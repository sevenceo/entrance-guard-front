import {
    GetArticlePhotoList,
    ShareArticlePhoto,
    DeleteArticlePhoto,
    GetArticlePreViewData,
    ModifyArticleStatus
} from "src/views/wc-material/my-material/api/myMaterialApi";
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
            checked: false,
            checkAll: false,
            shareID: [],
            shareData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            serverUrl: '',
            imageUrl: process.env.MATERIAL_API,
            disSharedData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: false
            },
            selectedModeRadio:'',
            selectedMode:'',
            checkboxStatus: [],
            articleTableData:[],
            preViewVisible : false
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
                    $('.icon-wrapper .material-share use').attr('xlink:href','#icon-share')
                    $('.icon-wrapper .material-edit use').attr('xlink:href','#icon-edit1')
                    $('.icon-wrapper .material-delete use').attr('xlink:href','#icon-delete1')
                    $('.icon-wrapper .material-check use').attr('xlink:href','#icon-check')
                })
        },
        onPreView(id) {
            GetArticlePreViewData(id,this.$store.state.weChatAccount.accountInfo.account)
                .then((response) => {
                    this.articleTableData = response.data;
                    this.preViewVisible = true;
            })
        },
        resetForm(){
            this.preViewVisible = false;
        },
        preView(url){
            if(url){
                window.open(url);
            }
        },
        onDelete(id, account) {
            this.ConfirmBox("是否确认删除")
                .then(() => {
                    // console.log(id)
                    DeleteArticlePhoto(id, account)
                        .then((response) => {
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onPublish(id, account) {
            this.ConfirmBox("是否确认发布")
                .then(() => {
                    ModifyArticleStatus(id, account,1)
                        .then((response) => {
                            if(response.status == 200) {
                                this.$message({
                                    message: "发布成功",
                                    type: 'success'
                                })
                            }
                            this.getDataList(this.pageParam)
                        })
                })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
        },
        onShare(item) {
            this.shareID = []
            this.shareID.push(item.id)
            this.shareData.ids = this.shareID
            console.log(this.shareData)
            this.ConfirmBox("是否确认分享")
                .then(() => {
                    ShareArticlePhoto(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onEdit(id) {
            this.$router.push({name: '编辑图文', params: {id: id}})
        },
        onSearch() {
            this.searchFormVisible = true
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
            ShareArticlePhoto(this.disSharedData)
                .then(() => {
                    this.getDataList()
                })
        },
        onAdd(){
            this.$router.push({name:'新增图文'})
        },
        search(){
            this.pageParam.page = 1;
            this.pageParam.size = 15;
            this.getDataList()
            this.searchFormVisible = false
            this.$refs.pages.changePage(1)

        },
        resetSearchForm(){
            this.pageParam.viewMode = "NORMAL";
            this.pageParam.name = "";
        }

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
