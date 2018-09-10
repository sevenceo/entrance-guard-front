import {SearchDataList} from './api/fansTagSelectBoxApi'

export default {
    created() {
        this.getDataList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            totalPage: 10,
            pageParam: pageParamInit(),
            account:this.$store.state.weChatAccount.accountInfo.account
        }
    },
    methods: {
        getDataList(pageParam) {
            SearchDataList(pageParam).then((response) => {
                this.totalPage = response.headers['x-total-count'];
                this.tableData = response.data;

            })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page - 1;
            this.getDataList(this.pageParam);
        },
        search: function () {
            this.getDataList(this.pageParam);
        },
        confirm(row){
            this.$emit("selectTag",row);
        }
    }
}

function pageParamInit() {
    return {
        page: 0,
        size: 10,
        name:'',
        account: localStorage.getItem("aid"),
        state:'ON',
        format : "文本"
    }
}