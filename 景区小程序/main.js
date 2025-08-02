import App from './App'
import { setupSimpleErrorHandler } from './utils/simpleErrorHandler.js'

// 修复 __route__ 未定义问题
if (typeof __route__ === 'undefined') {
  global.__route__ = ''
}

// 设置简化的错误处理
try {
  setupSimpleErrorHandler()
} catch (error) {
  console.warn('简化错误处理器设置失败:', error)
}

// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui'   // ✅ 新增

Vue.use(uView)                 // ✅ 注册 uView

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
