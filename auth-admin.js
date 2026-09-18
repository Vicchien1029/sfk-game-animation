(() => {
  const statusNode = document.getElementById("adminStatus");
  const roleList = document.getElementById("roleList");
  const userList = document.getElementById("userList");
  const roleForm = document.getElementById("roleForm");
  const userForm = document.getElementById("userForm");
  const bulkImportForm = document.getElementById("bulkImportForm");
  const bulkImportResult = document.getElementById("bulkImportResult");
  const downloadImportTemplate = document.getElementById("downloadImportTemplate");
  const rolePermissions = document.getElementById("rolePermissions");
  const userRoleSelect = document.getElementById("userRoleSelect");
  const roleSection = document.getElementById("roleSection");
  const roleCount = document.getElementById("roleCount");
  const userCount = document.getElementById("userCount");
  const userFilters = document.getElementById("userFilters");
  const userFilterCampus = document.getElementById("userFilterCampus");
  const userFilterDepartment = document.getElementById("userFilterDepartment");
  const userFilterRole = document.getElementById("userFilterRole");
  const resetUserFilters = document.getElementById("resetUserFilters");
  const userFilterSummary = document.getElementById("userFilterSummary");
  const adminTitle = document.getElementById("adminTitle");
  const adminLead = document.getElementById("adminLead");
  const roleSubmit = document.getElementById("roleSubmit");
  const roleLayout = document.getElementById("roleLayout");
  const roleEditor = document.getElementById("roleEditor");
  const roleEditorTitle = document.getElementById("roleEditorTitle");
  const addRoleButton = document.getElementById("addRoleButton");
  const closeRoleButton = document.getElementById("closeRoleEditor");
  const cancelRoleButton = document.getElementById("cancelRoleEditor");
  const deleteRoleDialog = document.getElementById("deleteRoleDialog");
  const deleteRoleForm = document.getElementById("deleteRoleForm");
  const deleteRoleName = document.getElementById("deleteRoleName");
  const deleteRoleError = document.getElementById("deleteRoleError");
  const cancelDeleteRole = document.getElementById("cancelDeleteRole");
  const confirmDeleteRole = document.getElementById("confirmDeleteRole");
  const deleteUserDialog = document.getElementById("deleteUserDialog");
  const deleteUserForm = document.getElementById("deleteUserForm");
  const deleteUserName = document.getElementById("deleteUserName");
  const deleteUserError = document.getElementById("deleteUserError");
  const cancelDeleteUser = document.getElementById("cancelDeleteUser");
  const confirmDeleteUser = document.getElementById("confirmDeleteUser");

  let permissions = [];
  let roles = [];
  let users = [];
  let editingRoleId = "";
  let me = null;
  let roleTrigger = null;
  let rowFeedback = { id: "", message: "", kind: "" };
  let pendingDeleteRoleId = "";
  let pendingDeleteUserId = "";

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));

  const pad = value => String(value).padStart(2, "0");
  const emptyFilterValue = "__sfk_empty__";
  const builtinOrder = { system_admin: 0, research_mentor: 1, viewer: 2 };
  const managerRank = user => user.roleKey === "system_admin" ? 0 :
    user.roleKey === "research_mentor" ? 1 :
    user.permissions?.manage_users || user.permissions?.manage_roles ? 2 : 3;

  const setStatus = (message, isError = false) => {
    statusNode.textContent = message || "";
    statusNode.style.color = isError ? "#ff8a5b" : "#ccc";
  };

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.replace("login.html?next=admin.html");
      throw new Error("请先登录");
    }
    if (!response.ok) throw new Error(payload.error || "请求失败");
    return payload;
  };

  const canManageUsers = () => Boolean(me?.permissions?.manage_users || me?.isSystemAdmin);
  const canManageRoles = () => Boolean(me?.permissions?.manage_roles || me?.isSystemAdmin);
  const permissionIds = () => permissions.map(item => item.id);
  const isStrictlyLower = targetPermissions => {
    const own = me?.permissions || {};
    const target = targetPermissions || {};
    return permissionIds().every(id => !target[id] || own[id]) &&
      permissionIds().some(id => own[id] && !target[id]);
  };
  const canEditUser = user => {
    if (me?.roleKey === "research_mentor") return user.id === me.id || isStrictlyLower(user.permissions);
    return canManageUsers() || user.id === me?.id;
  };

  const permissionGroups = [
    { title: "01 / 科系基本内容", group: "department", description: "科系导航、首页和规划我的未来" },
    { title: "02 / 科系主要内容", group: "primary", description: "与主要导航同步；未开放的页面会在上线后生效" },
    { title: "03 / 管理人员", group: "users", description: "创建、停用账号，修改资料和密码，分配角色；仅系统管理员可永久删除账号" },
    { title: "04 / 管理角色", group: "roles", description: "新增、编辑、删除角色及其权限" }
  ];

  const permissionChecks = (selected = {}, locked = false) => permissionGroups.map(section => {
    const items = permissions.filter(item => item.group === section.group ||
      (section.group === "users" && item.id === "manage_users") ||
      (section.group === "roles" && item.id === "manage_roles"));
    return `<fieldset class="admin-permission-group ${section.group === "primary" ? "is-primary" : ""}">
      <legend>${escapeHtml(section.title)}</legend>
      <p>${escapeHtml(section.description)}</p>
      ${section.group === "primary" ? `<label class="admin-permission-all"><input type="checkbox" data-select-all="primary" ${locked ? "disabled" : ""}><strong>全选主要内容</strong></label>` : ""}
      <div class="admin-permission-options">${items.map(item => `
        <label>
          <input type="checkbox" name="perm-${item.id}" ${selected[item.id] ? "checked" : ""} ${locked ? "disabled" : ""}>
          <span><strong>${escapeHtml(item.label)}</strong>${section.group === "primary" ? "" : `<small>${escapeHtml(item.hint)}</small>`}</span>
        </label>`).join("")}</div>
    </fieldset>`;
  }).join("") + (locked ? '<p class="admin-permission-locked">系统管理员始终拥有全部权限。</p>' : "");

  const syncSelectAll = () => {
    const selectAll = rolePermissions.querySelector('[data-select-all="primary"]');
    if (!selectAll) return;
    const checks = permissions.filter(item => item.group === "primary")
      .map(item => rolePermissions.querySelector(`[name="perm-${item.id}"]`)).filter(Boolean);
    selectAll.checked = checks.length > 0 && checks.every(check => check.checked);
    selectAll.indeterminate = checks.some(check => check.checked) && !selectAll.checked;
  };

  rolePermissions.addEventListener("change", event => {
    if (event.target.matches('[data-select-all="primary"]')) {
      permissions.filter(item => item.group === "primary").forEach(item => {
        const check = rolePermissions.querySelector(`[name="perm-${item.id}"]`);
        if (check && !check.disabled) check.checked = event.target.checked;
      });
    }
    syncSelectAll();
  });

  const readPermissions = form => {
    const next = {};
    permissions.forEach(item => {
      next[item.id] = Boolean(form.querySelector(`[name="perm-${item.id}"]`)?.checked);
    });
    return next;
  };

  const openRoleEditor = (role = null, trigger = null) => {
    roleTrigger = trigger;
    editingRoleId = role?.id || "";
    roleForm.reset();
    roleForm.elements.namedItem("name").value = role?.name || "";
    roleForm.elements.namedItem("description").value = role?.description || "";
    rolePermissions.innerHTML = permissionChecks(role?.permissions || {}, role?.key === "system_admin");
    syncSelectAll();
    roleEditorTitle.textContent = role ? `编辑角色 · ${role.name}` : "新增角色";
    roleSubmit.textContent = role ? "保存角色" : "添加角色";
    roleLayout.classList.add("is-open");
    roleEditor.removeAttribute("inert");
    roleEditor.setAttribute("aria-hidden", "false");
    addRoleButton.setAttribute("aria-expanded", "true");
    roleForm.elements.namedItem("name").focus();
  };

  const closeRoleEditor = () => {
    roleLayout.classList.remove("is-open");
    roleEditor.setAttribute("inert", "");
    roleEditor.setAttribute("aria-hidden", "true");
    addRoleButton.setAttribute("aria-expanded", "false");
    editingRoleId = "";
    if (roleTrigger?.isConnected) roleTrigger.focus();
    roleTrigger = null;
  };

  addRoleButton.addEventListener("click", () => openRoleEditor(null, addRoleButton));
  closeRoleButton.addEventListener("click", closeRoleEditor);
  cancelRoleButton.addEventListener("click", closeRoleEditor);
  document.addEventListener?.("keydown", event => {
    if (event.key === "Escape" && roleLayout.classList.contains("is-open")) closeRoleEditor();
  });

  const roleOptions = selectedId => roles.filter(role =>
    (me?.isSystemAdmin || role.key !== "system_admin") &&
    (me?.roleKey !== "research_mentor" || isStrictlyLower(role.permissions))
  ).map(role =>
    `<option value="${escapeHtml(role.id)}" ${role.id === selectedId ? "selected" : ""}>${escapeHtml(role.name)}</option>`
  ).join("");

  const renderRoles = () => {
    roleCount.textContent = pad(roles.length);
    if (!canManageRoles() && !canManageUsers()) {
      roleSection.hidden = true;
      return;
    }
    roleSection.hidden = false;
    roleList.innerHTML = roles.map((role, index) => `
      <tr data-role-id="${escapeHtml(role.id)}" class="${role.builtin ? "is-builtin" : ""}">
        <td>
          <span class="admin-row-index">${pad(index + 1)}</span>
          <strong>${escapeHtml(role.name)}</strong>
          ${role.builtin ? '<em class="admin-inline-note">内置</em>' : ""}
        </td>
        <td>${escapeHtml(role.description || "未填写说明")}</td>
        <td>
          <div class="admin-perms">${Object.entries(role.permissions).filter(([, on]) => on).map(([id]) => {
            const meta = permissions.find(item => item.id === id);
            return `<span>${escapeHtml(meta ? meta.label : id)}</span>`;
          }).join("")}</div>
        </td>
        <td>
          <div class="admin-actions">
            ${canManageRoles() ? `<button class="admin-btn-ghost" type="button" data-edit-role="${escapeHtml(role.id)}">编辑</button>` : ""}
            ${role.builtin || !canManageRoles() ? "" : `<button class="admin-btn-danger" type="button" data-delete-role="${escapeHtml(role.id)}">删除</button>`}
          </div>
        </td>
      </tr>`).join("");
    userRoleSelect.innerHTML = roleOptions(userRoleSelect.value);
  };

  const renderUserFilterOptions = () => {
    const updateOptions = (select, items, allLabel) => {
      const selected = select.value;
      select.innerHTML = `<option value="">${allLabel}</option>` +
        items.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
      select.value = items.some(([value]) => value === selected) ? selected : "";
    };
    const textOptions = field => [...new Set(users.map(user => String(user[field] || "").trim()))]
      .sort((a, b) => !a - !b || a.localeCompare(b, "zh-CN"))
      .map(value => [value || emptyFilterValue, value || "未填写"]);
    const roleOptions = [...new Map(users.map(user => [
      String(user.roleId || "") || emptyFilterValue,
      user.roleName || "未分配角色"
    ])).entries()].sort((a, b) => a[1].localeCompare(b[1], "zh-CN"));
    updateOptions(userFilterCampus, textOptions("campus"), "全部校区");
    updateOptions(userFilterDepartment, textOptions("department"), "全部部门");
    updateOptions(userFilterRole, roleOptions, "全部角色");
  };

  const applyUserFilters = () => {
    const matches = (value, selected) => !selected ||
      (selected === emptyFilterValue ? !String(value || "").trim() : String(value || "").trim() === selected);
    const visibleUsers = users.filter(user =>
      matches(user.campus, userFilterCampus.value) &&
      matches(user.department, userFilterDepartment.value) &&
      matches(user.roleId, userFilterRole.value));
    const visibleIds = new Set(visibleUsers.map(user => String(user.id)));
    if (typeof userList.querySelectorAll === "function") {
      userList.querySelectorAll("tr[data-user-id]").forEach(row => {
        row.hidden = !visibleIds.has(row.dataset.userId);
      });
      const emptyRow = userList.querySelector(".admin-filter-empty");
      if (emptyRow) emptyRow.hidden = visibleUsers.length > 0;
    }
    const active = Boolean(userFilterCampus.value || userFilterDepartment.value || userFilterRole.value);
    resetUserFilters.disabled = !active;
    userFilterSummary.textContent = active
      ? `显示 ${visibleUsers.length} / ${users.length} 人`
      : `共 ${users.length} 人`;
  };

  const renderUsers = () => {
    userCount.textContent = pad(users.length);
    userList.innerHTML = users.map(user => {
      const editable = canEditUser(user);
      const mentorSelf = me?.roleKey === "research_mentor" && user.id === me.id;
      const assignRole = canManageUsers() && editable && !mentorSelf;
      const campusValue = user.campus || "";
      const departmentValue = user.department || "";
      const emailValue = user.email || "";
      return `
      <tr data-user-id="${escapeHtml(user.id)}" class="admin-user-row ${rowFeedback.id === user.id && rowFeedback.kind === "saved" ? "is-saved" : ""} ${!editable && me?.roleKey === "research_mentor" ? "is-protected" : ""}">
        <td>
          ${editable
            ? `<input form="user-row-${escapeHtml(user.id)}" name="displayName" value="${escapeHtml(user.displayName)}" required maxlength="40">`
            : `<strong>${escapeHtml(user.displayName)}</strong>`}
        </td>
        <td>
          ${editable
            ? `<input form="user-row-${escapeHtml(user.id)}" name="campus" value="${escapeHtml(campusValue)}" maxlength="40" placeholder="未填写">`
            : escapeHtml(campusValue || "未填写")}
        </td>
        <td>
          ${editable
            ? `<input form="user-row-${escapeHtml(user.id)}" name="department" value="${escapeHtml(departmentValue)}" maxlength="60" placeholder="未填写">`
            : escapeHtml(departmentValue || "未填写")}
        </td>
        <td>
          ${editable
            ? `<input form="user-row-${escapeHtml(user.id)}" name="email" type="email" value="${escapeHtml(emailValue)}" maxlength="80" placeholder="name@example.com">`
            : escapeHtml(emailValue || "未填写")}
        </td>
        <td>
          ${mentorSelf
            ? `<div class="admin-self-password-fields">
                <label><span>当前密码</span><input form="user-row-${escapeHtml(user.id)}" name="currentPassword" type="password" autocomplete="current-password" placeholder="仅改密时填写"></label>
                <label><span>新密码</span><input form="user-row-${escapeHtml(user.id)}" name="password" type="password" minlength="8" maxlength="64" autocomplete="new-password" placeholder="8–64 位"></label>
              </div>`
            : editable
            ? `<input form="user-row-${escapeHtml(user.id)}" name="password" type="password" minlength="8" maxlength="64" placeholder="留空则不修改" autocomplete="new-password">`
            : "••••••••"}
        </td>
        <td>
          ${assignRole
            ? `<select form="user-row-${escapeHtml(user.id)}" name="roleId">${roleOptions(user.roleId)}</select>`
            : `<span class="admin-tag">${escapeHtml(user.roleName)}</span>`}
        </td>
        <td>
          ${editable ? `<form id="user-row-${escapeHtml(user.id)}" class="admin-row-form" data-user-form="${escapeHtml(user.id)}">
            <div class="admin-actions">
              <button class="admin-btn" type="submit">${rowFeedback.id === user.id && rowFeedback.kind === "saved" ? "✓ 已保存" : "保存更改"}</button>
              ${assignRole && user.id !== me?.id ? `<button class="admin-btn-ghost" type="button" data-toggle-user="${escapeHtml(user.id)}" data-status="${escapeHtml(user.status)}">${user.status === "active" ? "停用" : "启用"}</button>` : ""}
              ${me?.isSystemAdmin && user.id !== me.id ? `<button class="admin-btn-danger" type="button" data-delete-user="${escapeHtml(user.id)}">删除</button>` : ""}
              <span class="admin-row-feedback ${rowFeedback.id === user.id && rowFeedback.kind === "error" ? "is-error" : ""}" role="status">${rowFeedback.id === user.id ? escapeHtml(rowFeedback.message) : ""}</span>
            </div>
          </form>` : (me?.roleKey === "research_mentor" ? '<span class="admin-protected-note">非低权限账号 · 不可修改</span>' : "")}
        </td>
      </tr>`;
    }).join("") + '<tr class="admin-filter-empty" hidden><td colspan="7">没有符合条件的人员</td></tr>';
    applyUserFilters();
  };

  const loadAll = async () => {
    const meRes = await request("api/auth/me");
    me = meRes.user;
    const isAdmin = canManageUsers() || canManageRoles();
    adminTitle.textContent = isAdmin ? "权限管理" : "账号设置";
    adminLead.textContent = isAdmin
      ? "按科系内容和管理职责配置角色；主要内容可分别授权或全选。人员列表可分配角色与维护账号。"
      : "你可以修改自己的姓名、校区、部门、邮箱和登录密码。角色由系统管理员分配。";
    const [roleRes, userRes] = await Promise.all([
      isAdmin ? request("api/roles") : Promise.resolve({ roles: [] }),
      request("api/users")
    ]);
    permissions = meRes.permissions || [];
    roles = (roleRes.roles || []).map((role, index) => ({ role, index }))
      .sort((a, b) => (builtinOrder[a.role.key] ?? 3) - (builtinOrder[b.role.key] ?? 3) || a.index - b.index)
      .map(item => item.role);
    users = (userRes.users || []).map((user, index) => ({ user, index }))
      .sort((a, b) => managerRank(a.user) - managerRank(b.user) || a.index - b.index)
      .map(item => item.user);
    roleForm.hidden = !canManageRoles();
    addRoleButton.hidden = !canManageRoles();
    userForm.hidden = !canManageUsers();
    bulkImportForm.hidden = !canManageUsers();
    userFilters.hidden = !canManageUsers();
    if (canManageRoles() && !rolePermissions.dataset.ready) {
      rolePermissions.innerHTML = permissionChecks();
      syncSelectAll();
      rolePermissions.dataset.ready = "true";
    }
    renderRoles();
    renderUserFilterOptions();
    renderUsers();
  };

  [userFilterCampus, userFilterDepartment, userFilterRole].forEach(select => {
    select.addEventListener("change", applyUserFilters);
  });
  resetUserFilters.addEventListener("click", () => {
    userFilterCampus.value = "";
    userFilterDepartment.value = "";
    userFilterRole.value = "";
    applyUserFilters();
  });

  roleList.addEventListener("click", async event => {
    const editId = event.target.closest("[data-edit-role]")?.dataset.editRole;
    const deleteId = event.target.closest("[data-delete-role]")?.dataset.deleteRole;
    if (editId) {
      const role = roles.find(item => item.id === editId);
      if (!role) return;
      openRoleEditor(role, event.target.closest("[data-edit-role]"));
    }
    if (deleteId) {
      const role = roles.find(item => item.id === deleteId);
      if (!role || role.builtin) return;
      pendingDeleteRoleId = role.id;
      deleteRoleName.textContent = role.name;
      deleteRoleError.textContent = "";
      deleteRoleForm.reset();
      deleteRoleDialog.showModal();
      deleteRoleForm.elements.namedItem("password").focus();
    }
  });

  cancelDeleteRole.addEventListener("click", () => deleteRoleDialog.close());
  deleteRoleDialog.addEventListener("close", () => {
    pendingDeleteRoleId = "";
    deleteRoleForm.reset();
    deleteRoleError.textContent = "";
  });
  deleteRoleForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!pendingDeleteRoleId) return;
    confirmDeleteRole.disabled = true;
    confirmDeleteRole.textContent = "正在验证…";
    deleteRoleError.textContent = "";
    try {
      await request(`api/roles/${pendingDeleteRoleId}`, {
        method: "DELETE",
        body: JSON.stringify({ password: deleteRoleForm.elements.namedItem("password").value })
      });
      deleteRoleDialog.close();
      setStatus("角色已删除");
      await loadAll();
    } catch (error) {
      deleteRoleError.textContent = error.message;
      deleteRoleForm.elements.namedItem("password").value = "";
    } finally {
      confirmDeleteRole.disabled = false;
      confirmDeleteRole.textContent = "确认删除";
    }
  });

  roleForm.addEventListener("submit", async event => {
    event.preventDefault();
    const body = {
      name: roleForm.elements.namedItem("name").value.trim(),
      description: roleForm.elements.namedItem("description").value.trim(),
      permissions: readPermissions(roleForm)
    };
    const originalLabel = roleSubmit.textContent;
    roleSubmit.disabled = true;
    roleSubmit.textContent = "保存中…";
    try {
      if (editingRoleId) {
        await request(`api/roles/${editingRoleId}`, { method: "PATCH", body: JSON.stringify(body) });
        setStatus("角色已更新");
      } else {
        await request("api/roles", { method: "POST", body: JSON.stringify(body) });
        setStatus("角色已创建");
      }
      await loadAll();
      closeRoleEditor();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      roleSubmit.disabled = false;
      if (roleLayout.classList.contains("is-open")) roleSubmit.textContent = originalLabel;
    }
  });

  userForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = userForm.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = "添加中…";
    try {
      await request("api/users", {
        method: "POST",
        body: JSON.stringify({
          displayName: userForm.displayName.value.trim(),
          campus: userForm.campus.value.trim(),
          department: userForm.department.value.trim(),
          email: userForm.email.value.trim(),
          username: userForm.email.value.trim(),
          password: userForm.password.value,
          roleId: userForm.roleId.value
        })
      });
      userForm.reset();
      setStatus("人员账号已创建");
      await loadAll();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = "添加人员";
    }
  });

  downloadImportTemplate.addEventListener("click", () => {
    const csv = "\uFEFF姓名,校区,部门,邮箱,初始密码,角色\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "账号批量导入模板.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });

  bulkImportForm.addEventListener("submit", async event => {
    event.preventDefault();
    const file = bulkImportForm.elements.file.files?.[0];
    if (!file) return;
    const format = file.name.toLowerCase().endsWith(".xlsx") ? "xlsx"
      : file.name.toLowerCase().endsWith(".csv") ? "csv" : "";
    bulkImportResult.classList.remove("is-error");
    bulkImportResult.textContent = "";
    if (!format || file.size > 1024 * 1024) {
      bulkImportResult.classList.add("is-error");
      bulkImportResult.textContent = "请选择不超过 1 MB 的 .xlsx 或 UTF-8 CSV 文件";
      return;
    }
    const button = bulkImportForm.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = "导入中…";
    try {
      const response = await fetch(`api/users/import?format=${format}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/octet-stream" },
        body: await file.arrayBuffer()
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.replace("login.html?next=admin.html");
        return;
      }
      if (!response.ok) {
        const error = new Error(payload.error || "导入失败");
        error.rows = payload.rows || [];
        throw error;
      }
      bulkImportResult.textContent = `成功导入 ${payload.created} 个账号。`;
      setStatus(`已批量创建 ${payload.created} 个账号`);
      bulkImportForm.reset();
      await loadAll();
    } catch (error) {
      bulkImportResult.classList.add("is-error");
      const rowItems = (error.rows || []).map(item =>
        `<li>第 ${escapeHtml(item.row)} 行：${escapeHtml(item.message)}</li>`).join("");
      bulkImportResult.innerHTML = `<p>${escapeHtml(error.message)}</p>${rowItems ? `<ul>${rowItems}</ul>` : ""}`;
    } finally {
      button.disabled = false;
      button.textContent = "导入账号";
    }
  });

  const markUserRowDirty = event => {
    const row = event.target.closest("tr[data-user-id]");
    if (!row) return;
    if (rowFeedback.id === row.dataset.userId) rowFeedback = { id: "", message: "", kind: "" };
    row.classList.remove("is-saved");
    row.classList.add("is-dirty");
    const button = row.querySelector('[type="submit"]');
    if (button && !button.disabled) button.textContent = "保存更改";
    const feedback = row.querySelector(".admin-row-feedback");
    if (feedback) feedback.textContent = "有未保存的修改";
  };
  userList.addEventListener("input", markUserRowDirty);
  userList.addEventListener("change", markUserRowDirty);

  userList.addEventListener("submit", async event => {
    const form = event.target.closest("[data-user-form]");
    if (!form) return;
    event.preventDefault();
    const userId = form.dataset.userForm;
    const displayName = document.querySelector(`[form="${form.id}"][name="displayName"]`);
    const campus = document.querySelector(`[form="${form.id}"][name="campus"]`);
    const department = document.querySelector(`[form="${form.id}"][name="department"]`);
    const email = document.querySelector(`[form="${form.id}"][name="email"]`);
    const password = document.querySelector(`[form="${form.id}"][name="password"]`);
    const currentPassword = document.querySelector(`[form="${form.id}"][name="currentPassword"]`);
    const roleId = document.querySelector(`[form="${form.id}"][name="roleId"]`);
    const body = {
      displayName: displayName?.value.trim(),
      campus: campus?.value.trim(),
      department: department?.value.trim(),
      email: email?.value.trim()
    };
    if (password?.value) {
      body.password = password.value;
      if (currentPassword) body.currentPassword = currentPassword.value;
    }
    if (canManageUsers() && roleId?.value) body.roleId = roleId.value;
    const row = form.closest("tr[data-user-id]");
    if (currentPassword?.value && !password?.value) {
      const feedback = row?.querySelector(".admin-row-feedback");
      if (feedback) {
        feedback.textContent = "请输入新密码";
        feedback.classList.add("is-error");
      }
      setStatus("请输入新密码", true);
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = "保存中…";
    const feedback = row?.querySelector(".admin-row-feedback");
    if (feedback) feedback.textContent = "正在提交修改";
    try {
      await request(`api/users/${userId}`, { method: "PATCH", body: JSON.stringify(body) });
      rowFeedback = { id: userId, message: `已提交 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`, kind: "saved" };
      setStatus("人员信息已保存");
      await loadAll();
    } catch (error) {
      rowFeedback = { id: userId, message: error.message, kind: "error" };
      if (feedback) {
        feedback.textContent = error.message;
        feedback.classList.add("is-error");
      }
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
      if (button.isConnected && button.textContent === "保存中…") button.textContent = "保存更改";
    }
  });

  userList.addEventListener("click", async event => {
    const deleteButton = event.target.closest("[data-delete-user]");
    if (deleteButton && me?.isSystemAdmin) {
      const user = users.find(item => item.id === deleteButton.dataset.deleteUser);
      if (!user || user.id === me.id) return;
      pendingDeleteUserId = user.id;
      deleteUserName.textContent = `${user.displayName}（${user.email || user.username}）`;
      deleteUserError.textContent = "";
      deleteUserForm.reset();
      deleteUserDialog.showModal();
      deleteUserForm.elements.namedItem("password").focus();
      return;
    }
    const button = event.target.closest("[data-toggle-user]");
    if (!button) return;
    try {
      await request(`api/users/${button.dataset.toggleUser}`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.status === "active" ? "disabled" : "active" })
      });
      setStatus("人员状态已更新");
      await loadAll();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  cancelDeleteUser.addEventListener("click", () => deleteUserDialog.close());
  deleteUserDialog.addEventListener("close", () => {
    pendingDeleteUserId = "";
    deleteUserForm.reset();
    deleteUserError.textContent = "";
  });
  deleteUserForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!pendingDeleteUserId) return;
    confirmDeleteUser.disabled = true;
    confirmDeleteUser.textContent = "正在验证…";
    deleteUserError.textContent = "";
    try {
      await request(`api/users/${encodeURIComponent(pendingDeleteUserId)}`, {
        method: "DELETE",
        body: JSON.stringify({ password: deleteUserForm.elements.namedItem("password").value })
      });
      deleteUserDialog.close();
      rowFeedback = { id: "", message: "", kind: "" };
      setStatus("人员账号已删除");
      await loadAll();
    } catch (error) {
      deleteUserError.textContent = error.message;
      deleteUserForm.elements.namedItem("password").value = "";
    } finally {
      confirmDeleteUser.disabled = false;
      confirmDeleteUser.textContent = "确认删除";
    }
  });

  loadAll().catch(error => setStatus(error.message, true));
})();
