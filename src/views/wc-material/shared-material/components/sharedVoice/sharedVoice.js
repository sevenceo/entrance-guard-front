/**
 * Created by zhaimaojin on 2017/9/21.
 */

import {
    GetVoiceList, DownloadVoice
} from "src/views/wc-material/shared-material/api/sharedMaterialApi";
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
            temp: tempVoiceInit(),
            serverUrl: '',
            downloadID: [],
            downloadData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            voiceUrl: process.env.MATERIAL_API,
            selectedModeRadio: '',
            selectedMode: ''
        }
    },
    methods: {
        getDataList() {
            GetVoiceList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                $('.icon-wrapper .material-download use').attr('xlink:href','#icon-download')

            })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
        },
        onSearch() {
            this.searchFormVisible = true;
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempVoiceInit()
        },
        onDownload(item) {
            this.downloadID = []
            this.downloadID.push(item.id)
            this.downloadData.ids = this.downloadID
            console.log(this.downloadData)
            this.ConfirmBox("是否确认下载")
                .then(() => {
                    DownloadVoice(this.downloadData)
                        .then(response => {
                            this.$message(
                                {
                                    message: '下载成功',
                                    type: 'success'
                                }
                            )
                            this.getDataList(this.pageParam)
                        })
                })
        },
        search() {
            this.pageParam.page = 1;
            this.pageParam.size = 15;
            this.getDataList()
            this.searchFormVisible = false
            this.$refs.pages.changePage(1)

        },
        resetSearchForm() {
            this.pageParam.viewMode = "SHARED";
            this.pageParam.name = ""
        }
    }
}


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
        viewMode: "SHARED",
        name: ""
    }
}