<template>
    <!--显示描述的弹窗-->
    <el-dialog :title="title" :visible="true" :show-close="false" v-dialogDrag>
        <div style="margin-bottom: 10px">
            <el-col :span="18" class="text-center" style="margin-right: 10px">
                <el-input v-model="dNodeName" :disabled="!(isOneself&&editable)"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
                <el-button @click="rename" v-if="isOneself&&editable">重命名</el-button>
            </el-col>
            <div style="text-align:right">
                <el-button type="danger" circle icon="el-icon-close" @click="setVisible"></el-button>
            </div>
        </div>
        <div style="height: 404px;width: 100%">
            <mavon-editor style="height: 100%;width: 100%"
                          v-model="dNodeDescription"
                          :ishljs="true"
                          :scrollStyle="true"
                          :subfield="isOneself&&editable"
                          defaultOpen="preview"
                          :toolbars="(isOneself&&editable)?toolbarsIsOneself:toolbarsNotOneself"
                          :editable="isOneself&&editable"
                          @save="saveDescription">
            </mavon-editor>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "DescriptionDialog",
        props:{
            title:{
                type:String
            },
            pNodeName:{
                type:String
            },
            pNodeDescription:{
                type:String
            },
            isOneself:{
                type:Boolean,
                default:false
            },
            editable:{
                type:Boolean,
                default:true
            }
        },
        data(){
        // :toolbarsFlag="isOneself&&editable"
            return{
                toolbarsIsOneself:{
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                },
                toolbarsNotOneself:{
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    navigation: true, // 导航目录
                },
                dNodeName:this.pNodeName,
                dNodeDescription:this.pNodeDescription,
            }
        },
        methods:{
            rename() {
                this.$emit("rename",this.dNodeName)
            },
            saveDescription() {
                this.$emit("saveDescription",this.dNodeDescription)
            },
            setVisible() {
                this.$emit("invisible")
            }
        }
    }
</script>

<style scoped>

</style>
