import {
    GetArticlePhotoList,
    DownloadArticlePhotoList
} from "src/views/wc-material/shared-material/api/sharedMaterialApi";
import store from 'store'

export default {
    data() {
        return {
            tableData: [],
            pageParam: pageParamInit(this.$store.state.weChatAccount.accountInfo.account),
            totalPage: 10,
            searchFormVisible: false,
            account: '',
            dataList: [],
            checkedIds: [],
            dialogFormVisible: false,
            downloadID: [],
            downloadData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            checked: false,
            checkAll: false,
            serverUrl: '',
            imageUrl: process.env.MATERIAL_API,
            selectedModeRadio: '',
            selectedMode: ''
        }
    },
    created() {
        this.getDataList(this.pageParam)
    },
    methods: {
        getDataList() {
            GetArticlePhotoList(this.pageParam)
                .then((response) => {
                    this.totalPage = response.headers['x-total-count']
                    this.dataList = response.data
                    $('.icon-wrapper .material-download use').attr('xlink:href','#icon-download')

                })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page - 1;
            this.getList(this.pageParam)
        },
        onDownload(item) {
            this.downloadID = []
            this.downloadID.push(item.id)
            this.downloadData.ids = this.downloadID
            this.ConfirmBox("是否确认下载")
                .then(() => {
                    DownloadArticlePhotoList(this.downloadData)
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
        },
        onSearch() {
            this.searchFormVisible = true
        }
    }
}

/*function downloadDataInit() {
    return {
        account: this.$store.state.weChatAccount.accountInfo.account,
        ids: [],
        shared: true
    }
}*/

function pageParamInit(account) {
    return {
        page: 1,
        size: 15,
        account: account,
        viewMode: "SHARED",
        name: ""
    }
}