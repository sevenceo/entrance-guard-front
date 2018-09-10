/**
 * Created by zhaimaojin on 2017/9/21.
 */

import {
    GetTextList,
    DeleteText,
    ShareText,
    CreateText,
    UpdateText
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
            typeValue: 'text',
            totalPage: 10,
            checkAll: false,
            shareID: [],
            shareData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: true
            },
            temp: tempTextInit(),
            checkboxStatus: [],
            disSharedData: {
                account: this.$store.state.weChatAccount.accountInfo.account,
                ids: [],
                shared: false
            },
            selectedModeRadio: '',
            selectedMode: '',
            rules: {
                name: [
                    {required: true, message: '请输入素材名称', trigger: 'blur'},
                    {max: 200, message: '长度不可超过200', trigger: 'blur'}
                ],
                content: [
                    {required: true, message: '请输入素材正文', trigger: 'blur'},
                    {max: 1000, message: '长度不可超过1000', trigger: 'blur'}
                ],

            },
        }
    },
    mounted() {
        console.log($('.text-wrapper p'))
    },
    methods: {
        getDataList() {
            GetTextList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList)
                $('.icon-wrapper .material-share use').attr('xlink:href','#icon-share')
                $('.icon-wrapper .material-edit use').attr('xlink:href','#icon-edit1')
                $('.icon-wrapper .material-delete use').attr('xlink:href','#icon-delete1')
            })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getDataList(this.pageParam)
        },

        onAdd() {
            this.dialogFormVisible = true;
            this.temp.account = this.$store.state.weChatAccount.accountInfo.account
            this.serverUrl = ''

        },
        onEdit(item) {
            this.dialogFormVisible = true;
            // this.temp = item
            $.extend(this.temp,item)
        },
        onDelete(id, account) {
            this.ConfirmBox('请检查此素材是否正在被使用，您确定要执行删除？')
                .then(() => {
                    DeleteText(id, account)
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
                    ShareText(this.shareData)
                        .then(response => {
                            console.log(response);
                            this.getDataList(this.pageParam)
                        })
                })
        },
        onSearch() {
            this.searchFormVisible = true
        },
        create() {

            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    CreateText(this.temp)
                        .then((response) => {
                            console.log('CreateText')
                            console.log(response)
                            this.dialogFormVisible = false
                            this.getDataList()
                        })
                }
            })
        },
        update() {
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    UpdateText(this.temp)
                        .then((response) => {
                            this.dialogFormVisible = false
                            this.getDataList()
                        })
                } else {
                }
            })


        },
        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = tempTextInit()
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false;
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
            ShareText(this.disSharedData)
                .then(() => {
                    this.getDataList()
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
            this.pageParam.viewMode = "NORMAL";
            this.pageParam.name = "";
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
//         account: this.$store.state.weChatAccount.accountInfo.account
//
//     }
// }
// function shareDataInit() {
//     return {
//         account: this.$store.state.weChatAccount.accountInfo.account,
//         ids: [],
//         shared: true
//     }
// }
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
        viewMode: "NORMAL",
        name:""
    }
}
