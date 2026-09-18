const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const permissions = require("../lib/permissions");
const navigation = require("../../site-navigation");
const store = require("../lib/store");
const session = require("../lib/session");
const bcrypt = require("bcryptjs");

process.env.SESSION_SECRET = "scoped-permissions-test-secret";

const users = {
  courses: { id: "courses", status: "active", roleKey: "custom_courses", roleName: "课程访客", displayName: "课程访客", permissions: permissions.normalizePermissions({ view_courses: true }) },
  cases: { id: "cases", status: "active", roleKey: "custom_cases", roleName: "案例访客", displayName: "案例访客", permissions: permissions.normalizePermissions({ view_cases: true }) },
  department: { id: "department", status: "active", roleKey: "custom_department", roleName: "科系访客", displayName: "科系访客", permissions: permissions.normalizePermissions({ view_department: true }) },
  manager: { id: "manager", status: "active", roleKey: "custom_manager", roleName: "角色管理员", displayName: "角色管理员", permissions: permissions.normalizePermissions({ manage_roles: true }) }
};
const mentorPermissions = { ...permissions.viewerPermissions(), manage_users: true, manage_roles: false };
users.mentor = { id: "mentor", status: "active", roleKey: "research_mentor", roleName: "教研导师", permissions: mentorPermissions };
users.mentorPeer = { id: "mentorPeer", status: "active", roleKey: "research_mentor", roleName: "教研导师", permissions: mentorPermissions };
users.mentorLower = { id: "mentorLower", status: "active", roleKey: "viewer", roleName: "资料访客", permissions: permissions.viewerPermissions() };
users.mentorHigher = { id: "mentorHigher", status: "active", roleKey: "system_admin", roleName: "系统管理员", permissions: permissions.fullPermissions() };
users.mentorIncomparable = { id: "mentorIncomparable", status: "active", roleKey: "custom_manager", roleName: "角色管理员", permissions: permissions.normalizePermissions({ manage_roles: true }) };

store.findUserById = async id => users[id] || null;
const { createApp } = require("../app");

test("old browser permission keeps all seven content areas", () => {
  const legacy = permissions.normalizePermissions({ view_site: true });
  assert.equal(permissions.PERMISSIONS.length, 9);
  assert.ok(permissions.CONTENT_PERMISSION_IDS.every(id => legacy[id]));
});

test("existing mentor role becomes builtin without changing its id or assigned user", () => {
  const oldRoleId = "existing-mentor";
  const data = store.normalizeStore({ roles: [{
    id: oldRoleId, key: "custom_mentor", name: "教研导师", builtin: false,
    permissions: permissions.normalizePermissions({ view_department: true, manage_users: true })
  }], users: [{ id: "mentor-user", roleId: oldRoleId, status: "active" }] });
  const mentor = data.roles.find(role => role.id === oldRoleId);
  assert.equal(data.roles.length, 1);
  assert.equal(mentor.key, "research_mentor");
  assert.equal(mentor.builtin, true);
  assert.equal(mentor.permissions.manage_users, true);
  assert.equal(mentor.permissions.manage_roles, false);
  assert.equal(data.users[0].roleId, oldRoleId);
});

test("non-system managers cannot manage administrator accounts", () => {
  const adminRole = { key: "system_admin" };
  assert.throws(() => store.assertCanManageAdministrator({ roleKey: "research_mentor" }, adminRole), /只有系统管理员/);
  assert.throws(() => store.assertCanManageAdministrator({ roleKey: "custom_manager" }, adminRole), /只有系统管理员/);
  assert.doesNotThrow(() => store.assertCanManageAdministrator({ roleKey: "system_admin" }, adminRole));
});

test("mentor may manage only a strictly lower permission set", () => {
  assert.equal(permissions.canManageUser(users.mentor, users.mentor), true);
  assert.equal(permissions.canManageUser(users.mentor, users.mentorLower), true);
  assert.equal(permissions.canManageUser(users.mentor, users.mentorPeer), false);
  assert.equal(permissions.canManageUser(users.mentor, users.mentorHigher), false);
  assert.equal(permissions.canManageUser(users.mentor, users.mentorIncomparable), false);
});

test("role deletion verifies the current manager password", () => {
  const data = { roles: [{ id: "manager-role", permissions: { manage_roles: true } }], users: [{
    id: "actor", roleId: "manager-role", status: "active", passwordHash: bcrypt.hashSync("correct-password", 4)
  }] };
  assert.throws(() => store.assertVerifiedManagerForDeletion(data, { id: "actor" }, ""), /请输入/);
  assert.throws(() => store.assertVerifiedManagerForDeletion(data, { id: "actor" }, "wrong-password"), /密码不正确/);
  assert.doesNotThrow(() => store.assertVerifiedManagerForDeletion(data, { id: "actor" }, "correct-password"));
});

test("only a verified system administrator can remove another account", () => {
  const data = {
    roles: [
      { id: "admin-role", key: "system_admin", permissions: permissions.fullPermissions() },
      { id: "viewer-role", key: "viewer", permissions: permissions.viewerPermissions() }
    ],
    users: [
      { id: "admin", roleId: "admin-role", status: "active", passwordHash: bcrypt.hashSync("correct-password", 4) },
      { id: "target", roleId: "viewer-role", status: "active", passwordHash: "target-hash" }
    ]
  };
  assert.throws(() => store.removeUserFromStore(data, "target",
    { id: "admin", roleKey: "research_mentor" }, "correct-password"), /只有系统管理员/);
  assert.throws(() => store.removeUserFromStore(data, "target",
    { id: "admin", roleKey: "system_admin" }, "wrong-password"), /密码不正确/);
  assert.throws(() => store.removeUserFromStore(data, "admin",
    { id: "admin", roleKey: "system_admin" }, "correct-password"), /不能删除当前登录账号/);
  assert.equal(data.users.length, 2);
  assert.deepEqual(store.removeUserFromStore(data, "target",
    { id: "admin", roleKey: "system_admin" }, "correct-password"), { ok: true });
  assert.deepEqual(data.users.map(user => user.id), ["admin"]);
});

test("mentor self password change requires the current password", () => {
  const user = { passwordHash: bcrypt.hashSync("old-password", 4) };
  assert.throws(() => store.assertMentorSelfPassword(user, { password: "new-password" }, true), /请输入当前密码/);
  assert.throws(() => store.assertMentorSelfPassword(user, { password: "new-password", currentPassword: "wrong" }, true), /当前密码不正确/);
  assert.doesNotThrow(() => store.assertMentorSelfPassword(user, { password: "new-password", currentPassword: "old-password" }, true));
});

test("role editor renders four groups, shared main-content choices and select-all", async () => {
  const nodes = new Map();
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, {
        hidden: false, dataset: {}, style: {}, innerHTML: "", textContent: "", value: "",
        addEventListener() {}, querySelector() { return null; }
      });
      return nodes.get(id);
    }
  };
  const admin = {
    id: "admin", status: "active", roleKey: "system_admin", isSystemAdmin: true,
    displayName: "系统管理员", roleName: "系统管理员",
    permissions: permissions.fullPermissions()
  };
  const target = { id: "target", status: "active", roleKey: "viewer", roleName: "游客",
    displayName: "目标老师", email: "target@example.com", permissions: permissions.viewerPermissions() };
  const fetchStub = async url => ({
    ok: true, status: 200,
    json: async () => url.includes("auth/me")
      ? { user: admin, permissions: permissions.PERMISSIONS }
      : url.includes("roles") ? { roles: [] } : { users: [admin, target] }
  });
  const source = fs.readFileSync(path.join(__dirname, "..", "..", "auth-admin.js"), "utf8");
  vm.runInNewContext(source, { document, window: {}, fetch: fetchStub });
  await new Promise(resolve => setImmediate(resolve));
  const form = nodes.get("rolePermissions").innerHTML;
  assert.equal((form.match(/<fieldset/g) || []).length, 4);
  assert.equal((form.match(/name="perm-/g) || []).length, 9);
  assert.equal((form.match(/name="perm-view_(?:majors|courses|cases|fulltime|undergraduate|graduate)"/g) || []).length, 6);
  assert.match(form, /data-select-all="primary"/);
  assert.equal(permissions.CONTENT_PERMISSION_IDS.length - 1, navigation.primary.length);
  assert.doesNotMatch(nodes.get("userList").innerHTML, /data-delete-user="admin"/);
  assert.match(nodes.get("userList").innerHTML, /data-toggle-user="target"[^<]*>停用<\/button>\s*<button[^>]+data-delete-user="target">删除/, nodes.get("adminStatus").textContent);
});

test("admin UI sorts builtin roles first and makes mentor peers read-only", async () => {
  const nodes = new Map();
  const rowNodes = new Map(["mentor", "mentorLower", "manager", "mentorPeer", "mentorHigher"]
    .map(id => [id, { dataset: { userId: id }, hidden: false }]));
  const emptyRow = { hidden: true };
  const document = { getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, {
      hidden: false, dataset: {}, style: {}, innerHTML: "", textContent: "", value: "",
      listeners: {},
      addEventListener(type, listener) { this.listeners[type] = listener; },
      querySelectorAll(selector) { return id === "userList" && selector === "tr[data-user-id]" ? [...rowNodes.values()] : []; },
      querySelector(selector) { return id === "userList" && selector === ".admin-filter-empty" ? emptyRow : null; }
    });
    return nodes.get(id);
  } };
  const roleData = [
    { id: "custom", key: "custom", name: "自定义", permissions: { view_cases: true } },
    { id: "viewer", key: "viewer", name: "游客", builtin: true, permissions: permissions.viewerPermissions() },
    { id: "mentor", key: "research_mentor", name: "教研导师", builtin: true, permissions: mentorPermissions },
    { id: "admin", key: "system_admin", name: "系统管理员", builtin: true, permissions: permissions.fullPermissions() }
  ];
  const userData = [users.mentor, users.mentorLower, users.manager, users.mentorPeer, users.mentorHigher]
    .map((user, index) => ({
      ...user,
      campus: index === 1 ? "北京" : "上海",
      department: index === 1 ? "课程部" : "教研部",
      roleId: user.roleKey
    }));
  const fetchStub = async url => ({ ok: true, status: 200, json: async () =>
    url.includes("auth/me") ? { user: users.mentor, permissions: permissions.PERMISSIONS } :
    url.includes("roles") ? { roles: roleData } : { users: userData }
  });
  const source = fs.readFileSync(path.join(__dirname, "..", "..", "auth-admin.js"), "utf8");
  vm.runInNewContext(source, { document, window: {}, fetch: fetchStub });
  await new Promise(resolve => setImmediate(resolve));
  const roleHtml = nodes.get("roleList").innerHTML;
  assert.ok(roleHtml.indexOf('data-role-id="admin"') < roleHtml.indexOf('data-role-id="mentor"'));
  assert.ok(roleHtml.indexOf('data-role-id="mentor"') < roleHtml.indexOf('data-role-id="viewer"'));
  assert.ok(roleHtml.indexOf('data-role-id="viewer"') < roleHtml.indexOf('data-role-id="custom"'));
  const userHtml = nodes.get("userList").innerHTML;
  assert.ok(userHtml.indexOf('data-user-id="mentorHigher"') < userHtml.indexOf('data-user-id="mentorLower"'));
  assert.ok(userHtml.indexOf('data-user-id="mentor"') < userHtml.indexOf('data-user-id="mentorLower"'));
  assert.ok(userHtml.indexOf('data-user-id="manager"') < userHtml.indexOf('data-user-id="mentorLower"'));
  assert.match(userHtml, /data-user-id="mentor"[\s\S]*?data-user-form="mentor"/);
  assert.match(userHtml, /name="currentPassword"/);
  assert.match(userHtml, /name="password"/);
  assert.match(userHtml, /data-user-id="mentorLower"[\s\S]*?data-user-form="mentorLower"/);
  assert.doesNotMatch(userHtml, /data-user-form="mentorPeer"/);
  assert.doesNotMatch(userHtml, /data-user-form="mentorHigher"/);
  assert.doesNotMatch(userHtml, /data-delete-user=/);
  assert.match(nodes.get("userFilterCampus").innerHTML, /上海/);
  assert.match(nodes.get("userFilterDepartment").innerHTML, /课程部/);
  const campusFilter = nodes.get("userFilterCampus");
  campusFilter.value = "北京";
  campusFilter.listeners.change();
  assert.equal(rowNodes.get("mentorLower").hidden, false);
  assert.equal(rowNodes.get("mentor").hidden, true);
  assert.equal(nodes.get("userFilterSummary").textContent, "显示 1 / 5 人");
  nodes.get("userFilterRole").value = "research_mentor";
  nodes.get("userFilterRole").listeners.change();
  assert.equal(emptyRow.hidden, false);
  nodes.get("resetUserFilters").listeners.click();
  assert.equal(rowNodes.get("mentor").hidden, false);
  assert.equal(nodes.get("userFilterSummary").textContent, "共 5 人");
});

test("navigation hides unauthorized entries and keeps a permitted landing link", async () => {
  const entries = ["view_department", "view_majors", "view_courses", "view_cases", "view_fulltime", "view_undergraduate", "view_graduate"]
    .map(permission => ({ dataset: { navPermission: permission }, hidden: true }));
  const tiers = [
    { hidden: false, querySelectorAll: () => entries.slice(0, 1) },
    { hidden: false, querySelectorAll: () => entries.slice(1) }
  ];
  const accountNodes = {
    ".nav-account-name-link": { hidden: true, textContent: "" },
    ".nav-account-name-text": { hidden: true, textContent: "" },
    ".nav-account-role": { textContent: "" },
    ".nav-account-logout": { addEventListener() {} }
  };
  const slot = { hidden: true, querySelector: selector => accountNodes[selector] };
  const toggle = { addEventListener() {}, setAttribute() {} };
  const links = { addEventListener() {} };
  const logo = { href: "" };
  const navbar = {
    dataset: { siteNavShared: "true" }, classList: { toggle() {} },
    querySelector(selector) {
      return {
        "#navToggle": toggle, "#navLinks": links, "[data-auth-slot]": slot,
        ".logo": logo
      }[selector] || (selector.startsWith("[data-nav-permission]:not") ? { href: "http://local/cases.html" } : null);
    },
    querySelectorAll: selector => selector === ".nav-tier" ? tiers : entries
  };
  const host = { dataset: {}, replaceWith(node) { assert.equal(node, navbar); } };
  const document = {
    body: { classList: { toggle() {} } }, addEventListener() {},
    querySelectorAll() { return [host]; },
    createElement() { return { set innerHTML(value) { this.html = value; }, firstElementChild: navbar }; }
  };
  const window = { scrollY: 0, addEventListener() {}, SFK_SITE_NAVIGATION: navigation };
  const source = fs.readFileSync(path.join(__dirname, "..", "..", "site-nav.js"), "utf8");
  vm.runInNewContext(source, {
    document, window,
    fetch: async () => ({ ok: true, json: async () => ({ user: {
      username: "case-reader", displayName: "案例访客", roleName: "案例访客",
      permissions: permissions.normalizePermissions({ view_cases: true })
    } }) })
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(entries.filter(entry => !entry.hidden).map(entry => entry.dataset.navPermission), ["view_cases"]);
  assert.equal(tiers[0].hidden, true);
  assert.equal(tiers[1].hidden, false);
  assert.equal(logo.href, "http://local/cases.html");
  assert.equal(accountNodes[".nav-account-name-link"].hidden, false);
  assert.equal(accountNodes[".nav-account-name-link"].href, "profile.html");
  assert.equal(accountNodes[".nav-account-role"].textContent, "，案例访客");
});

test("page and data access follows the selected content permissions", async t => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => server.close());
  const port = server.address().port;
  const get = (route, userId) => fetch(`http://127.0.0.1:${port}${route}`, {
    redirect: "manual",
    headers: userId ? { Cookie: `${session.COOKIE_NAME}=${session.createToken(userId)}` } : {}
  });

  assert.equal((await get("/index.html")).status, 302);
  assert.equal((await get("/courses.html", "courses")).status, 200);
  assert.equal((await get("/profile.html", "courses")).status, 200);
  assert.equal((await get("/site-navigation.js", "courses")).status, 200);
  assert.equal((await get("/courses-data.js", "courses")).status, 200);
  assert.equal((await get("/cases-data.js", "courses")).status, 403);
  assert.equal((await get("/assets/cases-v2/cases/case-001/cover.webp", "courses")).status, 403);
  assert.equal((await get("/cases-data.js", "cases")).status, 200);
  assert.equal((await get("/index.html", "courses")).headers.get("location"), "/courses.html");
  assert.equal((await get("/login.html?next=%2Fcases.html", "courses")).headers.get("location"), "/courses.html");

  assert.equal((await get("/index.html", "department")).status, 200);
  assert.equal((await get("/school-search.html", "department")).status, 200);
  assert.equal((await get("/courses-data.js", "department")).status, 200);
  assert.equal((await get("/assets/courses-v2/cards/winter-school-017.webp", "department")).status, 200);
  assert.equal((await get("/courses.html", "department")).headers.get("location"), "/index.html");
  assert.equal((await get("/school-search-data/career-map-data.js", "department")).status, 200);

  assert.equal((await get("/admin.html", "manager")).status, 200);
  assert.equal((await get("/index.html", "manager")).headers.get("location"), "/admin.html");
  assert.equal((await get("/assets/courses-v2/cards/winter-school-017.webp", "manager")).status, 403);
  assert.equal((await get("/server/data/store.json", "manager")).status, 404);
  assert.equal((await get("/api/auth/me", "manager")).status, 200);
  const denied = await fetch(`http://127.0.0.1:${port}/api/users/mentorPeer`, {
    method: "PATCH", headers: { Cookie: `${session.COOKIE_NAME}=${session.createToken("mentor")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ displayName: "不应修改" })
  });
  assert.equal(denied.status, 403);
  const originalUpdateUser = store.updateUser;
  store.updateUser = async (id, patch) => ({ id, ...patch });
  try {
    const self = await fetch(`http://127.0.0.1:${port}/api/users/mentor`, {
      method: "PATCH", headers: { Cookie: `${session.COOKIE_NAME}=${session.createToken("mentor")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "教研导师新名字" })
    });
    assert.equal(self.status, 200);
    const forbiddenRoleChange = await fetch(`http://127.0.0.1:${port}/api/users/mentor`, {
      method: "PATCH", headers: { Cookie: `${session.COOKIE_NAME}=${session.createToken("mentor")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ roleId: "some-role" })
    });
    assert.equal(forbiddenRoleChange.status, 403);
  } finally {
    store.updateUser = originalUpdateUser;
  }

  const originalDeleteUser = store.deleteUser;
  let deleted = null;
  store.deleteUser = async (id, actor, password) => {
    deleted = { id, actor: actor.id, password };
    return { ok: true };
  };
  try {
    const remove = actorId => fetch(`http://127.0.0.1:${port}/api/users/mentorLower`, {
      method: "DELETE",
      headers: {
        Cookie: `${session.COOKIE_NAME}=${session.createToken(actorId)}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: "checked-password" })
    });
    assert.equal((await remove("mentor")).status, 403);
    assert.equal(deleted, null);
    assert.equal((await remove("mentorHigher")).status, 200);
    assert.deepEqual(deleted, { id: "mentorLower", actor: "mentorHigher", password: "checked-password" });
  } finally {
    store.deleteUser = originalDeleteUser;
  }
});
