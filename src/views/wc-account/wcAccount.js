/**
 * Created by Micheal Xiao on 2017/7/26.
 */

import moment from 'moment'

import dataTable from './components/table/table.vue'
import store from 'store'

import {GetList, DeleteAccount, CreateAccount, ModifyAccount, AvatarUpload, GetOrganizationName, GetSelection,GetSelectionById,GetAllSelection} from './api/wcAccountApi'
import editor from './components/editor.vue';


//组件级变量
let selectionData = []

export default {
    created(){
        this.getList(this.pageParam);
        GetAllSelection()
            .then((response)=>{
                this.dbListInSearchBox = response.data
                console.log(this.dbListInSearchBox)
            })
    },
    data() {
        const validateChinese = (rule, value, callback) => {
            if (/[\u4E00-\u9FA5]/i.test(value)) {
                callback(new Error('请不要输入中文'));
            }  else {
                callback();
            }
        };
        return {
            //对话框数据
            textMap: {
                update: '编辑',
                create: '创建'
            },

            radio: '',

            pageParam: pageParamInit(),
            isEditStatus:false,
            selectionList:[],
            dbListInSearchBox:[],
            dialogStatus: 'create',
            dialogFormVisible: false,
            searchFormVisible:false,
            imageUrl: '',
            fullPath: '',
            searchVal: {
                inputRes: '',
                activityType: '全部'
            },
            temp: tempInit(),
            //日期选择限制
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            organizationName: "请选择组织机构",
            totalPage: 10,
            formData: [
                // {name:'联蔚公众号',account:'112233',organizationId:'联蔚科技',headImgUrl:'123.img',appId:'001'},
                // {name:'欧唯特公众号',account:'223344',organizationId:'欧唯特',headImgUrl:'321.img',appId:'002'},
            ],

            // activityType: ''
            rules: {
                account: [
                    {required: true, message: '请输入公众号账号'},
                    {validator: validateChinese},
                    {max: 50, message: '最多输入50个字符'}
                ],
                name: [
                    {required: true, message: '请输入公众号名称'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                imageUrl: [
                    {max: 200, message: '地址长度不可超过200'}
                ],
                appId: [
                    {required: true, message: '请输入应用编号'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                appSecret: [
                    {required: true, message: '应用秘钥'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                appToken: [
                    {required: true, message: '请输入应用令牌'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                aesKey: [
                    {required: true, message: '请输入消息内容解密Key'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                organizationId: [
                    {required: true, message: '请选择组织机构'}
                ],

            },
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            baseUrl: process.env.MATERIAL_API

        }
    },
    components: {
        dataTable,
        editor
    },
    methods: {
        create(temp){
            this.$refs[temp].validate((valid) => {
                if (valid) {
                    CreateAccount(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam)
                            this.$refs[temp].resetFields();
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        update(temp){

            this.$refs[temp].validate((valid) => {
                if (valid) {

                    // this.temp.beginDate = moment(this.temp.beginDate).format("YYYY-MM-DD")
                    // this.temp.headImgUrl = this.fullPath;
                    console.log(this.temp)
                    ModifyAccount(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false
                            this.getList(this.pageParam)
                            this.$refs[temp].resetFields();
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        cancel(temp){
            this.$refs[temp].resetFields();
            this.dialogFormVisible = false
        },
        getList(pageParam) {
            GetList(pageParam).then((response) => {
                this.totalPage = response.headers['x-total-count']
                this.formData = response.data
            })
        },
        onSubmit() {
            console.log('submit!');
        },
        onAdd() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true;
            this.temp = tempInit()
            this.imageUrl = ''
            this.organizationName = "请选择组织机构"
            this.tempOrg = this.temp.organizationId
            this.getSelection()
        },
        onDel() {
            if (selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return
            }

            this.ConfirmBox("是否确认删除")
                .then(()=>{
                    Promise.all(selectionData.map(function (val) {
                        return DeleteAccount(val.id)
                    })).then(() => {
                        this.getList(this.pageParam)
                    })
                })


        },
        onEdit: function () {
            if (selectionData.length > 1 || selectionData.length == 0) {
                this.$message({
                    message: "请选择一行数据",
                    type: 'error',
                })
                return
            }
            $.extend(this.temp, selectionData[0])
            this.imageUrl = this.baseUrl+selectionData[0].headImgUrl
            this.dialogStatus = 'update';
            this.getSelectionById(selectionData[0].dbInstanceId)
            this.getOrganizationName(this.temp.organizationId)
            this.dialogFormVisible = true;
        },
        getOrganizationName(id){
            GetOrganizationName(id)
                .then((response) => {
                    this.organizationName = response.data.name
                })
        },
        onSearch: function () {
            this.searchFormVisible = true;
            // this.pageParam = pageParamInit()
            this.pageParam.account = ''
            // this.organizationName = "请选择组织机构"
        },
        resetSearchBox(){
            this.$refs['searchForm'].resetFields();
            this.organizationName = '请选择组织机构'
            this.pageParam = pageParamInit()
        },

        search: function () {
            this.getList(this.pageParam);
            this.$refs.pages.changePage(1)
            this.searchFormVisible = false;
        },

        handleCurrentChange(page){
            // console.log("page")
            // console.log(page)
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection){
            selectionData = selection
        },
        resetForm(){
            this.$refs['temp'].resetFields();
            this.temp = tempInit()
        },
        //head-img upload
        avatarUpload(file) {
            let flag = true;
            const isJepg = file.type === 'image/jpeg';
            const isJpg = file.type === 'image/jpg';
            const isPng = file.type === 'image/png';
            const isBmp = file.type === 'image/bmp';
            const isGif = file.type === 'image/gif';
            if (!isJepg && !isJpg && !isPng && !isBmp && !isGif) {
                this.$message(
                    {
                        message: '图片类型必须是gif,jpeg,jpg,png,bmp中的一种',
                        type:'error'

                    }
                );
                flag = false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message({
                    message: '上传头像图片大小不能超过 2MB!',
                    type: 'error'
                });
            }
            return flag && isLt2M;
        },

        getSelection() {
            GetSelection()
                .then((response) => {
                    this.selectionList = response.data
                })
        },
        getSelectionById(id){
            GetSelectionById(id)
                .then((response) => {
                    console.log(response)
                    this.selectionList.push(response.data)
                })
        },
        getOrganization(key,name){
            this.temp.organizationId = key;
            this.organizationName = name;
        },
        getSearchOrganization(key,name){
            this.pageParam.organizationId = key;
            this.organizationName = name;
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = this.baseUrl + res;
            this.temp.imageUrl = res
            this.temp.headImgUrl = res
        },
    }
}

function tempInit() {
    return {
        beginDate: "",
        creator: "",
        description: "",
        name: "",
        type: "",
        account: "",
        organizationId: "",
        dbInstanceId:'',
        appId:'',
        appSecret:'',
        appToken: '',
        aesKey:'',
        oAuthServerDomainName:''
    }
}
function pageParamInit() {
    return {
        page: 1,
        size: 10,
        account: '',
        dbInstanceId:null
    }
}
