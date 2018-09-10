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
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus} from "./api/orgAttendanceConfigApi";
import {getOrginations} from "../attendance/api/attendanceApi";
import {Message} from "element-ui";

export default {
    created() {
        // //获取当前用户所管理的组织
        // getOrginations().then(resp=>{
        //     if(resp!=null){
        //         this.organizations=resp.data;
        //     }
        // })
        this.getFirstLvl();
    },
    data() {
        return {
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
            temp: tempInit(),
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            organizations:[
                {id:1111, label:'组织1'},
                {id:222, label:'组织2'}
            ],
            organizationName:'',
            rules: {
                // organizationName:
                //     [
                //             {required: true, message: '请选择组织'},
                //     ]
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
        //获取当前用户管理资源的顶级
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
        formatter(row){
            if(row.isNatureMonth=='1'){
                return "是";
            }
            return "否";
        },
        //选中组织
        handleNodeClick(data,node){
            this.temp.resourceId=data.id;
            this.organizationName=data.label;
        },
        selectNodeClick(data,node){
            this.pageParam.resourceId=data.id;
            this.pageParam.organizationName=data.label;
        },
        showOrganization(){
            $('#organizationTree').show();
        },
        closeOrganization(){
            $('#organizationTree').hide();
        },
        //显示
        getList(pageParam) {
            if(this.firstLvl.length>0){
                var ids = this.firstLvl.map(item => item.value);
                pageParam.userResourceIds=ids;
            }
            GetList(pageParam)
                .then((response) => {
                console.log(response);
                if(response.data!=null&&response.data.rows!=null &&response.data.rows.length>0){
                    this.rowTotal = response.data.rowTotal;
                    this.tableData = response.data.rows;
                }else{
                    this.rowTotal = 0;
                    this.tableData = [];
                }
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
            this.organizationName='请选择组织';
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);
            this.temp.resourceId = ''+row.resourceId;
            // this.organizationName = row.organizationName;
            if(this.temp.isSecondMonth=='1'){
                this.temp.isSecondMonth='1';
            }else{
                this.temp.isSecondMonth='0'
            }
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
            this.$refs.pages.changePage(1)

            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
        },

        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var data=this.temp;
                    if(data.resourceIds==[]||data.resourceId==null||data.resourceId==undefined){
                        Message({
                            message: '组织不能为空',
                            type: 'error',
                            customClass: 'msg-error',
                            iconClass: 'ic'
                        })
                        return false;
                    }
                    if(data.isNatureMonth=='0'){
                        if(data.startDay==''||data.startDay==null||data.startDay==undefined){
                            Message({
                                message: '非默认自然月时考勤开始不能为空',
                                type: 'error',
                                customClass: 'msg-error',
                                iconClass: 'ic'
                            })
                            return false;
                        }
                    }
                    this.onXHR = true;
                    Create(this.temp).then((resp) => {
                            if(resp){
                                this.dialogFormVisible = false;
                                this.dialogStatus = 'create';
                                this.getList(this.pageParam);
                            }
                    })
                } else {
                    return false;
                }
        })
            ;

        },
        update(formName) {
            var data= this.$refs[formName];
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var data=this.temp;
                    if(data.resourceId==''||data.resourceId==null||data.resourceId==undefined){
                        Message({
                            message: '组织不能为空',
                            type: 'error',
                            customClass: 'msg-error',
                            iconClass: 'ic'
                        })
                        return false;
                    }
                    if(data.isNatureMonth=='0'){
                        if(data.startDay==''||data.startDay==null||data.startDay==undefined){
                            Message({
                                message: '非默认自然月时考勤开始不能为空',
                                type: 'error',
                                customClass: 'msg-error',
                                iconClass: 'ic'
                            })
                            return false;
                        }
                    }
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
                Delete(row.id).then(() => {
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
        resourceId:'',
        isNatureMonth:1,
        startDay : '',
        endDay : '',
        isSecondMonth:'0',
        resourceIds:[]
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        isNatureMonth : '',
        startDay : '',
        endDay : '',
        organizationName:'请选择组织',
        resourceId:'',
        resourceIds:[],
        userResourceIds:[]
    }
}

