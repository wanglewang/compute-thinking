<template>
    <div style="width: 1522px;">
        <el-menu class="el-menu-demo" mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
            <el-menu-item index="1" @click="toHome">首页</el-menu-item>
            <el-submenu style="float: right" index="4" v-if="hasLogin">
                <template slot="title">
                    <span>{{nickname}}</span>
                </template>
                <el-menu-item index="4-1">个人中心</el-menu-item>
                <el-menu-item index="4-2">我的课程</el-menu-item>
                <el-menu-item index="4-3">我的收藏</el-menu-item>
                <el-menu-item index="4-4"@click="logout">退出登录</el-menu-item>
            </el-submenu>
            <el-menu-item style="float: right" @click="login" v-if="!hasLogin">登录</el-menu-item>
            <el-submenu style="float: right" index="2">
                <template slot="title">
                    <span>爱你的心啊</span>
                </template>
                <el-menu-item index="2-1" @click="toCube">爱的立方体</el-menu-item>
                <el-menu-item index="2-2" @click="toSurface">爱的反应面</el-menu-item>
                <el-menu-item index="2-3" @click="toHeart">爱的转圈圈</el-menu-item>
                <el-menu-item index="2-4" @click="toLiberate">爱的卍解</el-menu-item>
                <el-menu-item index="2-5" @click="toClick">点击</el-menu-item>
                <el-menu-item index="2-5" @click="toDrag">拖拽</el-menu-item>
            </el-submenu>
            <el-menu-item style="float: right" @click="toCreate" v-if="isTeacher==1" index="3">创作中心</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import cookie from "js-cookie";

    export default {
        name: "NavMenu",
        data() {
            return {
                isTeacher:false,
                nickname:null,
                hasLogin:false
            };
        },
        methods: {
            login(){
                this.$router.push('/login');
            },
            logout() {
                cookie.remove("java_course_token")
                this.$router.push('/login');
            },
            toHome() {
                this.$router.push('/index');
            },
            toCreate() {
                window.open("/create",'_blank')
            },
            toCube() {
                window.open("/cube",'_blank')
            },
            toSurface() {
                window.open("/surface",'_blank')
            },
            toHeart() {
                window.open("/heart",'_blank')
            },
            toLiberate() {
                window.open("/liberate",'_blank')
            },
            toClick() {
                window.open("/click",'_blank')
            },
            toDrag() {
                window.open("/drag",'_blank')
            }
        },
        created() {
            const java_course_token=cookie.get('java_course_token')
            const _this=this
            axios.get('user/getRole',
                {headers: {'token': java_course_token}}).then(response => {
                    if(response.data.code==20000) {
                        _this.hasLogin=true
                        _this.isTeacher=response.data.data.user.isTeacher
                        _this.nickname=response.data.data.user.nickname
                    }
            })
        }
    }
</script>

<style scoped>

</style>
