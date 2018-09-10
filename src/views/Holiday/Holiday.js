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
  * 作   者：hwy
  * 创建日期：2018-7-31
  * </pre>
  */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus} from "./api/holidayApi";
import {getOrginations} from "../attendance/api/attendanceApi";

export default {
    created() {
        this.getFirstLvl();
    },
    data() {
        return {
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
            temp: tempInit(),
            rules: {

                // holidayName:
                //     [
                //             {required: true, message: '请输入节假日名称', trigger: 'blur'},
                //             {max: 50, message: '节假日名称不得超过50个字符'}],
                // startAndEnd:[
                //     {required: true, message: '请选择节假日的期间'},
                // ]
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
                        this.getList(this.pageParam);
                    }
                }
            })
        },
        formatterName(row){
            if(row.holidayName!=null&&row.holidayName!=''){
                return row.holidayName;
            }else{
                return '上班';
            }
        },
        formatterStart(row){
            var timestamp = row.holidayStartDate;
            var d = new Date(timestamp); //根据时间戳生成的时间对象
            var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate());
            return date;
        },
        formatterEnd(row){
            var timestamp = row.holidayEndDate;
            var d = new Date(timestamp); //根据时间戳生成的时间对象
            var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate());
            return date;
        },
        //显示
        getList(pageParam) {
            if(pageParam.startAndEnd.length>0){
                pageParam.holidayStartDate=pageParam.startAndEnd[0];
                pageParam.holidayEndDate=pageParam.startAndEnd[1];
            }
            if(this.firstLvl.length>0){
                var ids = this.firstLvl.map(item => item.value);
                pageParam.resourceIds=ids;
            }
            GetList(pageParam)
                .then((response) => {
                console.log(response);
            this.rowTotal = response.data.rowTotal;
            this.tableData = response.data.rows;
        })
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

            this.temp.startAndEnd[0]=this.temp.holidayStartDate;
            this.temp.startAndEnd[1]=this.temp.holidayEndDate;
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
            this.getList(this.pageParam)
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
                    if(this.temp.workOrRest=='2'){
                        this.temp.holidayName='';
                    }else if(this.temp.workOrRest=='1'){
                        if(this.temp.holidayName==null||this.temp.holidayName==''||this.temp.holidayName==undefined){
                            this.$message({
                                message: "节假日名称不能为空",
                                type: 'error'
                            })
                            return;
                        }
                    }
                    if(this.temp.startAndEnd.length<2){
                        this.$message({
                            message: "日期区间异常，请重新选择",
                            type: 'error'
                        })
                        return;
                    }
                    var data = this.temp;
                    data.holidayStartDate=data.startAndEnd[0];
                    data.holidayEndDate=data.startAndEnd[1];
                    if(data.holidayStartDate==null||data.holidayStartDate==''||data.holidayStartDate==undefined
                        ||data.holidayEndDate==null||data.holidayEndDate==''||data.holidayEndDate==undefined){
                        this.$message({
                            message: "日期区间异常，请重新选择",
                            type: 'error'
                        })
                        return;
                    }
                    Create(data)
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
                    if(this.temp.workOrRest=='2'){
                        this.temp.holidayName='';
                    }else if(this.temp.workOrRest=='1'){
                        if(this.temp.holidayName==null||this.temp.holidayName==''||this.temp.holidayName==undefined){
                            this.$message({
                                message: "节假日名称不能为空",
                                type: 'error'
                            })
                            return;
                        }
                    }
                    if(this.temp.startAndEnd.length<2){
                        this.$message({
                            message: "日期区间异常，请重新选择",
                            type: 'error'
                        })
                        return;
                    }
                    var data =this.temp;
                    data.holidayStartDate=data.startAndEnd[0];
                    data.holidayEndDate=data.startAndEnd[1];
                    if(data.holidayStartDate==null||data.holidayStartDate==''||data.holidayStartDate==undefined
                        ||data.holidayEndDate==null||data.holidayEndDate==''||data.holidayEndDate==undefined){
                        this.$message({
                            message: "日期区间异常，请重新选择",
                            type: 'error'
                        })
                        return;
                    }
                    Editor(data)
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
        holidayName : '',
        holidayStartDate : '',
        holidayEndDate : '',
        startAndEnd:[],
        workOrRest:'1',
        resourceIds:[]
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        holidayName : '',
        holidayStartDate : '',
        holidayEndDate : '',
        startAndEnd:[],
        resourceIds:[]
    }
}

