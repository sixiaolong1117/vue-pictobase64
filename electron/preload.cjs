// preload.cjs — 使用 CommonJS 格式（preload 不支持 ESM）
const { contextBridge, ipcRenderer } = require('electron');

// 通道白名单
const ALLOWED_SEND_CHANNELS = [
  'window-minimize',
  'window-maximize',
  'window-close',
  'window-always-on-top',
  'window-minimize-to-tray',
  'close-settings',
  'toggle-auto-copy',
  'toggle-use-markdown',
  'open-sponsors-page',
  'open-feedback-page',
  'check-for-updates',
  'toggle-devtools',
  'open-external',
  // 旧 channel 名兼容（TitleBar.vue 使用）
  'closeFrame',
  'minimizeToTray',
  'minimizeFrame',
];

// 可查询的 Store key 白名单
const ALLOWED_STORE_KEYS = ['minimizeToTray', 'autoCopy', 'useMarkdown', 'alwaysOnTop'];

// 安全的 Store key 校验
function assertStoreKey(key) {
  if (!ALLOWED_STORE_KEYS.includes(key)) {
    throw new Error(`Store key "${key}" is not allowed`);
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  // —— 窗口控制 ——
  send: (channel, ...args) => {
    if (ALLOWED_SEND_CHANNELS.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },

  // —— invoke（主进程 handle）——
  invoke: async (channel, ...args) => {
    switch (channel) {
      case 'get-store': {
        const [key] = args;
        assertStoreKey(key);
        return ipcRenderer.invoke(channel, key);
      }
      case 'set-store': {
        const [key, value] = args;
        assertStoreKey(key);
        return ipcRenderer.invoke(channel, key, value);
      }
      case 'read-image-file':
        return ipcRenderer.invoke(channel, args[0]);
      case 'get-app-version':
        return ipcRenderer.invoke(channel);
      default:
        throw new Error(`Invoke channel "${channel}" is not allowed`);
    }
  },

  // —— 主进程→渲染进程（on）——
  on: (channel, callback) => {
    const allowed = ['openPicture', 'always-on-top-changed', 'update-available', 'update-downloaded'];
    if (allowed.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  // —— 一次性监听 ——
  once: (channel, callback) => {
    const allowed = ['openPicture', 'always-on-top-changed'];
    if (allowed.includes(channel)) {
      ipcRenderer.once(channel, (_event, ...args) => callback(...args));
    }
  },
});