import {SearchGroupList} from './api/fansGroupSelectBoxApi'
import {GetTreeData} from 'src/views/fansgroup-manage/api/fansgroupManageApi'
export default {
    created() {
        // this.account = this.$store.state.weChatAccount.accountInfo.account;
        this.searchGroupList(this.pageParam,this.tags);
        // this.getTreeData();
    },
    watch: {
        /**
         *  过滤树
         */
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            filterText:'',
            tableData: [],
            treeData:[],
            totalPage: 10,
            pageParam: pageParamInit(),
            tags: [],
            defaultProps: {
                children: 'childTags',
                label: 'name'
            },
            labelTreeVisible:false
        }
    },
    methods: {
        //  显示粉丝组列表
        // getFansGroupList() {
        //     GetFansGroupList()
        //         .then((response) => {
        //             if (response.data) {
        //                 // this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
        //                 this.tableData = response.data
        //             } else {
        //                 this.totalPage = 0
        //             }
        //         })
        // },
        searchGroupList(pageParam,tags) {
            SearchGroupList(pageParam,tags).then((response) => {
                this.tableData = response.data;
                this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)

                for (let i in this.tableData) {
                    if(this.tableData[i].fansInGroupNum == null){
                        this.tableData[i].fansInGroupNum = 0;
                    }
                }
            })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.searchGroupList(this.pageParam,this.tags);
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        search: function () {

            this.searchGroupList(this.pageParam,this.tags);
        },
        confirm(row){
            this.$emit("selectGroup",row);
            this.fansGroupSelectSearchBoxVisible = false;

        },
        formatterIsMaster(row, column){
            let isMaster = row[column.property];
            if(isMaster) {
                return "主机厂";
            } else {
                return "经销商";
            }
        },
        getCheckedNodes: function() {
            this.labelTreeVisible = false;
            this.tags = $.extend([],this.filterSelectedTags(this.$refs.tree.getCheckedNodes()));
        },
        setCheckedNodes: function() {
            if(this.$refs.tree) {
                this.$refs.tree.setCheckedNodes(this.tags);
            }
        },
        showLabelTree: function() {
            this.labelTreeVisible = true;
            this.setCheckedNodes();
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        closeTree: function() {
            this.labelTreeVisible = false;
        },
        cancel: function() {
            this.labelTreeVisible = false;
        },
        handleClose: function(tag) {
            this.tags.splice(this.tags.indexOf(tag),1);
            this.setCheckedNodes();
        },
        showLabelTree: function() {
            this.labelTreeVisible = true;
            this.setCheckedNodes();
        },
        getTreeData: function () {
            GetTreeData().then((response) => {
                this.treeData = response.data;
            })
        },
        filterSelectedTags: function(list) {
            let array = [];
            for(let i = 0; i < list.length; i++) {
                if(list[i].format != '分类') {
                    array.push(list[i]);
                }
            }
            return array;
        },
        exportAll: function() {
            ExportAll(this.param,this.tags).then((response) => {
                console.log(response);
            });
        }
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        master:true,
        account: localStorage.getItem("aid"),
        createTime: "",
        createTimeEnd: "",
        name: "",
        state:"ON"
    }
}