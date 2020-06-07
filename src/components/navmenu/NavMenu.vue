<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1" @click="toHome">首页</el-menu-item>

            <el-submenu style="float: right" index="2" v-if="hasLogin">
                <template slot="title">
                    <span>{{nickname}}</span>
                </template>
                <el-menu-item index="2-1">个人中心</el-menu-item>
                <el-menu-item index="2-2">我的课程</el-menu-item>
                <el-menu-item index="2-3">我的收藏</el-menu-item>
                <el-menu-item index="2-3"@click="logout">退出登录</el-menu-item>
            </el-submenu>
            <el-menu-item style="float: right" @click="login" v-if="!hasLogin">登录</el-menu-item>
            <el-menu-item style="float: right" v-if="isTeacher==1">
                <router-link :to="'/create'" target="_blank">创作中心</router-link>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import cookie from "js-cookie";

    export default {
        name: "NavMenu",
        data() {
            return {
                activeIndex: '1',
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
