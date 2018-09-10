/**
 * Created by zhaimaojin on 2017/9/21.
 */
import router from "src/router"
import {GetExternalLinksList, DownloadExternalLinks} from "src/views/wc-material/shared-material/api/sharedMaterialApi";
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
            checked: false,
            totalPage: 10,
            checkAll: false,
            downloadID: [],
            downloadData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            dialogFormVisible: false,
            picUrl: process.env.MATERIAL_API,
            selectedModeRadio: '',
            selectedMode: ''
        }
    },
    methods: {
        getDataList() {
            GetExternalLinksList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                $('.icon-wrapper .material-download use').attr('xlink:href','#icon-download')
            })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
        },
        onDownload(item) {
            this.downloadID = []
            this.downloadID.push(item.id)
            this.downloadData.ids = this.downloadID
            this.ConfirmBox("是否确认下载")
                .then(() => {
                    DownloadExternalLinks(this.downloadData)
                        .then(response => {
                            this.$message({
                                message: '下载成功',
                                type: 'success'
                            })
                            this.getDataList(this.pageParam)
                        })
                })
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
        },
        onSearch() {
            this.searchFormVisible = true
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

// function pageParamInit() {
//     return {
//         page: 1,
//         size: 15,
//         account: this.$store.state.weChatAccount.accountInfo.account
//     }
// }
function tempLinkInit() {
    return {
        name: "",
        title: "",
        description: "",
        picUrl: "",
        url: "",
        scopeType: '',
        account: '',
    }
}

// function downloadDataInit() {
//     return {
//         account: this.$store.state.weChatAccount.accountInfo.account,
//         ids: [],
//         shared: true
//     }
// }

function pageParamInit(account) {
    return  {
        page: 1,
        size: 15,
        account: account,
        viewMode: "SHARED",
        name:""
    }
}