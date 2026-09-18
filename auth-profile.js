(() => {
  const form = document.getElementById('passwordForm');
  const status = document.getElementById('profileStatus');
  fetch('api/auth/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('请先登录')))
    .then(({ user }) => {
      document.getElementById('profileName').textContent = user.displayName || user.username;
      document.getElementById('profileRole').textContent = user.roleName || '普通用户';
      document.getElementById('profileManageLink').hidden = !(user.isSystemAdmin || user.permissions?.manage_users || user.permissions?.manage_roles);
    })
    .catch(() => window.location.replace('login.html?next=profile.html'));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.newPassword.value;
    if (newPassword !== form.elements.confirmPassword.value) {
      status.textContent = '两次输入的新密码不一致';
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const response = await fetch('api/auth/password', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || '密码修改失败');
      form.reset();
      status.textContent = '密码已更新';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
})();
