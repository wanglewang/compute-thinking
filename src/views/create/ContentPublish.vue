<template>
    <el-tabs v-model="activeName">
        <!--创建课程的表单-->
        <el-tab-pane label="创建课程" name="first">
            <el-form :model="courseAddForm" ref="courseAddFormRef":rules="courseAddFormRules">
                <el-upload class="avatar-uploader" action="http://101.200.53.247:8866/compute_thinking/course/upload"
                           :before-upload="beforeCoverUpload"
                           :on-success="coverUploadSuccess"
                           :show-file-list="false">
                    <img v-model="courseAddForm.courseCover" v-if="courseAddForm.courseCover" :src="courseAddForm.courseCover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

                <el-form-item label="课程名称">
                    <el-input v-model="courseAddForm.courseName"></el-input>
                </el-form-item>
                <el-form-item label="课程简介">
                    <el-input v-model="courseAddForm.courseDescription" type="textarea" :rows="3" placeholder="请输入内容">
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="createCourse">创建</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <!--上传Office文件的表单-->
        <el-tab-pane label="上传Office文件" name="third">
            <el-form :model="uploadOfficesForm">
                <el-upload class="upload-demo" drag action="http://101.200.53.247:8866/compute_thinking/office-file/upload" multiple
                           :before-upload="beforeOfficeUpload"
                           :on-exceed="officeUploadExceed"
                           :on-success="officeUploadSuccess"
                           :before-remove="beforeOfficeRemove"
                           :on-remove="officeOnRemove"
                           :file-list="fileNameList">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <el-form-item class="btns">
                    <el-button type="primary" @click="uploadOffices">上传</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <!--上传视频的表单-->
        <el-tab-pane label="上传视频" name="forth">
            <el-form :model="uploadVideosForm">
                <el-upload class="upload-demo" drag action="http://101.200.53.247:8866/compute_thinking/video/upload"
                           :on-exceed="videoUploadExceed"
                           :on-success="videoUploadSuccess"
                           :before-remove="beforeVideoRemove"
                           :on-remove="videoOnRemove"
                           :file-list="videoNameList">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>

                <el-form-item class="btns">
                    <el-button type="primary" @click="uploadVideos">上传</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <!--上传资源的表单-->
        <el-tab-pane label="上传资源" name="second">
            <el-form :model="uploadDocumentForm">
                <el-upload class="upload-demo" drag action="http://101.200.53.247/:8866/compute_thinking/document/upload" multiple
                           :on-exceed="documentUploadExceed"
                           :on-success="documentUploadSuccess"
                           :before-remove="beforeDocumentRemove"
                           :on-remove="documentOnRemove"
                           :file-list="documentNameList">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <el-form-item class="btns">
                    <el-button type="primary" @click="uploadDocument">上传</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import cookie from "js-cookie";
    export default {
        name: "ContentPublish",
        data() {
            return{

                accountId:'',
                activeName: 'first',
                //课程表单
                courseAddForm: {
                    courseName:'',
                    courseCover: '',
                    courseDescription:'',
                    accountId:''
                },
                //课程表单的验证规则对象
                courseAddFormRules:{
                    //验证课程名称
                    courseName:[
                        { required: true, message: '请输入课程名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    //验证课程简介
                    courseDescription:[
                        { required: true, message: '请输入客户曾简介', trigger: 'blur' },
                        { min: 6, max: 200, message: '长度在 6 到 200 个字符', trigger: 'blur' }
                    ]
                },

                fileNameList:[],
                OfficeObject:{
                    filePath:''
                },
                uploadOfficesForm:{
                    officeFileList:[],
                    accountId:''
                },

                videoNameList:[],
                //视频列表
                uploadVideosForm: {
                    videoList:[],
                    accountId:''
                },

                documentNameList:[],
                documentObject:{
                    filePath:''
                },
                //资源表单
                uploadDocumentForm: {
                    documentList:[],
                    accountId:''
                },
            }
        },
        created() {
            const _this = this;
            let token=cookie.get('java_course_token');
            axios.get('user/getRole',
                {headers: {'token': cookie.get('java_course_token')}}
            ).then(response=> {
                _this.accountId=response.data.data.user.accountId
                _this.courseAddForm.accountId=_this.accountId;
                _this.uploadDocumentForm.accountId=_this.accountId;
                _this.uploadOfficesForm.accountId=_this.accountId;
                _this.uploadVideosForm.accountId=_this.accountId;
                console.log(_this.accountId)
            })
        },
        methods:{
            /**
             * 上传课程封面之前
             * @param file
             * @returns {boolean|boolean}
             */
            beforeCoverUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG&&!isPNG) {
                    this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return (isJPG||isPNG) && isLt2M;
            },
            /**
             * 课程封面上传成功后
             * @param response
             * @param file
             */
            coverUploadSuccess(response, file) {
                this.courseAddForm.courseCover =response.data.coverUrl;
            },
            /**
             * 创建课程
             */
            createCourse() {
                const _this=this;
                this.$refs.courseAddFormRef.validate((valid)=>{
                    if(valid) {//表单预验证成功
                        //调用后端进行验证
                        axios.post('course/insert',_this.courseAddForm).then(response=> {
                            console.log(response.data)
                            if(response.data.code==20000) {
                                _this.$message.success('添加课程成功');
                                _this.$router.push('/create');
                            }else {
                                return _this.$message.error('添加课程失败，请重新检查一遍');
                            }
                        });
                    }
                });
            },


            beforeOfficeUpload(file){
                console.log(file)
            },
            officeUploadExceed() {

            },
            officeUploadSuccess(response, file) {
                //一个Office文件上传成功
                //将Office文件信息添加到OfficeList中
                console.log(response.data)
                console.log(file)
                this.uploadOfficesForm.officeFileList.push({
                    officeFileInitialName:file.name,
                    officeFileNewName: file.name,
                    officeFileAddress:response.data.officeFileAddress
                })
                this.fileNameList.push(
                    {
                        name: file.name,
                        url:response.data.officeFileAddress
                    }
                )
                console.log(this.uploadOfficesForm.officeFileList);
            },
            beforeOfficeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            officeOnRemove(file,fileList) {
                const _this=this;
                console.log(file)
                let filePath=file.url.substring(file.url.lastIndexOf(".com")+5);
                _this.OfficeObject.filePath=filePath
                console.log(_this.OfficeObject)
                axios.post("office-file/delete",_this.OfficeObject).then( response=> {
                    console.log(response)
                })
            },
            uploadOffices() {
                console.log(this.uploadOfficesForm)
                const _this=this;
                axios.post('office-file/insert',_this.uploadOfficesForm).then(response=> {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message.success('Office文件上传成功');
                        _this.$router.push('/create/');
                        _this.uploadOfficesForm.officeFileList = []
                        console.log(_this.uploadOfficesForm)
                    }else {
                        return _this.$message.error('Office文件上传失败，请重新上传');
                    }
                });

            },

            videoUploadExceed() {

            },
            videoUploadSuccess(response, file) {
                //一个视频上传成功
                //将视频添加到videoList中
                console.log(file)
                console.log(response.data)
                this.uploadVideosForm.videoList.push({
                    cloudVideoId: response.data.cloudVideoId,
                    videoInitialName:file.name,
                    videoNewName: file.name
                })
                this.videoNameList.push(
                    {
                        cloudVideoId: response.data.cloudVideoId,
                        name:file.name,
                        url:null
                    }
                )
            },
            beforeVideoRemove(file, fileList) {
                console.log(file)
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            videoOnRemove(file,fileList) {
                console.log(file)
                axios.delete("video/delete/"+file.cloudVideoId).then( response=> {
                    console.log(response)
                })
            },
            uploadVideos() {
                console.log(this.uploadVideosForm);
                const _this=this;
                axios.post('video/insert',_this.uploadVideosForm).then(response=>  {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message.success('视频上传成功');
                        _this.$router.push('/create/');
                        _this.uploadVideosForm.videoList = []
                    }else {
                        return _this.$message.error('视频上传失败，请重新上传');
                    }
                });

            },

            documentUploadExceed() {//资源正在上传
                this.$message.warning("正在上传");
            },
            documentUploadSuccess(response,file) {
                this.uploadDocumentForm.documentList.push({
                    documentInitialName:file.name,
                    documentNewName:file.name,
                    documentAddress:response.data.documentAddress
                })
                this.documentNameList.push({
                    name:file.name,
                    url:response.data.documentAddress
                })
            },
            beforeDocumentRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            documentOnRemove(file,fileList) {
                const _this=this;
                console.log(file)
                let filePath=file.url.substring(file.url.lastIndexOf(".com")+5);
                _this.documentObject.filePath=filePath
                console.log(_this.documentObject)
                axios.post("document/delete",_this.documentObject).then( response=> {
                    console.log(response)
                })
            },
            uploadDocument() {
                const _this=this;
                //调用后端进行验证
                axios.post('document/insert',_this.uploadDocumentForm).then(response=> {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message.success('上传资源成功');
                        _this.$router.push('/create/');
                    }else {
                        return _this.$message.error('上传资源失败，请重新上传');
                    }
                });
            },
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
