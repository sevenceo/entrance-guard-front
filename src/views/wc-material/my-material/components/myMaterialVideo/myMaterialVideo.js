/**
 * Created by zhaimaojin on 2017/9/21.
 */

import {
    GetVideoList,
    DeleteVideo,
    ShareVideo,
    CreateVideo,
    UpdateVideo,
    AvatarUpload
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
            pageParam: pageParamInit(this.$store.state.weChatAccount.accountInfo.account),
            dataList: [],
            checkedIds: [],
            dialogFormVisible: false,
            checked: false,
            typeValue: 'video',
            totalPage: 10,
            checkAll: false,
            videoDialogVisible: false,
            videoSrc: '',
            shareID: [],
            shareData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            }, disSharedData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: false
            },
            serverUrl: '',
            temp: tempVideoInit(),
            videoUrl: process.env.MATERIAL_API,
            checkboxStatus: [],
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            selectedModeRadio: '',
            selectedMode: '',
            rules:{
                name: [
                    { required: true, message: '请输入素材名称', trigger: 'blur' },
                    { max:200, message: '长度不可超过200', trigger: 'blur'}
                ],
                title: [
                    { required: true, message: '请输入素材标题', trigger: 'blur' },
                    { max:200, message: '长度不可超过200', trigger: 'blur'}
                ],
                serverUrl: [
                    { required: true, message: '请选择视频', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        getDataList() {
            GetVideoList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList.length)
                $('.icon-wrapper .material-share use').attr('xlink:href','#icon-share')
                $('.icon-wrapper .material-edit use').attr('xlink:href','#icon-edit1')
                $('.icon-wrapper .material-delete use').attr('xlink:href','#icon-delete1')
            })
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
        setUnshared() {

            this.checkedIds = this.checkboxStatus
            this.disSharedData.ids = this.checkedIds
            ShareVideo(this.disSharedData)
                .then(() => {
                    this.getDataList()
                })
        },
        onEdit(item) {
            this.dialogFormVisible = true;
            $.extend(this.temp, item)
            this.serverUrl = this.videoUrl + this.temp.serverUrl
        },
        onAdd() {
            this.dialogFormVisible = true;
            this.temp.account = this.$store.state.weChatAccount.accountInfo.account
            this.serverUrl = ''
        },
        onSearch() {
            this.searchFormVisible = true
        },
        onDelete(id, account) {
            this.ConfirmBox('请检查此素材是否正在被使用，您确定要执行删除？')
                .then(() => {
                    DeleteVideo(id, account)
                        .then((response) => {
                            this.getDataList();
                        })
                })
        },
        showVideo(url) {
            this.videoDialogVisible = true
            this.videoSrc = this.videoUrl + url
        },
        onShare(item) {
            this.shareID = []
            this.shareID.push(item.id)
            this.shareData.ids = this.shareID
            console.log(this.shareData)
            this.ConfirmBox("是否确认分享")
                .then(() => {
                    ShareVideo(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        stopPlay() {
            this.videoSrc = ''
        },
        create() {

            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    CreateVideo(this.temp)
                        .then((response) => {
                            console.log(response)
                            this.dialogFormVisible = false
                            this.getDataList()
                        })
                } else {

                }

            })

        },
        update() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    UpdateVideo(this.temp)
                        .then((response) => {
                            console.log(response)
                            this.dialogFormVisible = false
                            this.serverUrl = this.temp.serverUrl
                            this.getDataList()
                        })
                } else {

                }

            })
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempVideoInit()
        },
        avatarUpload(file) {
            const isMP4 = file.name.split('.')[1] === 'mp4';
            const isLt10M = file.size / 1024 / 1024 < 10;

            if (!isLt10M) {
                this.$message(
                    {
                        message: '上传视频大小不能超过 10MB!',
                        type:'error'
                    }
                );
            } else if (!isMP4) {
                this.$message(
                    {
                        message: '请上传MP4格式的视频',
                        type:'error'
                    }
                );
            }

            return isLt10M && isMP4;

        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.serverUrl = this.videoUrl + file.response
            this.temp.serverUrl = file.response
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

// function pageParamInit() {
//     return {
//         page: 1,
//         size: 12,
//         account: this.$store.state.weChatAccount.accountInfo.account
//     }
// }
//
// function shareDataInit() {
//     return {
//         account: this.$store.state.weChatAccount.accountInfo.account,
//         ids: [],
//         shared: true
//     }
// }

function tempVideoInit() {
    return {
        name: '',
        serverUrl: '',
        account: '',
        title: '',
        description: ''
    }
}


function pageParamInit(account) {
    return  {
        page: 1,
        size: 15,
        account: account,
        viewMode: "NORMAL",
        name:""
    }
}
