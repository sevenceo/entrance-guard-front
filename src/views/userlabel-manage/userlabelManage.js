/**
 * Created by zyk on 2017/9/18.
 */

import dataTable from './components/datatable/dataTable.vue';
import {SearchDataList,CountUserLabel,tableData,GetFansList,ExportAll} from './api/userlabelManageApi';

const tagStateOptions = [
    {key: 'ON', label: '启用'},
    {key: 'OFF', label: '停用'},
];

const tagTypeOptions = [
    {key: '基础信息', label: '基础信息'},
    {key: '活动', label: '活动'},
    {key: '成交', label: '成交'},
    {key: '社媒体', label: '社媒体'},
    {key: '产品', label: '产品'}
];

const runCycleOptions = [
    {key: 'Day', label:'Day'},
    {key: 'Week',label:'Week'},
    {key: 'Month',label:'Month'}
];

//组件级变量
let selectionData = [];

export default {
    created() {
        this.getDataList(this.pageParam);
    },
    data() {
        var checkValidateStart = (rule, value, callback) => {
            if(this.pageParam.validateStart && this.pageParam.validateEnd) {
                if(this.pageParam.validateStart >  this.pageParam.validateEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkValidateEnd = (rule, value, callback) => {
            if(this.pageParam.validateStart && this.pageParam.validateEnd) {
                if(this.pageParam.validateStart >  this.pageParam.validateEnd) {
                    callback(new Error('结束日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkRunTimeStart = (rule, value, callback) => {
            if(this.pageParam.runTimeStart && this.pageParam.runTimeEnd) {
                if(this.pageParam.runTimeStart >  this.pageParam.runTimeEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkRunTimeEnd = (rule, value, callback) => {
            if(this.pageParam.runTimeStart && this.pageParam.runTimeEnd) {
                if(this.pageParam.runTimeStart >  this.pageParam.runTimeEnd) {
                    callback(new Error('结束日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            tagStateOptions,
            tagTypeOptions,
            runCycleOptions,
            pageParam:pageParamInit(),
            totalPage: 10,
            fansTotalPage: 10,
            formData: [],
            searchFormVisible: false,
            loading: false,
            searchRule: {
                validateStart: [
                    { validator: checkValidateStart, trigger: 'change' }
                ],
                validateEnd: [
                    { validator: checkValidateEnd, trigger: 'change' }
                ],
                runTimeStart: [
                    { validator: checkRunTimeStart, trigger: 'change' }
                ],
                runTimeEnd: [
                    { validator: checkRunTimeEnd, trigger: 'change' }
                ]
            },
            fansParam: {
                page: 1,
                size: 10,
                account: this.$store.state.weChatAccount.accountInfo.account,
                id:""
            },
            tableData:[],
            showFans:false
        }
    },
    methods: {
        getDataList(pageParam) {
            SearchDataList(pageParam).then((response) => {
                this.totalPage = response.headers['x-total-count'];
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
        onSearch: function () {
            this.searchFormVisible = true;
        },
        search: function (pageParam) {
            this.$refs[pageParam].validate((valid) => {
                if (valid) {
                    this.pageParam.page = 0;
                    this.getDataList(this.pageParam);
                    this.searchFormVisible = false;
                } else {
                    console.log('error serach!!');
                    return false;
                }
            });
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        handleCurrentChange(page){
            this.pageParam.page = page - 1;
            this.getDataList(this.pageParam)
        },
        handleSelectionChange(selection){
            selectionData = selection;
        },
        countUserLabel: function () {
            if (selectionData.length == 0) {
                this.$message({
                    message: "请选择至少一行数据",
                    type: 'error'
                })
                return
            }
            this.ConfirmBox("是否计算") .then(()=>{
                this.loading = true;
                CountUserLabel(selectionData,this.pageParam.account).then((response) => {
                    this.loading = false;
                    this.getDataList(this.pageParam);
                });
            })
        },
        goAddUserLabel: function(){
            this.$router.push({name: '标签维护', params: { id: 'add' }});
        },
        getFansList(page){
            GetFansList(page)
                .then((response) => {
                    if (response.data) {
                        this.fansTotalPage = Math.ceil(response.headers['x-total-count'] / page.size * 10)
                        this.tableData = response.data
                        for (let i in this.tableData) {
                            if (this.tableData[i].gender == 1) {
                                this.tableData[i].gender = '男'
                            } else if (this.tableData[i].gender == 2) {
                                this.tableData[i].gender = '女'
                            } else {
                                this.tableData[i].gender = '-'
                            }
                            if (this.tableData[i].isSubscribe == "1") {
                                this.tableData[i].unsubscribeTime = "-"
                            }
                            if (this.tableData[i].headImgUrl) {
                                this.tableData[i].headImgUrl = this.tableData[i].headImgUrl.substring(0, this.tableData[i].headImgUrl.lastIndexOf("/") + 1) + "64";
                            }
                        }
                    } else {
                        this.fansTotalPage = 0
                    }
                })
        },
        showfans(item){
            this.showFans = true;
            this.fansParam.id = item;
            this.fansParam.page = 1;
            this.fansParam.size = 10;
            this.tableData = [];
            this.getFansList(this.fansParam);
        },
        resetForm(){
            this.showFans = false;
        },
        handleCurrentChange3(page){
            this.fansParam.page = page
            this.getFansList(this.fansParam);
        },
        formatter1(row, column) {
            let issub = row[column.property];
            if (issub == '1') {
                return "已关注";
            } else {
                return "已取消";
            }
        },
        exportAll(){
            ExportAll(this.fansParam.account,this.fansParam.id);
        }
    },
    components: {
        dataTable
    }
}

function pageParamInit() {
    return {
        page: 0,
        size: 10,
        name:'',
        state:'',
        runCycle:'',
        type:'',
        validateStart:'',
        validateEnd:'',
        runTimeStart:"",
        runTimeEnd:"",
        account: localStorage.getItem("aid")
    }
}
