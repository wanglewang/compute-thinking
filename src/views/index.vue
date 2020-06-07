<template>
    <div>
        <!--3.使用路由导航组件-->
        <NavMenu/>
        <!--路由占位符，匹配到的路由都会展示到这-->
        <router-view/>
    </div>
</template>

<script>
    /*1.引入路由导航组件*/
    import NavMenu from "../components/navmenu/NavMenu";
    export default {
        name: "index",
        /*2.映射成组件*/
        components:{
            NavMenu
        }
    }
</script>

<style scoped>

</style>
