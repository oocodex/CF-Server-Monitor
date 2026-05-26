# CF-Server-Monitor-Pro

一个基于 Cloudflare Workers + D1 的多服务器监控探针系统，支持实时监控、历史数据查看、延迟追踪、地图展示等功能。

## ✨ 功能特点

- 📊 **实时监控**：CPU、内存、磁盘、网络、进程数、连接数
- 📈 **历史图表**：支持 1/3/6/12/24 小时历史数据查看
- 🌍 **全球地图**：可视化展示服务器分布
- 🔔 **离线告警**：支持 Telegram 和企业微信通知
- 🎨 **多主题**：6 种预设主题 + 自定义 CSS
- 📱 **响应式**：支持桌面端和移动端
- 🔄 **自动部署**：GitHub Actions 一键部署
- 🗺️ **延迟追踪**：国内电信/联通/移动/字节延迟监测

## 📁 项目结构

```
server-monitor/
├── public/
│   └── install.sh              # 一键安装脚本（含卸载）
├── src/
│   ├── index.js                # 主入口 - 路由分发
│   ├── database/
│   │   └── schema.js           # 数据库初始化、历史数据存储
│   ├── middleware/
│   │   └── auth.js             # 认证中间件
│   ├── handlers/
│   │   ├── admin.js            # 后台管理 API
│   │   ├── admin-ui.js         # 后台管理界面
│   │   ├── update.js           # 数据上报处理
│   │   ├── dashboard.js        # 前台大盘首页
│   │   └── server-detail.js    # 服务器详情页（24h历史）
│   ├── services/
│   │   └── notification.js     # 通知服务
│   ├── utils/
│   │   ├── format.js           # 格式化工具
│   │   └── settings.js         # 设置管理
│   └── themes/
│       └── styles.js           # 主题样式
├── package.json
├── wrangler.toml
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions 自动部署
```

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare 账户](https://dash.cloudflare.com/)
- [GitHub 账户](https://github.com/)

### 第一步：Fork 项目

点击右上角 **Fork** 按钮，将项目 Fork 到你的 GitHub 账户。

### 第二步：创建 D1 数据库

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **D1 SQL Database**
3. 点击 **Create database**
4. 数据库名称填写：`server-monitor-db`
5. 点击 **Create**
6. 记录下生成的 **Database ID**，稍后会用到

### 第三步：获取 Cloudflare 配置

#### 获取 Account ID

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧面板找到 **Account ID**
3. 复制保存

#### 获取 API Token

1. 打开 [API Tokens 页面](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 在 **Account Resources** 选择你的账户
5. 点击 **Continue to summary** → **Create Token**
6. 复制生成的 Token（只显示一次！）

### 第四步：配置 GitHub Secrets

1. 打开你 Fork 的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，依次添加以下 4 个密钥：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CF_API_TOKEN` | 第三步获取的 Token | Cloudflare API 令牌 |
| `CF_ACCOUNT_ID` | 第三步获取的 ID | Cloudflare 账户 ID |
| `API_USER_NAME` | 自定义用户名（如 `admin`） | 管理后台用户名 |
| `API_SECRET` | 自定义密码（如 `MyMonitor2024!`） | 探针认证密钥 & 管理后台密码 |
| `D1_DATABASE_ID` | 第二步获取的 Database ID | D1 数据库 ID |

### 第五步：部署

推送代码到 `main` 分支即可自动部署：

```bash
# 克隆你 Fork 的仓库
git clone https://github.com/你的用户名/CF-Server-Monitor-Pro.git
cd CF-Server-Monitor-Pro

# 可选：修改配置后提交
git add .
git commit -m "Initial setup"
git push origin main
```

推送后，GitHub Actions 会自动部署。在仓库的 **Actions** 标签页可查看部署进度。

### 第六步：访问管理后台

部署成功后，访问管理后台：

```
https://你的项目名.你的子域.workers.dev/admin
```

- 用户名：`admin`
- 密码：你设置的 `API_SECRET`

> **提示**：项目名和子域可以在 Cloudflare Workers & Pages 页面找到。

## 🖥️ 添加服务器监控

### 在管理后台添加服务器

1. 进入管理后台 `/admin`
2. 在"服务器名称"输入框填写名称
3. 点击 **+ 添加服务器**
4. 点击新服务器旁的 **📋** 按钮复制安装命令

### 在目标服务器上安装探针

```bash
# 粘贴从管理后台复制的命令，类似：
curl -sL https://你的项目.你的子域.workers.dev/install.sh | bash -s install <SERVER_ID> <SECRET> <WORKER_URL>
```

支持的系统：Ubuntu / Debian / CentOS / RHEL / Fedora / Rocky / AlmaLinux

### 卸载探针

```bash
curl -sL https://你的项目.你的子域.workers.dev/install.sh | bash -s uninstall
```

## 📊 使用说明

### 前台大盘

访问 `https://你的项目.你的子域.workers.dev/` 查看：

- **卡片视图**：服务器状态概览
- **表格视图**：详细数据列表
- **地图视图**：全球服务器分布
- **过滤器**：按国家筛选服务器

### 服务器详情

点击任意服务器卡片进入详情页：

- 实时 CPU/内存/磁盘/网络
- 1/3/6/12/24 小时历史趋势图
- 鼠标悬停查看具体时间点的数值
- 国内四大运营商延迟追踪

### 主题切换

管理后台支持 6 种主题：
1. 默认清爽白
2. 暗黑极客
3. 新粗野主义
4. 毛玻璃渐变
5. 赛博朋克
6. 完全自定义 CSS

## 🔔 离线告警配置

在管理后台 → 全局设置中配置：

**Telegram 告警：**
1. 创建 Telegram Bot（通过 [@BotFather](https://t.me/BotFather)）
2. 获取 Bot Token
3. 获取 Chat ID（通过 [@userinfobot](https://t.me/userinfobot)）
4. 填入后台设置并开启

**企业微信告警：**
1. 创建群机器人，获取 Webhook URL
2. 填入 Bot Token 字段
3. Chat ID 留空

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 创建本地配置文件
echo "API_SECRET=your-dev-secret" > .dev.vars

# 创建 D1 数据库
npx wrangler d1 create server-monitor-db

# 更新 wrangler.toml 中的 database_id

# 启动本地开发服务器
npm run dev

# 部署
npm run deploy
```

## 📝 环境变量说明

| 变量 | 说明 | 必需 |
|------|------|------|
| `API_SECRET` | 探针认证密钥 + 管理后台密码 | ✅ |
| `D1_DATABASE_ID` | Cloudflare D1 数据库 ID | ✅ |
| `CF_API_TOKEN` | Cloudflare API Token（仅 GitHub Actions） | ✅ |
| `CF_ACCOUNT_ID` | Cloudflare 账户 ID（仅 GitHub Actions） | ✅ |

## ❓ 常见问题

**Q: 部署后访问 404？**
A: 确认 `wrangler.toml` 中的 `database_id` 已正确配置，且 D1 数据库已创建。

**Q: 探针安装后不显示数据？**
A: 检查服务器是否能访问 Worker URL，查看探针日志：`journalctl -u cf-probe -f`

**Q: 如何更换 API_SECRET？**
A: 更新 GitHub Secrets 中的 `API_SECRET`，重新部署，并在所有服务器上重新安装探针。

**Q: D1 数据库免费额度够用吗？**
A: Cloudflare D1 免费版提供 5GB 存储和 50 亿次读取/月，足以支持大量服务器监控。

## 📄 许可证

MIT License

## 🙏 致谢
- [CF-Server-Monitor-Pro](https://github.com/a63414262/CF-Server-Monitor-Pro)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Chart.js](https://www.chartjs.org/)
- [Leaflet](https://leafletjs.com/)