<template>
    <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu>
                <el-menu-item>
                    <router-link :to="'/content_publish/'">内容发布</router-link>
                </el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-setting"></i>
                        <span>管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span><router-link
                                :to="'/course_manage/'">课程管理</router-link></span>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span><router-link :to="'/resource_manage/'">资源管理</router-link></span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Create"
    }
</script>

<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #1AE6BD;
    }

    .el-aside {
        background-color: aquamarine;
    }

    .el-main {
        background-color: aliceblue;
    }
</style>
