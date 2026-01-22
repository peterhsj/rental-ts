/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import DateFnsAdapter from '@date-io/date-fns'
import { zhTW } from 'date-fns/locale'
// Composables
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import { VDateInput } from 'vuetify/labs/VDateInput'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'

import 'unfonts.css'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  date: {
    adapter: new DateFnsAdapter({ locale: zhTW }),
    // dateFormat: 'yyyy-MM-dd',
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      fa,
    },
  },
  theme: {
    defaultTheme: 'light',
  },
})
