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
    GetByIdSensingList,
    Create,
    Editor,
    Delete,
    BatchDelete,
    Status,
    BatchStatus,
    openDoor,
    ResourceControlDeviceRefInsertBatch,
    GetRescourceByControlDeviceId,
    GetCommunityList,
    CancleAssociate,
    GetAllOrgs
} from "./api/controlDeviceApi";

export default {
    created() {
        GetAllOrgs().then((result) =>{
            this.options = result.data;
        })
        this.getList(this.pageParam);
        // this.getByIdSensingList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            tableDataAdd:[],
            tableDataControl: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            dialogAddData : false,
            dialogResourceDetail : false,
            tableDataDetail:[],
            temp: tempInit(),
            rules: {

                ip:
                    [
                        {required: true, message: '请输入IP', trigger: 'blur'},
                        {max: 128, message: 'ip不得超过128个字符'}],
                port:
                    [
                        {required: true, message: '请输入端口'}],
                delayTime:
                    [
                        {required: true, message: '请输入关门延迟时间（秒）'}],
                onCommond:
                    [
                        {required: true, message: '请输入开门指令', trigger: 'blur'},
                        {max: 50, message: '开门指令不得超过128个字符'}],
                offCommond:
                    [
                        {required: true, message: '请输入关门指令', trigger: 'blur'},
                        {max: 50, message: '开门指令不得超过128个字符'}],
                remark:
                    [
                        {required: true, message: '请输入备注', trigger: 'blur'},
                        {max: 256, message: '备注不得超过256个字符'}],


            },
            pageParam: pageParamInit(),
            formVisible: false,
            dialogDetail: false,
            errorTip: "",
            errorLine: 5,
            controlDeviceId : '',
            options: []
        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示控制设备
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(11111111111111111111111111111111111111111111111111111111111);
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableData = response.data.rows;
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
        onDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.controlDeviceId = row.id;
            this.pageParam.type = "1";
            this.getByIdSensingList(this.pageParam)
            /*弹框是否显示*/
            this.dialogDetail = true;
        },
        getByIdSensingList(pageParam) {
            GetByIdSensingList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataControl = response.data;
                    } else {
                        this.tableDataControl = [];
                    }
                })
        },
        /*关闭查看摄头弹框*/
        closeDetailForm() {
            this.temp = tempInit()
            this.tableDataControl = []
            this.dialogDetail = false;
            this.dialogAddData =false;
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
        onOpenDoor(row) {
            // 开门
            openDoor(row);
        },



        DetailHumanResourceRef(row) {
            this.tableDataDetail = [];
            this.temp = $.extend(tempInit(), row);
            this.controlDeviceId = row.id;
            //this.pageParam.type = "1";
            this.getByIdResourceList(row.id)
            /*弹框查看组织*/
            this.dialogResourceDetail = true;
        },
        getByIdResourceList(controlDeviceId) {
            GetRescourceByControlDeviceId(controlDeviceId)
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
        addHumanResourceRef(row) {
            this.temp = $.extend(tempInit(), row);
            //this.pageParam.aiServerId = row.id;
            //this.pageParam.type = "2";
            this.controlDeviceId = row.id;
            this.addByIdList(row.id)
            /*弹框是否显示*/
            this.dialogAddData = true;
        },
        addByIdList(controlDeviceId) {
            GetCommunityList(controlDeviceId)
                .then((response) => {
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAdd = response.data;
                    } else {
                        this.tableDataAdd = [];
                    }

                })
        },
        onResourceDelete(row) {
           /* let obj = {};
            obj['id'] = this.controlDeviceId;
            obj['tenantId'] = row.id;*/
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    CancleAssociate(this.controlDeviceId).then(() => {
                        this.dialogResourceDetail = false;
                        this.getByIdResourceList(this.controlDeviceId);
                        this.getList(this.pageParam);
                    })
                })
        },
        onBatchAdd() {
            if (this.selectionDataResource == undefined || this.selectionDataResource.length == 0 || this.selectionDataResource.length > 1) {
                this.$message({
                    message: "请选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = {};
            var id = this.controlDeviceId;
            var tenantId = this.selectionDataResource[0].orgId;
            //获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认关联资源？')
                .then(() => {
                    ResourceControlDeviceRefInsertBatch(id,tenantId)
                        .then(() => {
                            this.dialogAddData = false;
                            this.getList(this.pageParam);
                            //this.addByIdList(this.pageParam);
                        })
                })
        },
        handleSelectionChangeResource(selection) {
            this.selectionDataResource = selection
        }


    }
}

function tempInit() {
    return {
        onCommond: '',
        remark: '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        onCommond: '',
        remark: '',
        organizationId:''
    }
}

