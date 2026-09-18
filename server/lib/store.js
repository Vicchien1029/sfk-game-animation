const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const {
  SYSTEM_ADMIN_KEY,
  RESEARCH_MENTOR_KEY,
  VIEWER_KEY,
  fullPermissions,
  viewerPermissions,
  normalizePermissions,
  canManageUser,
  isStrictlyLowerPermissionSet
} = require("./permissions");
const { createId, nowIso } = require("./ids");

const LOCAL_DIR = path.join(__dirname, "..", "data");
const LOCAL_FILE = path.join(LOCAL_DIR, "store.json");
const BOOTSTRAP_FILE = path.join(LOCAL_DIR, "bootstrap-once.txt");
const CLOUD_PATH = "ga-auth/rbac-store.json";
const SALT_ROUNDS = 10;

let cache = null;
let writeQueue = Promise.resolve();
let tcbApp = null;
let tcbTried = false;
let cloudFileId = "";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureLocalDir() {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

function emptyStore() {
  return {
    version: 1,
    sessionSecret: "",
    cloudFileId: "",
    roles: [],
    users: []
  };
}

function shouldUseCloud() {
  return Boolean(
    process.env.TCB_ENV ||
    process.env.CLOUDBASE_ENV_ID ||
    process.env.TENCENTCLOUD_RUNENV ||
    process.env.KUBERNETES_SERVICE_HOST
  );
}

async function getTcbApp() {
  if (tcbTried) return tcbApp;
  tcbTried = true;
  if (!shouldUseCloud()) {
    tcbApp = null;
    return null;
  }
  try {
    const cloudbase = require("@cloudbase/node-sdk");
    const envId = process.env.TCB_ENV || process.env.CLOUDBASE_ENV_ID || "cb-env-dengxuewe-122-d6a6f250b1b";
    tcbApp = cloudbase.init({ env: envId });
    return tcbApp;
  } catch (error) {
    console.warn("[auth-store] CloudBase SDK 未初始化，将使用本地文件存储:", error.message);
    tcbApp = null;
    return null;
  }
}

async function downloadCloudStore() {
  const app = await getTcbApp();
  if (!app) return null;
  const fileID = process.env.AUTH_STORE_FILE_ID || cloudFileId;
  if (!fileID) return null;
  try {
    const result = await app.downloadFile({ fileID });
    const content = result.fileContent;
    if (!content) return null;
    const text = Buffer.isBuffer(content) ? content.toString("utf8") : String(content);
    return JSON.parse(text);
  } catch (error) {
    console.warn("[auth-store] 云存储读取失败，回退本地文件:", error.message);
    return null;
  }
}

async function uploadCloudStore(store) {
  const app = await getTcbApp();
  if (!app) return;
  try {
    const result = await app.uploadFile({
      cloudPath: CLOUD_PATH,
      fileContent: Buffer.from(JSON.stringify(store, null, 2), "utf8")
    });
    if (result && result.fileID) {
      cloudFileId = result.fileID;
      store.cloudFileId = result.fileID;
    }
  } catch (error) {
    console.warn("[auth-store] 云存储写入失败，已保留本地副本:", error.message);
  }
}

function readLocalStore() {
  if (!fs.existsSync(LOCAL_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
  } catch (error) {
    console.warn("[auth-store] 本地存储损坏，将重新初始化:", error.message);
    return null;
  }
}

function writeLocalStore(store) {
  ensureLocalDir();
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(store, null, 2), "utf8");
}

function randomPassword() {
  return `SFK#${Math.random().toString(36).slice(2, 8)}A1`;
}

function hashPassword(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function assertCanManageAdministrator(actor, role, action = "管理") {
  if (role?.key === SYSTEM_ADMIN_KEY && actor?.roleKey !== SYSTEM_ADMIN_KEY) {
    throw new Error(`只有系统管理员可以${action}系统管理员账号`);
  }
}

function seedStore() {
  const createdAt = nowIso();
  const adminRoleId = createId("role");
  const viewerRoleId = createId("role");
  const mentorRoleId = createId("role");
  const adminUserId = createId("user");
  const username = process.env.ADMIN_BOOTSTRAP_USER || "admin";
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || randomPassword();
  const sessionSecret = process.env.SESSION_SECRET || require("crypto").randomBytes(32).toString("hex");

  const store = emptyStore();
  store.sessionSecret = sessionSecret;
  store.roles = [
    {
      id: adminRoleId,
      key: SYSTEM_ADMIN_KEY,
      name: "系统管理员",
      description: "可配置角色、管理人员账号与密码，并浏览全部内部资料",
      builtin: true,
      permissions: fullPermissions(),
      createdAt,
      updatedAt: createdAt
    },
    {
      id: mentorRoleId,
      key: RESEARCH_MENTOR_KEY,
      name: "教研导师",
      description: "科系教研可以辅助管理人员，但不能管理系统管理员",
      builtin: true,
      permissions: { ...viewerPermissions(), manage_users: true, manage_roles: false },
      createdAt,
      updatedAt: createdAt
    },
    {
      id: viewerRoleId,
      key: VIEWER_KEY,
      name: "资料访客",
      description: "可登录浏览站点，并修改自己的姓名、邮箱和密码",
      builtin: true,
      permissions: viewerPermissions(),
      createdAt,
      updatedAt: createdAt
    }
  ];
  store.users = [
    {
      id: adminUserId,
      username,
      displayName: "系统管理员",
      campus: "",
      department: "",
      email: "",
      passwordHash: hashPassword(password),
      roleId: adminRoleId,
      status: "active",
      builtin: true,
      createdAt,
      updatedAt: createdAt
    }
  ];

  ensureLocalDir();
  fs.writeFileSync(
    BOOTSTRAP_FILE,
    `初始管理员账号：${username}\n初始密码：${password}\n请登录后立即修改密码。\n`,
    "utf8"
  );
  console.log(`[auth-store] 已创建初始管理员 ${username}，密码见 ${BOOTSTRAP_FILE}`);
  if (process.env.ADMIN_BOOTSTRAP_PASSWORD) {
    console.log("[auth-store] 使用环境变量 ADMIN_BOOTSTRAP_PASSWORD 作为初始密码");
  } else {
    console.log(`[auth-store] 初始管理员密码：${password}`);
  }
  return store;
}

function normalizeStore(raw) {
  const store = raw && typeof raw === "object" ? raw : emptyStore();
  store.version = 1;
  store.sessionSecret = store.sessionSecret || "";
  store.cloudFileId = store.cloudFileId || "";
  store.roles = Array.isArray(store.roles) ? store.roles : [];
  store.users = Array.isArray(store.users) ? store.users : [];
  let mentor = store.roles.find(role => role.key === RESEARCH_MENTOR_KEY) ||
    store.roles.find(role => role.name === "教研导师");
  if (!mentor) {
    const createdAt = nowIso();
    mentor = {
      id: createId("role"), key: RESEARCH_MENTOR_KEY, name: "教研导师",
      description: "科系教研可以辅助管理人员，但不能管理系统管理员",
      builtin: true, permissions: { ...viewerPermissions(), manage_users: true, manage_roles: false },
      createdAt, updatedAt: createdAt
    };
    store.roles.push(mentor);
  }
  mentor.key = RESEARCH_MENTOR_KEY;
  mentor.builtin = true;
  store.roles.forEach(role => {
    role.permissions = role.key === SYSTEM_ADMIN_KEY
      ? fullPermissions()
      : normalizePermissions(role.permissions);
    role.builtin = Boolean(role.builtin);
    if (role.key === RESEARCH_MENTOR_KEY) {
      role.permissions.manage_users = true;
      role.permissions.manage_roles = false;
    }
  });
  store.users.forEach(user => {
    user.status = user.status === "disabled" ? "disabled" : "active";
    user.builtin = Boolean(user.builtin);
    user.campus = String(user.campus || "").trim();
    user.department = String(user.department || "").trim();
    user.email = String(user.email || "").trim().toLowerCase();
  });
  return store;
}

async function loadStore() {
  if (cache) return cache;
  const cloud = await downloadCloudStore();
  if (shouldUseCloud() && !cloud && process.env.ALLOW_NEW_CLOUD_STORE !== "1") {
    throw new Error("未读取到云端账号数据；请核对 AUTH_STORE_FILE_ID 和 CloudBase 凭证，避免重建人员账号");
  }
  const local = readLocalStore();
  const picked = cloud || local || seedStore();
  cache = normalizeStore(picked);
  if (cache.cloudFileId) cloudFileId = cache.cloudFileId;
  if (!process.env.SESSION_SECRET && cache.sessionSecret) {
    process.env.SESSION_SECRET = cache.sessionSecret;
  }
  if (!cache.sessionSecret) {
    cache.sessionSecret = process.env.SESSION_SECRET || require("crypto").randomBytes(32).toString("hex");
    process.env.SESSION_SECRET = cache.sessionSecret;
  }
  writeLocalStore(cache);
  return cache;
}

async function persist(store) {
  cache = store;
  writeLocalStore(store);
  try {
    await uploadCloudStore(store);
  } catch (error) {
    console.warn("[auth-store] 云存储同步失败，已保留本地副本:", error.message);
  }
  if (store.cloudFileId && store.cloudFileId !== cloudFileId) {
    cloudFileId = store.cloudFileId;
    writeLocalStore(store);
  }
}

function withStore(mutator) {
  const operation = writeQueue.then(async () => {
    const store = clone(await loadStore());
    const result = await mutator(store);
    await persist(store);
    return result;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

function getRole(store, roleId) {
  return store.roles.find(role => role.id === roleId) || null;
}

function decorateUser(store, user) {
  if (!user) return null;
  const role = getRole(store, user.roleId);
  return {
    ...user,
    roleKey: role ? role.key : "",
    roleName: role ? role.name : "未分配角色",
    permissions: role ? role.permissions : normalizePermissions()
  };
}

async function listRoles() {
  const store = await loadStore();
  return clone(store.roles);
}

async function listUsers() {
  const store = await loadStore();
  return store.users.map(user => {
    const decorated = decorateUser(store, user);
    const safe = clone(decorated);
    delete safe.passwordHash;
    return safe;
  });
}

async function findUserByUsername(username) {
  const store = await loadStore();
  const value = String(username || "").trim().toLowerCase();
  const user = store.users.find(item => {
    const login = String(item.username || "").toLowerCase();
    const email = String(item.email || "").toLowerCase();
    return login === value || (email && email === value);
  });
  return decorateUser(store, user);
}

async function findUserById(id) {
  const store = await loadStore();
  const user = store.users.find(item => item.id === id);
  return decorateUser(store, user);
}

function assertUsername(username) {
  const value = String(username || "").trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 80) {
    return value.toLowerCase();
  }
  if (!/^[a-zA-Z0-9._-]{3,32}$/.test(value)) {
    throw new Error("账号需为 3-32 位字母、数字、点、下划线或短横线，也可直接使用邮箱");
  }
  return value;
}

function assertEmail(email, required) {
  const value = String(email || "").trim().toLowerCase();
  if (!required && !value) return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 80) {
    throw new Error("请填写有效邮箱");
  }
  return value;
}

function loginTaken(store, value, exceptUserId) {
  const login = String(value || "").trim().toLowerCase();
  if (!login) return false;
  return store.users.some(item => {
    if (exceptUserId && item.id === exceptUserId) return false;
    return String(item.username || "").toLowerCase() === login || String(item.email || "").toLowerCase() === login;
  });
}

function assertPassword(password, required) {
  const value = String(password || "");
  if (!required && !value) return "";
  if (value.length < 8 || value.length > 64) {
    throw new Error("密码长度需为 8-64 位");
  }
  return value;
}

function assertDisplayName(name) {
  const value = String(name || "").trim();
  if (!value || value.length > 40) {
    throw new Error("姓名需为 1-40 个字符");
  }
  return value;
}

async function createRole(input) {
  return withStore(store => {
    const name = String(input.name || "").trim();
    if (!name || name.length > 20) throw new Error("角色名称需为 1-20 个字符");
    if (store.roles.some(role => role.name === name)) throw new Error("角色名称已存在");
    const createdAt = nowIso();
    const role = {
      id: createId("role"),
      key: `custom_${createId("key")}`,
      name,
      description: String(input.description || "").trim().slice(0, 80),
      builtin: false,
      permissions: normalizePermissions(input.permissions),
      createdAt,
      updatedAt: createdAt
    };
    if (!Object.values(role.permissions).some(Boolean)) throw new Error("请至少选择一项权限");
    store.roles.push(role);
    return clone(role);
  });
}

async function updateRole(roleId, input) {
  return withStore(store => {
    const role = getRole(store, roleId);
    if (!role) throw new Error("角色不存在");
    if (role.key === SYSTEM_ADMIN_KEY) {
      role.permissions = fullPermissions();
      if (input.name) role.name = String(input.name).trim() || role.name;
      if (input.description !== undefined) role.description = String(input.description || "").trim().slice(0, 80);
      role.updatedAt = nowIso();
      return clone(role);
    }
    if (input.name) {
      const name = String(input.name).trim();
      if (!name || name.length > 20) throw new Error("角色名称需为 1-20 个字符");
      if (store.roles.some(item => item.id !== roleId && item.name === name)) throw new Error("角色名称已存在");
      role.name = name;
    }
    if (input.description !== undefined) {
      role.description = String(input.description || "").trim().slice(0, 80);
    }
    if (input.permissions) {
      role.permissions = normalizePermissions(input.permissions);
      if (!Object.values(role.permissions).some(Boolean)) throw new Error("请至少选择一项权限");
    }
    if (role.key === RESEARCH_MENTOR_KEY) {
      role.permissions.manage_users = true;
      role.permissions.manage_roles = false;
    }
    role.updatedAt = nowIso();
    return clone(role);
  });
}

function assertVerifiedManagerForDeletion(store, actor, password) {
  const manager = store.users.find(user => user.id === actor?.id && user.status === "active");
  const managerRole = manager && getRole(store, manager.roleId);
  if (!manager || !managerRole?.permissions?.manage_roles) throw new Error("当前账号没有管理角色的权限");
  if (!String(password || "")) throw new Error("请输入当前登录管理员的密码");
  if (!verifyPassword(String(password), manager.passwordHash)) throw new Error("管理员密码不正确");
}

function assertPersonDetail(value, label, maxLength, required = false) {
  const text = String(value || "").trim();
  if ((required && !text) || text.length > maxLength) {
    throw new Error(`${label}需为 ${required ? "1" : "0"}-${maxLength} 个字符`);
  }
  return text;
}

function assertMentorSelfPassword(user, input, mentorSelf) {
  if (mentorSelf && input.password) {
    if (!String(input.currentPassword || "")) throw new Error("请输入当前密码");
    if (!verifyPassword(String(input.currentPassword), user.passwordHash)) throw new Error("当前密码不正确");
  }
}

async function deleteRole(roleId, actor, password) {
  return withStore(store => {
    assertVerifiedManagerForDeletion(store, actor, password);
    const role = getRole(store, roleId);
    if (!role) throw new Error("角色不存在");
    if (role.builtin) throw new Error("内置角色不能删除");
    if (store.users.some(user => user.roleId === roleId)) {
      throw new Error("仍有人员使用该角色，请先调整人员角色");
    }
    store.roles = store.roles.filter(item => item.id !== roleId);
    return { ok: true };
  });
}

async function createUser(input, actor) {
  return withStore(store => {
    const email = assertEmail(input.email, true);
    const username = assertUsername(input.username || email);
    if (loginTaken(store, username) || loginTaken(store, email)) {
      throw new Error("账号或邮箱已被使用");
    }
    const role = getRole(store, input.roleId);
    if (!role) throw new Error("请选择有效角色");
    assertCanManageAdministrator(actor, role, "创建");
    if (actor?.roleKey === RESEARCH_MENTOR_KEY && !isStrictlyLowerPermissionSet(actor.permissions, role.permissions)) {
      throw new Error("只能创建权限低于教研导师的人员账号");
    }
    const createdAt = nowIso();
    const user = {
      id: createId("user"),
      username,
      displayName: assertDisplayName(input.displayName || username),
      campus: assertPersonDetail(input.campus, "校区", 40, true),
      department: assertPersonDetail(input.department, "部门", 60, true),
      email,
      passwordHash: hashPassword(assertPassword(input.password, true)),
      roleId: role.id,
      status: "active",
      builtin: false,
      createdAt,
      updatedAt: createdAt
    };
    store.users.push(user);
    const decorated = decorateUser(store, user);
    const safe = clone(decorated);
    delete safe.passwordHash;
    return safe;
  });
}

function prepareUsersBatch(store, rows, actor) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 200) {
    throw new Error("每次须导入 1-200 个账号");
  }
  const prepared = [];
  const errors = [];
  const seenEmails = new Set();
  for (const row of rows) {
    try {
      const displayName = assertDisplayName(row.displayName);
      const campus = assertPersonDetail(row.campus, "校区", 40, true);
      const department = assertPersonDetail(row.department, "部门", 60, true);
      const email = assertEmail(row.email, true);
      const password = assertPassword(row.password, true);
      const roleName = String(row.roleName || "").trim();
      const role = store.roles.find(item => item.name === roleName);
      if (!role) throw new Error(`角色“${roleName || "空"}”不存在`);
      assertCanManageAdministrator(actor, role, "创建");
      if (actor?.roleKey === RESEARCH_MENTOR_KEY && !isStrictlyLowerPermissionSet(actor.permissions, role.permissions)) {
        throw new Error("只能创建权限低于教研导师的人员账号");
      }
      if (loginTaken(store, email)) throw new Error("邮箱已被使用");
      if (seenEmails.has(email)) throw new Error("表格内邮箱重复");
      seenEmails.add(email);
      prepared.push({ displayName, campus, department, email, password, roleId: role.id });
    } catch (error) {
      errors.push({ row: row.rowNumber, message: error.message });
    }
  }
  if (errors.length) {
    const error = new Error(`有 ${errors.length} 行未通过校验，未创建任何账号`);
    error.rows = errors;
    throw error;
  }
  return prepared;
}

async function createUsersBatch(rows, actor) {
  return withStore(store => {
    const prepared = prepareUsersBatch(store, rows, actor);
    const createdAt = nowIso();
    for (const item of prepared) {
      store.users.push({
        id: createId("user"),
        username: item.email,
        displayName: item.displayName,
        campus: item.campus,
        department: item.department,
        email: item.email,
        passwordHash: hashPassword(item.password),
        roleId: item.roleId,
        status: "active",
        builtin: false,
        createdAt,
        updatedAt: createdAt
      });
    }
    return { created: prepared.length };
  });
}

async function updateUser(userId, input, actor) {
  return withStore(store => {
    const user = store.users.find(item => item.id === userId);
    if (!user) throw new Error("人员不存在");
    const currentRole = getRole(store, user.roleId);
    assertCanManageAdministrator(actor, currentRole);
    if (input.roleId) assertCanManageAdministrator(actor, getRole(store, input.roleId), "分配");
    const target = decorateUser(store, user);
    const mentorSelf = actor?.roleKey === RESEARCH_MENTOR_KEY && actor.id === userId;
    if (actor?.roleKey === RESEARCH_MENTOR_KEY && !canManageUser(actor, target)) {
      throw new Error("不能修改权限相同或更高的人员信息");
    }
    if (mentorSelf && (input.roleId || input.status !== undefined)) {
      throw new Error("不能修改自己的角色或账号状态");
    }
    assertMentorSelfPassword(user, input, mentorSelf);
    if (actor?.roleKey === RESEARCH_MENTOR_KEY && input.roleId) {
      const nextRole = getRole(store, input.roleId);
      if (!nextRole || !isStrictlyLowerPermissionSet(actor.permissions, nextRole.permissions)) {
        throw new Error("只能分配权限低于教研导师的角色");
      }
    }
    if (input.username !== undefined) {
      const username = assertUsername(input.username);
      if (loginTaken(store, username, userId)) throw new Error("账号或邮箱已被使用");
      user.username = username;
    }
    if (input.displayName !== undefined) {
      user.displayName = assertDisplayName(input.displayName);
    }
    if (input.campus !== undefined) {
      user.campus = assertPersonDetail(input.campus, "校区", 40);
    }
    if (input.department !== undefined) {
      user.department = assertPersonDetail(input.department, "部门", 60);
    }
    if (input.email !== undefined) {
      const email = assertEmail(input.email, false);
      if (email && loginTaken(store, email, userId)) throw new Error("账号或邮箱已被使用");
      user.email = email;
    }
    if (input.password) {
      user.passwordHash = hashPassword(assertPassword(input.password, true));
    }
    if (input.roleId) {
      const role = getRole(store, input.roleId);
      if (!role) throw new Error("请选择有效角色");
      const currentRole = getRole(store, user.roleId);
      if (currentRole && currentRole.key === SYSTEM_ADMIN_KEY && role.key !== SYSTEM_ADMIN_KEY) {
        const remainingAdmins = store.users.filter(item => {
          const itemRole = getRole(store, item.roleId);
          return item.id !== userId && item.status === "active" && itemRole && itemRole.key === SYSTEM_ADMIN_KEY;
        });
        if (!remainingAdmins.length) throw new Error("至少保留一名系统管理员");
      }
      user.roleId = role.id;
    }
    if (input.status === "disabled" || input.status === "active") {
      if (input.status === "disabled") {
        const currentRole = getRole(store, user.roleId);
        if (currentRole && currentRole.key === SYSTEM_ADMIN_KEY) {
          const remainingAdmins = store.users.filter(item => {
            const itemRole = getRole(store, item.roleId);
            return item.id !== userId && item.status === "active" && itemRole && itemRole.key === SYSTEM_ADMIN_KEY;
          });
          if (!remainingAdmins.length) throw new Error("不能停用最后一名系统管理员");
        }
        if (actor && actor.id === userId) throw new Error("不能停用当前登录账号");
      }
      user.status = input.status;
    }
    user.updatedAt = nowIso();
    const decorated = decorateUser(store, user);
    const safe = clone(decorated);
    delete safe.passwordHash;
    return safe;
  });
}

function removeUserFromStore(store, userId, actor, password) {
  const manager = store.users.find(user => user.id === actor?.id && user.status === "active");
  const managerRole = manager && getRole(store, manager.roleId);
  if (actor?.roleKey !== SYSTEM_ADMIN_KEY || managerRole?.key !== SYSTEM_ADMIN_KEY) {
    throw new Error("只有系统管理员可以删除人员账号");
  }
  assertVerifiedManagerForDeletion(store, actor, password);
  const target = store.users.find(user => user.id === userId);
  if (!target) throw new Error("人员不存在");
  if (target.id === actor.id) throw new Error("不能删除当前登录账号");
  const targetRole = getRole(store, target.roleId);
  if (targetRole?.key === SYSTEM_ADMIN_KEY) {
    const remainingAdmins = store.users.filter(user =>
      user.id !== target.id && user.status === "active" &&
      getRole(store, user.roleId)?.key === SYSTEM_ADMIN_KEY);
    if (!remainingAdmins.length) throw new Error("不能删除最后一名系统管理员");
  }
  store.users = store.users.filter(user => user.id !== userId);
  return { ok: true };
}

async function deleteUser(userId, actor, password) {
  return withStore(store => removeUserFromStore(store, userId, actor, password));
}

async function authenticate(username, password) {
  const user = await findUserByUsername(username);
  if (!user || user.status !== "active") {
    return null;
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

async function changeOwnPassword(userId, currentPassword, newPassword) {
  return withStore(store => {
    const user = store.users.find(item => item.id === userId);
    if (!user || user.status !== "active") throw new Error("账号不存在或已停用");
    if (!verifyPassword(String(currentPassword || ""), user.passwordHash)) throw new Error("当前密码不正确");
    user.passwordHash = hashPassword(assertPassword(newPassword, true));
    user.updatedAt = nowIso();
    return { ok: true };
  });
}

const ASSET_PREFIX = "ga-site/";
const MANIFEST_FILE = path.join(__dirname, "..", "asset-manifest.json");
const assetUrlCache = new Map();
let assetManifest = null;

function loadAssetManifest() {
  if (assetManifest) return assetManifest;
  try {
    if (fs.existsSync(MANIFEST_FILE)) {
      assetManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
    } else {
      assetManifest = {};
    }
  } catch (error) {
    console.warn("[auth-store] 资源清单读取失败:", error.message);
    assetManifest = {};
  }
  return assetManifest;
}

async function getAssetTempUrl(relPath) {
  const rel = String(relPath || "").replace(/^\/+/, "").replace(/\\/g, "/");
  if (!rel.startsWith("assets/")) return null;
  const cached = assetUrlCache.get(rel);
  if (cached && cached.expireAt > Date.now() + 60 * 1000) {
    return cached.url;
  }
  const manifest = loadAssetManifest();
  const fileID = manifest[rel];
  if (!fileID) return null;
  const app = await getTcbApp();
  if (!app) return null;
  const result = await app.getTempFileURL({ fileList: [fileID] });
  const item = result && result.fileList && result.fileList[0];
  const url = item && (item.tempFileURL || item.download_url);
  if (!url || (item.code && item.code !== "SUCCESS")) {
    console.warn("[auth-store] 资源临时链接失败:", rel, item && item.code);
    return null;
  }
  assetUrlCache.set(rel, { url, expireAt: Date.now() + 50 * 60 * 1000 });
  return url;
}

module.exports = {
  loadStore,
  listRoles,
  listUsers,
  findUserById,
  createRole,
  updateRole,
  deleteRole,
  createUser,
  createUsersBatch,
  prepareUsersBatch,
  updateUser,
  deleteUser,
  removeUserFromStore,
  changeOwnPassword,
  authenticate,
  getAssetTempUrl,
  ASSET_PREFIX,
  normalizeStore,
  assertCanManageAdministrator,
  assertVerifiedManagerForDeletion,
  assertMentorSelfPassword
};
