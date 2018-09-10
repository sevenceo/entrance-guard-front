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
  * 创建日期：2018-6-27
  * </pre>
  */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus, GetVersionList,GetLdList,Relation,DeleteRef ,GetTypeList,GetUpgradeURL,IssueData} from "./api/appUpgradeApi";
import {GetRescourceByLdServerId} from "../LdServer/api/LdServerApi";

export default {
    created() {
        this.getList(this.pageParam);
        this.getVersionList();
        /*this.getLdList(this.dialogPageParam);*/
    },
    data() {
        return {
            tableData: [],
            dialogTableData: [],
            rowTotal: 10,
            dialogRowTotal:10,
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
                appVersionDes:
                    [{required: true,max: 255, message: '应用版本描述不得超过255个字符'}],
                recommendVersionDes:
                    [{required: true,max: 255, message: '推荐版本描述不得超过255个字符'}],
                upgradeType:
                    [{required: true, message: '请选择升级方式',trigger: 'blur',type :'number'}],
                appVersionId:
                    [{required: true,max: 255, message: '请选择应用版本',trigger: 'blur',type :'number'}],
                recommendVersionId:
                    [{required: true,max: 255, message: '请选择推荐版本',trigger: 'blur',type :'number'}],
            },
            pageParam: pageParamInit(),
            dialogPageParam: pageParamInit(),
            formVisible: false,
            ldServerVisible: false,
            errorTip: "",
            errorLine: 5,
            options: [],
            appUpgradeId: "",
            deleteRef: deleteRefInit(),
            dialogResourceDetail: false,
            tableDataDetail: [],
            optionTypes:[],
            obj:dataIssuedInit()
    }
    },
    components: {
        //etc...
    },
    methods: {
        //显示LD服务器
        getLdList(pageParam,id) {
            GetLdList(pageParam,id)
                .then((response) => {
                    this.dialogRowTotal = response.data.rowTotal;
                    this.dialogTableData = response.data.rows;
                })
        },
        //翻页功能
        dialogHandleCurrentChange(page) {
            this.dialogPageParam.page = page;
            this.getLdList(this.dialogPageParam)
        },
        diaLogHandleSelectionChange(selection) {
            this.dialogSelectionData = selection
        },
        closeLdOnlyForm(){
            this.ldServerVisible = false;
        },
        closeLdForm(){
            console.log(this.dialogSelectionData);
            if (this.dialogSelectionData == undefined || this.dialogSelectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.dialogSelectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认关联')
                .then(() => {
                    Relation(this.appUpgradeId,ids).then(()=>{
                        console.log("relation OK")
                    })

                })
            this.ldServerVisible = false;
        },
        relation(row){
            this.dialogStatus = 'relation';
            this.ldServerVisible = true;
            this.appUpgradeId = row.id;
            this.pageParam.type = '2';
            console.log(this.pageParam);
            this.getLdList(this.pageParam,row.id);
        },
        searchRelation(row){
            this.dialogStatus = 'search';
            this.ldServerVisible = true;
            this.appUpgradeId = row.id;
            this.pageParam.type = '1';
            console.log(this.pageParam);
            this.getLdList(this.pageParam,row.id);
        },
        dialogOnDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    this.deleteRef.appUpgradeId = this.appUpgradeId;
                    this.deleteRef.ldServerId = row.id;
                    DeleteRef(this.deleteRef
                    )
                        .then(() => {
                            this.pageParam.type = '1';
                            this.getLdList(this.pageParam, this.appUpgradeId);
                        })
                })

        },
        //数据下发
        generate(row){
            this.ConfirmBox('是否确认数据下发？')
                .then(() => {
                    this.obj.recommendVersion = row.recommendVersion
                    this.obj.appVersion = row.appVersion
                    //this.obj.upgradeType = row.upgradeType
                    GetUpgradeURL(row.appVersionId).then((response) =>{
                        if (row.upgradeTypeName == '全量升级'){
                            this.obj.upgradeURL = response.data.fullVersionPath;
                            this.obj.upgradeType = 1 ;
                        }else{
                            this.obj.upgradeURL = response.data.incrementalVersionPath;
                            this.obj.upgradeType = 0 ;
                        }
                        //console.log(this.obj);
                        let str = JSON.stringify(this.obj);
                        //console.log(str);
                        IssueData(str,row.id).then((response) =>{
                            console.log(response)
                            if (response.code == 0){
                                this.$message({
                                    message: "数据下发成功",
                                    type: 'success'
                                })
                            }else{
                                this.$message({
                                    message: "数据下发失败",
                                    type: 'error'
                                })
                            }
                        })
                    });
                })
        },
        //查询版本下拉菜单
        getVersionList(){
            GetVersionList().then(response=>{
                this.options = response.data;
                }
            )
            GetTypeList().then(response=>{
                this.optionTypes = response.data;
            })

        },
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
            console.log(this.temp);
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
                    Create(this.temp)
                        .then(() => {
                        this.dialogFormVisible = false;
                    this.dialogStatus = 'create';
                    this.getList(this.pageParam);
                })
                } else {
                    return false;
        }
        });
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
                });
                } else {
                    return false;
        }
        });

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
        },
        closeDetailForm() {
            this.tableDataDetail = [];
            this.dialogResourceDetail = false;
        },
        DetailHumanResourceRef(row){
            this.temp = $.extend(tempInit(), row);
            this.ldServerId = row.id;
            this.pageParam.type = "1";
            this.getByIdResourceList(row.id)
            this.dialogResourceDetail = true;
        },
        getByIdResourceList(serverId) {
            GetRescourceByLdServerId(serverId)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        // this.rowTotal = response.data;
                        this.tableDataDetail.push(response.data);
                    } else {
                        this.tableDataDetail = [];
                    }

                })
        },

    }
}

function tempInit() {
    return {
                appVersionId : '',
                appVersionDes : '',
                recommendVersionId : '',
                recommendVersionDes : '',
                tenantId : '',
                upgradeType:'',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
            appVersionId : '',
            appVersionDes : '',
            recommendVersionId : '',
            recommendVersionDes : '',
            tenantId : '',
            type: '',
    }
}

function dataIssuedInit() {
    return {
        recommendVersion: '',
        appVersion: '',
        upgradeType: '',
        upgradeURL:''
    }
}

function deleteRefInit(){
    return{
        appUpgradeId: '',
        ldServerId: ''
    }
}


