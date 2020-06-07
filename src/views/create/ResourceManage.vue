<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="资源ID" prop="resourceId"></el-table-column>
            <el-table-column label="资源名称" prop="resourceName"></el-table-column>
            <el-table-column label="资源类型">
                <template slot-scope="scope">
                    {{options[scope.row.resourceType]}}
                </template>
            </el-table-column>
            <el-table-column label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.gmtCreate.replace('T','  ')}}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="view(scope.$index, scope.row)">查看</el-button>
                    <el-button size="mini" @click="download(scope.$index, scope.row)">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="edit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" @click="delete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import cookie from "js-cookie";
    export default {
        name: "ResourceManage",
        data() {
            return {
                accountId:'',
                tableData: [{
                    resourceId:null,
                    resourceName:null,
                    resourceType:null,
                    gmtCreate:''
                }],
                options:['Office文件','视频','其他文件'],
                search: ''
            }
        },
        methods: {
            view(index, row) {
                console.log(index, row);
            },
            download(index, row) {
                console.log(index, row);
            },
            edit(index, row) {
                console.log(index, row);
            },
            delete(index, row) {
                console.log(index, row);
            }
        },
        created(){
            const _this=this;
            let token=cookie.get('java_course_token');
            axios.get('user/getRole',
                {headers: {'token': cookie.get('java_course_token')}}
            ).then(response=> {
                _this.accountId=response.data.data.user.accountId
                axios.get("resource/getByAccountId/"+_this.accountId).then(response=> {
                    _this.tableData=response.data.data.resourceList;
                });
            })
        }
    }
</script>

<style scoped>

</style>
