# Pic to Base64

<div align="center">

<img src="src/assets/icon/icon.png" alt="Pic to Base64" width="128">

**A Vue 3 + Electron image-to-Base64 converter<br/>Supports local images, clipboard images/image files, drag-and-drop import, Base64 decoding, and Markdown copy**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3-42B883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vite.dev/)
[![Electron](https://img.shields.io/badge/Electron-34-47848F)](https://www.electronjs.org/)

**English** | [简体中文](README.md)

</div>

---

## Introduction

Pic to Base64 is a lightweight desktop image encoding tool. It can quickly convert local images, clipboard images, image files copied to the clipboard, or images dragged into the window into Base64 Data URLs. It also provides image preview, copy, Markdown-wrapped copy, and reverse Base64 decoding.

It is useful for frontend development, Markdown documentation, email templates, rich text editing, API debugging, and temporary image embedding workflows where you need ready-to-use Base64 image content.

## Interface Preview

![Pic to Base64 interface preview](README/01.png)

## Features

- **Local image import**: Select a local image file with the button and convert it to Base64.
- **Drag-and-drop import**: Drag image files into the app window to read and convert them automatically.
- **Clipboard image reading**: Read screenshots, image editor output, or images copied from a browser from the system clipboard and generate Base64.
- **Clipboard image file reading**: After copying an image file in File Explorer, click **From Clipboard** or press `Ctrl+V` to convert it.
- **Markdown copy**: Enable `![](base64)` format copying in settings.
- **Auto copy**: Automatically copy the result after conversion to reduce repetitive actions.
- **Base64 decoding**: Extract valid `data:image/...;base64,...` content from text and restore the preview.

## Quick Start

### System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 11 (Big Sur) or later
- **Linux**: Mainstream distributions (Ubuntu 20.04+, Debian 11+, Fedora 36+, etc.)

### Installation

#### Get It from Microsoft Store

[<img src="https://get.microsoft.com/images/en-us%20light.svg" width="220" alt="Get it from Microsoft Store">](https://apps.microsoft.com/detail/9NBF4FCR4T0G)

#### Get It from Releases

You can download packaged installers from [Releases](https://github.com/SIXiaolong1117/vue-pictobase64/releases).

#### Run from Source

1. Clone the repository:

```powershell
git clone https://github.com/SIXiaolong1117/vue-pictobase64.git
cd vue-pictobase64
```

2. Install dependencies:

```powershell
yarn
```

3. Start the development environment:

```powershell
yarn electron:serve
```

### Build

```powershell
yarn electron:build
```

## Privacy

Pic to Base64 does not actively collect, upload, or share user images or personal information. Image conversion is completed locally. For more details, see [PRIVACY](PRIVACY).

## Contributing

Issues and pull requests are welcome.

## License

This project is open source under the [MIT License](LICENSE).

## Acknowledgements

- [Vue](https://vuejs.org/) - The progressive JavaScript framework
- [Vite](https://vite.dev/) - Fast frontend build tooling
- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [Font Awesome](https://fontawesome.com/) - Icon resources
- [electron-builder](https://www.electron.build/) - Electron app packaging tool
