<script setup>
import { ref } from 'vue';

// 通过 preload 暴露的 API 获取版本信息
const version = ref('');
const appVersion = ref('');

async function loadVersionInfo() {
  const info = await window.electronAPI.invoke('get-app-version');
  if (info) {
    version.value = info.electronVersion || '';
    appVersion.value = info.appVersion || '';
  }
}
loadVersionInfo();

// 有关 Store 的通信（通过 preload 白名单 API）
async function getStoreValue(key) {
  return await window.electronAPI.invoke('get-store', key);
}

async function setStoreValue(key, value) {
  await window.electronAPI.invoke('set-store', key, value);
}

// 设置项变量
const minimizeToTray = ref(false);
const autoCopy = ref(false);
const useMarkdown = ref(false);

// 初始化变量
async function initializeSettings() {
  minimizeToTray.value = (await getStoreValue('minimizeToTray')) ?? false;
  autoCopy.value = (await getStoreValue('autoCopy')) ?? false;
  useMarkdown.value = (await getStoreValue('useMarkdown')) ?? false;
}

// 调用初始化
initializeSettings();

// 更新存储的函数
function updateStore(key, value) {
  setStoreValue(key, value);
}

// 关闭页面
async function closeFrame() {
  const minimizeToTrayValue = await getStoreValue('minimizeToTray');
  if (minimizeToTrayValue === true) {
    window.electronAPI.send('minimizeToTray');
  } else {
    window.electronAPI.send('closeFrame');
  }
}

// 最小化窗口
function minimizeFrame() {
  window.electronAPI.send('minimizeFrame');
}

// 打开设置 dialog
const showSettingDialog = ref(false);
function openSettings() {
  showSettingDialog.value = true;
}

// 打开关于 dialog
const showAboutDialog = ref(false);
function openAbout() {
  showAboutDialog.value = true;
  fetchContent();
}

// 赞助者列表缓存
let sponsorsCache = null;

// 获取赞助者列表
const content = ref('');
const loading = ref(true);
const error = ref('');
async function fetchContent() {
  // 如果已有缓存，直接使用
  if (sponsorsCache !== null) {
    content.value = sponsorsCache;
    loading.value = false;
    return;
  }

  try {
    const response = await fetch('https://raw.githubusercontent.com/SIXiaolong1117/SIXiaolong1117/main/README/Sponsor/List');

    if (!response.ok) {
      throw new Error('文件加载失败');
    }

    const text = await response.text();
    content.value = text;
    sponsorsCache = text; // 缓存结果
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
    <!-- 标题栏 -->
    <div id="title-bar">
        <div class="title"><b>ℙ𝕚𝕔 𝕋𝕠 𝔹𝕒𝕤𝕖𝟞𝟜</b></div>
        <div class="bar">
            <el-button class="bar-button mini-button" @click="openAbout()">
                <font-awesome-icon :icon="['fas', 'circle-exclamation']" size="1x" />
            </el-button>
            <el-button class="bar-button mini-button" @click="openSettings()">
                <font-awesome-icon :icon="['fas', 'gear']" size="1x" />
            </el-button>
            <el-button class="bar-button mini-button" @click="minimizeFrame()">
                <font-awesome-icon :icon="['fas', 'minus']" size="1x" />
            </el-button>
            <el-button class="bar-button close-button" @click="closeFrame()">
                <font-awesome-icon :icon="['fas', 'xmark']" size="1x" />
            </el-button>
        </div>

        <!-- 关于页面 -->
        <el-dialog id="about-dialog" v-model="showAboutDialog" width="25em" :close-on-click-modal="true"
            :destroy-on-close="true">
            <div class="dialog-back">
                <el-scrollbar height="380px">
                    <div id="dialog-title"><b>ℙ𝕚𝕔 𝕋𝕠 𝔹𝕒𝕤𝕖𝟞𝟜</b> v{{ appVersion }}</div>
                    <div id="dialog-subtitle">Electron v{{ version }}</div>
                    <div class="dialog-header-text"><b>关于</b></div>
                    <div id="sixiaolong">© 2022 司晓龙, 使用 MIT License.</div>
                    <div id="related-links">
                        <a class="dialog-inner-text"
                            href="https://raw.githubusercontent.com/SIXiaolong1117/vue-pictobase64/refs/heads/main/PRIVACY"
                            target="_blank">隐私政策</a>
                        <a class="dialog-inner-text" href="https://github.com/SIXiaolong1117/vue-pictobase64/issues"
                            target="_blank">反馈问题</a>
                        <a class="dialog-inner-text" href="https://github.com/SIXiaolong1117/vue-pictobase64"
                            target="_blank">开源仓库</a>
                        <a href="https://raw.githubusercontent.com/SIXiaolong1117/vue-pictobase64/refs/heads/main/LICENSE"
                            target="_blank">MIT License</a>
                    </div>

                    <div id="sponsors" class="dialog-header-text"><b>赞助者</b></div>
                    <div id="sponsors-list">
                        <el-scrollbar height="100px">
                            <div v-if="loading" class="loading-text">加载中...</div>
                            <div v-else-if="error" class="error-text">{{ error }}</div>
                            <pre v-else id="sponsors-list-content">{{ content }}</pre>
                        </el-scrollbar>
                        <div id="payment">
                            <a class="dialog-inner-text"
                                href="https://raw.githubusercontent.com/SIXiaolong1117/SIXiaolong1117/refs/heads/main/README/Sponsor/AliPay.jpg"
                                target="_blank">支付宝</a>
                            <a href="https://raw.githubusercontent.com/SIXiaolong1117/SIXiaolong1117/refs/heads/main/README/Sponsor/WeChat.png"
                                target="_blank">微信</a>
                        </div>
                    </div>

                    <div class="dialog-header-text"><b>作者</b></div>
                    <div id="author">
                        <div id="author-content">
                            <a class="dialog-inner-text" href="https://sixiaolong.win" target="_blank">司晓龙 (SI
                                Xiaolong)</a>
                            <a href="https://linkcollection.sixiaolong.win/" target="_blank">𝓛𝓲𝓷𝓴
                                𝓒𝓸𝓵𝓵𝓮𝓬𝓽𝓲𝓸𝓷</a>
                        </div>
                        <div class="avatar">
                                <img src="https://avatars.githubusercontent.com/u/59590732?v=4" />
                        </div>
                    </div>

                    <div class="dialog-header-text"><b>依赖</b></div>
                    <div id="depend">
                        <a class="dialog-inner-text" href="https://github.com/vuejs/vue" target="_blank">Vue</a>
                        <a class="dialog-inner-text" href="https://github.com/vitejs/vite" target="_blank">Vite</a>
                        <a class="dialog-inner-text" href="https://github.com/electron/electron"
                            target="_blank">Electron</a>
                        <a class="dialog-inner-text" href="https://github.com/element-plus/element-plus"
                            target="_blank">Element Plus</a>
                        <a class="dialog-inner-text" href="https://github.com/FortAwesome/Font-Awesome"
                            target="_blank">Font Awesome</a>
                        <a class="dialog-inner-text" href="https://github.com/open-cli-tools/concurrently"
                            target="_blank">concurrently</a>
                        <a class="dialog-inner-text" href="https://github.com/kentcdodds/cross-env"
                            target="_blank">cross-env</a>
                        <a class="dialog-inner-text" href="https://github.com/electron-userland/electron-builder"
                            target="_blank">electron-builder</a>
                        <a class="dialog-inner-text" href="https://github.com/jeffbski/wait-on"
                            target="_blank">wait-on</a>
                    </div>
                </el-scrollbar>
            </div>
        </el-dialog>

        <!-- 设置界面 -->
        <el-dialog id="setting-dialog" v-model="showSettingDialog" width="25em" :close-on-click-modal="true"
            :destroy-on-close="true">
            <div class="dialog-back">
                <div id="dialog-title"><b>设置</b></div>
                <div class="row-div dialog-inner-text" style="margin-top: .5em;">
                    <div class="dialog-header-text">点击关闭按钮最小化到托盘：</div>
                    <el-switch class="dialog-switch" v-model="minimizeToTray"
                        @update:modelValue="(value) => updateStore('minimizeToTray', value)"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt
                        active-text="是" inactive-text="否" />
                </div>
                <div class="row-div dialog-inner-text">
                    <div class="dialog-header-text">转换后自动复制：</div>
                    <el-switch class="dialog-switch" v-model="autoCopy"
                        @update:modelValue="(value) => updateStore('autoCopy', value)"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt
                        active-text="是" inactive-text="否" />
                </div>
                <div class="row-div">
                    <div class="dialog-header-text">复制时使用Markdown语法：</div>
                    <el-switch class="dialog-switch" v-model="useMarkdown"
                        @update:modelValue="(value) => updateStore('useMarkdown', value)"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt
                        active-text="是" inactive-text="否" />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.dialog-back {
    height: 380px;
    padding: 1em;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 8px;
}

.dialog-inner-text {
    margin-bottom: .5em;
}

.avatar {
    width: 8em;
    height: 8em;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    margin-left: auto;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar:hover {
    transform: rotate(360deg) rotateY(360deg) scale(1.2) !important;
    transition: transform 1s ease-in-out !important;
}

.avatar {
    transform: rotate(0deg) rotateY(0deg) scale(1) !important;
    transition: transform .5s ease-in-out !important;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

#about-dialog {
    background-color: black !important;
}

.dialog-header-text {
    user-select: none;
    color: #ffffff;
}

#dialog-title {
    font-size: 2em;
    user-select: none;
    color: #ffffff;
}

#dialog-subtitle {
    user-select: none;
    margin-top: -.5em;
    margin-bottom: .5em;
}

#sponsors {
    font-size: 1em;
    user-select: none;
}

#sixiaolong,
#related-links,
#sponsors-list,
#author,
#depend {
    color: #ffffff;
    user-select: none;
    margin: .5em;
    padding: 1em;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 8px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

#related-links,
#author-content,
#depend {
    display: flex;
    flex-direction: column;
}

#author,
#sponsors-list,
.row-div {
    display: flex;
    flex-direction: row;
    color: #ffffff;
    align-items: center;
}

.dialog-switch {
    margin-left: auto;
}

#payment {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    width: 4em;
    color: #ffffff;
}

a {
    color: #ffffff;
}

a:hover {
    color: rgba(255, 255, 255, 0.5);
}

.loading-text,
.error-text {
    color: #ffffff;
    text-align: center;
    padding: 1em;
    font-size: 14px;
}

.error-text {
    color: #ff4949;
}

.title {
    color: #ffffff;
    margin-left: .5em;
    margin-top: 0em;
    font-size: 2em;
    user-select: none;
}

#title-bar {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
}

.bar {
    position: fixed;
    align-self: flex-end;
    margin: 0px 0px 0 0;
    z-index: 1000;
}

.bar-button {
    width: 2.5em;
    height: 2em;
    margin: 0;
    border-radius: 0px !important;
    background-color: #ffffff00;
    border-color: #ffffff00 !important;
}

.close-button,
.mini-button {
    -webkit-app-region: no-drag;
    margin: 0;
}

.close-button:hover {
    background-color: #c42b1c;
    color: white;
}

.mini-button:hover {
    background-color: hsla(0, 0%, 0%, 0.5);
    color: white;
}
</style>