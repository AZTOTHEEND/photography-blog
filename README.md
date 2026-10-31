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
│   ├── data.js           # ★ 作品数据源：标题、拍摄信息、图片路径都在这里
│   └── main.js           # 交互脚本：导航、画廊渲染、详情渲染、表单提示
├── images/
│   ├── README.txt        # 图片目录使用说明
│   ├── placeholder/      # 8 张 SVG 占位图（可直接删除）
│   └── photos/           # ★ 把你的摄影作品放这里（当前为空，.gitkeep 占位）
└── README.md             # 本文件
```

## 如何替换为自己的摄影作品

1. **放入照片**：将你的照片复制到 `images/photos/` 目录。建议宽边 **1600px**，格式 **JPEG 或 WebP**，单张不超过 1MB（网页加载更快）。
2. **修改数据**：打开 `js/data.js`，找到对应作品，把 `image` 字段改为你的照片路径，例如：
   ```js
   image: "images/photos/海边日落.jpg"
   ```
3. **更新信息**：同步修改 `title`（标题）、`titleEn`（英文标题）、`category`（分类：风光/城市/人文/静物/人像）、`date`、`location`、`description` 以及 `camera`/`lens`/`focal`/`aperture`/`shutter`/`iso` 等拍摄参数。
4. **新增作品**：在 `WORKS` 数组末尾追加一个对象，`id` 使用新的数字（不要与现有 id 重复），画廊和详情页会自动生效。
5. **清理占位图**：全部替换完成后，可删除 `images/placeholder/` 目录下的 SVG 文件。

> 分类筛选按钮在首页 `index.html` 中定义，若你使用新的分类名，需同步添加/修改按钮的 `data-filter` 值。

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
*（内容由AI生成，仅供参考）*
