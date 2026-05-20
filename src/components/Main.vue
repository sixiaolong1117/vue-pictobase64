<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const base64code = ref('')
const copiedRef = ref(false)
const previewSrc = ref('')
const fileInputRef = ref(null)

// 文件大小上限：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 监听主进程发送的事件（通过 preload API）
window.electronAPI.on('openPicture', async (filePath) => {
  const result = await window.electronAPI.invoke('read-image-file', filePath)
  if (result.error) {
    ElMessage.error('读取图片失败：' + result.error)
    return
  }
  const blob = await fetch(result.dataUrl).then(res => res.blob())
  const fileName = filePath.split(/[/\\]/).pop() || 'image'
  const file = new File([blob], fileName, { type: result.mimeType })
  processImageFile(file)
})

// 有关 Store 的通信（通过 preload 白名单 API）
async function getStoreValue(key) {
  return await window.electronAPI.invoke('get-store', key)
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
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请确保文件为图像类型')
    return
  }

  // 大小检查
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    ElMessage.warning(`文件大小 ${sizeMB}MB 超过 10MB 上限，请选择更小的图片`)
    return
  }

  // 创建 FileReader 对象
  const reader = new FileReader()

  reader.addEventListener('load', async function () {
    previewSrc.value = this.result
    base64code.value = this.result

    const autoCopy = await getStoreValue('autoCopy')
    if (autoCopy === true) {
      copyCode()
    }
  }, false)

  // 以 Base64 编码渲染图像
  reader.readAsDataURL(file)
}

// 从剪贴板读取并解析图像为 Base64
async function readClipboard() {
  try {
    const items = await navigator.clipboard.read()
    for (const item of items) {
      // 找到第一个图片类型的 MIME
      const imageType = item.types.find(type => type.startsWith('image/'))
      if (imageType) {
        const blob = await item.getType(imageType)
        const reader = new FileReader()

        reader.onloadend = async function () {
          base64code.value = reader.result
          previewSrc.value = reader.result

          const autoCopy = await getStoreValue('autoCopy')
          if (autoCopy === true) {
            copyCode()
          }
        }

        reader.readAsDataURL(blob)
        return
      }
    }
    // 没有找到图片
    ElMessage.warning('剪贴板中没有图片内容')
  } catch (error) {
    console.error('读取剪贴板失败:', error)
    ElMessage.error('无法读取剪贴板内容')
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