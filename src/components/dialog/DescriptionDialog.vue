<template>
    <!--显示描述的弹窗-->
    <el-dialog :title="title" :visible="true" :show-close="false">
        <div style="margin-bottom: 10px">
            <el-col :span="18" class="text-center" style="margin-right: 10px">
                <el-input v-model="dNodeName" :disabled="!isOneself"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
                <el-button :disabled="!isOneself" @click="rename" v-if="isOneself">重命名</el-button>
            </el-col>
            <div style="text-align:right">
                <el-button type="danger" circle icon="el-icon-close" @click="setVisible"></el-button>
            </div>
        </div>
        <div>
            <mavon-editor style="height: 480px;width: 100%"
                          v-model="dNodeDescription"
                          :ishljs="true"
                          :scrollStyle="true"
                          :subfield="isOneself"
                          defaultOpen="preview"
                          :toolbarsFlag="isOneself"
                          :editable="isOneself"
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
        },
        data(){
            return{
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
