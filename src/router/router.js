import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', redirect: '/index' },
    { path: '/index', component: () => import('@/views/index/index.vue') },
    { path: '/about', component: () => import('@/views/game/game.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/404/404.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
