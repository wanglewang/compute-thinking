<template>
    <el-container class="home-container">
        <!--页面主体区域-->
        <el-tabs :tab-position="tabPosition" style="height: 100%;width: 100%;">
            <!--课程简介栏-->
            <el-tab-pane label="课程简介" style="height: 100%;width: 100%;">
                <mavon-editor style="height: 688px;width: 100%"
                              v-model="courseDetailsDTO.courseDescription"
                              :ishljs="true"
                              :scrollStyle="true"
                              :subfield="isOneself"
                              defaultOpen="preview"
                              :toolbarsFlag="isOneself"
                              :editable="isOneself"
                              @save="saveCourseDescription">
                </mavon-editor>
            </el-tab-pane>
            <!--主线栏-->
            <el-tab-pane label="主线">
                <el-tabs v-model="mainThreadId" type="card"
                         closable @tab-remove="deleteMainThread"
                         addable @tab-add="mainThreadAddFormVisible = true"
                         @tab-click="clickMainThread">
                    <el-tab-pane
                            v-for="(mainThread) in courseDetailsDTO.mainThreads"
                            :key="mainThread.mainThreadId"
                            :label="mainThread.mainThreadName" :name="mainThread.mainThreadId+''">
                        <el-row style="margin-left:20px;margin-bottom: 10px">
                            <el-col :span="1" class="text-center">
                                <el-tooltip content="简介" placement="top">
                                    <el-button icon="el-icon-view" circle @click="showMainThreadDescription(mainThread.mainThreadId)"></el-button><!--查看简介-->
                                </el-tooltip>
                            </el-col>
                            <el-col :span="5" class="text-center">
                                <el-cascader
                                        style="width: 224px"
                                        placeholder="请选择搜索字段"
                                        v-model="searchField"
                                        :options="options"
                                        :props="{ checkStrictly: true }"
                                        props.expandTrigger="hover"
                                        clearable>
                                </el-cascader>
                            </el-col>
                            <el-col :span="4" class="text-center">
                                <el-input v-model="search" placeholder="请输入搜索内容"></el-input>
                            </el-col>
                        </el-row>
                        <el-collapse v-model="activeNames" @change="getKnowledgeDetails">
                            <draggable v-model="mainThreadDTO" :draggable="isOneself?'.list-group-item':''"
                                       @update="resortSubsectionList(mainThread.mainThreadId)" class="list-group">
                                <el-collapse-item v-for="(subsectionDTO,index) in mainThreadDTOAfterSearch"
                                                  :key="subsectionDTO.subsection.subsectionId+''"
                                                  :name="index+';'+subsectionDTO.subsection.subsectionId"
                                                  :title="index+1+'  '+subsectionDTO.subsection.subsectionName"
                                                  class="list-group-item">
                                    <el-row >
                                        <div style="margin-bottom: 10px">
                                            <el-col :span="1" class="text-center">
                                                <el-tooltip content="删除" placement="top" style="margin-top: 5px" v-if="isOneself">
                                                    <el-button icon="el-icon-delete" circle
                                                               @click="deleteSubsection(subsectionDTO.subsection.subsectionId+'')">
                                                    </el-button><!--删除小节-->
                                                </el-tooltip>
                                            </el-col>
                                            <el-col :span="1" class="text-center">
                                                <el-tooltip content="简介" placement="top" style="margin-top: 5px">
                                                    <el-button icon="el-icon-view" circle
                                                               @click="showSubsectionDescription(subsectionDTO.subsection.subsectionId+'')">
                                                    </el-button><!--查看简介-->
                                                </el-tooltip>
                                            </el-col>
                                            <el-col :span="1" class="text-center">
                                                <el-tooltip content="添加子知识点" placement="right" style="margin-top: 5px" v-if="isOneself">
                                                    <el-button icon="el-icon-circle-plus-outline" circle
                                                               @click="showCreateKnowledge(subsectionDTO.subsection.subsectionId+'')">
                                                    </el-button><!--添加子知识点-->
                                                </el-tooltip>
                                            </el-col>
                                            <el-col :span="20" class="text-center" style="float: right">
                                                <knowledge-list-node
                                                        :knowledge-list="subsectionDTO.knowledgeList"
                                                        :subsection-id="subsectionDTO.subsection.subsectionId"
                                                        :is-oneself="isOneself"
                                                        :draggable="true">
                                                </knowledge-list-node>
                                            </el-col>
                                        </div>
                                    </el-row>
                                </el-collapse-item>
                            </draggable>
                            <div style="text-align: center"v-if="isOneself">
                                <el-button style="color: azure;background-color: lightpink" round
                                           @click="showCreateSubsection(mainThread.mainThreadId)">
                                    添加小节
                                </el-button>
                            </div>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <!--计划栏-->
            <el-tab-pane label="计划">
                <el-tabs v-model="planId" type="card"
                         closable @tab-remove="deletePlan"
                         addable @tab-add="planAddFormVisible = true"
                         @tab-click="clickPlan">
                    <el-tab-pane
                            v-for="(plan) in courseDetailsDTO.plans"
                            :key="plan.planId"
                            :label="plan.planName" :name="plan.planId+''">
                        <el-collapse v-model="activeNames" @change="getSubsectionDetailsInPlan">
                            <draggable v-model="planDTO"
                                       @update="resortSubsectionListInPlan(plan.planId)" class="list-group">
                                <el-collapse-item v-for="(subsectionDTO,index) in planDTO"
                                                  :key="subsectionDTO.subsection.subsectionId+''"
                                                  :name="index+';'+subsectionDTO.subsection.subsectionId"
                                                  :title="index+1+'  '+subsectionDTO.subsection.subsectionName"
                                                  class="list-group-item">
                                    <el-row >
                                        <div style="float: right;width: 90%">
                                            <knowledge-list-node
                                                    :knowledge-list="subsectionDTO.knowledgeList"
                                                    :is-oneself="false">
                                            </knowledge-list-node>
                                        </div>
                                    </el-row>
                                </el-collapse-item>
                            </draggable>
                            <div style="text-align: center" v-if="isOneself">
                                <el-button style="color: azure;background-color: lightpink" round
                                           @click="addSubsection(plan.planId)">
                                    关联小节
                                </el-button>
                            </div>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
        <!--各种弹窗-->
        <div>
            <!--显示主线描述的弹窗-->
            <description-dialog
                    title="主线描述"
                    v-if="mainThreadVisible"
                    :p-node-name="mainThreadName.mainThreadName"
                    :p-node-description="mainThreadDescription.mainThreadDescription"
                    :is-oneself="isOneself"
                    @rename="renameMainThread"
                    @saveDescription="saveMainThreadDescription"
                    @invisible="mainThreadVisible=false">
            </description-dialog>
            <!--显示计划描述的弹窗-->
            <description-dialog
                    title="计划描述"
                    v-if="planVisible"
                    :p-node-name="planName.planName"
                    :p-node-description="planDescription.planDescription"
                    :is-oneself="isOneself"
                    @rename="renamePlan"
                    @saveDescription="savePlanDescription"
                    @invisible="planVisible=false">
            </description-dialog>
            <!--显示小节描述的弹窗-->
            <description-dialog
                    title="小节描述"
                    v-if="subsectionVisible"
                    :p-node-name="subsectionName.subsectionName"
                    :p-node-description="subsectionDescription.subsectionDescription"
                    :is-oneself="isOneself"
                    @rename="renameSubsection"
                    @saveDescription="saveSubsectionDescription"
                    @invisible="subsectionVisible=false">
            </description-dialog>
            <!--添加主线的弹窗-->
            <description-add-dialog
                    title="添加主线"
                    v-if="mainThreadAddFormVisible"
                    p-label-node-name="主线名称"
                    :p-node-name="mainThreadAddForm.mainThreadName"
                    p-label-node-description="主线描述"
                    :p-node-description="mainThreadAddForm.mainThreadDescription"
                    @invisible="mainThreadAddFormVisible=false"
                    @createNode="addMainThread">
            </description-add-dialog>
            <!--添加计划的弹窗-->
            <description-add-dialog
                    title="添加计划"
                    v-if="planAddFormVisible"
                    p-label-node-name="计划名称"
                    :p-node-name="planAddForm.planName"
                    p-label-node-description="计划描述"
                    :p-node-description="planAddForm.planDescription"
                    @invisible="planAddFormVisible=false"
                    @createNode="addPlan">
            </description-add-dialog>
            <!--添加小节的弹窗-->
            <description-add-dialog
                    title="添加小节"
                    v-if="subsectionCreateVisible"
                    p-label-node-name="小节名称"
                    :p-node-name="subsectionCreate.subsectionName"
                    p-label-node-description="小节描述"
                    :p-node-description="subsectionCreate.subsectionDescription"
                    @invisible="subsectionCreateVisible = false"
                    @createNode="createSubsection">
            </description-add-dialog>
            <!--添加知识点的弹窗-->
            <description-add-dialog
                    title="添加知识点"
                    v-if="knowledgeCreateVisible"
                    p-label-node-name="知识点名称"
                    :p-node-name="knowledgeCreate.knowledgeName"
                    p-label-node-description="知识点描述"
                    :p-node-description="knowledgeCreate.knowledgeDescription"
                    @invisible="knowledgeCreateVisible=false"
                    @createNode="createKnowledge">
            </description-add-dialog>
            <!--关联小节的弹窗-->
            <el-dialog title="关联小节" :visible.sync="subsectionLinkFormVisible">
                <div>
                    <el-radio-group v-model="subsectionGroup">
                        <div v-for="subsection in subsectionList">
                            <el-radio  :label="subsection.subsectionId" border
                                       :key="subsection.subsectionId">
                                {{subsection.subsectionName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="subsectionLinkFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddSubsection(subsectionGroup)">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
    import cookie from "js-cookie";
    import DescriptionDialog from "../../components/dialog/DescriptionDialog";
    import draggable from "vuedraggable";
    import DescriptionAddDialog from "../../components/dialog/DescriptionAddDialog";
    import KnowledgeListNode from "../../components/node/KnowledgeListNode";
    export default {
        name: "CourseDetails.vue",
        components: {
            KnowledgeListNode,
            DescriptionAddDialog,
            draggable,
            DescriptionDialog
        },
        computed:{
            mainThreadDTOAfterSearch() {
                if(this.search==""||new RegExp("^[ ]+$").test(this.search)) {
                    return this.mainThreadDTO
                }else {
                    let classLength=this.searchField.length;
                    if(classLength==1) {
                        if(this.searchField[0]=="subsection") {
                            return this.mainThreadDTO.filter(mainThread=>{
                                let boolName=mainThread.subsection.subsectionName.indexOf(this.search)>-1
                                let boolDescription=mainThread.subsection.subsectionDescription.indexOf(this.search)>-1
                                return boolName||boolDescription
                            })
                        }else if(this.searchField[0]=="knowledge"){

                        }else {
                            return this.mainThreadDTO
                        }
                    }else if(classLength==2) {
                        if(this.searchField[0]=="subsection") {
                            switch (this.searchField[1]) {
                                case "subsectionId" : {
                                    return this.mainThreadDTO.filter(mainThread=>
                                        mainThread.subsection.subsectionId.toString().indexOf(this.search)>-1
                                    )
                                }
                                case "subsectionName" : {
                                    return this.mainThreadDTO.filter(mainThread=>
                                        mainThread.subsection.subsectionName.indexOf(this.search)>-1
                                    )
                                }
                                case "subsectionDescription" : {
                                    return this.mainThreadDTO.filter(mainThread=>
                                        mainThread.subsection.subsectionDescription.indexOf(this.search)>-1
                                    )
                                }
                                case "gmtCreate" : {
                                    return this.mainThreadDTO.filter(mainThread=>
                                        mainThread.subsection.gmtCreate.indexOf(this.search)>-1
                                    )
                                }
                                case "gmtModified" : {
                                    return this.mainThreadDTO.filter(mainThread=>
                                        mainThread.subsection.gmtModified.indexOf(this.search)>-1
                                    )
                                }
                            }
                        }else if(this.searchField[0]=="knowledge"){

                        }else {
                            return this.mainThreadDTO
                        }
                    }else if(classLength==3) {

                    }
                }
            }
        },
        data() {
            return {
                searchField:'',
                options: [{
                    value: 'subsection',
                    label: '小节',
                    children: [{
                        value: 'subsectionId',
                        label: 'ID'
                    }, {
                        value: 'subsectionName',
                        label: '名称'
                    }, {
                        value: 'subsectionDescription',
                        label: '描述'
                    },{
                        value: 'gmtCreate',
                        label: '创建时间'
                    },{
                        value: 'gmtModified',
                        label: '修改时间'
                    }]
                }, {
                    value: 'knowledge',
                    label: '知识点',
                    children: [{
                        value: 'knowledgeId',
                        label: 'ID'
                    }, {
                        value: 'knowledgeName',
                        label: '名称'
                    }, {
                        value: 'knowledgeDescription',
                        label: '描述'
                    }, {
                        value: 'officeFileList',
                        label: 'Office文件',
                        children: [
                            {value: 'officeFileId', label: 'ID'},
                            {value: 'officeFileInitialName', label: '初始名称'},
                            {value: 'officeFileNewName', label: '最新名称'},
                            {value: 'gmtCreate', label: '上传时间'},
                            {value: 'gmtModified', label: '修改时间'}
                        ]
                    }, {
                        value: 'video',
                        label: '视频',
                        children: [
                            {value: 'videoId', label: 'ID'},
                            {value: 'videoInitialName', label: '初始名称'},
                            {value: 'videoNewName', label: '最新名称'},
                            {value: 'gmtCreate', label: '上传时间'},
                            {value: 'gmtModified', label: '修改时间'}
                        ]
                    }, {
                        value: 'documentList',
                        label: '其他文件',
                        children: [
                            {value: 'documentId', label: 'ID'},
                            {value: 'documentInitialName', label: '初始名称'},
                            {value: 'documentNewName', label: '最新名称'},
                            {value: 'gmtCreate', label: '上传时间'},
                            {value: 'gmtModified', label: '修改时间'}
                        ]

                    }]
                }],
                formInline: {
                    user: '',
                    region: ''
                },
                search:'',
                accountId: '',
                isOneself:false,
                courseDetailsDTO: {
                    courseId:0,
                    courseName:'',
                    courseCover:'',
                    courseDescription:'',
                    accountId:0,
                    teacher:'',
                    mainThreads:[],
                    plans:[]
                },
                markCourseDescription: {
                    courseId:'',
                    courseDescription:''
                },
                tabPosition: 'left',
                editableTabsValue: '2',
                editableTabs: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2,
                activeNames: ['1'],
                formLabelWidth: '120px',
                //主线
                mainThreadDTO:[{
                    subsection:'',
                    knowledgeList:[{}]
                }],
                mainThreadId:'',
                mainThreadAddFormVisible: false,
                mainThreadAddForm: {
                    mainThreadName: '',
                    mainThreadDescription:'',
                    courseId:this.$route.params.id
                },
                mainThreadVisible:false,
                mainThreadName:{
                    mainThreadId:'',
                    mainThreadName:''
                },
                mainThreadDescription:{
                    mainThreadId:'',
                    mainThreadDescription:''
                },
                //小节
                subsectionCreateVisible:false,
                subsectionCreate:{
                    subsectionName:'',
                    subsectionDescription:'',
                    mainThreadId:''
                },
                subsectionVisible:false,
                subsectionName:{
                    subsectionId:'',
                    subsectionName:''
                },
                subsectionDescription:{
                    subsectionId:'',
                    subsectionDescription:''
                },
                //知识点
                knowledgeList:'',
                knowledgeCreateVisible: false,
                knowledgeCreate: {
                    knowledgeName: '',
                    knowledgeDescription:'',
                    subsectionId:''
                },
                contentFormVisible:false,
                knowledgeName:{
                    knowledgeId:'',
                    knowledgeName:''
                },
                markKnowledgeDescription:{
                    knowledgeId:'',
                    knowledgeDescription:''
                },

                openCount:1,
                OfficeObject:{
                    objectName:''
                },
                relatedDocuments:[{
                    officeFileId:'',
                    officeFileNewName:'',
                }],
                relatedDocumentsFormVisible:false,
                officeFileLink:{
                    knowledgeId:'',
                    officeFileId:''
                },
                visible: false,
                content:'',
                //计划
                planDTO:[{
                    subsection:'',
                    knowledgeList:[{}]
                }],
                planId:'',
                planAddFormVisible: false,
                planAddForm: {
                    planName: '',
                    planDescription:'',
                    courseId:this.$route.params.id
                },
                planVisible:false,
                planName:{
                    planId:'',
                    planName:''
                },
                planDescription:{
                    planeId:'',
                    planDescription:''
                },
                subsectionList:'',
                subsectionGroup:'',
                subsectionLinkFormVisible:false,
                subsectionLinkForm:{
                    planId:'',
                    subsectionId:''
                },
            }
        },
        created(){
            const _this = this;
            let token=cookie.get('java_course_token');
            axios.get('user/getRole',
                {headers: {'token': cookie.get('java_course_token')}}
            ).then(response=> {
                if(response.data.code==20000) {
                    console.log(response.data)
                    _this.accountId=response.data.data.user.accountId
                    axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                        _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                        _this.isOneself=(_this.courseDetailsDTO.teacher.accountId==_this.accountId)
                    });
                }else {
                    this.$confirm('尚未登录, 是否去登录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.$router.push("/login");
                    }).catch(() => {
                    });
                }

            })
        },
        methods: {
            //课程描述
            saveCourseDescription(value,render) {
                this.markCourseDescription.courseId=this.$route.params.id
                this.markCourseDescription.courseDescription=value
                const _this=this
                axios.post("course/saveDescription",this.markCourseDescription).then(response=>{
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message({
                            message: '课程描述保存成功',
                            center: true,
                            type: 'success'
                        });
                    }else {
                        _this.$message({
                            message: '对不起，出了点问题，请稍后再试，或等待管理员处理',
                            center: true,
                            type: 'warning'
                        });
                    }
                })
            },
            //主线
            addMainThread(node) {
                this.mainThreadAddForm.mainThreadName=node.dNodeName
                this.mainThreadAddForm.mainThreadDescription=node.dNodeDescription
                //调用后端进行验证
                const _this=this
                axios.post('main-thread/insert',_this.mainThreadAddForm).then(response=> {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message({
                            message: '主线创建成功',
                            center: true,
                            type: 'success'
                        });
                        _this.mainThreadAddFormVisible=false;
                        /**
                         * 重新加载课程资源
                         */
                        axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                            _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                        });
                    }else {
                        return _this.$message.error(response.data.message);
                    }
                });
            },
            deleteMainThread(mainThreadId) {
                const _this=this
                this.$confirm('此操作将永久删除该主线以及主线下的所有内容，但是不会删除资源文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete("main-thread/delete/"+mainThreadId).then(response=>{
                        if(response.data.code=20000) {
                            _this.$message({
                                type: 'success',
                                message: '主线删除成功!'
                            });
                        }else{
                            _this.$message({
                                type: 'error',
                                message: response.data.message
                            });
                        }
                        axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                            _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                            _this.isOneself=(_this.courseDetailsDTO.teacher.accountId==_this.accountId)
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            clickMainThread(tab, event) {
                const _this=this
                let mainThreadId=this.courseDetailsDTO.mainThreads[tab.index].mainThreadId
                axios.get("main-thread/getContentById/" + mainThreadId).then(response => {
                    if(response.data.code=20000) {
                        _this.mainThreadDTO=response.data.data.mainThreadDTO
                    }
                });
            },
            showMainThreadDescription(mainThreadId) {
                const _this=this
                axios.get("main-thread/getMainThreadById/"+mainThreadId).then(response=>{
                    console.log(response.data)
                    let mainThread=response.data.data.mainThread
                    _this.mainThreadName.mainThreadId=mainThread.mainThreadId
                    _this.mainThreadName.mainThreadName=mainThread.mainThreadName
                    _this.mainThreadDescription.mainThreadId=mainThread.mainThreadId
                    _this.mainThreadDescription.mainThreadDescription=mainThread.mainThreadDescription
                    _this.mainThreadVisible=true
                })

            },
            renameMainThread(mainThreadName){
                const _this=this
                this.mainThreadName.mainThreadName=mainThreadName
                axios.post("main-thread/rename",this.mainThreadName).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '主线重命名成功',
                            type: 'success',
                            center:true
                        });
                        axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                            _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            saveMainThreadDescription(mainThreadDescription) {
                const _this=this
                this.mainThreadDescription.mainThreadDescription=mainThreadDescription
                axios.post("main-thread/saveDescription",this.mainThreadDescription).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '主线描述保存成功',
                            type: 'success',
                            center:true
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            //小节
            resortSubsectionList(mainThreadId) {
                if(this.mainThreadDTO==this.mainThreadDTOAfterSearch) {
                    let subsectionIdList=[];
                    for(let i=0;i<this.mainThreadDTO.length;i++){
                        subsectionIdList.push(this.mainThreadDTO[i].subsection.subsectionId)
                    }
                    let subsectionList=subsectionIdList.join(";")
                    subsectionList+=";"
                    let subsectionInMainThread={mainThreadId:mainThreadId,subsectionList:subsectionList};
                    const _this=this
                    axios.post("subsection-in-mainthread/update",subsectionInMainThread).then(response=>{
                        if(response.data.code=20000) {
                            _this.$message({
                                message: '小节顺序调整成功',
                                type: 'success',
                                center:true
                            });
                        }else {
                            _this.$message({
                                message: response.data.message,
                                type: 'error',
                                center:true
                            });
                        }
                    })
                }else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: '搜索状态下不允许调整顺序呢！  要想调整顺序请清空搜索输入框',
                        type: 'warning'
                    });
                }
            },
            showCreateSubsection(mainThreadId) {
                this.subsectionCreate.mainThreadId=mainThreadId
                this.subsectionCreateVisible=true
            },
            createSubsection(node) {
                this.subsectionCreate.subsectionName=node.dNodeName
                this.subsectionCreate.subsectionDescription=node.dNodeDescription
                //调用后端进行验证
                const _this=this;
                axios.post('subsection/insert',_this.subsectionCreate).then(response=> {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message.success('小节添加成功');
                        _this.subsectionCreateVisible=false;
                        axios.get("main-thread/getContentById/" + _this.subsectionCreate.mainThreadId).then(response => {
                            _this.mainThreadDTO=response.data.data.mainThreadDTO
                        });
                    }else {
                        return _this.$message.error('小节添加失败，请重新检查一遍');
                    }
                });
            },
            //删除小节
            deleteSubsection(subsectionId) {
                const _this=this
                this.$confirm('此操作将永久删除该小节以及小节下的所有知识点，但是不会删除资源文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete("subsection/delete/"+subsectionId).then(response=>{
                        if(response.data.code=20000) {
                            _this.$message({
                                type: 'success',
                                message: '小节删除成功!'
                            });
                            axios.get("main-thread/getContentById/" + this.mainThreadName.mainThreadId).then(response => {
                                if(response.data.code=20000) {
                                    _this.mainThreadDTO=response.data.data.mainThreadDTO
                                }
                            });
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
            //查看小节描述
            showSubsectionDescription(subsectionId) {
                this.subsectionName.subsectionId=subsectionId
                this.subsectionDescription.subsectionId=subsectionId
                const _this=this
                axios.get("subsection/getSubsectionById/"+subsectionId).then(response=>{
                    _this.subsectionName.subsectionName=response.data.data.subsection.subsectionName
                    _this.subsectionDescription.subsectionDescription=response.data.data.subsection.subsectionDescription
                    _this.subsectionVisible=true
                })
            },
            renameSubsection(subsectionName) {
                const _this=this
                this.subsectionName.subsectionName=subsectionName
                axios.post("subsection/rename",this.subsectionName).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '小节重命名成功',
                            type: 'success',
                            center:true
                        });
                        axios.get("main-thread/getContentById/" + _this.mainThreadId).then(response => {
                            if(response.data.code=20000) {
                                _this.mainThreadDTO=response.data.data.mainThreadDTO
                            }
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            saveSubsectionDescription(subsectionDescription) {
                const _this=this
                this.subsectionDescription.subsectionDescription=subsectionDescription
                axios.post("subsection/saveDescription",this.subsectionDescription).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '小节描述保存成功',
                            type: 'success',
                            center:true
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            //查看小节描述
            getKnowledgeDetails(val) {
                let params= val[val.length - 1].split(";")
                let index=params[0]
                if(val.length>this.openCount) {
                    const _this=this;
                    let subsectionId=params[1]
                    axios.get("knowledge/getBySubsectionId/"+subsectionId).then(response=> {
                        if(response.data.code=20000){
                            _this.mainThreadDTO[index].knowledgeList=response.data.data.knowledgeDetailsDTOList;
                        }else {
                            _this.$message.error(response.data.message)
                        }
                    });
                }else {
                    this.openCount=val.length;
                }
            },
            //知识点
            showCreateKnowledge(subsectionId) {
                console.log(subsectionId);
                this.knowledgeCreate.subsectionId=subsectionId
                this.knowledgeCreateVisible=true;
            },
            createKnowledge(node) {
                this.knowledgeCreate.knowledgeName=node.dNodeName;
                this.knowledgeCreate.knowledgeDescription=node.dNodeDescription
                //调用后端进行验证
                const _this=this
                axios.post('knowledge/insert',this.knowledgeCreate).then(response=> {
                    console.log(response.data)
                    if(response.data.code==20000) {
                        _this.$message.success('知识点添加成功');
                        axios.get("main-thread/getContentById/" + _this.mainThreadId).then(response => {
                            if(response.data.code=20000) {
                                _this.mainThreadDTO=response.data.data.mainThreadDTO
                            }
                            _this.knowledgeCreateVisible=false
                        });
                    }else {
                        return _this.$message.error('知识点添加失败，请重新检查一遍');
                    }
                });
            },
            //计划
            addPlan(node) {
                this.planAddForm.planName=node.dNodeName
                this.planAddForm.planDescription=node.dNodeDescription
                //调用后端进行验证
                const _this=this
                axios.post('plan/insert',_this.planAddForm).then( response => {
                    console.log(response.data.data)
                    if(response.data.code==20000) {
                        _this.$message.success('计划添加成功');
                        _this.planAddFormVisible=false
                        /**
                         * 重新加载课程资源
                         */
                        axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                            _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                        });
                    }else {
                        return _this.$message.error('计划添加失败，请重新检查一遍');
                    }
                });
            },
            deletePlan(planId) {
                const _this=this
                this.$confirm('此操作将永久删除该计划, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete("plan/delete/"+planId).then(response=>{
                        if(response.data.code=20000) {
                            _this.$message({
                                type: 'success',
                                message: '计划删除成功!'
                            });
                        }else{
                            _this.$message({
                                type: 'error',
                                message: response.data.message
                            });
                        }
                        axios.get("course/getById/"+_this.$route.params.id).then(response=> {
                            _this.courseDetailsDTO=response.data.data.courseDetailsDTO;
                            _this.isOneself=(_this.courseDetailsDTO.teacher.accountId==_this.accountId)
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            clickPlan(tab, event){
                const _this=this;
                let planId=this.courseDetailsDTO.plans[tab.index].planId
                axios.get("plan/getPlanById/"+planId).then(response=>{
                    let plan=response.data.data.plan
                    _this.planName.planId=plan.planId
                    _this.planName.planName=plan.planName
                    _this.planDescription.planId=plan.planId
                    _this.planDescription.planDescription=plan.planDescription
                    _this.planVisible=true
                })
                axios.get("plan/getContentById/" + tab.$options._parentVnode.key).then(response => {
                    if(response.data.code=20000) {
                        _this.planDTO=response.data.data.planDTO
                    }
                });
            },
            renamePlan(planName){
                const _this=this
                this.planName.planName=planName
                axios.post("plan/rename",this.planName).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '计划重命名成功',
                            type: 'success',
                            center:true
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            savePlanDescription(planDescription) {
                const _this=this
                this.planDescription.planDescription=planDescription
                axios.post("plan/saveDescription",this.planDescription).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '计划描述保存成功',
                            type: 'success',
                            center:true
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
            addSubsection(planId) {
                const _this=this;
                axios.get('subsection/getByCourseId/'+this.$route.params.id).then(response=> {
                    if(response.data.code==20000) {
                        _this.subsectionList=response.data.data.subsectionList
                        _this.subsectionLinkForm.planId=planId
                        _this.subsectionLinkFormVisible=true
                    }else {
                        return _this.$message.error('未知错误，请稍后')
                    }
                });

            },
            confirmAddSubsection(subsectionId){
                console.log(subsectionId)
                this.subsectionLinkForm.subsectionId=subsectionId;
                const _this=this;
                axios.post('subsection-in-plan/append',this.subsectionLinkForm).then(response=>{
                    console.log(response.data.data)
                    if(response.data.code==20000) {
                        _this.$message.success('小节关联成功');
                        _this.subsectionLinkFormVisible=false;
                        axios.get("plan/getContentById/" + _this.subsectionLinkForm.planId).then(response => {
                            _this.planDTO=response.data.data.planDTO
                        });
                    }else {
                        return _this.$message.error('小节关联失败，请重试');
                    }
                })
            },
            getSubsectionDetailsInPlan(val) {
                let params= val[val.length - 1].split(";")
                let index=params[0]
                if(val.length>this.openCount) {
                    const _this=this;
                    let subsectionId=params[1]
                    axios.get("knowledge/getBySubsectionId/"+subsectionId).then(response=> {
                        _this.planDTO[index].knowledgeList=response.data.data.knowledgeDetailsDTOList;
                    });
                }else {
                    this.openCount=val.length;
                }
            },
            //计划下小节
            resortSubsectionListInPlan(planId) {
                let subsectionIdList=[];
                for(let i=0;i<this.planDTO.length;i++){
                    subsectionIdList.push(this.planDTO[i].subsection.subsectionId)
                }
                let subsectionList=subsectionIdList.join(";")
                subsectionList+=";"
                let subsectionInPlan={planId:planId,subsectionList:subsectionList};
                const _this=this
                axios.post("subsection-in-plan/update",subsectionInPlan).then(response=>{
                    if(response.data.code=20000) {
                        _this.$message({
                            message: '小节顺序调整成功',
                            type: 'success',
                            center:true
                        });
                    }else {
                        _this.$message({
                            message: response.data.message,
                            type: 'error',
                            center:true
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .home-container{
        height: 100%;
    }
</style>
