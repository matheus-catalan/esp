import { POSITION } from "vue-toastification";
import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - dashboard',
    title: 'dashboard',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
  ],

  plugins: [
    { src: '~/plugins/chart.js', mode: 'client' },
    '~/plugins/utils.js'
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
    'nuxt-socket-io',
    [
      "vue-toastification/nuxt",
      {
        position: POSITION.TOP_CENTER,
        "z-index": "999999999999999"
      }
    ],
  ],

  axios: {
    baseURL: 'http://localhost:8000',
  },
  io: {
    sockets: [{
      name: '',
      url: 'http://localhost:8000'
    }]
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {
  }
}
