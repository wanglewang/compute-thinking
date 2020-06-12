import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/index'},
    {
      path:'/index',name:'主页',component:()=>import('../views/index'),
      children:[
        {path:'/index',name:'课程列表',component:()=>import('../views/home/Home')},
        {path:'/course/:id',name:'课程详情',component:()=>import('../views/course/CourseDetails')},

        {path:'/cube',name:'爱的立方体',component:()=>import('../components/three/CubeStar')},
        {path:'/surface',name:'爱的反应面',component:()=>import('../components/three/SurfaceStar')},
        {path:'/heart',name:'爱的心心转',component:()=>import('../components/three/HeartStar')},
        {path:'/liberate',name:'爱的卍解',component:()=>import('../components/three/KnowledgeStar')},
        {path:'/click',name:'点击',component:()=>import('../components/three/Click')},
        {path:'/drag',name:'拖拽',component:()=>import('../components/three/Drag')},

        {
          path:'/create',name:'创作中心',component:()=>import('../views/create/Create'),
          children:[
            {path:'/content_publish',name:'ContentPublish',component:()=>import('../views/create/ContentPublish')},
            {path:'/course_manage',name:'CourseManage',component:()=>import('../views/create/CourseManage')},
            {path:'/resource_manage',name:'ResourceManage',component:()=>import('../views/create/ResourceManage')}
          ]
        }
      ]
    },
    {path:'/login',name:'登录',component:()=>import('../views/user/Login')},
    {path:'/register',name:'注册',component:()=>import('../views/user/Register')}
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
