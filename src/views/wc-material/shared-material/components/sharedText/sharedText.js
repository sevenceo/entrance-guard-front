/**
 * Created by zhaimaojin on 2017/9/21.
 */

import {GetTextList, DownloadText} from "src/views/wc-material/shared-material/api/sharedMaterialApi";
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
            typeValue: 'text',
            totalPage: 10,
            checkAll: false,
            temp: tempTextInit(),
            downloadId: [],
            downloadData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            selectedModeRadio:'',
            selectedMode:''

        }
    },
    methods: {
        getDataList() {
            GetTextList(this.pageParam).then(response => {
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
            this.searchFormVisible = true
        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempTextInit()
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false;
        },
        onDownload(item) {
            this.downloadID = [];
            this.downloadID.push(item.id);
            this.downloadData.ids = this.downloadID;
            this.ConfirmBox("是否确认下载")
                .then(() => {
                    DownloadText(this.downloadData)
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
        search(){
            this.pageParam.page = 1;
            this.pageParam.size = 15;
            this.getDataList()
            this.searchFormVisible = false
            this.$refs.pages.changePage(1)

        },
        resetSearchForm(){
            this.pageParam.viewMode = "SHARED";
            this.pageParam.name = ""
        }
    }
}

function tempTextInit() {
    return {
        name: '',
        content: '',
        account: ''
    }
}

function pageParamInit(account) {
    return  {
        page: 1,
        size: 15,
        account: account,
        viewMode: "SHARED",
        name:""
    }
}