const http = require("http");

function request(method, path, { body, cookie } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: "127.0.0.1",
      port: Number(process.env.PORT) || 8080,
      path,
      method,
      headers: {
        Accept: method === "GET" && !path.startsWith("/api/") ? "text/html" : "application/json,text/html",
        ...(payload ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      }
    }, res => {
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve({
          status: res.statusCode,
          location: res.headers.location || "",
          cookies: res.headers["set-cookie"] || [],
          text
        });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function cookieHeader(cookies) {
  return cookies.map(part => part.split(";")[0]).filter(Boolean).join("; ");
}

async function main() {
  const home = await request("GET", "/");
  console.log("GET /", home.status, home.location);
  const cases = await request("GET", "/cases.html");
  console.log("GET /cases.html", cases.status, cases.location);
  const loginPage = await request("GET", "/login.html");
  console.log("GET /login.html", loginPage.status, loginPage.text.includes("登录资料库"));
  const login = await request("POST", "/api/auth/login", {
    body: { username: "admin", password: "ChangeMe@SFK2026" }
  });
  console.log("POST login", login.status, login.text);
  const cookie = cookieHeader(login.cookies);
  const authedHome = await request("GET", "/index.html", { cookie });
  console.log("GET /index.html authed", authedHome.status, authedHome.text.includes("斯芬克游戏动画科系"));
  const me = await request("GET", "/api/auth/me", { cookie });
  console.log("GET me", me.status, me.text);
  const role = await request("POST", "/api/roles", {
    cookie,
    body: {
      name: `课程顾问${Date.now().toString().slice(-4)}`,
      description: "可浏览资料",
      permissions: { view_site: true, manage_users: false, manage_roles: false }
    }
  });
  console.log("POST role", role.status, role.text);
  const roleId = JSON.parse(role.text).role.id;
  const stamp = Date.now().toString().slice(-4);
  const advisorUser = `advisor${stamp}`;
  const advisorEmail = `advisor${stamp}@sfk.local`;
  const user = await request("POST", "/api/users", {
    cookie,
    body: { username: advisorUser, email: advisorEmail, displayName: "顾问甲", password: "Advisor@123456", roleId }
  });
  console.log("POST user", user.status, user.text);
  const userId = JSON.parse(user.text).user.id;
  const patched = await request("PATCH", `/api/users/${userId}`, {
    cookie,
    body: { password: "Advisor@654321" }
  });
  console.log("PATCH password", patched.status, JSON.parse(patched.text).user.email);
  const advisorLogin = await request("POST", "/api/auth/login", {
    body: { username: advisorEmail, password: "Advisor@654321" }
  });
  console.log("advisor login by email", advisorLogin.status, advisorLogin.text);
  const advisorCookie = cookieHeader(advisorLogin.cookies);
  const selfList = await request("GET", "/api/users", { cookie: advisorCookie });
  console.log("advisor GET users", selfList.status, selfList.text);
  const selfUsers = JSON.parse(selfList.text).users || [];
  const advisorCases = await request("GET", "/cases.html", { cookie: advisorCookie });
  console.log("advisor cases", advisorCases.status, advisorCases.text.includes("Student Showcase"));
  const adminPage = await request("GET", "/admin.html", { cookie: advisorCookie });
  console.log("advisor admin", adminPage.status, adminPage.text.includes("人员列表"));
  const selfPatch = await request("PATCH", `/api/users/${userId}`, {
    cookie: advisorCookie,
    body: { displayName: "顾问甲改名", email: advisorEmail, password: "Advisor@765432" }
  });
  console.log("advisor self patch", selfPatch.status, JSON.parse(selfPatch.text).user.displayName);
  const forbiddenRole = await request("PATCH", `/api/users/${userId}`, {
    cookie: advisorCookie,
    body: { roleId: JSON.parse(me.text).user.roleId }
  });
  const afterSelf = JSON.parse((await request("GET", "/api/auth/me", { cookie: advisorCookie })).text);
  console.log("advisor cannot steal admin role", afterSelf.user.roleKey);
  const others = await request("PATCH", `/api/users/${JSON.parse(me.text).user.id}`, {
    cookie: advisorCookie,
    body: { displayName: "黑客" }
  });
  console.log("advisor patch admin", others.status, others.text);
  const ok = home.status === 302 && cases.status === 302 && loginPage.status === 200 && login.status === 200 && authedHome.status === 200 && selfList.status === 200 && selfUsers.length === 1 && advisorCases.status === 200 && adminPage.status === 200 && selfPatch.status === 200 && others.status === 403 && afterSelf.user.roleKey !== "system_admin";
  if (!ok) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
