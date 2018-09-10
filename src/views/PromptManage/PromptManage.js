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
 * 作   者：Allison
 * 创建日期：2018-7-12
 * </pre>
 */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus, GetPromptTypes,GetHuman,GetPromptHumanGroup,DeleteHumanRef,DeleteGroupRef,SendData} from "./api/promptManageApi";

export default {
    created() {
        this.getList(this.pageParam);
        this.getPromptTypes();
    },
    data() {
        return {
            tableData: [],
            rowTotal: 10,
            rowHumanTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            promptTypes: [],
            temp: tempInit(),
            rules: {

                promptType:
                    [
                        {required: true, message: '请输入提示媒介'},
                    ],
                messageModel:
                    [
                        {required: true, message: '请输入消息模板', trigger: 'blur'},
                        {max: 255, message: '消息模板不得超过255个字符'}],
            },
            pageParam: pageParamInit(),
            humanPageParam: humanPageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5,
            humanSelectVisible: false,
            humanSelect: [],
            humanSelection: [],
            selectedHumanIds: '',
            humanDetailVisible: false,
            humanDetailData: [],
            rowHumanDetailTotal: 10,
            humanGroupDetailVisible: false,
            humanDetailGroupData: [],
            rowHumanGroupDetailTotal: 10,
            humanGroupSelectVisible: false,
            humanGroupSelect: [],
            rowHumanGroupTotal: 10,
            humanGroupsSelection: [],
            selectedHumanGroupIds: [],
        }
    },
    components: {
        //etc...
    },
    methods: {
        getPromptTypes() {
            GetPromptTypes().then((response) => {
                this.promptTypes = response.data;
            });
        }
        ,
        //显示
        getList(pageParam) {
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

            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit();
            this.dialogFormVisible = false;

        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
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
                    this.temp.humanIds = this.selectedHumanIds;
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
                    let humanIds = this.temp.humanIds;
                    if(this.selectedHumanIds != null && this.selectedHumanIds!=''){
                        this.temp.humanIds = humanIds+','+this.selectedHumanIds;
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
                        .then(() => {
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
        },
        selectHuman(row) {
            this.temp = $.extend(tempInit(), row);
            this.humanSelectVisible = true;
            this.humanPageParam.promptId = row.id;
            this.humanPageParam.promptDataType = 'create';
            this.getHuman(this.humanPageParam);
        },
        closeHumanSelect() {
            this.humanSelectVisible = false;
        },
        getHuman(humanPageParam) {
            GetHuman(humanPageParam)
                .then((response) => {
                    this.humanSelect = response.data.rows;
                    this.rowHumanTotal = response.data.rowTotal;
                });
        },
        handleHumanCurrentChange(page){
            this.humanPageParam.page = page;
            this.getHuman(this.humanPageParam)
        },
        humanSelectionChange(selection){
            this.humanSelection = selection;
        },
        matchHuman(){
            this.selectedHumanIds = '';
            if (this.humanSelection == undefined || this.humanSelection.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            let idArray = [];
            for(let i=0;i<this.humanSelection.length;i++){
                idArray.push(this.humanSelection[i].id);
            }
            this.selectedHumanIds = idArray.join();
            let humanIds = this.temp.humanIds;
            if(this.selectedHumanIds != null && this.selectedHumanIds!=''){
                if(humanIds != null && humanIds != ''&& humanIds != ','){
                    this.temp.humanIds = humanIds+','+this.selectedHumanIds;
                }else{
                    this.temp.humanIds = this.selectedHumanIds;
                }

            }
            Editor(this.temp)
                .then(() => {
                    this.humanSelectVisible = false;
                    this.getList(this.pageParam);
                    this.temp = tempInit()
                })
            ;

        },
        humanDetail(row){
            this.temp = $.extend(tempInit(), row);
            this.humanDetailVisible = true;
            this.humanPageParam.promptDataType = 'update';
            this.humanPageParam.promptId= row.id;
            this.getPromptHuman(this.humanPageParam);
        },
        getPromptHuman(pageParam){
            GetHuman(pageParam)
                .then((response)=>{
                    this.rowHumanDetailTotal = response.data.rowTotal;
                    this.humanDetailData = response.data.rows;
                });
        },
        closeHumanDetail(){
            this.humanDetailVisible = false;
        },
        handleHumanDetailCurrentChange(page){
            this.humanPageParam.page = page;
            this.getPromptHuman(this.humanPageParam)
        },
        onHumanDelete(row){
            this.temp.humanIds = row.id;
            this.ConfirmBox('是否确认删除') .then(() => {
                    DeleteHumanRef(this.temp)
                        .then(() => {
                            this.getPromptHuman(this.humanPageParam)
                    })
            })

        },
        humanGroupDetail(row){
            this.temp = $.extend(tempInit(), row);
            this.humanGroupDetailVisible = true;
            this.humanPageParam.promptDataType = 'update';
            this.humanPageParam.promptId= row.id;
            this.getPromptHumanGroup(this.humanPageParam);
        },
        getPromptHumanGroup(pageParam) {
            GetPromptHumanGroup(pageParam)
                .then((response) => {
                    this.rowHumanGroupDetailTotal = response.data.rowTotal;
                    this.humanDetailGroupData = response.data.rows;
                });
        },
        handleHumanGroupDetailCurrentChange(page){
            this.humanPageParam.page = page;
            this.getPromptHumanGroup(this.humanPageParam);
        },
        selectHumanGroup(row){
            this.temp = $.extend(tempInit(), row);
            this.humanGroupSelectVisible = true;
            this.humanPageParam.promptDataType = 'create';
            this.humanPageParam.promptId= row.id;
            this.getPromptHumanGroupSelect(this.humanPageParam);
        },
        getPromptHumanGroupSelect(pageParam){
            GetPromptHumanGroup(pageParam)
                .then((response) => {
                    this.rowHumanGroupTotal = response.data.rowTotal;
                    this.humanGroupSelect = response.data.rows;
                });
        },
        handleHumanGroupCurrentChange(page){
            this.humanPageParam.page = page;
            this.getPromptHumanGroupSelect(this.humanPageParam);
        },
        closeHumanGroupSelect(){
            this.humanGroupSelectVisible = false;
        },
        humanGroupSelectionChange(selection){
            this.humanGroupsSelection = selection;
        },
        matchHumanGroup(){
            this.selectedHumanGroupIds = '';
            if (this.humanGroupsSelection == undefined || this.humanGroupsSelection.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            let idArray = [];
            for(let i=0;i<this.humanGroupsSelection.length;i++){
                idArray.push(this.humanGroupsSelection[i].id);
            }
            this.selectedHumanGroupIds = idArray.join();
            let humanGroupIds = this.temp.humanGroupIds;
            if(this.selectedHumanGroupIds != null && this.selectedHumanGroupIds!=''){
                if(humanGroupIds != null && humanGroupIds != '' && humanGroupIds != ','){
                    this.temp.humanGroupIds = humanGroupIds+','+this.selectedHumanGroupIds;
                }else{
                    this.temp.humanGroupIds = this.selectedHumanGroupIds;
                }

            }
            Editor(this.temp)
                .then(() => {
                    this.humanGroupSelectVisible = false;
                    this.getList(this.pageParam);
                    this.temp = tempInit()
                })
            ;
        },
        closeHumanGroupDetail(){
            this.humanGroupDetailVisible = false;
        },
        onHumanGroupDelete(row){
            this.temp.humanGroupIds = row.id;
            this.ConfirmBox('是否确认删除') .then(() => {
                DeleteGroupRef(this.temp)
                    .then(() => {
                        this.getPromptHumanGroup(this.humanPageParam);
                    })
            })
        },
        sendData(row){
            this.temp = $.extend(tempInit(), row);
            SendData(this.temp)
                .then((response)=>{

                })
        },
    }
}

function tempInit() {
    return {
        promptType: '',
        humanIds: '',
        humanGroupIds: '',
        messageModel: '',
        noticeIds: '',
        tenantId: '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        id:'',
        promptType: '',
        promptDataType:'',
        promptId: '',
        humanIds: '',
        messageModel: '',
        noticeIds: '',
        tenantId: '',
    }
}

function humanPageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        humanIds: [],
        promptId: '',
        promptDataType:''
    }
}

