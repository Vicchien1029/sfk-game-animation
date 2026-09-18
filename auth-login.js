(() => {
  const form = document.getElementById("loginForm");
  const errorNode = document.getElementById("loginError");
  const forgotButton = document.getElementById("forgotPassword");
  const params = new URLSearchParams(window.location.search);
  const nextUrl = params.get("next");

  const landingPage = user => {
    const allowed = user?.permissions || {};
    if (allowed.manage_users || allowed.manage_roles || user?.isSystemAdmin) return "admin.html";
    return [
      ["view_department", "index.html"],
      ...window.SFK_SITE_NAVIGATION.primary.filter(item => !item.disabled && item.href !== "#")
        .map(item => [`view_${item.id}`, item.href])
    ].find(([permission]) => allowed[permission])?.[1] || "profile.html";
  };

  const safeNext = value => {
    if (!value || value.startsWith("//")) return false;
    try {
      const destination = new URL(value, window.location.href);
      const sitePath = window.location.pathname.replace(/login\.html$/, "");
      return destination.origin === window.location.origin &&
        destination.pathname.startsWith(sitePath) &&
        (destination.pathname === sitePath || destination.pathname.endsWith(".html")) &&
        !destination.pathname.endsWith("login.html");
    } catch (_error) {
      return false;
    }
  };

  forgotButton?.addEventListener("click", () => {
    errorNode.textContent = "请联系管理员重置密码。";
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    errorNode.textContent = "";
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        errorNode.textContent = payload.error || "登录失败";
        return;
      }
      window.location.replace(safeNext(nextUrl) ? nextUrl : landingPage(payload.user));
    } catch (error) {
      errorNode.textContent = "网络异常，请稍后重试";
    } finally {
      button.disabled = false;
    }
  });
})();
