# AI 视频生成网站 MVP

一个基于 Next.js 的 AI 视频生成网站最小可行版本（MVP）。用户输入提示词后，前端调用后端 API 创建异步视频任务，并轮询任务状态，完成后展示视频并支持下载。

## 功能清单

- 提示词输入
- 风格选择（写实、电影感、电商广告、产品展示、短视频封面）
- 画面比例选择（16:9、9:16、1:1）
- 异步任务创建与轮询状态
- 加载状态展示
- 视频预览与下载
- API Key 仅在服务端环境变量中读取

## 技术栈

- Next.js 14（App Router）
- TypeScript
- 原生 CSS

## 本地安装

```bash
npm install
```

## 本地运行

1. 复制环境变量模板并填写：

```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`：

```env
VIDEO_API_KEY=your_real_key
VIDEO_API_ENDPOINT=https://your-video-api-endpoint
VIDEO_API_PROVIDER=generic
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 打开浏览器访问：

```text
http://localhost:3000
```

## API 说明

### `POST /api/generate-video`
- 入参：`prompt`、`style`、`aspectRatio`
- 返回：`taskId`、`status`

### `GET /api/generate-video/:taskId`
- 返回：任务状态（`queued` / `processing` / `succeeded` / `failed`）
- 任务成功时返回 `videoUrl`

## 如何接入 Runway / Replicate / Google Veo

项目已抽象 `lib/video-providers`：

- `types.ts`：统一 Provider 接口
- `generic-provider.ts`：占位 Provider（当前使用）
- `index.ts`：根据 `VIDEO_API_PROVIDER` 选择具体 Provider

接入新平台时，新增 `xxx-provider.ts` 并实现 `VideoProvider` 接口，再在 `index.ts` 中注册即可。

## 部署

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入仓库
3. 在 Project Settings → Environment Variables 配置：
   - `VIDEO_API_KEY`
   - `VIDEO_API_ENDPOINT`
   - `VIDEO_API_PROVIDER`
4. 点击 Deploy

### 部署到 Cloudflare Workers（使用 OpenNext）

1. 安装 OpenNext Cloudflare 适配器（按其文档）
2. 在 Cloudflare 项目中配置环境变量：
   - `VIDEO_API_KEY`
   - `VIDEO_API_ENDPOINT`
   - `VIDEO_API_PROVIDER`
3. 构建并发布

> 注意：请勿将 `.env.local` 提交到 Git 仓库。

## 安全说明

- API Key 仅通过服务端 `process.env` 读取
- `.gitignore` 已忽略 `.env`、`.env.local` 等敏感文件
