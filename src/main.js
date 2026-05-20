import { createApp } from 'vue'
import App from './App.vue'
// 引入 element-plus 结构
import ElementPlus from 'element-plus'; 
// 引入 element-plus 样式
import 'element-plus/dist/index.css'; 
import * as Icons from '@element-plus/icons-vue'
// 自定义的css要在Element后面引入，这样才能保证样式覆盖。
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 按需导入常用图标，减少包体积
import { faCircleExclamation, faGear, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(fab, fas);
library.add(faCircleExclamation, faGear, faMinus, faXmark);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus)
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component)
  }
app.mount('#app')