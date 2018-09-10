/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import moment from 'moment'
import {DeleteUsers} from 'api/getUserList'
import permission from 'store/permission'
import {parseTime} from 'utils'
import {isWscnEmail, ValidateEmail, ValidatePass} from 'utils/validate';
import {GetRolesList} from 'api/roles'
import { GetUserList, CreateUser, EditorUser, DeleteUser, GetUsers, GetOrganizationName,ResetPassword,UnlockUser,ExportAll} from "./api/userManageApi";
import trRoles from './components/trRoles'
import {DeleteFile} from "../userlabel-manage/api/userlabelManageApi";
import {Message} from 'element-ui';

//每页显示的记录数

let selectionData = []

export default{
    created(){
        this.getUserList(this.pageParam);
//            this.getList(pageParam);
    },
    data(){
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
            }  else {
                callback();
            }
        };
        return {
            //初始化
            userCheckList:[],
            tableData: [],
            totalPage: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible:false,
            onXHR:false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers:false,
            temp: tempInit(),
            // rolesStr:'',
            uaaList:[],
            userRules: {
                realname: [
                    {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    {max: 50, message: '真实姓名不得超过50个字符'}
                ],
                login: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {max: 50, message: '用户名不得超过50个字符'}
                ],
                email: [
                    {validator: ValidateEmail, trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {max: 30, message: '密码不得超过30个字符'},
                    {validator: ValidatePass, trigger: 'blur'}
                ],
                password2:[
                    {required: true, message: '请重复输入密码', trigger: 'blur'},
                    {max: 30, message: '密码不得Password超过30个字符'},
                    { validator: validatePass2, trigger: 'blur' }
                ],
                oldPassword:[
                    {required: true, message: '请入原密码', trigger: 'blur'},
                    { validator: validateOldPass, trigger: 'blur' }
                ],
                rolesStr:[
                    {required: true, message: '请选择角色', trigger: 'blur'},
                    // { validator: validatePass2, trigger: 'blur' }
                ],
                organizationid: [
                    {required: true, message: '请选择组织机构'}
                ],
            },
            pageParam : pageParamInit(),
            organizationName: '请选择组织机构',
            upLoadApi:process.env.UPLOAD_API + '/uaa/api/user/upload/excel',
            uploadFileFlag : false,
            formVisible : false,
            errorTip:"",
            errorLine:5
        }
    },
    components: {
        trRoles
    },
    methods: {
        hasAuthority: permission.hasAuthority,

        //  显示用户信息
        getUserList(pageParam){
            GetUserList(pageParam)
                .then((response) => {
                    this.totalPage = response.headers['x-total-count']
                    this.tableData = response.data
                })
        },
        //翻页功能
        handleCurrentChange1(page){
            this.pageParam.page = page;
            this.getUserList(this.pageParam)
        },
        handleSelectionChange(selection){
            this.selectionData = selection
        },
        onAdd(){
            this.temp = tempInit()
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            this.organizationName = "请选择组织机构"
        },
        onEdit(row){
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            this.temp = $.extend(tempInit(), row)
            this.temp.password = "••••••"
            this.temp.password2 = "••••••"
            this.temp.oldPassword = "••••••";

            this.getOrganizationName(this.temp.organizationid)
            this.temp.rolesStr = []
            if(!this.temp.roles){this.temp.roles = []}
            let rolesArr = []
            this.temp.roles.forEach((v)=>{
                this.temp.rolesStr.push(v.name)
                rolesArr.push(v.id)
            })
            this.temp.roles = rolesArr;
            this.temp.rolesStr = this.temp.rolesStr.join(',');
        },
        resetForm(){
            this.$refs['userForm'].resetFields();
            this.temp = tempInit()

        },
        onSearch: function () {
            this.searchFormVisible = true;
            console.log(this)
        },
        search: function () {
            this.getUserList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        onAddUser(){
            this.dialogFormUsers = true;
            GetUsers()
                .then((res) => {
                    this.uaaList = res.data;
                    setTimeout(()=>{
                        // $('.usersManageList').find(`input[type="checkbox"]`).prop("checked",false)
                        this.temp.roles.forEach((v)=>{
                            $('.usersManageList').find(`input[name=${v}]`).prop("checked","checked")
                        })
                    },200)
                });
            
        },
        addUsers(){
            let rolesArr = [];
            let useName = [];
            let roles = []
            $('.usersManageList').find('input[type=checkbox]:checked').each((index,value) => {
                rolesArr.push($(value).attr('name'));
                useName.push($(value).attr('vname'));
            });
            this.temp.rolesStr = useName.join(',');
            this.$refs['userForm'].validate()
            this.temp.roles = rolesArr
            this.dialogFormUsers = false;
        },
        create(){
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    // delete this.temp("roleStr")
                    CreateUser(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getUserList(this.pageParam);
                        })
                } else {
                    return false;
                }
            });

        },
        update(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // delete this.temp("roleStr")
                    if(this.temp.enable){
                        this.temp.enable = 'true'
                    }else {
                        this.temp.enable = 'false'
                    }
                    EditorUser(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getUserList(this.pageParam);
                            this.temp = tempInit()
                        });
                } else {
                    return false;
                }
            });

        },
        onDelete(row){
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DeleteUser(row.id)
                        .then(()=>{
                            this.getUserList(this.pageParam);
                        })
                })

        },
        resetPassword(row){
            this.ConfirmBox('是否重置密码')
                .then(() => {
                    ResetPassword(row.login)
                        .then((result)=>{
                            if(result.status == 200){
                                this.ConfirmBox("重置后密码为： "+result.data,"密码重置结果","info",true);
                            }
                        })
                })
        },
        unLockUser(row){
            this.ConfirmBox('是否要解除用户账号锁定')
                .then(() => {
                    UnlockUser(row.login)
                        .then((result)=>{
                            this.$message({
                                message: "账号已解锁成功",
                                type: 'success'
                            })
                        })
                })
        },
        getOrganizationName(id){
            GetOrganizationName(id)
                .then((response) => {
                    this.organizationName = response.data.name
                })
        },
        handleCancel(){
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['userForm'].resetFields()
        },
        handleSsemit(){
            this.getUserList(this.pageParam);
        },
        getOrganization(key,name){
            // this.$refs['userForm'].resetFields();
            this.temp.organizationid = key
            this.organizationName = name
        },
        exportAll(){
            ExportAll(this.pageParam).then((response) => {
                console.log(response);
            });
        },
        beforeUpload(file) {
            this.uploadFileFlag = true;
            this.errorTip = "";
            this.errorLine = 5;
            let fileNameArray = file.name.split(".");
            const isXlsORXlsx = fileNameArray.length < 2 ||
                (fileNameArray[fileNameArray.length-1].toUpperCase() != "XLS"
                    && fileNameArray[fileNameArray.length-1].toUpperCase() != "XLSX");
            const isLt5M = file.size / 1024 / 1024 <= 5;
            let tip = "";
            if (!isLt5M || isXlsORXlsx) {
                if(!isLt5M){
                    tip = "上传文件大小不能超过 5MB!";
                }else{
                    tip = "上传文件类型错误！";
                }
                this.$message({
                    message: tip,
                    type: 'error'
                })
                this.uploadFileFlag = false;
                return false;
            }
            let formData = new FormData();
            formData.append("file", file,encodeURI(file.name));
            return true;
        },
        handleSuccess(res, file,fileList){
            this.uploadFileFlag = false;
            if(res){
                this.errorTip = res;
                this.errorLine = res.split("\r\n").length+4;
                this.formVisible = true;
            } else {
                this.getUserList(this.pageParam);
                this.$message({
                    message: "导入成功",
                    type: 'success'
                })
            }

        },
        closeForm(){
            this.formVisible = false;
        },
        handleError(res, file,fileList){
            this.uploadFileFlag = false;
            this.$message({
                message: "导入失败",
                type: 'error'
            })
        }

    }
}

function tempInit() {
    return {
        "password": "",
        "login": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "phone": "",
        "imageUrl": "http://placehold.it/50x50",
        "status": "ACTIVATED",
        "langKey": "en",
        "bewrite": "",
        "realname": "",
        "organizationid": "",
        "roleId": '',
        "roles":[],
        "rolesStr":"",
        "isEnable": true
    }
}
function pageParamInit() {
    return {
        page: 1,
        size: 10,
        userName:'',
        realName:'',
        email:'',
        phone:'',
        isEnable:true
    }
}