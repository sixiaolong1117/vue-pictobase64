# 图片转 Base64（Pic to Base64）

<div align="center">

<img src="src/assets/icon/icon.png" alt="Pic to Base64" width="128">

**基于 Vue 3 + Electron 的图片 Base64 转换工具<br/>支持本地图片、剪贴板图片/图片文件、拖拽导入、Base64 解码与 Markdown 复制**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3-42B883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vite.dev/)
[![Electron](https://img.shields.io/badge/Electron-34-47848F)](https://www.electronjs.org/)

[English](README_EN.md) | **简体中文**

</div>

---

## 📖 简介

图片转 Base64（Pic to Base64）是一款面向桌面的轻量级图片编码工具。它可以将本地图片、剪贴板图片、复制到剪贴板的图片文件或拖入窗口的图片快速转换为 Base64 Data URL，并提供预览、复制、Markdown 包裹复制与 Base64 反向解码能力。

适合在前端开发、Markdown 文档、邮件模板、富文本编辑、接口调试或临时图片嵌入场景中快速生成可直接使用的 Base64 图片内容。

## 🖼️ 界面预览

![Pic to Base64 界面预览](README/01.png)

## ✨ 功能特性

### 🖼️ 图片转 Base64

- **本地图片导入**：通过按钮选择本地图片文件并转换为 Base64。
- **拖拽导入**：将图片文件拖入应用界面即可自动读取并转换。
- **剪贴板图片读取**：从系统剪贴板读取截图、图片编辑器或浏览器复制的图片内容并生成 Base64。
- **剪贴板图片文件读取**：在资源管理器中复制图片文件后，可点击 **从剪贴板** 或直接 `Ctrl+V` 转换。
- **图片预览**：转换后同步显示图片预览，方便确认内容是否正确。
- **常见格式支持**：支持 PNG、JPG/JPEG、GIF、WebP、BMP、SVG、ICO 等图片格式。
- **文件大小保护**：默认限制单个图片不超过 10MB，避免过大的图片拖慢界面。

### 🔁 Base64 处理

- **复制 Base64**：一键复制当前 Base64 Data URL。
- **Markdown 复制**：可在设置中开启 `![](base64)` 格式复制。
- **自动复制**：转换完成后可自动复制结果，减少重复操作。
- **Base64 解码**：从文本中提取有效的 `data:image/...;base64,...` 内容并还原预览。
- **清空内容**：一键清空当前文本和预览状态。

### 🪟 桌面体验

- **自定义标题栏**：提供关于、设置、最小化与关闭按钮。
- **托盘最小化**：可设置关闭按钮最小化到系统托盘。
- **托盘菜单**：支持显示/隐藏主界面、打开图片与退出应用。
- **单实例启动**：重复启动时会聚焦到已运行窗口。
- **亚克力背景**：在 Windows 上使用 Electron 的 Acrylic 背景材质。
- **完整图标资源**：内置 SVG 母版、PNG/ICO 应用图标与 AppX/MSIX 所需尺寸资源。

## 🚀 快速开始

### 系统要求

- Windows 10 或更高版本
- Node.js 18 或更高版本
- Yarn 1.x 或 npm

### 安装

#### 🛒 从 Microsoft Store 获取

[<img src="https://get.microsoft.com/images/zh-cn%20light.svg" width="220" alt="从 Microsoft Store 获取">](https://apps.microsoft.com/detail/9NBF4FCR4T0G)

#### 📦 从 Releases 获取

可以在 [Releases](https://github.com/SIXiaolong1117/vue-pictobase64/releases) 下载已经打包好的安装包。

#### 🛠️ 从源码运行

1. 克隆仓库：

```powershell
git clone https://github.com/SIXiaolong1117/vue-pictobase64.git
cd vue-pictobase64
```

2. 安装依赖：

```powershell
yarn
```

3. 启动开发环境：

```powershell
yarn electron:serve
```

### 📦 打包

```powershell
yarn electron:build
```

## 📖 使用指南

### 🖼️ 打开图片

1. 点击底部 **打开图片**。
2. 选择需要转换的图片文件。
3. 应用会在左侧生成 Base64，在右侧显示预览。

也可以直接将图片文件拖入应用窗口。

### 📋 从剪贴板转换

支持两类剪贴板内容：

- **图片内容**：先用截图工具、图片编辑器或浏览器复制图片，再点击 **从剪贴板**。
- **图片文件**：在资源管理器中复制图片文件，再点击 **从剪贴板** 或回到应用直接按 `Ctrl+V`。

如果剪贴板中存在图片内容或受支持的图片文件，应用会自动读取并转换为 Base64。

### 🔁 解码 Base64

1. 将包含 `data:image/...;base64,...` 的内容粘贴到左侧文本框。
2. 点击 **解码 Base64**。
3. 应用会提取有效的 Base64 图片内容并显示预览。

### ⚙️ 管理复制行为

| 设置项 | 说明 |
|------|------|
| 转换后自动复制 | 图片转换完成后自动复制 Base64 |
| 复制时使用 Markdown 语法 | 复制内容会变成 `![](base64)` |
| 点击关闭按钮最小化到托盘 | 关闭窗口时隐藏到系统托盘，而不是退出应用 |

## 🏗️ 技术架构

- **前端框架**：[Vue 3](https://vuejs.org/)
- **构建工具**：[Vite](https://vite.dev/)
- **桌面框架**：[Electron](https://www.electronjs.org/)
- **组件库**：[Element Plus](https://element-plus.org/)
- **图标库**：[Font Awesome](https://fontawesome.com/)
- **本地设置**：[electron-store](https://github.com/sindresorhus/electron-store)
- **打包工具**：[electron-builder](https://www.electron.build/)
- **商店包格式**：MSIX / AppX，面向 Microsoft Store

## 🔒 隐私

Pic to Base64 不会主动收集、上传或分享用户图片与个人信息。图片转换在本地完成，更多说明请查看 [PRIVACY](PRIVACY)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request：

- 反馈图片读取、剪贴板或 Base64 解码问题
- 改进不同图片格式和大文件处理体验
- 优化界面、设置项、托盘菜单与跨平台兼容性
- 补充 Microsoft Store 打包和发布流程

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Vue](https://vuejs.org/) — 渐进式 JavaScript 框架
- [Vite](https://vite.dev/) — 快速前端构建工具
- [Electron](https://www.electronjs.org/) — 跨平台桌面应用框架
- [Element Plus](https://element-plus.org/) — Vue 3 组件库
- [Font Awesome](https://fontawesome.com/) — 图标资源
- [electron-builder](https://www.electron.build/) — Electron 应用打包工具
