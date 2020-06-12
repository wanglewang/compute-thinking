<template>
    <el-container>
        <el-aside width="200px">
            <el-menu style="height: 688px;background-color: rgba(255,224,236,0.33)">
                <el-menu-item>
                    <i class="el-icon-sort"></i>
                    <router-link :to="'/content_publish/'" style="text-decoration: none">
                        内容发布
                    </router-link>
                </el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-s-operation"></i>
                        <span>管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-edit-outline"></i>
                        <router-link :to="'/course_manage/'" style="text-decoration: none">
                            课程管理
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <i class="el-icon-files"></i>
                        <router-link :to="'/resource_manage/'" style="text-decoration: none">
                            资源管理
                        </router-link>
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
