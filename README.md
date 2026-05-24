# Pic to Base64

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

- **本地图片导入**：通过按钮选择本地图片文件并转换为 Base64。
- **拖拽导入**：将图片文件拖入应用界面即可自动读取并转换。
- **剪贴板图片读取**：从系统剪贴板读取截图、图片编辑器或浏览器复制的图片内容并生成 Base64。
- **剪贴板图片文件读取**：在资源管理器中复制图片文件后，可点击 **从剪贴板** 或直接 `Ctrl+V` 转换。
- **Markdown 复制**：可在设置中开启 `![](base64)` 格式复制。
- **自动复制**：转换完成后可自动复制结果，减少重复操作。
- **Base64 解码**：从文本中提取有效的 `data:image/...;base64,...` 内容并还原预览。

## 🚀 快速开始

### 系统要求

- **Windows**：Windows 10 或更高版本
- **macOS**：macOS 11 (Big Sur) 或更高版本
- **Linux**：主流发行版（Ubuntu 20.04+、Debian 11+、Fedora 36+ 等）

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

## 🔒 隐私

Pic to Base64 不会主动收集、上传或分享用户图片与个人信息。图片转换在本地完成，更多说明请查看 [PRIVACY](PRIVACY)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Vue](https://vuejs.org/) — 渐进式 JavaScript 框架
- [Vite](https://vite.dev/) — 快速前端构建工具
- [Electron](https://www.electronjs.org/) — 跨平台桌面应用框架
- [Element Plus](https://element-plus.org/) — Vue 3 组件库
- [Font Awesome](https://fontawesome.com/) — 图标资源
- [electron-builder](https://www.electron.build/) — Electron 应用打包工具
