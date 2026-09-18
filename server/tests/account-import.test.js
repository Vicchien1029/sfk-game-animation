const test = require("node:test");
const assert = require("node:assert/strict");
const ExcelJS = require("exceljs");
const { parseAccountFile } = require("../lib/account-import");
const { prepareUsersBatch } = require("../lib/store");
const { fullPermissions, viewerPermissions } = require("../lib/permissions");
const storeModule = require("../lib/store");
const session = require("../lib/session");

process.env.SESSION_SECRET = "account-import-test-secret";

test("CSV import handles quoted names and retains row numbers", async () => {
  const csv = '\uFEFF姓名,校区,部门,邮箱,初始密码,角色\r\n"王,老师",上海,教研部,wang@example.com,Abcdef12,游客\r\n李老师,北京,游戏动画,li@example.com,Initpass34,游客\r\n';
  const rows = await parseAccountFile(Buffer.from(csv), "csv");
  assert.deepEqual(rows.map(({ rowNumber, displayName, campus, department, email }) => ({ rowNumber, displayName, campus, department, email })), [
    { rowNumber: 2, displayName: "王,老师", campus: "上海", department: "教研部", email: "wang@example.com" },
    { rowNumber: 3, displayName: "李老师", campus: "北京", department: "游戏动画", email: "li@example.com" }
  ]);
});

test("Excel import reads the first sheet and rejects formulas", async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("账号");
  sheet.addRow(["姓名", "校区", "部门", "邮箱", "初始密码", "角色"]);
  sheet.addRow(["张老师", "上海", "教研部", "zhang@example.com", "Initpass34", "游客"]);
  const rows = await parseAccountFile(Buffer.from(await workbook.xlsx.writeBuffer()), "xlsx");
  assert.equal(rows[0].rowNumber, 2);
  assert.equal(rows[0].campus, "上海");
  assert.equal(rows[0].department, "教研部");
  assert.equal(rows[0].password, "Initpass34");
  sheet.getCell("E2").value = { formula: '"unsafe"', result: "unsafe" };
  await assert.rejects(parseAccountFile(Buffer.from(await workbook.xlsx.writeBuffer()), "xlsx"), /不能使用公式/);
});

test("batch validation is all-or-nothing and checks duplicate emails and administrator role", () => {
  const store = {
    roles: [
      { id: "viewer", name: "游客", key: "viewer", permissions: viewerPermissions() },
      { id: "admin", name: "系统管理员", key: "system_admin", permissions: fullPermissions() }
    ],
    users: [{ username: "taken@example.com", email: "taken@example.com" }]
  };
  const rows = [
    { rowNumber: 2, displayName: "甲老师", campus: "上海", department: "教研部", email: "new@example.com", password: "Initpass34", roleName: "游客" },
    { rowNumber: 3, displayName: "乙老师", campus: "北京", department: "教研部", email: "new@example.com", password: "Initpass34", roleName: "游客" },
    { rowNumber: 4, displayName: "丙老师", campus: "上海", department: "教研部", email: "taken@example.com", password: "Initpass34", roleName: "游客" },
    { rowNumber: 5, displayName: "丁老师", campus: "上海", department: "教研部", email: "admin@example.com", password: "Initpass34", roleName: "系统管理员" }
  ];
  assert.throws(() => prepareUsersBatch(store, rows, { roleKey: "research_mentor", permissions: { ...viewerPermissions(), manage_users: true } }), error => {
    assert.deepEqual(error.rows.map(item => item.row), [3, 4, 5]);
    return true;
  });
  assert.equal(store.users.length, 1);
  const prepared = prepareUsersBatch(store, rows.slice(0, 1), { roleKey: "system_admin" });
  assert.equal(prepared[0].campus, "上海");
  assert.equal(prepared[0].department, "教研部");
  assert.throws(() => prepareUsersBatch(store, [{ ...rows[0], campus: "" }], { roleKey: "system_admin" }), /未创建任何账号/);
});

test("import endpoint accepts a CSV upload only for personnel managers", async t => {
  const users = {
    manager: { id: "manager", status: "active", roleKey: "research_mentor",
      permissions: { ...viewerPermissions(), manage_users: true } },
    viewer: { id: "viewer", status: "active", roleKey: "viewer",
      permissions: viewerPermissions() }
  };
  let importedRows = null;
  storeModule.findUserById = async id => users[id] || null;
  storeModule.createUsersBatch = async rows => {
    importedRows = rows;
    return { created: rows.length };
  };
  const { createApp } = require("../app");
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/users/import?format=csv`;
  const body = "姓名,校区,部门,邮箱,初始密码,角色\r\n张老师,上海,教研部,zhang@example.com,Initpass34,游客";
  const upload = userId => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Cookie: `${session.COOKIE_NAME}=${session.createToken(userId)}`
    },
    body
  });
  assert.equal((await upload("viewer")).status, 403);
  const response = await upload("manager");
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { created: 1 });
  assert.equal(importedRows[0].displayName, "张老师");
  assert.equal(importedRows[0].campus, "上海");
});
