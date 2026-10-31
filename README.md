---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: d7c95678abdcd6ac53b1333964d526ae_e373672ed3fe11f1a0da525400393706
    ReservedCode1: G8vBeY6KCCKWvxlc44GhuG6qv7qw5x8WVnGDzpnc7+sycr09OMxiH3YHcrTlBYqv0o38pponkY4ZEcwJzEKAoAoSiy2K8MNqB90LjJqmgxUUHLJobO9UyLaBP48GWQro3jHkoycl/h5L2Iu3Il3x24aEt72mhQ3cJsCWg7okUE+KEit7VQaCS94F7JM=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: d7c95678abdcd6ac53b1333964d526ae_e373672ed3fe11f1a0da525400393706
    ReservedCode2: G8vBeY6KCCKWvxlc44GhuG6qv7qw5x8WVnGDzpnc7+sycr09OMxiH3YHcrTlBYqv0o38pponkY4ZEcwJzEKAoAoSiy2K8MNqB90LjJqmgxUUHLJobO9UyLaBP48GWQro3jHkoycl/h5L2Iu3Il3x24aEt72mhQ3cJsCWg7okUE+KEit7VQaCS94F7JM=
---

# 光影集 · LUMEN — 纯静态摄影作品博客

一个用于收集与展示摄影作品的个人博客网站。基于 **HTML + CSS + JavaScript** 构建，**无需后端**，双击 `index.html` 即可本地打开浏览。

## 网站结构

```
output/
├── index.html            # 首页：画廊网格 + 分类筛选
├── work.html             # 作品详情页：点击卡片进入，查看大图与拍摄信息（EXIF）
├── about.html            # 关于页：站长介绍与摄影理念
├── contact.html          # 联系页：联系方式 + 留言表单
├── css/
│   └── style.css         # 全局样式（深色简约主题，响应式适配手机）
├── js/
│   ├── data.js           # 本地作品数据（已清空，仅保留结构与注释）
│   ├── config.js         # Supabase 配置（URL / anon key 占位）
│   ├── main.js           # 交互脚本：导航、画廊渲染、详情渲染、表单提示
│   ├── upload.js         # 上传页脚本：图片上传 + 作品记录写入
│   └── manage.js         # 管理页脚本：登录与审核
├── images/
│   ├── README.txt        # 图片目录使用说明
│   └── photos/           # ★ 真实摄影作品存放目录（当前为空，.gitkeep 占位）
└── upload.html           # 上传作品页
└── manage.html           # 管理审核页
└── README.md             # 本文件
```

## 作品数据来源

本站**只展示真实上传并通过审核的作品**，不包含任何示例占位内容：

- 示例占位图（`images/placeholder/`）已删除
- 本地演示数据（`js/data.js` 的 `WORKS` 数组）已清空，页面不再引用该文件
- 画廊与详情页只从 Supabase 读取 `status = 'approved'` 的作品；`js/config.js` 未配置时，画廊显示「暂无作品」提示，不再回退显示示例图
- 真实摄影作品存放于 `images/photos/` 目录（图片本体随上传自动进入 Supabase Storage，该目录用于本地静态展示场景）

> 如确需在本地添加演示作品，可在 `js/data.js` 的 `WORKS` 数组手动追加对象（`id` 不要重复），并恢复 `js/main.js` 中 `remoteWorks.concat(WORKS)` 的回退逻辑；默认情况下无需改动这两个文件。

## 如何部署上线

### 方式一：GitHub Pages（免费，推荐）
1. 在 GitHub 新建仓库，把本项目所有文件推送到 `main` 分支；
2. 进入仓库 **Settings → Pages**，在 "Build and deployment" 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`；
3. 保存后等待 1-2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。

### 方式二：Netlify / Vercel（免费，支持拖拽上传）
- **Netlify**：登录 netlify.com → **Sites → Add new site → Deploy manually**，直接把整个文件夹拖入即可上线，自动分配域名。
- **Vercel**：登录 vercel.com → **Projects → Add New Project**，导入 Git 仓库或使用 CLI 上传，构建命令留空即可。

### 方式三：自有服务器 / 虚拟主机
把整个文件夹上传到服务器任意静态目录（如 Nginx 的 `html` 目录、Apache 的 `htdocs` 目录），确保入口文件命名为 `index.html` 即可。

## 本地预览

- 直接双击 `index.html` 即可浏览（推荐用 Chrome / Edge）；
- 或启动本地静态服务器（更贴近线上环境）：
  ```bash
  # Python 3
  cd output
  python -m http.server 8000
  # 然后浏览器访问 http://localhost:8000
  ```

## 进阶定制

- **配色**：修改 `css/style.css` 顶部的 `:root` 变量（`--bg`、`--accent` 等）即可全局换肤。
- **留言表单**：`contact.html` 中的表单为静态演示。可前往 [formspree.io](https://formspree.io) 免费注册，把 `form.action` 改为 Formspree 提供的地址，并在 `js/main.js` 中调整提交提示文案，即可真实接收留言。
- **联系方式**：把 `contact.html` 中的占位邮箱与社交链接替换为你的真实信息。

---

## 用户上传功能（Supabase 免费档）

本站已接入 Supabase，实现「手机用户上传图片 → 站主审核 → 审核通过后展示」的完整流程：

- 游客在「上传作品」页（`upload.html`）选择照片、填写标题/分类/拍摄信息，图片上传到 Supabase Storage（bucket: `photos`），作品记录写入数据库表 `photos`（`status` 默认 `pending`）
- 首页画廊只读取 `status = 'approved'` 的作品；`js/config.js` 未配置时画廊显示「暂无作品」，不再回退展示本地示例数据
- 站主打开 `manage.html`（首页页脚有低调「管理」入口）登录后审核：一键通过 / 删除

### 1. 创建 Supabase 项目

1. 打开 https://supabase.com → Sign up → New project（选 **Free** 免费档，无需信用卡）
2. 创建成功后进入项目控制台，左侧 **Database → SQL Editor**

### 2. 建表 SQL

在 SQL Editor 中执行：

```sql
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default '其他',
  description text,
  date text,
  location text,
  camera text,
  lens text,
  focal text,
  aperture text,
  shutter text,
  iso text,
  image_url text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.photos enable row level security;

-- 匿名用户只能插入，且 status 必须是 pending（防止绕过审核）
create policy "允许匿名上传（仅 pending）" on public.photos
  for insert to anon with check (status = 'pending');

-- 匿名用户只能浏览已通过的作品
create policy "允许匿名浏览已通过作品" on public.photos
  for select to anon using (status = 'approved');

-- 登录用户（站主）可管理全部记录
create policy "站主可管理全部记录" on public.photos
  for all to authenticated using (true) with check (true);
```

### 3. 创建 Storage bucket（photos）

1. 左侧 **Storage → New bucket**，名称填 `photos`，勾选 **Public bucket**，点击 Create
2. 在 SQL Editor 执行以下策略（匿名上传 + 登录用户管理）：

```sql
-- 允许匿名用户上传照片到 photos bucket
create policy "允许匿名上传照片" on storage.objects
  for insert to anon with check (bucket_id = 'photos');

-- 允许登录用户（站主）管理 photos bucket 中的对象
create policy "允许登录用户管理照片" on storage.objects
  for all to authenticated using (bucket_id = 'photos') with check (bucket_id = 'photos');
```

> RLS 说明：匿名（anon key）权限被严格限制——只能插入 `pending` 记录、只能读取 `approved` 记录、只能上传不能删除；审核、删除、修改必须使用站主账号（authenticated）。`service_role` 密钥请勿放在前端。

### 4. 配置 js/config.js

1. 项目 **Settings → API**，复制 **Project URL** 与 **anon public key**
2. 填入 `js/config.js` 中 `SUPABASE_URL` 与 `SUPABASE_ANON_KEY` 两个占位常量并保存
3. 重新打开网站即可生效；未配置时画廊显示「暂无作品」，上传/管理页会提示先配置

### 5. 创建站主账号

1. 项目 **Authentication → Users → Add user**，创建一个邮箱 + 密码账号（即管理登录账号）
2. 打开网站的 `manage.html`，用该账号登录即可审核作品

### 6. 上传与审核流程（游客视角）

1. 手机打开网站 → 导航栏点「上传作品」
2. 选择照片、填写标题/分类/拍摄信息 → 提交
3. 图片上传至 Storage，记录写入 `photos` 表并进入 `pending` 状态
4. 站主打开 `manage.html` 登录，在「待审核作品」中点击「通过」或「删除」
5. 「通过」后作品即时出现在首页画廊（`status = approved`）

> 免费档提示：Supabase Free 档有容量/带宽限额（默认 500MB 存储），建议上传前压缩图片（宽边 1600px 左右），并在 Storage 设置中按需配置缓存与图片压缩。
*（内容由AI生成，仅供参考）*
