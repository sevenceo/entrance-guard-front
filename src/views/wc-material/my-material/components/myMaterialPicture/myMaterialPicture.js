/**
 * Created by zhaimaojin on 2017/9/21.
 */
import {
    GetImageList,
    DeleteImage,
    ShareImage,
    AvatarUpload,
    CreateImage,
    UpdateImage
} from "src/views/wc-material/my-material/api/myMaterialApi";
import store from 'store'


export default {

    created() {
        this.getDataList()
    },
    data() {
        return {
            searchFormVisible: false,
            account: '',
            pagesize: 12,
            pageParam: pageParamInit(this.$store.state.weChatAccount.accountInfo.account),
            dataList: [],
            checkedIds: [],
            dialogFormVisible: false,
            checked: false,
            typeValue: "image",
            totalPage: 10,
            checkAll: false,
            shareID: [],
            disSharedId: [],
            shareData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            disSharedData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: false
            },
            temp: tempImageInit(),
            serverUrl: '',
            imageUrl: process.env.MATERIAL_API,
            checkboxStatus: [],
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            selectedModeRadio: '',
            selectedMode: '',
            rules: {
                name: [
                    {required: true, message: '请输入素材名称', trigger: 'blur'},
                    {max: 200, message: '长度不可超过200', trigger: 'blur'}
                ],
                serverUrl: [
                    {required: true, message: '请选择图片', trigger: 'blur'},
                ]
            },
        }
    },
    methods: {
        getDataList() {
            GetImageList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(process.env.BASE_API)
                let oid = this.$store.state.weChatAccount.accountInfo.account;
                console.log(oid)
                $('.icon-wrapper .material-share use').attr('xlink:href','#icon-share')
                $('.icon-wrapper .material-edit use').attr('xlink:href','#icon-edit1')
                $('.icon-wrapper .material-delete use').attr('xlink:href','#icon-delete1')
            })
        },
        onEdit(item) {
            this.dialogFormVisible = true;
            $.extend(this.temp,item)
            this.serverUrl = this.imageUrl + this.temp.serverUrl
            console.log(this.temp)
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
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
        selectId(id) {
            this.disSharedId.push(id)
            console.log(this.disSharedId)
        },
        setUnshared() {

            this.checkedIds = this.checkboxStatus
            this.disSharedData.ids = this.checkedIds
            ShareImage(this.disSharedData)
                .then(() => {
                    this.getDataList()
                })
        },
        onDelete(id, account) {
            this.ConfirmBox('请检查此素材是否正在被使用，您确定要执行删除？')
                .then(() => {
                    DeleteImage(id, account)
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
                    ShareImage(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onAdd() {
            this.dialogFormVisible = true;
            this.serverUrl = ''
            console.log(this.temp)
            this.temp.account = this.$store.state.weChatAccount.accountInfo.account
        },
        create() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    CreateImage(this.temp)
                        .then((response) => {
                            console.log(response)
                            this.dialogFormVisible = false
                            this.$router.push({name: '图片'})
                            this.getDataList()
                        })
                } else {

                }
            })
        },
        update() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    UpdateImage(this.temp)
                        .then((response) => {
                            this.dialogFormVisible = false
                            this.serverUrl = this.temp.serverUrl
                            this.getDataList()
                        })
                } else {

                }
            })
        },
        // bmp/png/jpeg/jpg/gif
        avatarUpload(file) {
            console.log(file)
            const isJepg = file.type === 'image/jpeg';
            const isJpg = file.type === 'image/jpg';
            const isPng = file.type === 'image/png';
            const isBmp = file.type === 'image/bmp';
            const isGif = file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJepg && !isJpg && !isPng && !isBmp && !isGif) {
                this.$message(
                    {
                        message: '图片类型必须是gif,jpeg,jpg,png,bmp中的一种',
                        type:'error'

                    }
                );
                return false
            }

            if (!isLt2M) {
                this.$message(
                    {
                        message: '图片大小不能超过2MB',
                        type:'error'
                    }
                );
                return false
            }
        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.serverUrl = this.imageUrl + file.response
            this.temp.serverUrl = file.response
        },
        onSearch() {
            this.searchFormVisible = true
        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempImageInit()
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
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


function tempImageInit() {
    return {
        name: '',
        serverUrl: '',
        account: ''
    }
}

function pageParamInit(account) {
    return {
        page: 1,
        size: 15,
        account: account,
        viewMode: "NORMAL",
        name:""
    }
}
