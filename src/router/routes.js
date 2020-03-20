
const routes = [
  {
    path: '/',
    component: () => import('layouts/TopoLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/topo/Editor.vue')
      }
    ]
  },
  {
    path: '/fullscreen', name: 'TopoFullscreen',component: () => import('pages/topo/Fullscreen.vue')
  },
  {
    path: '/playlive', name: 'PlayLive',component: () => import('pages/topo/NowLive.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
