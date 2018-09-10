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
import {GetList,Agree,Rejected} from "./api/repairAttendenceApplyApi";
import {getOrginations} from "../attendance/api/attendanceApi";

export default {
    created() {
        this.getFirstLvl();
        // this.getList(this.pageParam);
        //设置审批人
        var temp = this.$store.getters.user.user.id;
        if(temp!=''&&temp!=null){
            this.userId=temp;
        }
    },
    data() {
        return {
            firstLvl:[],
            temp:{},
            AuditComment:'',
            rejectedFlag:false,
            userId:'439',
            options:[
                {label:"审批中",value:1},
                {label:"通过",value:2},
                {label:"驳回",value:3},
                {label:"撤回",value:4}
            ],
            tableData: [],
            rowTotal: 0,
            rowData:[],
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            rules: {
            },
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5
    }
    },
    components: {
        //etc...
    },
    methods: {
        fomatterTime(row){
            if(row.repairTime!=null){
                return row.repairTime.substring(0,19)
            }
        },
        fomatterRepair(row){
            if(row.applyTime!=null){
                return row.applyTime.substring(0,19)
            }
        },
        fomatterApprove(row){
            if(row.approverTime!=null){
                return row.approverTime.substring(0,19)
            }
        },
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
                        if(this.firstLvl.length>0){
                            var ids = this.firstLvl.map(item => item.value)
                            this.pageParam.resourceIds = ids;
                        }
                        this.getList(this.pageParam);
                    }
                }
            })
        },
        cancelRejected(){
          this.temp={};
          this.AuditComment='';
          this.rejectedFlag=false;
        },
        submitRejected(){
            var data=this.temp;
            data.auditComment=this.AuditComment;
            Rejected(data).then(resp=>{
                this.getList(this.pageParam);
                this.temp={};
                this.AuditComment='';
                this.rejectedFlag=false;
            })
        },
        onagree(row){
            let data={
                userId:this.userId,
                applyId:row.applyId,
                auditComment:''
            }
            Agree(data).then(resp=>{
                this.getList(this.pageParam);
            })
        }
        ,
        onRejected(row){
            let data={
                userId:this.userId,
                applyId:row.applyId,
                auditComment:''
            }
            this.temp = data;
            this.rejectedFlag=true;
        },
        fomatterState(row){
            if(row.state=='1'){
                return "审核中";
            }else if(row.state=='2'){
                return "通过";
            }else if(row.state=='3'){
                return "驳回";
            }else if(row.state=='4'){
                return "撤销";
            }else{
                return null;
            }
        },
        fomatterAuditState(row){
            if(row.auditState=='0'){
                return "审核中";
            }else if(row.auditState=='1'){
                return "通过";
            }else if(row.auditState=='2'){
                return "驳回";
            }else if(row.auditState=='3'){
                return "撤销";
            }else{
                return null;
            }
        },
        //显示补卡记录表
        getList(pageParam) {
            if(this.firstLvl.length>0){
                var ids = this.firstLvl.map(item => item.value);
                pageParam.resourceIds=ids;
            }
            GetList(pageParam)
                .then((response) => {
                    this.rowTotal = response.code;
                    this.tableData = response.data;
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
        onEdit(row) {
            if(row.repairAuditLog.length>0){
                this.rowData = row.repairAuditLog;
            }else{
                this.rowData=[{
                    realName:row.current_audit_user,
                    auditState:'0'
                }]
            }
            this.temp = $.extend(tempInit(), row);
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
        handleCancel() {
            this.dialogFormVisible = false;
        },
        closeForm() {
            this.formVisible = false;
        }

    }
}

function tempInit() {
    return {
                humanId : '',
                repairTime : '',
                attendenceType : '',
                checkDate : '',
                repairCause : '',
                checkType : '',
                attachment : '',
                state : '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        humanId : '',
        applyDate : '',
        applyType:1,
        state : '',
        resourceIds:[]
    }
}

function rowDataInit(){
    return{
        realName:'',
        auditState:'',
        auditComment:'',
        approverTime:''
    }
}

