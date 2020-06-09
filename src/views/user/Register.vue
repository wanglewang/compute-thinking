<template>
    <div class="register_container">
        <div class="register_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../../assets/logo.png">
            </div>
            <!--注册表单区域-->
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form">
                <el-form-item prop="nickname">
                    <el-input v-model="registerForm.nickname"auto-complete="off" placeholder="请输入昵称" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="registerForm.email"auto-complete="off" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
                </el-form-item>
                <el-form-item prop="verificationCode" class="code">
                    <div >
                        <div style="float: left">
                            <el-input  v-model="registerForm.verificationCode" placeholder="验证码" ></el-input>
                        </div>
                        <div style="float: right">
                            <el-button type="primary" :disabled='isDisabled' @click="sendCode" >{{buttonText}}</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="registerForm.pwd" auto-complete="off" placeholder="输入密码" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item prop="rePwd">
                    <el-input type="password" v-model="registerForm.rePwd" auto-complete="off" placeholder="确认密码" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register" style="width:100%;">注册</el-button>
                    <p class="login" @click="gotoLogin">已有账号？立即登录</p>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Register.vue",
        data() {
            // <!--验证手机号是否合法-->
            let checkEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入邮箱账号'))
                } else if (!this.checkEmail(value)) {
                    callback(new Error('邮箱账号不合法'))
                } else {
                    callback()
                }
            }
            //  <!--验证码是否为空-->
            let checkVerificationCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入邮箱验证码'))
                } else {
                    callback()
                }
            }
            // <!--验证密码-->
            let validatePwd = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"))
                } else {
                    if (this.registerForm.rePwd !== "") {
                        // this.$refs.registerForm.validateField("rePwd");
                    }
                    callback()
                }
            }
            // <!--二次验证密码-->
            let validateRePwd = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.registerForm.pwd) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                registerForm: {
                    nickname:'',
                    email: "",
                    verificationCode: "",
                    pwd: "",
                    rePwd: ""
                },
                registerFormRef:{

                },
                registerFormRules: {
                    email: [{ validator: checkEmail, trigger: 'change' }],
                    verificationCode: [{ validator: checkVerificationCode, trigger: 'change' }],
                    pwd: [{ validator: validatePwd, trigger: 'change' }],
                    rePwd: [{ validator: validateRePwd, trigger: 'change' }]
                },
                buttonText: '发送验证码',
                isDisabled: false, // 是否禁止点击发送验证码按钮
                flag: true
            }
        },
        methods: {
            // <!--发送验证码-->
            sendCode () {
                let email = this.registerForm.email
                const _this=this
                if (this.checkEmail(email)) {
                    axios.get('/user/sendVerificationCode/'+email).then(response=> {
                        if(response.data.code==20000) {
                            _this.$message.success("邮件发送成功");
                        }else {
                            _this.$message.error("服务器出现问题，请联系客服或等待修复");
                        }
                    })
                    let time = 2
                    this.buttonText = '已发送'
                    this.isDisabled = true
                    if (this.flag) {
                        this.flag = false;
                        let timer = setInterval(() => {
                            time--;
                            this.buttonText = time + ' 秒'
                            if (time === 0) {
                                clearInterval(timer);
                                this.buttonText = '重新获取'
                                this.isDisabled = false
                                this.flag = true;
                            }
                        }, 1000)
                    }
                }else {
                    this.$message.error('邮箱格式不正确');
                }
            },
            // <!--提交注册-->
            register(){
                const _this=this
                this.$refs.registerFormRef.validate(valid=>{
                    if(!valid)
                        return;
                    axios.post("/user/register",this.registerForm).then(response=> {
                        console.log(11111)
                        console.log(response.data)
                        if(response.data.code==20000) {
                            _this.$message.success("注册成功，请登录");
                            _this.$router.push("/login");
                        }else {
                            _this.$message.error(response.data.message);
                        }
                    });
                });
            },
            // <!--进入登录页-->
            gotoLogin() {
                this.$router.push({
                    path: "/login"
                });
            },
            // 验证邮箱号
            checkEmail(email) {
                let re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (re.test(email)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .register_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .register_box {
        width: 450px;
        height: 556px;
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
    .register_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .code {
        button{
            margin-left: 20px;
            width: 140px;
            text-align: center;
        }
    }
</style>
