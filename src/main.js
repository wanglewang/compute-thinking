import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'//导入全局样式表

//使用MavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
//使用Draggable
import draggable from 'vuedraggable'
Vue.use(draggable)

// axios.defaults.baseURL='http://101.200.53.247:8866/compute_thinking'//配置请求的根路径
axios.defaults.baseURL='http://localhost:8866/compute_thinking'//配置请求的根路径

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
