import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Assets
import './assets/main.css'

// Vue-I18n
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  messages: {
    en: {
      Theme: 'Theme',
      Documentation: 'Documentation',
      ReportError: 'Report error',
      BioinformaticsDepartment: 'Bioinformatics/Medical Informatics department',
      FacultyOfTechnology: 'Faculty of Technology',
      BielefeldUniversity: 'Bielefeld University',
      UploadFile: 'Upload file',
      SelectNode: 'Select node',
      Ids: "Id's",
      Names: 'Names',
      Prefixes: 'Prefixes'
    },
    de: {
      Theme: 'Farbschema',
      Documentation: 'Dokumentation',
      ReportError: 'Fehler melden',
      BioinformaticsDepartment: 'AG Bioinformatik/Medizininformatik',
      FacultyOfTechnology: 'Technische Fakultät',
      BielefeldUniversity: 'Universität Bielefeld',
      UploadFile: 'Datei hochladen',
      SelectNode: 'Knoten auswählen',
      Ids: 'Ids',
      Names: 'Namen',
      Prefixes: 'Präfixe'
    }
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

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(vuetify)
app.mount('#app')
