const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const store = require("./lib/store");
const { parseAccountFile } = require("./lib/account-import");
const session = require("./lib/session");
const navigation = require("../site-navigation");
const { PERMISSIONS, SYSTEM_ADMIN_KEY, hasPermission, hasAnyPermission, canManageUser, firstAccessiblePath, publicUser } = require("./lib/permissions");

const SITE_ROOT = path.join(__dirname, "..");
const loginAttempts = new Map();
const deletePasswordAttempts = new Map();

function basePath() {
  const value = process.env.BASE_PATH || "";
  if (!value || value === "/") return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function joinPath(base, suffix) {
  if (!suffix.startsWith("/")) suffix = `/${suffix}`;
  return `${base}${suffix}`;
}

function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

function tooManyLogins(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const current = loginAttempts.get(ip) || [];
  const recent = current.filter(item => now - item < windowMs);
  loginAttempts.set(ip, recent);
  return recent.length >= 8;
}

function recordLogin(ip) {
  const current = loginAttempts.get(ip) || [];
  current.push(Date.now());
  loginAttempts.set(ip, current);
}

function isPublicPath(pathname) {
  const publicFiles = new Set([
    "/login.html",
    "/auth.css",
    "/auth-login.js",
    "/styles.css",
    "/theme.css",
    "/healthz",
    "/api/auth/login",
    "/api/auth/logout",
    "/assets/game-animation-logo-lockup-cropped.png",
    "/assets/game-animation-department-icon.jpg",
    "/assets/showreel-hero-poster.jpg",
    "/assets/showreel-hero.mp4"
  ]);
  return publicFiles.has(pathname);
}

function wantsJson(req) {
  if (req.path.startsWith("/api/")) return true;
  const destination = String(req.headers["sec-fetch-dest"] || "");
  if (destination && destination !== "document" && destination !== "iframe") return true;
  const accept = String(req.headers.accept || "");
  return accept.includes("application/json") && !accept.includes("text/html");
}

function recentDeleteAttempts(userId) {
  const recent = (deletePasswordAttempts.get(userId) || []).filter(time => Date.now() - time < 15 * 60 * 1000);
  deletePasswordAttempts.set(userId, recent);
  return recent;
}

function requiredContentPermission(pathname) {
  const route = String(pathname || "").toLowerCase();
  if (["/", "/index.html", "/school-search.html", "/career-timeline.html", "/faculty-data.js", "/school-search-v2.js", "/school-search-v2.css"].includes(route) ||
      route.startsWith("/school-search-data/") || route.startsWith("/school-search-assets/")) return "view_department";
  const configuredPage = navigation.primary.find(item => {
    const destinations = [item.href, ...(item.paths || [])].filter(path => path && path !== "#");
    return destinations.some(path => path.endsWith("/") ? route.startsWith(`/${path.toLowerCase()}`) : route === `/${path.toLowerCase().split("#")[0]}`);
  });
  if (configuredPage) return `view_${configuredPage.id}`;
  if (["/courses.js", "/courses.css", "/courses-data.js"].includes(route) ||
      route.startsWith("/assets/courses-v1/") || route.startsWith("/assets/courses-v2/")) return "view_courses";
  if (["/cases.js", "/cases.css", "/cases-data.js"].includes(route) ||
      route.startsWith("/assets/cases-v1/") || route.startsWith("/assets/cases-v2/") ||
      route.startsWith("/assets/portfolio/")) return "view_cases";
  return null;
}

function isServedStaticPath(pathname) {
  const route = String(pathname || "").toLowerCase();
  if (route === "/") return true;
  const parts = route.split("/").filter(Boolean);
  if (parts.length < 1) return false;
  if (parts.some(part => part === "." || part === "..")) return false;
  const configuredDirectories = navigation.primary.flatMap(item => [item.href, ...(item.paths || [])])
    .filter(path => path && path.includes("/"))
    .map(path => path.split("/")[0].toLowerCase());
  if (["assets", "majors", "fulltime", "school-search-assets", "school-search-data", ...configuredDirectories].includes(parts[0])) return parts.length > 1;
  return parts.length === 1 && /\.(?:html|css|js|ico)$/.test(parts[0]);
}

function requireContentAccess(req, res, next) {
  if (!isServedStaticPath(req.path)) return res.status(404).end();
  if ((req.path.toLowerCase() === "/courses-data.js" ||
      req.path.toLowerCase().startsWith("/assets/courses-v1/") ||
      req.path.toLowerCase().startsWith("/assets/courses-v2/")) &&
      (hasPermission(req.user, "view_department") || hasPermission(req.user, "view_courses"))) return next();
  const permission = requiredContentPermission(req.path);
  if (!permission || hasPermission(req.user, permission)) return next();
  if (wantsJson(req) || (req.path !== "/" && !req.path.toLowerCase().endsWith(".html"))) {
    return sendError(res, 403, "当前角色没有这项内容的访问权限");
  }
  return res.redirect(joinPath(basePath(), firstAccessiblePath(req.user)));
}

async function attachUser(req, res, next) {
  try {
    const token = req.cookies[session.COOKIE_NAME];
    const payload = session.decode(token);
    if (!payload) {
      req.user = null;
      return next();
    }
    const user = await store.findUserById(payload.userId);
    req.user = user && user.status === "active" ? user : null;
    if (token && !req.user) {
      res.clearCookie(session.COOKIE_NAME, session.clearCookieOptions());
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireLogin(req, res, next) {
  if (isPublicPath(req.path)) return next();
  if (req.user && hasAnyPermission(req.user)) return next();
  if (req.user) return sendError(res, 403, "当前角色没有访问权限");
  if (wantsJson(req) || req.path.startsWith("/api/")) {
    return sendError(res, 401, "请先登录");
  }
  const nextUrl = encodeURIComponent(req.originalUrl || "/");
  return res.redirect(joinPath(basePath(), `/login.html?next=${nextUrl}`));
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      if (wantsJson(req) || req.path.startsWith("/api/")) {
        return sendError(res, 403, "当前角色没有这项权限");
      }
      return res.redirect(joinPath(basePath(), "/"));
    }
    return next();
  };
}

function createApp() {
  const app = express();
  const site = express.Router();
  const base = basePath();

  app.set("trust proxy", true);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  app.use(cookieParser());

  site.use(attachUser);

  site.get("/healthz", (_req, res) => {
    res.json({ ok: true });
  });

  site.get("/api/auth/me", (req, res) => {
    if (!req.user) return sendError(res, 401, "未登录");
    res.json({ user: publicUser(req.user), permissions: PERMISSIONS });
  });

  site.post("/api/auth/login", async (req, res, next) => {
    try {
      const ip = clientIp(req);
      if (tooManyLogins(ip)) {
        return sendError(res, 429, "尝试次数过多，请稍后再试");
      }
      const username = String(req.body && req.body.username || "").trim();
      const password = String(req.body && req.body.password || "");
      if (!username || !password) {
        recordLogin(ip);
        return sendError(res, 400, "请输入账号或邮箱，以及密码");
      }
      const user = await store.authenticate(username, password);
      if (!user) {
        recordLogin(ip);
        return sendError(res, 401, "账号或密码不正确");
      }
      if (!hasAnyPermission(user)) {
        return sendError(res, 403, "当前角色没有访问权限");
      }
      res.cookie(session.COOKIE_NAME, session.createToken(user.id), session.cookieOptions());
      res.json({ user: publicUser(user) });
    } catch (error) {
      next(error);
    }
  });

  site.post("/api/auth/logout", (req, res) => {
    res.clearCookie(session.COOKIE_NAME, session.clearCookieOptions());
    res.json({ ok: true });
  });

  site.post("/api/auth/password", requireLogin, async (req, res) => {
    try {
      await store.changeOwnPassword(req.user.id, req.body?.currentPassword, req.body?.newPassword);
      res.json({ ok: true });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  });

  site.get("/api/meta", requireLogin, requirePermission("manage_users"), (_req, res) => {
    res.json({ permissions: PERMISSIONS });
  });

  site.get("/api/roles", requireLogin, async (req, res, next) => {
    try {
      if (!hasPermission(req.user, "manage_users") && !hasPermission(req.user, "manage_roles")) {
        return sendError(res, 403, "当前角色没有这项权限");
      }
      res.json({ roles: await store.listRoles() });
    } catch (error) {
      next(error);
    }
  });

  site.post("/api/roles", requireLogin, requirePermission("manage_roles"), async (req, res, next) => {
    try {
      const role = await store.createRole(req.body || {});
      res.status(201).json({ role });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  });

  site.patch("/api/roles/:id", requireLogin, requirePermission("manage_roles"), async (req, res, next) => {
    try {
      const role = await store.updateRole(req.params.id, req.body || {});
      res.json({ role });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  });

  site.delete("/api/roles/:id", requireLogin, requirePermission("manage_roles"), async (req, res, next) => {
    try {
      if (recentDeleteAttempts(req.user.id).length >= 5) {
        return sendError(res, 429, "密码尝试次数过多，请稍后再试");
      }
      await store.deleteRole(req.params.id, req.user, req.body?.password);
      deletePasswordAttempts.delete(req.user.id);
      res.json({ ok: true });
    } catch (error) {
      if (error.message === "管理员密码不正确") {
        deletePasswordAttempts.get(req.user.id).push(Date.now());
      }
      sendError(res, 400, error.message);
    }
  });

  site.get("/api/users", requireLogin, async (req, res, next) => {
    try {
      if (hasPermission(req.user, "manage_users")) {
        const users = await store.listUsers();
        return res.json({ users: req.user.roleKey === "system_admin" ? users : users.filter(user => user.roleKey !== "system_admin") });
      }
      const self = await store.findUserById(req.user.id);
      if (!self) return sendError(res, 401, "请先登录");
      const safe = { ...self };
      delete safe.passwordHash;
      res.json({ users: [safe] });
    } catch (error) {
      next(error);
    }
  });

  site.post("/api/users", requireLogin, requirePermission("manage_users"), async (req, res) => {
    try {
      const user = await store.createUser(req.body || {}, req.user);
      res.status(201).json({ user });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  });

  site.patch("/api/users/:id", requireLogin, async (req, res) => {
    try {
      const isAdmin = hasPermission(req.user, "manage_users");
      const isSelf = req.user.id === req.params.id;
      if (!isAdmin && !isSelf) {
        return sendError(res, 403, "只能修改自己的账号和密码");
      }
      if (isAdmin) {
        const target = await store.findUserById(req.params.id);
        if (!target) return sendError(res, 404, "人员不存在");
        if (!canManageUser(req.user, target)) return sendError(res, 403, "不能修改权限相同或更高的人员信息");
      }
      const body = req.body || {};
      if (req.user.roleKey === "research_mentor" && isSelf && (body.roleId || body.status !== undefined)) {
        return sendError(res, 403, "不能修改自己的角色或账号状态");
      }
      const patch = isAdmin
        ? body
        : {
            displayName: body.displayName,
            campus: body.campus,
            department: body.department,
            email: body.email
          };
      if (!isAdmin && body.password) return sendError(res, 400, "请在个人页面验证当前密码后修改");
      const user = await store.updateUser(req.params.id, patch, req.user);
      res.json({ user });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  });

  site.get("/admin.html", requireLogin, (_req, res) => {
    res.sendFile(path.join(SITE_ROOT, "admin.html"));
  });

  site.delete("/api/users/:id", requireLogin, async (req, res) => {
    if (req.user.roleKey !== SYSTEM_ADMIN_KEY) {
      return sendError(res, 403, "只有系统管理员可以删除人员账号");
    }
    try {
      if (recentDeleteAttempts(req.user.id).length >= 5) {
        return sendError(res, 429, "密码尝试次数过多，请稍后再试");
      }
      await store.deleteUser(req.params.id, req.user, req.body?.password);
      deletePasswordAttempts.delete(req.user.id);
      res.json({ ok: true });
    } catch (error) {
      if (error.message === "管理员密码不正确") {
        deletePasswordAttempts.get(req.user.id).push(Date.now());
      }
      sendError(res, 400, error.message);
    }
  });

  site.post("/api/users/import", requireLogin, requirePermission("manage_users"),
    express.raw({ type: "application/octet-stream", limit: "1mb" }), async (req, res) => {
      try {
        if (!Buffer.isBuffer(req.body) || !req.body.length) return sendError(res, 400, "请选择要导入的表格");
        const rows = await parseAccountFile(req.body, req.query.format);
        const result = await store.createUsersBatch(rows, req.user);
        res.status(201).json(result);
      } catch (error) {
        if (error.rows) return res.status(422).json({ error: error.message, rows: error.rows });
        sendError(res, 400, error.message);
      }
    });

  site.get("/profile.html", requireLogin, (_req, res) => {
    res.sendFile(path.join(SITE_ROOT, "profile.html"));
  });

  site.get("/login.html", (req, res) => {
    if (req.user && hasAnyPermission(req.user)) {
      const requested = typeof req.query.next === "string" ? req.query.next : "";
      const safeLocal = requested.startsWith("/") && !requested.startsWith("//") &&
        (!base || requested.startsWith(`${base}/`));
      const route = safeLocal ? requested.split(/[?#]/)[0].slice(base.length) || "/" : "";
      const permission = requiredContentPermission(route);
      const isPage = route === "/" || (route.endsWith(".html") && route !== "/login.html");
      const nextUrl = safeLocal && isPage && isServedStaticPath(route) && (!permission || hasPermission(req.user, permission))
        ? requested
        : joinPath(base, firstAccessiblePath(req.user));
      return res.redirect(nextUrl);
    }
    res.sendFile(path.join(SITE_ROOT, "login.html"));
  });

  site.use(requireLogin, requireContentAccess, express.static(SITE_ROOT, {
    index: "index.html",
    dotfiles: "ignore",
    fallthrough: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  }));

  site.use(requireLogin, requireContentAccess, async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const rel = decodeURIComponent(req.path || "").replace(/^\/+/, "").replace(/\\/g, "/");
    if (!rel.startsWith("assets/")) return next();
    try {
      const url = await store.getAssetTempUrl(rel);
      if (!url) return next();
      return res.redirect(302, url);
    } catch (error) {
      console.warn("[assets] COS fallback failed:", error.message);
      return next();
    }
  });

  site.get("/", requireLogin, requireContentAccess, (_req, res) => {
    res.sendFile(path.join(SITE_ROOT, "index.html"));
  });

  site.use((error, _req, res, _next) => {
    console.error("[auth-api]", error);
    sendError(res, 500, "服务暂时不可用");
  });

  if (base) {
    app.use(base, site);
    app.get("/healthz", (_req, res) => res.json({ ok: true }));
    app.use((req, res) => {
      if (req.path === "/" || req.path === "") {
        return res.redirect(joinPath(base, "/"));
      }
      res.status(404).send("Not Found");
    });
  } else {
    app.use(site);
  }

  return app;
}

module.exports = { createApp, basePath };
