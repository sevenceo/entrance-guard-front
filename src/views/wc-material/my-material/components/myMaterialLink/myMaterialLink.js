/**
 * Created by zhaimaojin on 2017/9/21.
 */
import router from "src/router"
import {
    GetExternalLinksList,
    DeleteExternalLinks,
    ShareExternalLink,
    CreateExternalLinks,
    UpdateExternalLinks,
    AvatarUpload
} from "src/views/wc-material/my-material/api/myMaterialApi";
import store from 'store'
import { validateURL } from "utils/validate"



export default {

    created() {
        this.getDataList()
    },
    data() {
        return {
            searchFormVisible: false,
            account: '',
            pageParam: pageParamInit(this.$store.state.weChatAccount.accountInfo.account),
            dataList: [],
            checkedIds: [],
            checked: false,
            totalPage: 10,
            checkAll: false,
            shareID: [],
            shareData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            scopeTypeOptions: [
                {
                    scopeValue: 'DIRECT',
                    label: '直接跳转    '
                },
                {
                    scopeValue: 'BASIC_AUTH',
                    label: '基本授权'
                },
                {
                    scopeValue: 'ID_AUTH',
                    label: '身份授权'
                }
            ],
            scopeValue: 'DIRECT',
            temp: tempLinkInit(),
            dialogFormVisible: false,
            picUrl: '',
            imageUrl: process.env.MATERIAL_API,
            checkboxStatus: [],
            disSharedData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: false
            },
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            rules: {
                name: [
                    {required: true, message: '请输入素材名称', trigger: 'blur'},
                    {max: 200, message: '长度不可超过200', trigger: 'blur'}
                ],
                title: [
                    {required: true, message: '请输入素材标题', trigger: 'blur'},
                    {max: 200, message: '长度不可超过200', trigger: 'blur'}
                ],
                description: [
                    {required: true, message: '请输入描述', trigger: 'blur'},
                    {max: 1000, message: '长度不可超过1000', trigger: 'blur'}
                ],
                scopeType: [
                    {required: true, message: '请选择网页授权', trigger: 'blur'},
                ],
                picUrl: [
                    {required: true, message: '请选择图片', trigger: 'blur'},
                ],
                url: [
                    {required: true, message: '请输入外链地址', trigger: 'blur'},
                    {max: 1000, message: '长度不可超过1000', trigger: 'blur'},
                    {validator: validateURL,trigger: 'blur'}
                ]
            },
            selectedModeRadio: '',
            selectedMode: '',
        }
    },
    methods: {
        getDataList() {
            GetExternalLinksList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList)
                $('.icon-wrapper .material-share use').attr('xlink:href','#icon-share')
                $('.icon-wrapper .material-edit use').attr('xlink:href','#icon-edit1')
                $('.icon-wrapper .material-delete use').attr('xlink:href','#icon-delete1')
            })
        },
        onEdit(item) {
            this.dialogFormVisible = true;
            $.extend(this.temp, item)
            this.picUrl = this.imageUrl + this.temp.picUrl
        },
        selectAll: function () {
            console.log(123)
            if (this.checkAll) {
                for (var i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].shared) {
                        this.checkboxStatus.push(this.dataList[i].id)
                    }
                    // console.log(this.disSharedId)
                }
            } else {
                for (var i = 0; i < this.dataList.length; i++) {
                    this.checkboxStatus = []
                }
            }
            console.log(this.checkboxStatus)
        },
        setUnshared() {
            this.checkedIds = this.checkboxStatus
            this.disSharedData.ids = this.checkedIds
            ShareExternalLink(this.disSharedData)
                .then(() => {
                    this.getDataList()
                })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
        },
        onDelete(id, account) {
            this.ConfirmBox('请检查此素材是否正在被使用，您确定要执行删除？')
                .then(() => {
                    DeleteExternalLinks(id, account)
                        .then((response) => {
                            this.getDataList();
                        })
                })
        },
        onShare(item) {
            this.shareID = []
            this.shareID.push(item.id)
            this.shareData.ids = this.shareID
            console.log(this.shareData)
            this.ConfirmBox("是否确认分享")
                .then(() => {
                    ShareExternalLink(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onAdd() {
            this.dialogFormVisible = true;
            this.picUrl = ''
            this.temp.account = this.$store.state.weChatAccount.accountInfo.account
        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempLinkInit();
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
        },
        create() {

            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    CreateExternalLinks(this.temp)
                        .then((response) => {
                            console.log('CreateText')
                            console.log(response)
                            this.dialogFormVisible = false
                            this.getDataList()
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });


        },
        update() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {

                    UpdateExternalLinks(this.temp)
                        .then((response) => {
                            this.dialogFormVisible = false
                            this.picUrl = this.imageUrl + this.temp.picUrl
                            this.getDataList()
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onSearch() {
            this.searchFormVisible = true
        },
        avatarUpload(file) {

            const isJepg = file.type === 'image/jpeg';
            const isJpg = file.type === 'image/jpg';
            const isPng = file.type === 'image/png';
            const isBmp = file.type === 'image/bmp';
            const isGif = file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJepg && !isJpg && !isPng && !isBmp && !isGif) {
                this.$message(
                    {
                        message: "图片类型必须是gif,jpeg,jpg,png,bmp中的一种",
                        type:'error'
                    }
                );
                return false
            }
            if (!isLt2M) {
                this.$message(
                    {
                        message: '上传头像图片大小不能超过 2MB!',
                        type:'error'
                    }
                );
                return false
            }
        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.serverUrl = this.imageUrl + file.response
            this.temp.picUrl = file.response
            this.picUrl = this.serverUrl
        },
        search() {
            this.pageParam.page = 1;
            this.pageParam.size = 15;
            this.getDataList()
            this.searchFormVisible = false
            this.$refs.pages.changePage(1)
        },
        resetSearchForm() {
            this.pageParam.viewMode = "NORMAL";
            this.pageParam.name = "";
        }

    },
    watch: {}
}

function pageParamInit(account) {
    return {
        page: 1,
        size: 15,
        account: account,
        viewMode: "NORMAL",
        name: ""
    }
}

function tempLinkInit() {
    return {
        name: "",
        title: "",
        description: "",
        picUrl: "",
        url: "",
        scopeType: "",
        account: "",
    }
}