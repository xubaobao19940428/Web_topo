// Configuration for your app
const path = require('path');
function rootPath(dir) {
  return path.join(__dirname, '.', dir)
}

const APP_INFO = {
  NAME: "WebTopo",
  PKG_NAME: "WebTopo"
}

module.exports = function (ctx) {
  return {
    boot: [
      // references /src/boot/<name>.js
      'i18n',
      'axios',
      'x2js',
      'EventBus',
    ],
    css: [
      'app.styl'
    ],
    extras: [
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    build: {
      // env: {
      //   APP_NAME: JSON.stringify(APP_INFO.NAME),
      //   PKG_NAME: JSON.stringify(APP_INFO.PKG_NAME)
      // },
      env: ctx.dev
        ? { // so on dev we'll have
          // API: ("'http://ci.iotn2n.com:5080/iotapi'")
          API: ("'http://132.232.121.164:5080/iotapi'")
        }
        : { // and on build (production):
          API: JSON.stringify('/iotapi')
        },
      scopeHoisting: true,
      vueRouterMode: 'hash',
      //publicPath: "/WebTopo",
      publicPath: 'spa/', //注意：这里请根据实际情况部署
      vueCompiler: true,
      gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          "@": rootPath("src")
        }
      }
    },
    devServer: {
      // https: true,
      port: 8888,
      open: true, // opens browser window automatically
      proxy: {        
        '/api': {
          target: 'http://45.40.201.220:5080/iotapi',  // 接口域名
          secure: false,  // 如果是https接口，需要配置这个参数
          changeOrigin: true,  //是否跨域
          pathRewrite: {
            '^/api': ''
          }
        },
        // '/open/api/weather': {
        //   target: 'http://www.sojson.com/',
        //   changeOrigin: true
        // }        
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QExpansionItem',
        'QSelect',
        'QInput',
        'QColor',
        'QSlider',
        'QPopupProxy',
        'QPagination'
      ],
      directives: [
        'Ripple',
        'ClosePopup'
      ],
      // Quasar plugins
      plugins: [
        'Notify'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      bundler: 'builder', // 'packager' or 'builder'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        productName: APP_INFO.PKG_NAME,
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
