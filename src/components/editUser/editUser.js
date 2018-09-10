/**
 * Created by zyk on 2017/9/13.
 */
import moment from 'moment'
import permission from 'store/permission'
import {parseTime} from 'utils'
import {isWscnEmail, ValidateEmail, ValidatePass} from 'utils/validate';
import {EditorUser, GetUsers, getCurrentInfo} from "./api/editUserApi";
import store from '../../store';

export default {
    created() {
        this.getUser();
    },
    data() {
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.temp.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        const validateOldPass = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('原密码长度不得少于6个字符'));
            } else {
                callback();
            }
        };
        return {
            //初始化
            onXHR: false,
            temp: tempInit(null),
            userRules: {
                /*realName: [
                    {required: true, message: '请输入真实姓名', trigger: 'blur'}
                ],
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                email: [
                    {validator: ValidateEmail, trigger: 'blur'}
                ],*/
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {validator: ValidatePass, trigger: 'blur'}
                ],
                password2: [
                    {required: true, message: '请重复输入密码', trigger: 'blur'},
                    {validator: validatePass2, trigger: 'blur'}
                ],
                originalPassword: [
                    {required: true, message: '请输入原密码', trigger: 'blur'},
                    {validator: validateOldPass, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        hasAuthority: permission.hasAuthority,
        getUser() {
            // "use strict";
            let c_token;
            if (store.getters.token) {
                c_token = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            }
            getCurrentInfo(c_token)
                .then((res) => {
                    if (res && res.data && res.data.data) {
                        // this.temp = $.extend(tempInit(), res.data.data);
                        this.temp = tempInit(res.data.data);
                    }
                    this.temp.password = "";
                    this.temp.password2 = "";
                    this.temp.originalPassword = "";
                });
        },
        resetForm() {
            this.$store.state.user.showUserDialog = false;
            this.$refs['userForm'].resetFields();
            this.getUser();
        },
        update(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.temp.mobile = this.temp.phone;
                    let putData = $.extend({}, this.temp, {
                        password: this.temp.password,
                        originalPassword: this.temp.originalPassword
                    });
                    EditorUser(putData).then((result) => {
                        // this.$store.state.user.showUserDialog=false;
                        // this.getUser();
                        if (result && result.code === 1) {
                            this.$message({
                                type: "success",
                                message: "编辑成功，即将自动刷新页面",
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            });

                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }/* else {
                            this.$message({
                                type: "error",
                                message: "信息输入有误，请重新输入",
                                customClass: 'msg-error',
                                iconClass: 'ic'
                            });
                        }*/
                    });
                } else {
                    return false;
                }
            });
        },
        handleCancel() {
            this.$store.state.user.showUserDialog = false;
            this.$refs['userForm'].resetFields();
            this.getUser();
        }
    }
}

function tempInit(data) {
    if (data) {
        return {
            "id": data.id,
            "password": "",
            "userName": data.userName,
            "email": data.email,
            "phone": data.phone,
            "realName": data.realName
        };
    }
    return {
        "id": "",
        "password": "",
        "userName": "",
        "email": "",
        "phone": "",
        // "bewrite": "",
        "realName": "",
        "mobile": ""
    };
}
