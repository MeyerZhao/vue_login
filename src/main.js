import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import axios from 'axios'
import './lib/hotcss/hotcss.js'

window.axios = axios

Vue.config.productionTip = false

Vue.use(VeeValidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
