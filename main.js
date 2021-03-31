import Vue from 'vue'
import App from './App'
// 国际化
import VueI18n from 'vue-i18n'
import messages from './locales'
import validCode from './components/validCode.vue'  

Vue.component('validcode',validCode)  
Vue.config.productionTip = false
Vue.use(VueI18n)

App.mpType = 'app'
if( uni.getStorageSync("language") != "en" &&  uni.getStorageSync("language") != "zh_CN"){
	uni.setStorageSync("language","en")
}

const i18n = new VueI18n({
  locale:  uni.getStorageSync("language") || 'en', // set locale
  fallbackLocale: 'en',
  messages
})

Vue.prototype._i18n = i18n    
Vue.prototype.$i18nMsg = function(){  
    return i18n.messages[i18n.locale]  
}  

const app = new Vue({
	 i18n, 
    ...App
})
app.$mount()
