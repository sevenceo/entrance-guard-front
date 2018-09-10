/**************************************************************************/
/*                                                                        */
/* Copyright (c) 2017 HyperSmart Company                                  */
/* 深圳市超智慧信息科技有限公司版权所有                                     */
/*                                                                        */
/* PROPRIETARY RIGHTS of HyperSmart Company are involved in the           */
/* subject matter of this material. All manufacturing, reproduction, use, */
/* and sales rights pertaining to this subject matter are governed by the */
/* license agreement. The recipient of this software implicitly accepts   */
/* the terms of the license.                                              */
/* 本软件文档资料是深圳市超智慧信息科技有限公司的资产，任何人士阅读和        */
/* 使用本资料必须获得相应的书面授权，承担保密责任和接受相应的法律约束。      */
/*                                                                        */
/**************************************************************************/
/**
 * <pre>
 * 作   者：胡跃峥
 * 创建日期：2018-4-8
 * </pre>
 */
import {
    GetList,
    GetDeviceStateById,
    GetResourceTree,
    GetIdServerIpList,
    GetHistoryDeviceState
} from "./api/deviceStateApi";
import store from '../../store';

export default {
    watch: {
        filterText(val) {
            this.$refs.tenantTree.filter(val);
        }
    },
    created() {
        this.getList(this.pageParam);
        this.getResourceTree();
    },
    data() {
        return {
            searchFormVisibleHistory:false,
            paginationShow:false,
            showHistoryFlag:false,
            historyParam:historyParamInit(),
            historyTableData:[],
            historyRowTaotal:0,
            tableData: [],
            filterText: '',
            rowTotal: 0,
            dialogStateDetail: false,
            searchFormVisible: false,
            pageParam: pageParamInit(),
            tableDataDetail: [],
            tableDataDetailScene: [],
            value1: '',
            value2: '',
            pickerOptions0: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();
                }
            },
            treeData: [],
            resourceName: '',
            parentTree: false,
            sceneList: [],
            ipList: [],
            props: {
                children: 'child',
                id: 'id',
                label: 'text',
                // isLeaf: 'isLeaf'
            },
        }
    },
    methods: {
        //显示人员
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableData = response.data.rows;
                    }
                })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam);
        },
        search() {
            this.getList(this.pageParam);
            this.$refs.pages.changePage(1);
            this.searchFormVisible = false;
        },
        reset() {
            this.resourceName = '';
         /*   this.value1 = '';
            this.value2 = '';*/
            this.pageParam = pageParamInit();
        },
        deviceStateDetail(item) {
            this.tableDataDetail = [];
            this.tableDataDetail.push(item.deviceStateDetail);
            this.tableDataDetailScene = item.deviceStateDetail.scene;
            /*GetDeviceStateById(item.deviceStateId)
                .then((response) => {
                    if (response.data != null) {
                        this.tableDataDetail = response.data;
                        this.tableDataDetailScene = response.data[0].sceneDTOList;
                    }
                })*/
            this.dialogStateDetail = true;
        },
        /*关闭弹框*/
        closeDetailForm() {
            this.dialogStateDetail = false;
            this.getList(this.pageParam);
        },
        formatMQ(row, column) {
            let isOnline = row[column.property];
            if (isOnline != null) {
                if (isOnline) {
                    return "在线";
                } else {
                    return "掉线";
                }
            } else {
                return "没有设备";
            }

        },

        formatMQTable(row, column) {
            let isOnline = row.deviceStateDetail.mqtt;
            if (isOnline != null) {
                if (isOnline) {
                    return "在线";
                } else {
                    return "掉线";
                }
            } else {
                return "没有设备";
            }

        },
        setBeginDate(val) {
            if (val != undefined) {
                this.historyParam.beginDate = val
            }
        },
        setEndDate(val) {
            if (val != undefined) {
                var start = new Date(this.historyParam.beginDate);
                var end = new Date(val);
                if (start >= end) {
                    this.$message({
                        message: "结束时间必须大于开始时间",
                        type: 'error'
                    })
                    this.value2 = '';
                    return
                } else {
                    this.historyParam.endDate = val;
                }
            }
        },
        getResourceTree() {
            GetResourceTree().then((result) => {
                this.treeData = result.data;
            })
        },
        showParentTree() {
            this.parentTree = true;
            this.pageParam.sceneId = ''
            /* this.loadTreeNode();*/
        },
        //添加界面的树
        loadTreeNode() {
            /* GetResourceTree()
                 .then((response) => {
                     this.treeData = response.data;
                 });*/
        },
        nodeClick(data, node, object) {
            // this.selectedCommunity = data;
            //this.pageParam.operator = data.id;
            this.pageParam.sceneId = '';
            this.resourceName = data.text;
            this.parentTree = false;
            if (data.children) {
                GetIdServerIpList(data.id, 'org').then((result) => {
                    this.ipList = result.data;
                    this.pageParam.corpId = '';
                    this.pageParam.orgId = data.id;
                })
            } else {
                GetIdServerIpList(data.id, 'corp').then((result) => {
                    this.ipList = result.data;
                    this.pageParam.orgId = '';
                    this.pageParam.corpId = data.id;
                })
            }


        },
        filterTenantNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
        onSearch() {
            this.searchFormVisible = true;
        },
        deviceStateHistory(row){
            this.showHistoryFlag = true;
            this.historyParam = historyParamInit();
            this.historyParam.orgIds = [];
            this.historyParam.orgIds.push(row.tenantId);
            GetHistoryDeviceState(this.historyParam).then((response)=>{
                debugger;
                this.historyTableData = response.data.rows;
                this.historyRowTaotal = response.data.rowTotal;
            })
            this.paginationShow = true;
        },
        closeHistoryPane(){
            this.showHistoryFlag = false;
            this.paginationShow = false;
        },
        handleHistoryPageChange(page){
            this.historyParam.pageNum = page;
            //this.paginationShow = false;
            let that = this;
            GetHistoryDeviceState(that.historyParam).then((response)=>{
                debugger;
                that.historyTableData = response.data.rows;
                that.historyRowTaotal = response.data.rowTotal;
            })
        },
        searchHistory(){
            this.searchFormVisibleHistory = true;
        },
        resetHistory(){
            this.value1 = '';
            this.value2 = '';
            this.historyParam = historyParamInit();
        },
        doSearchHistory(){
            this.$refs.historyPages.changePage(1);
            this.handleHistoryPageChange(1);

        }
    },
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        beginDate: '',
        endDate: '',
        orgId: '',
        corpId: '',
        sceneId: ''
    }
}

function historyParamInit() {
    return {
        pageNum: 1,
        pageSize: 10,
        rowTotal: 0,
        beginDate: '',
        endDate: '',
        orgIds: [],
    }
}


