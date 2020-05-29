import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import CoolLightBox from 'vue-cool-lightbox'
import VueJWT from 'vuejs-jwt'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(VueJWT)
Vue.use(CoolLightBox)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
