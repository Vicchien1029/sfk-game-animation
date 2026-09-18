const ExcelJS = require("exceljs");

const HEADERS = {
  displayName: ["姓名", "老师姓名"],
  campus: ["校区", "所属校区"],
  department: ["部门", "所属部门"],
  email: ["邮箱", "电子邮箱"],
  password: ["初始密码", "登录密码"],
  roleName: ["角色", "角色名称"]
};
const MAX_ROWS = 200;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  let line = 1;
  let rowNumber = 1;
  const source = String(text).replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
        if (char === "\n") line += 1;
      }
    } else if (char === '"' && cell === "") {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\r" || char === "\n") {
      row.push(cell);
      rows.push({ rowNumber, values: row });
      row = [];
      cell = "";
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      line += 1;
      rowNumber = line;
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error("CSV 文件有未闭合的引号");
  if (cell !== "" || row.length) rows.push({ rowNumber, values: [...row, cell] });
  return rows;
}

function cellText(cell) {
  if (!cell || cell.value == null) return "";
  if (cell.type === ExcelJS.ValueType.Formula) {
    throw new Error("表格不能使用公式，请将内容粘贴为文本");
  }
  return String(cell.text ?? cell.value);
}

async function parseAccountFile(buffer, format) {
  let lines;
  if (format === "csv") {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    lines = parseCsv(text);
  } else if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) throw new Error("Excel 文件没有工作表");
    lines = [];
    sheet.eachRow((row, rowNumber) => {
      const values = [];
      for (let column = 1; column <= Math.max(row.cellCount, 6); column += 1) {
        values.push(cellText(row.getCell(column)));
      }
      lines.push({ rowNumber, values });
    });
  } else {
    throw new Error("只支持 .xlsx 或 UTF-8 编码的 .csv 文件");
  }

  if (!lines.length) throw new Error("表格为空");
  const labels = lines[0].values.map(value => String(value).trim().replace(/^\uFEFF/, ""));
  const columns = {};
  for (const [field, options] of Object.entries(HEADERS)) {
    columns[field] = labels.findIndex(label => options.includes(label));
    if (columns[field] < 0) throw new Error(`缺少“${options[0]}”列，请使用下载的模板`);
  }
  const rows = lines.slice(1).filter(line => line.values.some(value => String(value).trim()))
    .map(line => ({
      rowNumber: line.rowNumber,
      displayName: String(line.values[columns.displayName] ?? "").trim(),
      campus: String(line.values[columns.campus] ?? "").trim(),
      department: String(line.values[columns.department] ?? "").trim(),
      email: String(line.values[columns.email] ?? "").trim(),
      password: String(line.values[columns.password] ?? ""),
      roleName: String(line.values[columns.roleName] ?? "").trim()
    }));
  if (!rows.length) throw new Error("表格中没有账号数据");
  if (rows.length > MAX_ROWS) throw new Error(`每次最多导入 ${MAX_ROWS} 个账号`);
  return rows;
}

module.exports = { parseAccountFile, parseCsv, MAX_ROWS };
