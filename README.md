# SFK 游戏动画科系内部资料库

斯芬克游戏动画科系内部站点：作品案例、课程、专业介绍与学业规划。站点需账号登录后访问，支持角色与人员权限管理。

## 2026-09-18 阶段交付

本版包含登录页、共享导航中的个人入口、角色与人员权限管理、批量导入、人员筛选与管理员删除账号，以及近期课程海报与导师链接更新。仓库和历史部署包仅用于发版准备；推送 GitHub 不等于已更新云托管服务。发版前须备份线上账号数据，并按下文核对 `AUTH_STORE_FILE_ID` 等环境变量。

当前线上环境（CloudBase 122）：

- 地址：https://cb-env-dengxuewe-122-d6a6f250b1b.xdf.cn/
- 云托管服务名：`game-animation`
- EnvId：`cb-env-dengxuewe-122-d6a6f250b1b`

---

## 本地启动

环境要求：Node.js >= 18。

```bash
npm install
```

开发启动（默认监听 `0.0.0.0:80`，本机建议指定端口）：

```bash
# Windows PowerShell
$env:PORT="8080"
$env:HOST="127.0.0.1"
$env:NODE_ENV="development"
$env:ADMIN_BOOTSTRAP_USER="admin"
$env:ADMIN_BOOTSTRAP_PASSWORD="ChangeMe@SFK2026"
npm run dev
```

```bash
# macOS / Linux
PORT=8080 HOST=127.0.0.1 NODE_ENV=development \
ADMIN_BOOTSTRAP_USER=admin ADMIN_BOOTSTRAP_PASSWORD=ChangeMe@SFK2026 \
npm run dev
```

浏览器打开：http://127.0.0.1:8080/

首次启动若本地还没有账号数据，会创建初始管理员，密码写在 `server/data/bootstrap-once.txt`（该目录已 gitignore）。本地默认可用：

- 账号：`admin`
- 密码：`ChangeMe@SFK2026`（若你按上面环境变量启动）

可选自检脚本（需先启动服务）：

```bash
# PowerShell
$env:PORT="8080"
node server/verify-auth.js
```

---

## 项目结构（常用）

| 路径 | 说明 |
|------|------|
| `index.html` 等页面 | 站点页面与静态资源 |
| `server/` | Express 鉴权服务、角色/人员 API |
| `server/data/` | 本地账号数据（不入库、不进镜像） |
| `server/asset-manifest.json` | 大文件在云存储中的 fileID 清单 |
| `assets/` | 图片与媒体；`cases-v2` 与 `*.mp4` 发版时不打进容器 |
| `Dockerfile` | 云托管容器构建 |
| `cloudbaserc.json` | CloudBase 环境与服务名 |

---

## 权限说明

- **科系基本内容**：科系导航、首页及「规划我的未来」。
- **科系主要内容**：可分别授权或一键全选；选项由 `site-navigation.js` 的主要导航自动生成，新增页面时在该配置中登记地址与路径即可同步到导航、权限勾选和页面访问控制。研究生页面尚未上线，勾选项会在页面上线后生效。
- **管理人员**：创建或停用账号、修改人员资料和密码、分配角色。仅系统管理员可在人员列表中永久删除账号；删除时须验证当前管理员密码，不能删除自己或最后一名系统管理员。
- **管理角色**：新增、编辑、删除角色及其权限。
- **系统管理员**始终拥有全部权限；已有旧版「浏览站点」权限的角色会保留原先的全站浏览范围。未授权的页面及对应数据不能通过直接输入网址访问。
- **教研导师**是内置角色，可在人员列表修改自己的姓名、邮箱和密码；改密时须同时输入当前密码与新密码，不能给自己改角色或账号状态。对于其他人员，只能管理权限严格低于自己的账号（包括创建账号与分配角色）；同级、较高或权限无法被其完整覆盖的人员均不可修改。人员列表默认将拥有管理权限的账号排在前面。删除非内置角色时，须验证当前登录管理员的密码，连续输错五次会暂时限制重试。其他角色点击导航中的姓名进入个人资料页，验证当前密码后可修改自己的登录密码。
- **普通人员**只可修改自己的姓名、邮箱和密码；导航中的姓名不会链接到管理页。
- 人员字段：姓名、校区、部门、邮箱、登录密码、角色。新建账号时校区和部门必填；旧账号这两项暂时显示为空，可在人员列表补充。密码只可重设，页面不回显明文。
- 管理人员可在人员列表按校区、部门、角色组合筛选，也可一键清除筛选；选项由当前可见人员数据自动生成，旧账号的空白校区或部门可选择“未填写”。

在权限管理页“新增人员”下方可批量导入账号。下载 CSV 模板，填写“姓名、校区、部门、邮箱、初始密码、角色”（角色名称须与当前角色列表完全一致），或使用同样列名的 .xlsx 文件。支持 UTF-8 CSV，每次最多 200 人、文件不超过 1 MB；如有缺少校区/部门、重复邮箱、无效角色或不符合当前管理权限的行，页面会列出行号，整批不会创建任何账号。初始密码仅用于创建账号，不会在人员列表回显。
- 可用邮箱登录（或账号）。

---

## 注意事项

### 1. 改页面再发版，角色 / 人员会不会清空？

**正常情况不会清空。**

线上账号数据优先落在 CloudBase 云存储对象 `ga-auth/rbac-store.json`，不跟容器镜像走。只要发版时：

- 保留同一环境 `CLOUDBASE_ENV_ID`
- 保留可用的 `CLOUDBASE_APIKEY`
- 设置 `AUTH_STORE_FILE_ID` 指向现有 `ga-auth/rbac-store.json` 的 fileID（仅知道云路径不足以读取）
- 尽量固定 `SESSION_SECRET`（已写入云端 store 时也会继续沿用）

重新部署云托管后，角色与人员仍会从云存储读回。若云端账号数据未能读取，服务会拒绝启动，不会静默创建一套新账号。只有首次创建全新环境、确认无需保留旧账号时，才临时设置 `ALLOW_NEW_CLOUD_STORE=1`。

**可能导致“像被清空”的情况：**

- 换了环境 / 新环境第一次启动，并显式设置 `ALLOW_NEW_CLOUD_STORE=1`，才会新建初始 `admin`
- 部署时没注入 `CLOUDBASE_APIKEY`，云存储读写可能失败；不要在这种状态下对外开放服务
- 手动删掉了云存储里的 `ga-auth/rbac-store.json`
- 只改了页面但忘了同步 `server/` 或 `server/asset-manifest.json`（一般不影响账号，但会影响大媒体回源）

发版前建议备份：导出云存储 `ga-auth/rbac-store.json`，或备份整个项目目录到 `backups/`。

### 2. 部署形态

- 只允许云函数或 **CloudRun（云托管）**，禁止静态托管。
- 对外只使用自定义域名：`https://cb-env-dengxuewe-122-d6a6f250b1b.xdf.cn`
- 不要对外交付腾讯云默认域名（`*.tcloudbaseapp.com` / `*.tcb.qcloud.la` / `*.run.tcloudbase.com`）
- 云托管规格保持 CPU:内存 = 1:2（当前 1C / 2G）

### 3. 大媒体与发版体积

`assets/cases-v2` 与 `*.mp4` 体积大，已上传到云存储，由服务端登录后 302 到临时链接。发版目录不要把整包 700MB+ 媒体打进镜像，否则云端构建容易失败。

重新上传大媒体后，确认 `server/asset-manifest.json` 一并带上：

```bash
# 需配置 CLOUDBASE_ENV_ID + CLOUDBASE_APIKEY
node server/scripts/upload-large-assets.js
```

### 4. 密钥与数据

- 不要把 API Key、管理员密码、`server/data/` 提交到 Git。
- `SESSION_SECRET`、`ADMIN_BOOTSTRAP_*`、`CLOUDBASE_APIKEY` 通过云托管环境变量注入。
- `ADMIN_BOOTSTRAP_*` 只在**该环境第一次没有账号数据**时生效；已有 store 后改这两个变量不会覆盖现有管理员密码。
- 登录后请尽快修改管理员密码。

### 5. 本地与线上差异

- 本地无 `CLOUDBASE_*` 时，账号写在 `server/data/store.json`。
- 线上有 CloudBase 凭证时，账号同步到云存储；容器重启 / 发版不以本地盘为准。

---

## 云端发版（概要）

1. 发版前全量备份代码与 `ga-auth/rbac-store.json`。
2. 准备清洁构建目录（排除 `node_modules`、`.agents`、`backups`、大体积 `cases-v2` / `mp4` 等）。
3. 用 CloudBase MCP `manageCloudRun` 部署服务 `game-animation`（Container + Dockerfile）。
4. 确认环境变量含：`CLOUDBASE_ENV_ID`、`CLOUDBASE_APIKEY`、`AUTH_STORE_FILE_ID`、`SESSION_SECRET`（以及首次需要的 bootstrap）。
5. 自定义域名已绑定时，只维护路由 `/` → 云托管 `game-animation`，不要重复绑证。
6. 发版后验证：`/healthz`、登录、权限页、案例页媒体。

---

## 历史阶段记录（静态站快照）

以下为 2026-09-14 纯静态阶段整理记录，供对照：

- Git 提交：`15f94388ba879de490c184eca8f32b473955a7c8`，补丁 `e1460b34e89577e6494fc44e17f316ceaef7a613`
- 大体积图片转 WebP；案例视频保持原画质
- 清理未使用素材；增加部署忽略规则
- 已完成主页 / 课程 / 案例 / 本科 / 全日制 / 专业 / 学业规划的资源与响应式检查

当前仓库已演进为「静态站点 + Express 登录鉴权 + CloudRun 部署」，请以上文启动与注意事项为准。
