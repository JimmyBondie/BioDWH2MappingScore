import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Assets
import './assets/main.css'

// Vue-I18n
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
const i18n = createI18n({
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: {
    en: en,
    de: de
  }
})

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives
})

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// eCharts
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { BarChart, TreeChart } from 'echarts/charts'
use([SVGRenderer, TitleComponent, TooltipComponent, GridComponent, BarChart, TreeChart])

// Vue Store
import store from './store'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(store)
app.mount('#app')
