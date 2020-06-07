<template>
    <!--显示描述的弹窗-->
    <el-dialog :title="title" :visible="true" :show-close="false">
        <el-form :model="dNodeCreate">
            <el-form-item :label="pLabelNodeName">
                <el-input v-model="dNodeCreate.dNodeName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="pLabelNodeDescription">
                <el-input v-model="dNodeCreate.dNodeDescription" type="textarea" :rows="3" placeholder="请输入内容">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setVisible">取 消</el-button>
            <el-button type="primary" @click="createNode">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "DescriptionAddDialog",
        props:{
            title:{
                type:String
            },
            pLabelNodeName:{
                type:String
            },
            pNodeName:{
                type:String
            },
            pLabelNodeDescription:{
                type:String
            },
            pNodeDescription:{
                type:String
            }
        },
        data(){
            return{
                dNodeCreate:{
                    dNodeName:this.pNodeName,
                    dNodeDescription:this.pNodeDescription,
                }
            }
        },
        methods:{
            createNode() {
                this.$emit("createNode",this.dNodeCreate)
            },
            setVisible() {
                this.$emit("invisible")
            }
        }

    }
</script>

<style scoped>

</style>
