<template>
    <div style="width: 1522px">
        <div style="width: 1144px">
            <el-row style="background-color: rgba(26,230,189,0.15)">
                <el-col :span="5" v-for="(course, index) in courses" :key="index" :offset="1">
                    <el-card :body-style="{ padding: '10px',verticalAlign : 'middle',
                                    display: 'table-cell',textAlign: 'center'}" >
                        <router-link :to="'/course/'+course.courseId">
                            <div>
                                <img :src="course.courseCover" class="image" style="width:100%;height:auto;">
                            </div>
                        </router-link>
                        <div style="padding: 14px;">
                            <router-link :to="'/course/'+course.courseId">
                            <span class="courseName"
                                  style="display: block;
                                         line-height: 20px;
                                         height: 38px;
                                         margin-top: 6px;
                                         overflow: hidden;">
                                {{course.courseName}}
                            </span>
                            </router-link>
                            <div>{{course.teacher.nickname}}</div>
                            <div class="bottom clearfix">
                                <div style="font-size: 12px;
                                        overflow: hidden;
                                        overflow-x: hidden;
                                        overflow-y: hidden;
                                        text-overflow: ellipsis;"
                                >
                                    {{course.gmtCreate.replace('T',' ')}}
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row v-if="total>8" style="text-align: center;background-color: rgba(255,227,176,0.24)">
                <el-pagination
                        @size-change="changeSize"
                        @current-change="changeCurrentPage"
                        :current-page="currentPage"
                        :page-sizes="[8, 12, 16, 20,24]"
                        :page-size="8"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-row>
        </div>
        <el-row style="text-align: center;margin-top: 10px">
            备案
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                activeIndex: '1',
                courses:[
                    {
                        courseId:null,
                        courseCover:null,
                        courseName:null,
                        teacher:{
                            nickname:''
                        },
                        gmtCreate:''
                    }
                ],
                total:1,
                currentPage:1,
                pageSize:8
            }
        },
        created(){
            const _this=this;
            axios.get("course/getAll/"+this.currentPage+"/"+this.pageSize).then(response=> {
                _this.courses=response.data.data.courses;
                _this.total=response.data.data.total;
            });
        },
        methods:{
            /**
             * 修改当前页
             * @param currentPage
             */
            changeCurrentPage(currentPage) {
                this.currentPage=currentPage
                const _this=this;
                axios.get("course/getAll/"+currentPage+"/"+this.pageSize).then(response=> {
                    _this.courses=response.data.data.courses;
                    _this.total=response.data.data.total;
                });
            },
            /**
             * 修改页面大小
             * @param pageSize
             */
            changeSize(pageSize) {
                this.pageSize=pageSize
                const _this=this;
                axios.get("course/getAll/"+this.currentPage+"/"+pageSize).then(response=> {
                    _this.courses=response.data.data.courses;
                    _this.total=response.data.data.total;
                });
            }
        }
    }
</script>

<style scoped>
    .courseName {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .el-col-offset-1 {
        margin-left: 30px;
    }
    .el-card {
        border: 1px solid #EBEEF5;
        background-color: #FFF;
        color: #303133;
        -webkit-transition: .3s;
        transition: .3s;
        height: 250px;
        margin: 20px;
    }
</style>
