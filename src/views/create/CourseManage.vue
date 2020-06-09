<template>
    <div>
        <el-table
                :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
            <el-table-column label="课程ID" prop="courseId"></el-table-column>
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.gmtCreate.replace('T','  ')}}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="viewCourse(scope.$index, scope.row)">查看</el-button>
                    <el-button size="mini" @click="editCourse(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteCourse(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import cookie from "js-cookie";

    export default {
        name: "CourseManage",
        data() {
            return {
                accountId:'',
                tableData: [{
                    courseId: null,
                    courseName: null,
                    gmtCreate: '',
                }],
                search: '',
                courseName:{
                    courseId:'',
                    courseName:''
                }
            }
        },
        methods: {
            viewCourse(index, row) {
                this.$router.push('/course/'+row.courseId);
            },
            editCourse(index, row) {
                const _this=this
                this.courseName.courseId=row.courseId
                this.$prompt('请输入课程名称', '修改课程名称', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: null,
                    inputErrorMessage: '课程民称不符合规则',
                    inputValue:row.courseName
                }).then(({ value }) => {
                    this.courseName.courseName=value
                    axios.post("course/rename",this.courseName).then(response=>{
                        if(response.data.code==20000) {
                            this.$message({
                                type: 'success',
                                message: '你成功将课程名修改为: ' + value
                            });
                            axios.get("course/getByAccountId/" +_this.accountId).then(response=> {
                                _this.tableData = response.data.data.courseList;
                            });
                        }else {
                            this.$message({
                                type: 'error',
                                message: '修改失败，可能出啥问题了吧'
                            });
                        }

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                });
            },
            deleteCourse(index, row) {
                const _this=this
                this.$confirm('此操作将永久删除该课程'+row.courseName+'以及其下的所有内容,但不会删除资源文件。 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete("course/delete/"+row.courseId).then(response=>{
                        if(response.data.code==20000) {
                            _this.$message({
                                type: 'success',
                                message: '课程删除成功!'
                            });
                            _this.tableData.splice(index,1)
                        }else{
                            _this.$message({
                                type: 'error',
                                message: response.data.message
                            });
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        created() {
            const _this = this;
            let token=cookie.get('java_course_token');
            axios.get('user/getRole',
                {headers: {'token': cookie.get('java_course_token')}}
            ).then(response=> {
                _this.accountId=response.data.data.user.accountId
                axios.get("course/getByAccountId/" +_this.accountId).then(response=> {
                    _this.tableData = response.data.data.courseList;
                });
            })
        }
    }
</script>

<style scoped>

</style>
