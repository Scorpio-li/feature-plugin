import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// 自动生成页面--自动添加路由
import addRoute from './addRoute'

Vue.use(VueRouter)

let routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    }
]

let lastRoute = routes.concat(addRoute)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    lastRoute
})

export default router