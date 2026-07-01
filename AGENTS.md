# AGENTS.md

## 项目概述

Vue 3 + Electron 桌面应用：图片 Base64 转换工具。无测试、无 lint、无类型检查——改动后只能通过 `yarn electron:serve` 手动验证。

## 常用命令

| 命令 | 作用 |
|------|------|
| `yarn` | 安装依赖（使用 yarn，非 npm） |
| `yarn dev` | 仅启动 Vite 开发服务器（localhost:3000） |
| `yarn electron:serve` | 同时启动 Vite + Electron 开发环境（**主要开发入口**） |
| `yarn electron:build` | 构建打包产物到 `dist_electron/` |
| `yarn electron:build:msix` | 构建 MSIX 包（Windows Store 用） |

## 架构要点

- **渲染进程**：`src/` 目录，Vue 3 + Vite + Element Plus，入口 `src/main.js`
- **主进程**：`electron/main.js`（ESM 格式），处理窗口、托盘、剪贴板、文件读取
- **预加载脚本**：`electron/preload.cjs`（必须是 CJS，preload 不支持 ESM），通过 `window.electronAPI` 暴露安全接口
- **IPC 通信**：预加载脚本 `ALLOWED_SEND_CHANNELS` 白名单与 `main.js` 的 `ipcMain.on` 处理器需一一对应。当前 `ALLOWED_SEND_CHANNELS` 包含大量未在 `main.js` 中处理的通道（如 `window-minimize` 等），新增通道时必须两边同步注册
- **存储**：使用 `electron-store`，key 有白名单（`VALID_STORE_KEYS`）。注意：`preload.cjs` 的 `ALLOWED_STORE_KEYS` 额外包含 `alwaysOnTop`，但 `main.js` 的 `VALID_STORE_KEYS` 未包含——`set-store` 调用会失败，新增 key 时两台文件白名单必须一致
- **窗口**：无边框透明窗口（`frame: false, transparent: true`），自定义标题栏 `TitleBar.vue`
- **平台适配**：Windows 用 acrylic 背景材质，macOS 用 vibrancy 效果

## Electron 开发注意事项

- Vite 开发服务器在 3000 端口，Electron 通过 `wait-on tcp:3000` 等待就绪后启动
- 开发环境自动打开 DevTools，生产环境不打开
- 修改 `electron/main.js` 或 `preload.cjs` 后需重启 `yarn electron:serve`
- 渲染进程代码修改会热更新，无需重启
- `preload.cjs` 必须用 `.cjs` 扩展名（CJS 格式）

## 打包与发布

- 构建产物输出到 `dist_electron/`
- CI 通过 GitHub Actions 自动构建（Linux/macOS/Windows，x64/arm64）
- 打 tag 时自动触发发布流程
- MSIX 构建单独进行（仅 Windows x64）
- `extraResources` 会将 `src/assets/icon` 下的图标打包到应用资源中（排除各平台图标）

## 目录结构

```
src/
├── main.js           # Vue 应用入口，注册 Element Plus 和 FontAwesome
├── App.vue           # 根组件（仅 TitleBar + Main）
├── components/
│   ├── TitleBar.vue  # 自定义标题栏
│   └── Main.vue      # 核心业务逻辑
├── assets/icon/      # 应用图标
└── style.css         # 全局样式（在 Element Plus 之后加载以覆盖）
electron/
├── main.js           # Electron 主进程
└── preload.cjs       # 预加载脚本（CJS 格式）
```

## 风格约定

- 无 ESLint/Prettier 配置，保持现有代码风格
- 中文注释、中文 UI 文本
- Vue 组件使用 `<script setup>` 语法
- 无测试框架，不做自动化测试
