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

### Image to Base64

- **Local image import**: Select a local image file with the button and convert it to Base64.
- **Drag-and-drop import**: Drag image files into the app window to read and convert them automatically.
- **Clipboard image reading**: Read screenshots, image editor output, or images copied from a browser from the system clipboard and generate Base64.
- **Clipboard image file reading**: After copying an image file in File Explorer, click **From Clipboard** or press `Ctrl+V` to convert it.
- **Image preview**: Show a synchronized image preview after conversion, making it easy to verify the result.
- **Common format support**: Supports PNG, JPG/JPEG, GIF, WebP, BMP, SVG, ICO, and other image formats.
- **File size protection**: Limits each image to 10 MB by default to prevent oversized images from slowing down the interface.

### Base64 Processing

- **Copy Base64**: Copy the current Base64 Data URL with one click.
- **Markdown copy**: Enable `![](base64)` format copying in settings.
- **Auto copy**: Automatically copy the result after conversion to reduce repetitive actions.
- **Base64 decoding**: Extract valid `data:image/...;base64,...` content from text and restore the preview.
- **Clear content**: Clear the current text and preview state with one click.

### Desktop Experience

- **Custom title bar**: Provides About, Settings, Minimize, and Close buttons.
- **Minimize to tray**: Configure the close button to minimize the app to the system tray.
- **Tray menu**: Supports showing/hiding the main window, opening an image, and exiting the app.
- **Single-instance launch**: Re-launching the app focuses the already running window.
- **Acrylic background**: Uses Electron's Acrylic background material on Windows.
- **Complete icon assets**: Includes an SVG source icon, PNG/ICO app icons, and AppX/MSIX size assets.

## Quick Start

### System Requirements

- Windows 10 or later
- Node.js 18 or later
- Yarn 1.x or npm

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

## User Guide

### Open an Image

1. Click **Open Image** at the bottom.
2. Select the image file you want to convert.
3. The app generates Base64 on the left and shows the preview on the right.

You can also drag image files directly into the app window.

### Convert from Clipboard

Two types of clipboard content are supported:

- **Image content**: Copy an image from a screenshot tool, image editor, or browser, then click **From Clipboard**.
- **Image files**: Copy an image file in File Explorer, then click **From Clipboard** or return to the app and press `Ctrl+V`.

If the clipboard contains image content or a supported image file, the app reads it automatically and converts it to Base64.

### Decode Base64

1. Paste content containing `data:image/...;base64,...` into the text box on the left.
2. Click **Decode Base64**.
3. The app extracts valid Base64 image content and displays the preview.

### Manage Copy Behavior

| Setting | Description |
|------|------|
| Auto copy after conversion | Automatically copies Base64 after image conversion |
| Use Markdown syntax when copying | Changes the copied content to `![](base64)` |
| Minimize to tray when clicking close | Hides the window to the system tray instead of exiting the app |

## Tech Stack

- **Frontend framework**: [Vue 3](https://vuejs.org/)
- **Build tool**: [Vite](https://vite.dev/)
- **Desktop framework**: [Electron](https://www.electronjs.org/)
- **Component library**: [Element Plus](https://element-plus.org/)
- **Icon library**: [Font Awesome](https://fontawesome.com/)
- **Local settings**: [electron-store](https://github.com/sindresorhus/electron-store)
- **Packaging tool**: [electron-builder](https://www.electron.build/)
- **Store package format**: MSIX / AppX for Microsoft Store

## Privacy

Pic to Base64 does not actively collect, upload, or share user images or personal information. Image conversion is completed locally. For more details, see [PRIVACY](PRIVACY).

## Contributing

Issues and pull requests are welcome:

- Report image reading, clipboard, or Base64 decoding issues
- Improve support for different image formats and large-file handling
- Optimize the interface, settings, tray menu, and cross-platform compatibility
- Add Microsoft Store packaging and release workflow documentation

## License

This project is open source under the [MIT License](LICENSE).

## Acknowledgements

- [Vue](https://vuejs.org/) - The progressive JavaScript framework
- [Vite](https://vite.dev/) - Fast frontend build tooling
- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [Font Awesome](https://fontawesome.com/) - Icon resources
- [electron-builder](https://www.electron.build/) - Electron app packaging tool
