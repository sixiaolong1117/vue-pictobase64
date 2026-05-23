import { app, shell, Tray, Menu, BrowserWindow, ipcMain, dialog, clipboard } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

// 模拟 __dirname 和 __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Store 对象
const store = new Store();
// 开发环境标识
const NODE_ENV = process.env.NODE_ENV;
const isMacOS = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
// 实例检查
const gotTheLock = app.requestSingleInstanceLock();

// Store key 白名单
const VALID_STORE_KEYS = ['minimizeToTray', 'autoCopy', 'useMarkdown'];
function isValidStoreKey(key) {
  return VALID_STORE_KEYS.includes(key);
}

const IMAGE_MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function getImageMimeType(filePath) {
  return IMAGE_MIME_MAP[path.extname(filePath).toLowerCase()] || null;
}

function readImageFileAsDataUrl(filePath) {
  const normalizedFilePath = normalizeClipboardPath(filePath);
  if (!normalizedFilePath) {
    return { error: '无效的文件路径' };
  }

  if (!fs.existsSync(normalizedFilePath)) {
    return { error: '文件不存在' };
  }

  const stat = fs.statSync(normalizedFilePath);
  if (!stat.isFile()) {
    return { error: '路径不是文件' };
  }

  const mimeType = getImageMimeType(normalizedFilePath);
  if (!mimeType) {
    return { error: '剪贴板中的文件不是支持的图片格式' };
  }

  const buffer = fs.readFileSync(normalizedFilePath);
  const base64 = buffer.toString('base64');

  return {
    dataUrl: `data:${mimeType};base64,${base64}`,
    fileName: path.basename(normalizedFilePath),
    filePath: normalizedFilePath,
    mimeType,
    size: stat.size,
  };
}

function normalizeClipboardPath(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  let filePath = value.trim();
  if (!filePath || filePath === 'copy' || filePath === 'cut' || filePath.startsWith('#')) {
    return null;
  }

  filePath = filePath.replace(/^["']|["']$/g, '');

  if (filePath.toLowerCase().startsWith('file://')) {
    try {
      filePath = fileURLToPath(filePath);
    } catch (error) {
      return null;
    }
  }

  return filePath;
}

function extractClipboardPathsFromText(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  return text
    .split(/\r?\n|\0/)
    .map(normalizeClipboardPath)
    .filter(Boolean);
}

function extractClipboardPathsFromBuffer(format) {
  try {
    const buffer = clipboard.readBuffer(format);
    if (!buffer || buffer.length === 0) {
      return [];
    }

    const lowerFormat = format.toLowerCase();
    const encoding = lowerFormat.includes('filenamew') ? 'utf16le' : 'utf8';
    return extractClipboardPathsFromText(buffer.toString(encoding));
  } catch (error) {
    console.warn(`Unable to read clipboard format "${format}": ${error.message}`);
    return [];
  }
}

function getClipboardFilePaths() {
  const formats = clipboard.availableFormats();
  const paths = [];

  formats.forEach((format) => {
    const lowerFormat = format.toLowerCase();
    if (
      lowerFormat === 'filenamew'
      || lowerFormat === 'filename'
      || lowerFormat.includes('file-url')
      || lowerFormat.includes('uri-list')
      || lowerFormat.includes('gnome-copied-files')
    ) {
      paths.push(...extractClipboardPathsFromBuffer(format));
    }
  });

  paths.push(...extractClipboardPathsFromText(clipboard.readText()));

  return [...new Set(paths)];
}

function findClipboardImageFilePath() {
  return getClipboardFilePaths().find((filePath) => {
    if (!getImageMimeType(filePath)) {
      return false;
    }

    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (error) {
      return false;
    }
  });
}

function getAppIconPath(fileName = 'icon.png') {
  return NODE_ENV === 'development'
    ? path.join(__dirname, '../src/assets/icon', fileName)
    : path.join(process.resourcesPath, fileName);
}

// 全局作用域
let tray;
let mainWindow;

// 创建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    minWidth: 400,
    minHeight: 400,
    resizable: true,
    frame: false, // 窗口框架
    transparent: true, // 窗口背景透明
    icon: getAppIconPath(),
    ...(isMacOS ? {
      vibrancy: 'under-window',
      visualEffectState: 'active',
      backgroundColor: '#00000000',
    } : {}),
    webPreferences: {
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // 阻止主窗口导航到非应用地址
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    const appUrl = NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'file://';
    if (!parsedUrl.href.startsWith(appUrl)) {
      event.preventDefault();
    }
  });

  // 外部链接用系统浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // IPC 主进程事件
  ipcMain.on('closeFrame', () => {
    app.quit();
  });

  ipcMain.on('minimizeToTray', () => {
    mainWindow.hide();
  });

  ipcMain.on('minimizeFrame', () => {
    mainWindow.minimize();
  });

  ipcMain.on('pasteClipboard', () => {
    mainWindow.webContents.paste();
  });

  // 获取存储内容
  ipcMain.handle('get-store', async (event, key) => {
    if (!isValidStoreKey(key)) {
      console.warn(`Store key "${key}" is not in whitelist`);
      return null;
    }
    try {
      const value = store.get(key, false);
      return value;
    } catch (error) {
      console.error(`Error in get-store: ${error.message}`);
      return false;
    }
  });

  // 设置存储内容
  ipcMain.handle('set-store', async (event, key, value) => {
    if (!isValidStoreKey(key)) {
      console.warn(`Store key "${key}" is not in whitelist`);
      return false;
    }
    try {
      store.set(key, value);
      return true;
    } catch (error) {
      console.error(`Error in set-store: ${error.message}`);
      return false;
    }
  });

  // 删除存储内容
  ipcMain.handle('delete-store', async (event, key) => {
    if (!isValidStoreKey(key)) {
      console.warn(`Store key "${key}" is not in whitelist`);
      return false;
    }
    try {
      const success = store.delete(key);
      return !!success;
    } catch (error) {
      console.error(`Error in delete-store: ${error.message}`);
      return false;
    }
  });

  // 读取本地图片文件并返回 data URL
  ipcMain.handle('read-image-file', async (event, filePath) => {
    try {
      return readImageFileAsDataUrl(filePath);
    } catch (error) {
      console.error(`Error reading image file: ${error.message}`);
      return { error: error.message };
    }
  });

  // 读取系统剪贴板中的图片文件路径并返回 data URL
  ipcMain.handle('read-clipboard-image-file', async () => {
    try {
      const filePath = findClipboardImageFilePath();
      if (!filePath) {
        return { empty: true };
      }

      return readImageFileAsDataUrl(filePath);
    } catch (error) {
      console.error(`Error reading clipboard image file: ${error.message}`);
      return { error: error.message };
    }
  });

  // 获取应用版本
  ipcMain.handle('get-app-version', async () => {
    return {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
    };
  });

  // 加载 URL
  mainWindow.loadURL(
    NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // 打开开发工具（仅限开发环境）
  if (NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // 设置背景材质
  // 已知问题：窗口关闭再打开，背景材质应用失效。
  if (isWindows) {
    mainWindow.setBackgroundMaterial('acrylic');
  }

  mainWindow.show();
}

// 如果已经有实例在运行
if (!gotTheLock) {
  // 退出当前实例
  app.quit();
} else {
  app.on('second-instance', () => {
    // 当尝试启动第二个实例时，聚焦到已运行的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(() => {
    // 托盘图标路径
    const imgPath = getAppIconPath();

    tray = new Tray(imgPath);
    if (isMacOS && app.dock) {
      app.dock.setIcon(imgPath);
    }

    createWindow();

    // 隐藏菜单栏
    Menu.setApplicationMenu(null);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示主页面',
        click: () => {
          mainWindow.show();
        },
      },
      {
        label: '隐藏主页面',
        click: () => {
          mainWindow.hide();
        },
      },
      { type: 'separator' },
      {
        label: '打开图片',
        click: () => {
          dialog
            .showOpenDialog({
              properties: ['openFile'],
              filters: [
                {
                  name: '图片文件',
                  extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico'],
                },
              ],
            })
            .then((data) => {
              if (data.canceled || !data.filePaths || data.filePaths.length === 0) {
                return;
              }
              const filePath = data.filePaths[0];
              mainWindow.webContents.send('openPicture', filePath);
            });
        },
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          mainWindow.close();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);

    tray.setToolTip('Pic To Base64');
    tray.setTitle('Pic To Base64');

    // 双击托盘图标打开应用
    tray.on('click', () => {
      if (isWindows) {
        mainWindow.setBackgroundMaterial('acrylic');
      }
      mainWindow.show();
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // 关闭所有窗口时退出应用（除 macOS）
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
