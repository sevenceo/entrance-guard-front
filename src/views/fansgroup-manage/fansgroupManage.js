/**
 * Created by zyk on 2017/9/18.
 */

import dataTable from './components/datatable/dataTable.vue'
import {SearchDataList,GetTreeData,ExportAll} from './api/fansgroupManageApi'

const fansGroupStateOptions = [
    {key: 'ON', label: '启用'},
    {key: 'OFF', label: '停用'},
];

export default {
    created() {
        this.getDataList('',this.param,this.tags);
        this.getTreeData();
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
         filterText: '',
         param:paramInit(),
         formData: [],
         treeData:[],
         defaultProps: {
             children: 'childTags',
             label: 'name'
         },
         searchFormVisible : false,
         fansGroupStateOptions,
         labelTreeVisible:false,
         tags: []
     }
    },
    methods: {
        getDataList: function (page,param,tags) {
            SearchDataList(page,param,tags).then((response) => {
                this.formData = response.data;
                for (let i in this.formData) {
                    if (this.formData[i].state == 'ON') {
                        this.formData[i].state = "启用"
                    } else {
                        this.formData[i].state = "停用"
                    }
                }
            })
        },
        getTreeData: function () {
            GetTreeData().then((response) => {
                this.treeData = response.data;
            })
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        search: function (pageParam) {
            this.$refs[pageParam].validate((valid) => {
                if (valid) {
                    this.getDataList('',this.param,this.tags);
                    this.searchFormVisible = false;
                } else {
                    console.log('error serach!!');
                    return false;
                }
            });
        },
        showLabelTree: function() {
            this.labelTreeVisible = true;
            this.setCheckedNodes();
        },
        closeTree: function() {
            this.labelTreeVisible = false;
        },
        cancel: function() {
            this.labelTreeVisible = false;
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
        goAddManufacturerFansGroup: function(){
            this.$router.push({name: '粉丝组维护', params: {id: 'add',isMaster:true,auth:'Manufacturer',status:'maintenance'}});
        },
        goAddAgencyFansGroup: function(){
            this.$router.push({name: '粉丝组维护', params: {id: 'add',isMaster:false,auth:'Agency',status:'maintenance'}});
        },
        resetChecked: function() {
            if(this.$refs.tree) {
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        handleClose: function(tag) {
            this.tags.splice(this.tags.indexOf(tag),1);
            this.setCheckedNodes();
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
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        reset: function () {
            this.param = paramInit();
            this.tags = [];
        },
        exportAll: function() {
            ExportAll(this.param,this.tags).then((response) => {
                console.log(response);
            });
        }
    },
    components: {
        dataTable
    }
}

function paramInit() {
    return {
        account: localStorage.getItem("aid"),
        createTime: "",
        createTimeEnd: "",
        name: "",
        state: ""
    }
}
