# AI 对话收藏夹

一个用于收藏和浏览 AI 平台对话链接的 Web 应用。

## 功能特性

- 添加、编辑、删除收藏链接
- 支持多个 AI 平台（DeepSeek、Doubao、ChatGPT、Claude、Gemini、Kimi、通义千问、文心一言等）
- 标签管理（生活、学习、旅游等）
- 左侧列表浏览，右侧预览
- 访问密码保护
- 数据存储在 Vercel KV (Upstash Redis)

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env.local

# 填入你的 Vercel KV 配置
# VITE_KV_REST_API_URL=your_url
# VITE_KV_REST_API_TOKEN=your_token

# 启动开发服务器
npm run dev
```

## 部署到 Vercel

### 1. 创建 Upstash Redis 数据库

1. 登录 [Vercel](https://vercel.com)
2. 进入项目 Storage 页面
3. 创建 Upstash Redis（免费）
4. 获取 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN`

### 2. 部署项目

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel
```

### 3. 配置环境变量

在 Vercel 项目设置中添加：
- `VITE_KV_REST_API_URL` - Upstash Redis URL
- `VITE_KV_REST_API_TOKEN` - Upstash Redis Token
- `VITE_ACCESS_PASSWORD` - 访问密码（可选，默认 123456）

### 4. 访问应用

部署完成后，Vercel 会提供一个访问地址。

## 访问密码

默认密码：`123456`

可在 Vercel 环境变量中修改 `VITE_ACCESS_PASSWORD`。

## 技术栈

- React + Vite
- Tailwind CSS
- Upstash Redis (Vercel KV)
