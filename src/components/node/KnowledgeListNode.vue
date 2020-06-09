<template>
    <div>
<!--        <draggable v-model="dKnowledgeList" :draggable="(draggable&&isOneself&&subsectionId!=null)?'.knowledgeList':''"-->
<!--                   @update="resortKnowledgeList(subsectionId)" class="list-group">-->
            <el-row v-for="(knowledge,index) in knowledgeList"
                    :key="knowledge.knowledgeId"
                    class="knowledgeList">
                <el-col :span="1" style="margin: 5px;text-align: right;height: 100%;line-height:40px">
                    <el-tooltip content="删除" placement="top" v-if="isOneself">
                        <i class="el-icon-remove-outline cc_pointer" style="color: #F56C6C"
                           @click="deleteKnowledge(knowledge.knowledgeId,index)">
                        </i><!--删除知识点-->
                    </el-tooltip>
                </el-col>
                <el-col :span="22">
                    <div style="margin: 5px;background-color: rgba(21,255,211,0.05);width: 99%">
                        <!--知识点名称-->
                        <div style="float: left;height:100%; line-height:40px; overflow:hidden; width: 40%">
                            <span>{{index+1}}：{{knowledge.knowledgeName}}</span>
                        </div>
                        <!--前后置知识点-->
                        <span style="text-align: center;width: 20%">
                            <el-popover placement="top" title="后置知识点" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPostKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button  circle icon="el-icon-top" slot="reference"></el-button>
                            </el-popover>
                            <el-popover placement="top" title="前置知识点"
                                        width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPreKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                    <el-button @click="addPreKnowledge(knowledge.knowledgeId)" v-if="isOneself">添加</el-button>
                                </div>
                                <el-button circle icon="el-icon-bottom" slot="reference"></el-button>
                            </el-popover>
                        </span>
                        <!--关联文件-->
                        <div style="float: right">
                            <!--知识点描述-->
                            <el-tooltip content="简介" placement="top">
                                <el-button icon="el-icon-reading" circle
                                           @click="showKnowledgeDescription(knowledge.knowledgeId)">
                                </el-button><!--查看简介-->
                            </el-tooltip>
                            <!--Office文件关联-->
                            <el-popover placement="top" title="文档" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedOfficeFileList(knowledge.knowledgeId)">查看</el-button>
                                    <el-button @click="linkOfficeFile(knowledge.knowledgeId)" v-if="isOneself">添加</el-button>
                                </div>
                                <el-button type="primary" icon="el-icon-document" slot="reference" circle></el-button><!--Office文件-->
                            </el-popover>
                            <!--视频文件关联-->
                            <el-popover placement="top" title="视频" width="100" trigger="hover">
                                <div>
                                    <el-button @click="viewVideo(knowledge.knowledgeId)">观看</el-button>
                                    <el-button>下载</el-button>
                                </div>
                                <div>
                                    <el-button @click="linkVideo(knowledge.knowledgeId)" v-if="isOneself">添加</el-button>
                                    <el-button v-if="isOneself">删除</el-button>
                                </div>
                                <el-button type="info" icon="el-icon-video-play" circle slot="reference"></el-button><!--视频-->
                            </el-popover>
                            <!--其他文件关联-->
                            <el-popover placement="top" title="其他文件" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedDocumentList(knowledge.knowledgeId)">查看</el-button>
                                    <el-button @click="linkDocument(knowledge.knowledgeId)" v-if="isOneself">添加</el-button>
                                </div>
                                <el-button type="warning" icon="el-icon-folder" circle slot="reference"></el-button><!--程序-->
                            </el-popover>
                        </div>
                    </div>
                </el-col>
            </el-row>
<!--        </draggable>-->
        <div>
            <!--显示后置知识点-->
            <el-dialog title="后置知识点":visible.sync="postKnowledgeListDialogVisible">
                <div>
                    <el-row v-for="(knowledge,index) in postKnowledgeList"
                            :key="knowledge.knowledgeId"
                            style="margin: 10px;background-color: rgba(21,255,211,0.05);width: 99%">
                        <!--知识点名称-->
                        <div style="float: left;height:100%; line-height:40px; overflow:hidden; width: 40%">
                            <span>{{index}}：{{knowledge.knowledgeName}}</span>
                        </div>
                        <!--前后置知识点-->
                        <span style="text-align: center;width: 20%">
                            <el-popover placement="top" title="后置知识点" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPostKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button  circle icon="el-icon-top" slot="reference"></el-button>
                            </el-popover>
                            <el-popover placement="top" title="前置知识点" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPreKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button circle icon="el-icon-bottom" slot="reference"></el-button>
                            </el-popover>
                        </span>
                        <div style="float: right">
                            <!--知识点描述-->
                            <el-popover placement="top" title="知识点描述" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showKnowledgeDescription(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button icon="el-icon-reading" slot="reference" circle></el-button><!--Markdown-->
                            </el-popover>
                            <!--Office文件关联-->
                            <el-popover placement="top" title="文档" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedOfficeFileList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button type="primary" icon="el-icon-document" slot="reference" circle></el-button><!--Office文件-->
                            </el-popover>
                            <!--视频文件关联-->
                            <el-popover placement="top" title="视频" width="100" trigger="hover">
                                <div>
                                    <el-button @click="viewVideo(knowledge.knowledgeId)">观看</el-button>
                                    <el-button>下载</el-button>
                                </div>
                                <el-button type="info" icon="el-icon-video-play" circle slot="reference"></el-button><!--视频-->
                            </el-popover>
                            <!--其他文件关联-->
                            <el-popover placement="top" title="其他文件" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedDocumentList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button type="warning" icon="el-icon-folder" circle slot="reference"></el-button><!--程序-->
                            </el-popover>
                        </div>
                    </el-row>
                </div>
            </el-dialog>
            <!--显示前置知识点-->
            <el-dialog title="前置知识点":visible.sync="preKnowledgeListDialogVisible">
                <div>
                    <el-row v-for="(knowledge,index) in preKnowledgeList"
                            :key="knowledge.knowledgeId"
                            style="margin: 10px;background-color: rgba(21,255,211,0.05);width: 99%">
                        <!--知识点名称-->
                        <div style="float: left;height:100%; line-height:40px; overflow:hidden; width: 40%">
                            <span>{{index}}：{{knowledge.knowledgeName}}</span>
                        </div>
                        <!--前后置知识点-->
                        <span style="text-align: center;width: 20%">
                            <el-popover placement="top" title="后置知识点" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPostKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button  circle icon="el-icon-top" slot="reference"></el-button>
                            </el-popover>
                            <el-popover placement="top" title="前置知识点" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showPreKnowledgeList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button circle icon="el-icon-bottom" slot="reference"></el-button>
                            </el-popover>
                        </span>
                        <div style="float: right">
                            <!--知识点描述-->
                            <el-popover placement="top" title="知识点描述" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showKnowledgeDescription(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button icon="el-icon-reading" slot="reference" circle></el-button><!--Markdown-->
                            </el-popover>
                            <!--Office文件关联-->
                            <el-popover placement="top" title="文档" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedOfficeFileList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button type="primary" icon="el-icon-document" slot="reference" circle></el-button><!--Office文件-->
                            </el-popover>
                            <!--视频文件关联-->
                            <el-popover placement="top" title="视频" width="100" trigger="hover">
                                <div>
                                    <el-button @click="viewVideo(knowledge.knowledgeId)">观看</el-button>
                                    <el-button>下载</el-button>
                                </div>
                                <el-button type="info" icon="el-icon-video-play" circle slot="reference"></el-button><!--视频-->
                            </el-popover>
                            <!--其他文件关联-->
                            <el-popover placement="top" title="其他文件" width="100" trigger="hover">
                                <div>
                                    <el-button @click="showRelatedDocumentList(knowledge.knowledgeId)">查看</el-button>
                                </div>
                                <el-button type="warning" icon="el-icon-folder" circle slot="reference"></el-button><!--程序-->
                            </el-popover>
                        </div>
                    </el-row>
                </div>
            </el-dialog>
            <!--关联前置知识点-->
            <el-dialog title="关联前置知识点" :visible.sync="knowledgeListInCourseDialogVisible">
                <div>
                    <el-radio-group v-model="radioGroup">
                        <div v-for="knowledge in knowledgeListInCourse">
                            <el-radio  :label="knowledge.knowledgeId" border
                                       :key="knowledge.knowledgeId">
                                {{knowledge.knowledgeName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="knowledgeListInCourseDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddPreKnowledge(radioGroup)">确 定</el-button>
                </div>
            </el-dialog>
            <!--显示知识点描述的弹窗-->
            <description-dialog
                    title="知识点描述"
                    v-if="knowledgeDescriptionDialogVisible"
                    :p-node-name="knowledgeName.knowledgeName"
                    :p-node-description="knowledgeDescription.knowledgeDescription"
                    :is-oneself="isOneself"
                    @rename="renameKnowledge"
                    @saveDescription="saveKnowledgeDescription"
                    @invisible="knowledgeDescriptionDialogVisible=false">
            </description-dialog>
            <!--关联Office文件的弹窗-->
            <el-dialog title="关联Office文件" :visible.sync="officeFileListUnderAccountDialogVisible">
                <div>
                    <el-radio-group v-model="radioGroup">
                        <div v-for="officeFile in officeFileListUnderAccount">
                            <el-radio  :label="officeFile.officeFileId" border
                                       :key="officeFile.officeFileId">
                                {{officeFile.officeFileNewName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="officeFileListUnderAccountDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmLinkOfficeFile(radioGroup)">确 定</el-button>
                </div>
            </el-dialog>
            <!--显示Office文件的弹窗-->
            <el-dialog title="Office文件" :visible.sync="relatedOfficeFileListDialogVisible">
                <el-table :data="relatedOfficeFileList">
                    <el-table-column property="officeFileId" label="文档Id" width="150"></el-table-column>
                    <el-table-column property="officeFileNewName" label="文档名称" width="200"></el-table-column>
                    <el-table-column align="right">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="viewOfficeFile(scope.$index, scope.row)">查看</el-button>
                            <el-button size="mini" @click="downloadOfficeFile(scope.$index, scope.row)">下载</el-button>
                            <el-button size="mini" type="danger" @click="deleteOfficeFileLink(scope.$index, scope.row)" v-if="isOneself">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <!--关联视频的弹窗-->
            <el-dialog title="关联Office文件" :visible.sync="videoListUnderAccountDialogVisible">
                <div>
                    <el-radio-group v-model="radioGroup">
                        <div v-for="video in videoListUnderAccount">
                            <el-radio  :label="video.videoId" border
                                       :key="video.videoId">
                                {{video.videoNewName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="videoListUnderAccountDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmLinkVideo(radioGroup)">确 定</el-button>
                </div>
            </el-dialog>
            <!--视频播放-->
            <el-dialog title="视频" :visible.sync="relatedVideoDialogVisible">
                <AliPlayer :video-id="relatedVideo.cloudVideoId"
                           :play-auth="relatedVideo.videoPlayAuth">
                </AliPlayer>
            </el-dialog>
            <!--关联其他文件的弹窗-->
            <el-dialog title="关联其他文件" :visible.sync="documentListUnderAccountDialogVisible">
                <div>
                    <el-radio-group v-model="radioGroup">
                        <div v-for="document in documentListUnderAccount">
                            <el-radio  :label="document.documentId" border
                                       :key="document.documentId">
                                {{document.documentNewName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="documentListUnderAccountDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmLinkDocument(radioGroup)">确 定</el-button>
                </div>
            </el-dialog>
            <!--显示其他文件的弹窗-->
            <el-dialog title="其他文件" :visible.sync="relatedDocumentListDialogVisible">
                <el-table :data="relatedDocumentList">
                    <el-table-column property="documentId" label="文档Id" width="150"></el-table-column>
                    <el-table-column property="documentNewName" label="文档名称" width="200"></el-table-column>
                    <el-table-column align="right">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="downloadDocument(scope.$index, scope.row)">下载</el-button>
                            <el-button size="mini" type="danger" @click="deleteDocumentLink(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import cookie from "js-cookie";
    import AliPlayer from "../../components/aliplayer/AliPlayer";
    import DescriptionDialog from "../../components/dialog/DescriptionDialog";
    import draggable from "vuedraggable";
    import DescriptionAddDialog from "../../components/dialog/DescriptionAddDialog";
    export default {
        name: "KnowledgeListNode",
        components: {
            DescriptionAddDialog,
            draggable,
            AliPlayer,
            DescriptionDialog
        },
        created() {
            const java_course_token=cookie.get('java_course_token')
            const _this=this
            axios.get('user/getUserInfo',
                {headers: {'token': java_course_token}}).then(response => {
                    _this.accountId=response.data.data.userId
            })
        },
        props:{
            knowledgeList:{
                type:Array
            },
            isOneself: {
                type:Boolean
            },
            subsectionId:null,
            draggable:false
        },
        data(){
            return {
                accountId:'',
                radioGroup:'',
                dKnowledgeList:this.knowledgeList,
                /**
                 * 前后置
                 */
                postKnowledgeList:[],//后置知识点列表
                postKnowledgeListDialogVisible:false,//是否显示后置知识点列表
                preKnowledgeList:[],//前置知识点列表
                preKnowledgeListDialogVisible:false,//是否显示前置知识点列表
                knowledgeListInCourse:[],//课程下的所有知识点列表
                knowledgeListInCourseDialogVisible:false,//是否显示课程下的所有知识点列表
                preKnowledgeId:null,//用户选择的前置知识点Id
                preKnowledgeLink:{//关联前置知识点时提交的对象
                    postKnowledgeId:null,
                    preKnowledgeId:null
                },
                /**
                 * 知识点描述
                 */
                knowledgeName:{//知识点名称对象
                    knowledgeId:null,
                    knowledgeName:null
                },
                knowledgeDescription:{ //知识点描述对象
                    knowledgeId:null,
                    knowledgeDescription:null
                },
                knowledgeDescriptionDialogVisible:false,//是否展示知识点描述
                /**
                 * Office文件关联
                 */
                officeFileListUnderAccount:[],//用户拥有的所有Office文件列表
                officeFileListUnderAccountDialogVisible:false,////是否显示用户拥有的所有Office文件列表
                officeFileId:null,//用户选择的OfficeFileId
                officeFileLink:{//添加、删除Office文件关联时提交的对象
                    knowledgeId:null,
                    officeFileId:null,
                },
                relatedOfficeFileList:[],//关联的Office文件列表
                relatedOfficeFileListDialogVisible:false,//是否显示关联的Office文件列表
                /**
                 * 视频文件关联
                 */
                videoListUnderAccount:[],//用户拥有的所有video列表
                videoListUnderAccountDialogVisible:false,////是否显示用户拥有的所有video列表
                videoId:null,//用户选择的videoId
                videoLink:{//添加、删除video关联时提交的对象
                    knowledgeId:null,
                    videoId:null,
                },
                relatedVideo:{
                    cloudVideoId:'',
                    videoPlayAuth:''
                },//关联的video
                relatedVideoDialogVisible:false,//是否显示关联的video
                /**
                 * document文件关联
                 */
                documentListUnderAccount:[],//用户拥有的所有document文件列表
                documentListUnderAccountDialogVisible:false,////是否显示用户拥有的所有document文件列表
                documentId:null,//用户选择的documentId
                documentLink:{//添加、删除document文件关联时提交的对象
                    knowledgeId:null,
                    documentId:null,
                },
                relatedDocumentList:[],//关联的document文件列表
                relatedDocumentListDialogVisible:false,//是否显示关联的document文件列表
            }
        },
        methods:{
            //删除知识点
            deleteKnowledge(knowledgeId,index) {
                const _this=this
                this.$confirm('此操作将永久删除该小节，但是不会删除资源文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete("knowledge/delete/"+knowledgeId).then(response=>{
                        if(response.data.code==20000) {
                            _this.$message({
                                type: 'success',
                                message: '知识点删除成功!'
                            });
                            _this.knowledgeList.splice(index,1)
                            _this.dKnowledgeList=_this.knowledgeList
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
            //知识点重排序
            resortKnowledgeList(subsectionId) {
                if(true) {
                    let knowledgeIdList=[];
                    for(let i=0;i<this.dKnowledgeList.length;i++){
                        knowledgeIdList.push(this.dKnowledgeList[i].knowledgeId)
                    }
                    let knowledgeList=knowledgeIdList.join(";")
                    knowledgeList+=";"
                    let knowledgeInSubsection={subsectionId:subsectionId,knowledgeList:knowledgeList};
                    const _this=this
                    axios.post("knowledge-in-subsection/update",knowledgeInSubsection).then(response=>{
                        if(response.data.code==20000) {
                            _this.$message({
                                message: '知识点顺序调整成功',
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
            //显示后置知识点列表
            showPostKnowledgeList(knowledgeId){
                const _this=this;
                axios.get("knowledge-to-knowledge/getPostKnowledgeList/" + knowledgeId).then(response=> {
                    _this.postKnowledgeList=response.data.data.postKnowledgeList;
                    _this.postKnowledgeListDialogVisible=true
                });
            },
            //显示前置知识点列表
            showPreKnowledgeList(knowledgeId){
                const _this=this;
                axios.get("knowledge-to-knowledge/getPreKnowledgeList/" + knowledgeId).then(response=> {
                    _this.preKnowledgeList=response.data.data.preKnowledgeList;
                    _this.preKnowledgeListDialogVisible=true
                });
            },
            //添加前置知识点
            addPreKnowledge(knowledgeId) {
                const _this=this;
                axios.get('knowledge/getByCourseId/'+this.$route.params.id).then(response=> {
                    if(response.data.code==20000) {
                        _this.knowledgeListInCourse=response.data.data.knowledgeListInCourse
                        _this.knowledgeListInCourseDialogVisible=true
                        _this.preKnowledgeLink.postKnowledgeId=knowledgeId
                    }else {
                        return _this.$message.error('未知错误，请稍后')
                    }
                });
            },
            //确定关联某个前置知识点
            confirmAddPreKnowledge(preKnowledgeId) {
                this.preKnowledgeLink.preKnowledgeId=preKnowledgeId;
                const _this=this;
                axios.post('knowledge-to-knowledge/addPreKnowledge',this.preKnowledgeLink).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message.success('知识点关联成功');
                        _this.knowledgeListInCourseDialogVisible=false;
                    }else {
                        return _this.$message.error('知识点关联失败，请重试');
                    }
                })
            },
            //显示知识点描述
            showKnowledgeDescription(knowledgeId) {
                const _this=this
                axios.get("knowledge/getById/"+knowledgeId).then(response=>{
                    let knowledge=response.data.data.knowledge
                    _this.knowledgeName.knowledgeId=knowledge.knowledgeId
                    _this.knowledgeName.knowledgeName=knowledge.knowledgeName
                    _this.knowledgeDescription.knowledgeId=knowledge.knowledgeId
                    _this.knowledgeDescription.knowledgeDescription=knowledge.knowledgeDescription
                    _this.knowledgeDescriptionDialogVisible=true;
                })
            },
            //重命名知识点
            renameKnowledge(knowledgeName) {
                const _this=this
                this.knowledgeName.knowledgeName=knowledgeName
                axios.post("knowledge/rename",this.knowledgeName).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message({
                            message: '知识点重命名成功',
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
            //保存知识点描述
            saveKnowledgeDescription(knowledgeDescription){
                const _this=this
                this.knowledgeDescription.knowledgeDescription=knowledgeDescription
                axios.post("knowledge/saveDescription",this.knowledgeDescription).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message({
                            message: '知识点描述保存成功',
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
            //关联Office文件
            linkOfficeFile(knowledgeId) {
                //调用后端进行验证
                const _this=this;
                axios.get('office-file/getByAccountId/'+_this.accountId).then(response=> {
                    if(response.data.code==20000) {
                        _this.officeFileListUnderAccount=response.data.data.officeFileListUnderAccount
                        _this.officeFileListUnderAccountDialogVisible=true
                        _this.officeFileLink.knowledgeId=knowledgeId
                    }else {
                        return _this.$message.error('知识点添加失败，请重新检查一遍');
                    }
                });
            },
            //确认关联Office文件
            confirmLinkOfficeFile(officeFileId) {
                this.officeFileLink.officeFileId=officeFileId;
                //调用后端进行验证
                const _this=this;
                axios.post('knowledge-to-office-file/insert',_this.officeFileLink).then(response=> {
                    if(response.data.code==20000) {
                        _this.$message.success('Office文件关联成功');
                        _this.officeFileListUnderAccountDialogVisible=false
                    }else {
                        return _this.$message.error('Office文件关联失败，请重新检查一遍');
                    }
                });
            },
            //显示关联文件
            showRelatedOfficeFileList(knowledgeId) {
                const _this=this;
                axios.get("knowledge-to-office-file/getByKnowledgeId/" + knowledgeId).then(response=> {
                    _this.relatedOfficeFileList=response.data.data.relatedOfficeFileList;
                    _this.relatedOfficeFileListDialogVisible=true
                    _this.officeFileLink.knowledgeId=knowledgeId
                });

            },
            viewOfficeFile(index,row) {
                window.open('https://view.officeapps.live.com/op/view.aspx?src='+row.officeFileAddress,'_blank');
            },
            downloadOfficeFile(index,row) {
                const link = document.createElement('a') // 创建a标签
                link.download = row.officeFileNewName // a标签添加属性
                link.style.display = 'none'
                link.href = row.officeFileAddress
                document.body.appendChild(link)
                link.click() // 执行下载
                URL.revokeObjectURL(link.href) // 释放url
                document.body.removeChild(link) // 释放标签
            },
            deleteOfficeFileLink(index,row){
                this.officeFileLink.officeFileId=row.officeFileId
                const _this=this;
                axios.post("knowledge-to-office-file/delete",this.officeFileLink).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message.success('Office文件关联删除成功');
                        _this.relatedOfficeFileList.splice(index,1)
                    }else {
                        return _this.$message.error('Office文件关联删除失败，请重新检查一遍');
                    }
                })
            },
            //视频文件
            linkVideo(knowledgeId) {
                const _this=this;
                //调用后端进行验证
                axios.get('video/getByAccountId/'+_this.accountId).then(response=> {
                    if(response.data.code==20000) {
                        _this.videoListUnderAccount=response.data.data.videoListUnderAccount
                        _this.videoListUnderAccountDialogVisible=true
                        _this.videoLink.knowledgeId=knowledgeId
                    }else {
                        return _this.$message.error('知识点添加失败，请重新检查一遍');
                    }
                });
            },
            confirmLinkVideo(videoId) {
                this.videoLink.videoId=videoId;
                const _this=this;
                //调用后端进行验证
                axios.post('knowledge-to-video/insert',_this.videoLink).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message.success('视频添加成功');
                        this.videoListUnderAccountDialogVisible=false
                    }else {
                        return _this.$message.error('视频添加失败，请重新检查一遍');
                    }
                });
            },
            viewVideo(knowledgeId) {
                const _this=this
                axios.get("video/getByKnowledgeId/" + knowledgeId).then(response=> {
                    if(response.data.data.relatedVideo==null) {
                        _this.$message({
                            message: '对不起，改知识点尚未关联视频',
                            type: 'warning'
                        });
                    }else {
                        _this.relatedVideo.cloudVideoId=response.data.data.relatedVideo.cloudVideoId
                        axios.get("video/getPlayAuth/"+_this.relatedVideo.cloudVideoId).then(response=> {
                            if(response.data.code==20000) {
                                _this.relatedVideo.videoPlayAuth=response.data.data.playAuth
                                _this.relatedVideoDialogVisible=true
                            }else {
                                _this.$message({
                                    message: '对不起，数据库中没有改视频',
                                    type: 'warning',
                                    center:true
                                });
                            }
                        });
                    }
                });
            },
            deleteVideoLink(){},
            //其他文件
            linkDocument(knowledgeId) {
                const _this=this;
                //调用后端进行验证
                axios.get('document/getByAccountId/'+_this.accountId).then(response=> {
                    if(response.data.code==20000) {
                        _this.documentListUnderAccount=response.data.data.documentListUnderAccount
                        _this.documentListUnderAccountDialogVisible=true
                        _this.documentLink.knowledgeId=knowledgeId
                    }else {
                        return _this.$message.error('文件添加失败，请重新检查一遍');
                    }
                });
            },
            confirmLinkDocument(documentId) {
                this.documentLink.documentId=documentId;
                const _this=this;
                //调用后端进行验证
                axios.post('knowledge-to-document/insert',_this.documentLink).then(response=> {
                    if(response.data.code==20000) {
                        _this.$message.success('文件添加成功');
                        _this.documentListUnderAccountDialogVisible=false
                    }else {
                        return _this.$message.error('文件添加失败，请重新检查一遍');
                    }
                });
            },
            showRelatedDocumentList(knowledgeId) {
                const _this=this;
                axios.get("knowledge-to-document/getByKnowledgeId/" + knowledgeId).then(response=> {
                    _this.relatedDocumentList=response.data.data.relatedDocumentList;
                    _this.relatedDocumentListDialogVisible=true
                    _this.documentLink.knowledgeId=knowledgeId
                });
            },
            downloadDocument(index,row) {
                const link = document.createElement('a') // 创建a标签
                link.download = row.documentNewName // a标签添加属性
                link.style.display = 'none'
                link.href = row.documentAddress
                document.body.appendChild(link)
                link.click() // 执行下载
                URL.revokeObjectURL(link.href) // 释放url
                document.body.removeChild(link) // 释放标签
            },
            deleteDocumentLink(index,row){
                this.documentLink.documentId=row.documentId
                const _this=this;
                //调用后端进行验证
                axios.post("knowledge-to-document/delete",this.documentLink).then(response=>{
                    if(response.data.code==20000) {
                        _this.$message.success('文件关联删除成功');
                        _this.relatedDocumentList.splice(index,1)
                    }else {
                        return _this.$message.error('文件关联删除失败，请重新检查一遍');
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
