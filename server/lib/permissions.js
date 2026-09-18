const navigation = require("../../site-navigation");
const CONTENT_PERMISSIONS = [
  { id: "view_department", label: "科系基本内容", hint: "科系导航、首页和规划我的未来", group: "department" },
  ...navigation.primary.map(item => ({ id: `view_${item.id}`, label: item.label, hint: item.hint || item.label, group: "primary" }))
];

const PERMISSIONS = [
  ...CONTENT_PERMISSIONS,
  { id: "manage_users", label: "管理人员", hint: "创建、停用账号，修改资料和密码，分配角色；只有系统管理员可永久删除账号", group: "management" },
  { id: "manage_roles", label: "管理角色", hint: "新增、编辑、删除角色及其权限", group: "management" }
];

const PERMISSION_IDS = PERMISSIONS.map(item => item.id);
const CONTENT_PERMISSION_IDS = CONTENT_PERMISSIONS.map(item => item.id);

const SYSTEM_ADMIN_KEY = "system_admin";
const VIEWER_KEY = "viewer";
const RESEARCH_MENTOR_KEY = "research_mentor";

function emptyPermissions() {
  return Object.fromEntries(PERMISSION_IDS.map(id => [id, false]));
}

function normalizePermissions(input = {}) {
  const next = emptyPermissions();
  const source = input && typeof input === "object" ? input : {};
  const hasScopedContent = CONTENT_PERMISSION_IDS.some(id => Object.prototype.hasOwnProperty.call(source, id));
  PERMISSION_IDS.forEach(id => {
    next[id] = !hasScopedContent && CONTENT_PERMISSION_IDS.includes(id)
      ? Boolean(source.view_site)
      : Boolean(source[id]);
  });
  return next;
}

function fullPermissions() {
  return Object.fromEntries(PERMISSION_IDS.map(id => [id, true]));
}

function viewerPermissions() {
  return Object.fromEntries(PERMISSION_IDS.map(id => [id, CONTENT_PERMISSION_IDS.includes(id)]));
}

function hasPermission(user, permission) {
  if (!user || user.status !== "active") return false;
  if (!user.permissions) return false;
  if (user.roleKey === SYSTEM_ADMIN_KEY) return true;
  return Boolean(user.permissions[permission]);
}

function hasAnyPermission(user) {
  return PERMISSION_IDS.some(id => hasPermission(user, id));
}

function isStrictlyLowerPermissionSet(actorPermissions, targetPermissions) {
  const actor = normalizePermissions(actorPermissions);
  const target = normalizePermissions(targetPermissions);
  return PERMISSION_IDS.every(id => !target[id] || actor[id]) &&
    PERMISSION_IDS.some(id => actor[id] && !target[id]);
}

function canManageUser(actor, target) {
  if (!actor || !target || !hasPermission(actor, "manage_users")) return false;
  if (actor.roleKey === SYSTEM_ADMIN_KEY) return true;
  if (target.roleKey === SYSTEM_ADMIN_KEY) return false;
  if (actor.roleKey === RESEARCH_MENTOR_KEY) {
    if (actor.id === target.id) return true;
    return isStrictlyLowerPermissionSet(actor.permissions, target.permissions);
  }
  return true;
}

function firstAccessiblePath(user) {
  if (hasPermission(user, "manage_users") || hasPermission(user, "manage_roles")) return "/admin.html";
  const destinations = [
    ["view_department", "/index.html"],
    ...navigation.primary.filter(item => !item.disabled && item.href !== "#").map(item => [`view_${item.id}`, `/${item.href}`])
  ];
  const allowed = destinations.find(([permission]) => hasPermission(user, permission));
  return allowed ? allowed[1] : "/profile.html";
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    campus: user.campus || "",
    department: user.department || "",
    email: user.email || "",
    roleId: user.roleId,
    roleKey: user.roleKey,
    roleName: user.roleName,
    status: user.status,
    permissions: normalizePermissions(user.permissions),
    isSystemAdmin: user.roleKey === SYSTEM_ADMIN_KEY
  };
}

module.exports = {
  PERMISSIONS,
  PERMISSION_IDS,
  CONTENT_PERMISSION_IDS,
  SYSTEM_ADMIN_KEY,
  VIEWER_KEY,
  RESEARCH_MENTOR_KEY,
  emptyPermissions,
  normalizePermissions,
  fullPermissions,
  viewerPermissions,
  hasPermission,
  hasAnyPermission,
  isStrictlyLowerPermissionSet,
  canManageUser,
  firstAccessiblePath,
  publicUser
};
