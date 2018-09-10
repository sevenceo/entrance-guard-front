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
 * 作   者：Allen
 * 创建日期：2018-7-26
 * </pre>
 */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus,getGroupByIds} from "./api/dailyAttendanceApi";
import store from '../../store';
import {getOrginations} from "../attendance/api/attendanceApi";

export default {
    created() {
        this.getFirstLvl();

    },
    data() {
        return {
            humans:[],
            options:[],
            tableData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            attenDanceGroups:[],
            temp: tempInit(),
            rules: {


                mobile:
                    [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {max: 13, message: '手机号不得超过13个字符'}],



                requreUpDate:
                    [

                        {max: 20, message: '上班规定时间不得超过20个字符'}],
                requreDownDate:
                    [

                        {max: 20, message: '下班规定时间不得超过20个字符'}],
                amCheckTime:
                    [
                        {required: true, message: '请输入上班打卡时间', trigger: 'blur'},
                    ],
                pmCheckTime:
                    [
                        {required: true, message: '请输入下班打卡时间', trigger: 'blur'},
                    ],


            },
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5,
            firstLvl:[]
        }
    },
    components: {
        //etc...
    },
    methods: {
        getFirstLvl(){
            getOrginations().then(resp=>{
                if(resp!=null){
                    var data = resp.data;
                    if(data!=null){
                        for(var i = 0;i<data.length;i++){
                            this.firstLvl[i]={
                                value:data[i].id,
                                label:data[i].label
                            }
                        }
                        if(this.firstLvl.length>0){
                            var ids = this.firstLvl.map(item => item.value)
                            this.pageParam.resourceIds = ids;
                        }
                        this.getList(this.pageParam);
                        this.GetAttenDanceGroups();
                    }
                }
            })
        },
        formatterState(row){
            if (row.amWorkiStateText=="正常" && row.amCheckTime == '未打卡') {
                return "未打卡"
            } else {
                return row.amWorkiStateText;
            }
        },
        formatterPMState(row){
            if (row.amWorkiStateText=="正常" && row.pmCheckTime == '未打卡') {
                return "未打卡"
            } else {
                return row.pmWorkiStateText;
            }
        },
        //显示
        getList(pageParam) {
            let data={
                humanName:null,
                attendanceGroupName:null,
                checkDate:null
            }

            GetList(pageParam,data)
                .then((response) => {
                    console.log(response);
                    for(var i=0;i<response.data.rows.length;i++) {
                        var amDate = response.data.rows[i].amCheckTime;
                        if (amDate != null) {
                            response.data.rows[i].amCheckTime = this.fmtDate(amDate);
                        }
                        else
                            response.data.rows[i].amCheckTime="未打卡";

                        var pmDate = response.data.rows[i].pmCheckTime;
                        if(pmDate!=null) {
                            response.data.rows[i].pmCheckTime = this.fmtDate(pmDate);
                        }
                        else
                            response.data.rows[i].pmCheckTime="未打卡";
                    }
                    this.rowTotal = response.data.rowTotal;
                    this.tableData = response.data.rows;
                })
        },
        fmtDate(date)
        {
            var date = new Date(date);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        },

        async GetAttenDanceGroups() {
            if(this.firstLvl.length>0){
                var data = this.firstLvl;
                var ids = this.firstLvl.map(item => item.value)
                getGroupByIds(ids).then(resp=>{
                    this.attenDanceGroups=resp.data;
                })
            }
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd() {
            this.temp = tempInit();

            /*
             * Other init data
             *
             * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);

            /*
             * Other init data
             *
             * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.getFirstLvl();
            // this.getList(this.pageParam)
            // this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
        },

        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                        })
                } else {
                    return false;
                }
            })
            ;

        },
        update(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.temp.enable) {
                        this.temp.enable = 'true'
                    } else {
                        this.temp.enable = 'false'
                    }
                    Editor(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.temp = tempInit()
                        })
                    ;
                } else {
                    return false;
                }
            })
            ;

        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id
                    )
                        .
                        then(() => {
                            this.getList(this.pageParam);
                        })
                })

        },
        onBatchDelete() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认批量删除')
                .then(() => {
                    BatchDelete(ids)
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })

        },
        onStatus(row, type) {
            if (type == '1') {
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        Status(row.id, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        Status(row.id, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
        },
        onBatchStatus(type) {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            if (type == '1') {
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        }

    }
}

function tempInit() {
    return {
        humanId : '',
        mobile : '',
        resourceId : '',
        scheduleId : '',
        checkDate : '',
        requreUpDate : '',
        requreDownDate : '',
        amCheckTime : '',
        pmCheckTime : '',
        lateMinutes : '',
        earlyLeaveMinutes : '',
        amWorkiState : '',
        pmWorkiState : '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        humanId : '',
        mobile : '',
        resourceId : '',
        scheduleId : '',
        checkDate : '',
        requreUpDate : '',
        requreDownDate : '',
        amCheckTime : '',
        pmCheckTime : '',
        lateMinutes : '',
        earlyLeaveMinutes : '',
        amWorkiState : '',
        pmWorkiState : '',
        attendanceGroupId:'',
        resourceIds:[],
    }
}

