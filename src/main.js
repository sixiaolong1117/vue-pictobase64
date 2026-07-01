import { createApp } from 'vue'
import App from './App.vue'
// 引入 element-plus 结构
import ElementPlus from 'element-plus'; 
// 引入 element-plus 样式
import 'element-plus/dist/index.css'; 
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleExclamation, faGear, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faCircleExclamation, faGear, faMinus, faXmark);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus)
app.mount('#app')