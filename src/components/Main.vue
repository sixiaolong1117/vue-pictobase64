<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const base64code = ref('')
const copiedRef = ref(false)
const previewSrc = ref('')
const fileInputRef = ref(null)
const clipboardPasteTargetRef = ref(null)
let clipboardPasteTimer = null
let clipboardPasteRequested = false

// 文件大小上限：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024
const IMAGE_FILE_EXTENSION_PATTERN = /\.(png|jpe?g|gif|webp|bmp|svg|ico)$/i

// 监听主进程发送的事件（通过 preload API）
window.electronAPI.on('openPicture', async (filePath) => {
  await loadImageFilePath(filePath)
})

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
  clearClipboardPasteTimer()
})

// 有关 Store 的通信（通过 preload 白名单 API）
async function getStoreValue(key) {
  return await window.electronAPI.invoke('get-store', key)
}

async function applyImageDataUrl(dataUrl) {
  previewSrc.value = dataUrl
  base64code.value = dataUrl

  const autoCopy = await getStoreValue('autoCopy')
  if (autoCopy === true) {
    copyCode()
  }
}

function showImageFileSizeWarning(size) {
  const sizeMB = (size / (1024 * 1024)).toFixed(1)
  ElMessage.warning(`文件大小 ${sizeMB}MB 超过 10MB 上限，请选择更小的图片`)
}

function clearClipboardPasteTimer() {
  if (clipboardPasteTimer) {
    clearTimeout(clipboardPasteTimer)
    clipboardPasteTimer = null
  }
}

function markClipboardPasteHandled() {
  clearClipboardPasteTimer()
  clipboardPasteRequested = false
  clipboardPasteTargetRef.value?.blur()
}

function requestNativeClipboardPaste(fallbackMessage = '剪贴板中没有图片内容或图片文件') {
  clearClipboardPasteTimer()
  clipboardPasteRequested = true
  clipboardPasteTargetRef.value?.focus()
  window.electronAPI.send('pasteClipboard')

  clipboardPasteTimer = setTimeout(() => {
    clipboardPasteTimer = null
    clipboardPasteRequested = false
    clipboardPasteTargetRef.value?.blur()
    ElMessage.warning(fallbackMessage)
  }, 800)
}

async function loadImageFilePath(filePath, errorPrefix = '读取图片失败') {
  const result = await window.electronAPI.invoke('read-image-file', filePath)
  if (result.error) {
    ElMessage.error(`${errorPrefix}：${result.error}`)
    return false
  }

  if (result.size > MAX_FILE_SIZE) {
    showImageFileSizeWarning(result.size)
    return true
  }

  await applyImageDataUrl(result.dataUrl)
  return true
}

function isSupportedImageFile(file) {
  if (!file) {
    return false
  }

  const fileName = file.name || file.path || ''
  return file.type?.startsWith('image/') || IMAGE_FILE_EXTENSION_PATTERN.test(fileName)
}

function getImageFileFromFileList(fileList) {
  return Array
    .from(fileList || [])
    .find(file => isSupportedImageFile(file))
}

function getImageFileFromDataTransferItems(items) {
  return Array
    .from(items || [])
    .filter(item => item.kind === 'file')
    .map(item => item.getAsFile())
    .find(file => isSupportedImageFile(file))
}

function getImagePathFromClipboardText(text) {
  if (!text) {
    return ''
  }

  return text
    .split(/\r?\n/)
    .map(item => item.trim().replace(/^["']|["']$/g, ''))
    .find((item) => {
      if (!item || !IMAGE_FILE_EXTENSION_PATTERN.test(item)) {
        return false
      }

      return item.toLowerCase().startsWith('file://')
        || /^[a-zA-Z]:[\\/]/.test(item)
        || item.startsWith('\\\\')
        || item.startsWith('/')
    }) || ''
}

async function readClipboardImageFile(showError = true) {
  const result = await window.electronAPI.invoke('read-clipboard-image-file')
  if (!result || result.empty) {
    return false
  }

  if (result.error) {
    if (showError) {
      ElMessage.error('读取剪贴板图片失败：' + result.error)
    }
    return true
  }

  if (result.size > MAX_FILE_SIZE) {
    showImageFileSizeWarning(result.size)
    return true
  }

  await applyImageDataUrl(result.dataUrl)
  return true
}

async function handlePaste(event) {
  const isRequestedClipboardPaste = clipboardPasteRequested
  const file = getImageFileFromFileList(event.clipboardData?.files)
    || getImageFileFromDataTransferItems(event.clipboardData?.items)
  if (file) {
    event.preventDefault()
    markClipboardPasteHandled()
    processImageFile(file)
    return
  }

  const filePath = getImagePathFromClipboardText(event.clipboardData?.getData('text/plain'))
  if (filePath) {
    event.preventDefault()
    markClipboardPasteHandled()
    await loadImageFilePath(filePath)
    return
  }

  if (isRequestedClipboardPaste) {
    event.preventDefault()
  }

  const fileHandled = await readClipboardImageFile(false)
  if (fileHandled) {
    markClipboardPasteHandled()
  }
}

// el-button 打开图片按钮
function openFile() {
  fileInputRef.value?.click()
}

// 捕获文件
function triggerFile(event) {
  const file = event.target.files[0]
  if (file) {
    processImageFile(file)
  }
}

// 处理图片文件（统一入口）
function processImageFile(file) {
  // 类型判断
  if (!isSupportedImageFile(file)) {
    ElMessage.warning('请确保文件为图像类型')
    return
  }

  // 大小检查
  if (file.size > MAX_FILE_SIZE) {
    showImageFileSizeWarning(file.size)
    return
  }

  // 创建 FileReader 对象
  const reader = new FileReader()

  reader.addEventListener('load', async function () {
    await applyImageDataUrl(this.result)
  }, false)

  reader.addEventListener('error', async function () {
    if (file.path) {
      await loadImageFilePath(file.path)
      return
    }

    ElMessage.error('读取图片失败，请重试')
  }, false)

  // 以 Base64 编码渲染图像
  reader.readAsDataURL(file)
}

// 从剪贴板读取并解析图像为 Base64
async function readClipboard() {
  let clipboardReadError = null

  try {
    const items = await navigator.clipboard.read()
    for (const item of items) {
      // 找到第一个图片类型的 MIME
      const imageType = item.types.find(type => type.startsWith('image/'))
      if (imageType) {
        const blob = await item.getType(imageType)
        const file = new File([blob], 'clipboard-image', { type: imageType })
        processImageFile(file)
        return
      }
    }
  } catch (error) {
    console.error('读取剪贴板失败:', error)
    clipboardReadError = error
  }

  const fileHandled = await readClipboardImageFile(false)
  if (fileHandled) {
    return
  }

  if (clipboardReadError) {
    requestNativeClipboardPaste('无法读取剪贴板内容')
  } else {
    requestNativeClipboardPaste()
  }
}

// 复制 Base64 结果
async function copyCode() {
  let content = base64code.value
  if (!content) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  const useMarkdown = await getStoreValue('useMarkdown')
  if (useMarkdown === true) {
    content = '![](' + content + ')'
  }

  try {
    await navigator.clipboard.writeText(content)
    copiedRef.value = true
    setTimeout(() => {
      copiedRef.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请重试')
  }
}

// 清空内容
function initWindow() {
  base64code.value = ''
  previewSrc.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 解码 Base64
function base64Decode() {
  const inputString = base64code.value

  // 正则表达式匹配以 data:image/ 开头的 Base64 编码
  const base64Pattern = /data:image\/[a-zA-Z]+;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/
  const match = inputString.match(base64Pattern)

  if (match) {
    const base64Decode = match[0]
    base64code.value = base64Decode
    previewSrc.value = base64Decode
  } else {
    ElMessage.warning('未找到有效的 Base64 编码')
  }
}

// 处理拖拽文件
function handleDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    processImageFile(file)
  }
}

// 阻止拖拽事件默认行为
function handleDragOver(event) {
  event.preventDefault()
}
</script>

<template>
    <div class="display-main">
        <div class="display" @dragover="handleDragOver" @drop="handleDrop">
            <el-space direction="vertical">
                <div class="head-text">
                    <h2>𝔹𝔸𝕊𝔼𝟞𝟜</h2>
                    <h3>Base64</h3>
                </div>
                <textarea id="base64_code" v-model="base64code" spellcheck="false"></textarea>
            </el-space> <el-space direction="vertical">
                <div class="head-text">
                    <h2>图片</h2>
                    <h3>Image</h3>
                </div>
                <p id="img_area"><img id="img-preview" :src="previewSrc" alt="" /></p>
            </el-space>
        </div>
        <nav class="nav-button">
            <el-button class="action-button" @click="openFile()" round>打开图片</el-button>
            <el-button class="action-button" @click="readClipboard()" round>从剪贴板</el-button>
            <el-button class="action-button" @click="base64Decode()" round>解码 Base64</el-button>
            <el-button class="action-button" @click="copyCode()" round>复制 Base64</el-button>
            <el-button class="action-button" @click="initWindow()" round>清空内容</el-button>
            <input type="file" ref="fileInputRef" @change="triggerFile($event)" style="display:none"
                accept="image/*" />
            <textarea ref="clipboardPasteTargetRef" class="clipboard-paste-target" aria-hidden="true"></textarea>
        </nav>

        <div v-if="copiedRef" class="copy-success-message">
            <span>内容已复制！</span>
        </div>
    </div>
</template>

<style scoped>
.display-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
}

.nav-button {
    margin-top: auto;
}

.clipboard-paste-target {
    position: fixed;
    width: 1px;
    height: 1px;
    left: -100px;
    bottom: -100px;
    opacity: 0;
    pointer-events: none;
}

.copy-success-message {
    position: fixed;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    opacity: 0;
    animation: slideInOut 2s ease-in-out forwards;
}

.copy-success-message span {
    display: block;
    text-align: center;
}

@keyframes slideInOut {
    0% {
        bottom: 1em;
        opacity: 0;
    }

    15% {
        bottom: 8.5em;
        opacity: 1;
    }

    20% {
        bottom: 8em;
        opacity: 1;
    }

    80% {
        bottom: 8em;
        opacity: 1;
    }

    100% {
        bottom: 1em;
        opacity: 0;
    }
}
</style>
