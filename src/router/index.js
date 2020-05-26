import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/login'},
    {path:'/login',name:'登录',component:()=>import('../views/user/Login')},
    {path:'/register',name:'注册',component:()=>import('../views/user/Register')},
]

const router = new VueRouter({
  routes
})

export default router
