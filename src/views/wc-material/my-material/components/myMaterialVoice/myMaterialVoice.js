/**
 * Created by zhaimaojin on 2017/9/21.
 */

import {
    GetVoiceList,
    DeleteVoice,
    ShareVoice,
    CreateVoice,
    UpdateVoice,
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
            typeValue: 'voice',
            totalPage: 10,
            checkAll: false,
            voiceDialogVisible: false,
            shareID: [],
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
            temp: {
                name: '',
                serverUrl: '',
                account: this.$store.state.weChatAccount.accountInfo.account
            },
            serverUrl: '',
            voiceUrl: process.env.MATERIAL_API,
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
                    {required: true, message: '请选择音频', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        getDataList() {
            GetVoiceList(this.pageParam).then(response => {
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
            ShareVoice(this.disSharedData)
                .then(() => {
                    this.getDataList()
                })
        },
        onEdit(item) {
            this.dialogFormVisible = true;
            this.temp = item
            this.serverUrl = this.voiceUrl + this.temp.serverUrl

        },
        onAdd() {
            this.dialogFormVisible = true
            this.temp.account = this.$store.state.weChatAccount.accountInfo.account
            this.serverUrl = ''

        },
        onDelete(id, account) {
            this.ConfirmBox('请检查此素材是否正在被使用，您确定要执行删除？')
                .then(() => {
                    DeleteVoice(id, account)
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
                    ShareVoice(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onSearch() {
            this.searchFormVisible = true;
        },
        create() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    CreateVoice(this.temp)
                        .then((response) => {
                            console.log('Createvoice')
                            console.log(response)
                            this.dialogFormVisible = false
                            this.getDataList()
                            this.serverUrl = ''
                        })
                } else {

                }

            })
        },
        update() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    UpdateVoice(this.temp)
                        .then((response) => {
                            console.log('UP evoice')
                            console.log(response)
                            this.dialogFormVisible = false
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
            this.temp = tempVoiceInit()
        },
        avatarUpload(file) {

            let arr = file.name.split('.')
            const isMp3 = file.type === 'audio/mp3';
            const isMP3 = file.type === 'audio/mpeg';
            const isWav = file.type === 'audio/wav';
            const isMWma = file.type === 'audio/x-ms-wma'
            const isWma = file.type === 'video/x-ms-wma'
            const isAmr = file.type === 'audio/amr';
            const isIEAmr =  arr[arr.length - 1] === 'amr';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isMp3 && !isWav && !isMP3 && !isWma && !isMWma && !isAmr && !isIEAmr) {
                this.$message(
                    {
                        message: "音频类型必须是mp3,wav,amr,wma格式中的一种",
                        type:'error'
                    }
                );
                return false
            }
            if (!isLt2M) {
                this.$message(
                    {
                        message: '音频大小必须小于2MB',
                        type:'error'
                    }
                );
                return false
            }


            // AvatarUpload(file)
            //     .then((response) => {
            //         console.log('res')
            //         console.log(response)
            //
            //
            //         this.serverUrl = process.env.BASE_API + '/material/api/file/images?path=' + response.data;
            //         console.log(this.serverUrl)
            //         this.temp.serverUrl = response.data
            //
            //
            //     })
        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.serverUrl = this.voiceUrl + file.response
            this.temp.serverUrl = file.response
        },
        getSelectedRadio(value) {
            if (value === '仅显示我下载的') {
                this.selectedRadio = 'MY_IMPORT'
            } else if (value === '仅显示我共享的') {
                this.selectedRadio = 'MY_SHARED'
            } else {
                this.selectedRadio = ''
            }
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
            this.pageParam.name = ""
        }
    },
    watch: {
        // searchFormVisible : function () {
        //     console.log(searchFormVisible)
        // }
    }
}

// function pageParamInit() {
//     return {
//         page: 1,
//         size: 12,
//         account: ''
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

function tempVoiceInit() {
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
        name: ""
    }
}