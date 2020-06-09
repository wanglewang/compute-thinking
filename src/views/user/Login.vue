<template>
    <div class="login_container" style="background-color: aquamarine">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../../assets/logo.png">
            </div>
            <!--登录表单区域-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="email">
                    <el-input v-model="loginForm.email"placeholder="请输入邮箱" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="info">帮助</el-button>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="primary" @click="register">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import cookie from 'js-cookie'
    export default {
        name: "Login.vue",
        data() {
            return{
                //登录表单的数据绑定对象
                loginForm:{
                    email:'1478547870@qq.com',
                    password:'12345678'
                },
                loginFormRef:{

                },
                //表单的验证规则对象
                loginFormRules:{
                    //验证邮箱
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    //验证密码
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ]
                }
            }

        },
        methods: {
            login() {
                const _this=this;
                this.$refs.loginFormRef.validate((valid)=>{
                    if(valid) {//表单预验证成功
                        //调用后端进行验证
                        axios.post('user/login',_this.loginForm).then(response=> {
                            console.log(response.data)
                            if(response.data.code==20000) {
                                cookie.set('java_course_token', response.data.data.token)
                                _this.$message.success('登录成功');
                                _this.$router.push('/');
                            }else {
                                return _this.$message.error('登录失败，请检查邮箱和密码');
                            }
                        });
                    }
                });
            },
            register() {
                this.$router.push('register');
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #25ffbe;
        height: 100%;
    }
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            width:130px;
            height: 130px;
            border: 1px solid #eeeeee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #dddddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-30%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eeeeee;
            }
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
