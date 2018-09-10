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
    GetAiServerList,
    GetByIdControlList,
    DetailDelete,
    InfoInsertBatch,
    Create,
    Editor,
    Delete,
    BatchDelete,
    Status,
    BatchStatus,
    ResourceSensingDeviceRefInsertBatch,
    GetRescourceBySensingDeviceId,
    GetCommunityList,
    CancleAssociate,
    GetAllOrgs
} from "./api/sensingDeviceApi";

export default {
    created() {
        GetAllOrgs().then((result) =>{
            this.items = result.data;
        })
        this.getList(this.pageParam);
        this.aiServiceList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            tableDataDetail:[],
            tableDataAdd:[],
            tableDataControl: [],
            tableDataEditControl: [],
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
            temp: tempInit(),
            rules: {

                aiServerId:
                    [
                        {type: "number", required: true, message: '请输入AI服务器ip', trigger: 'blur'},
                    ],
                // mac:
                //     [
                //         {required: true, message: '请输入Mac地址', trigger: 'blur'},
                //         {max: 128, message: 'Mac地址不得超过128个字符'}],
                ip:
                    [
                        {required: true, message: '请输入IP', trigger: 'blur'},
                        {max: 15, message: 'IP不得超过15个字符'}],
                // prot:
                //     [
                //         {required: true, message: '请输入端口', trigger: 'blur'},
                //     ],
                bitStreamAddr:
                    [
                        {required: true, message: '请输入码流地址', trigger: 'blur'},
                        {max: 128, message: '码流地址不得超过128个字符'}],
                // bitStreamPort:
                //     [
                //         {required: true, message: '请输入码流端口', trigger: 'blur'},
                //     ],
                remark:
                    [
                        {required: true, message: '请输入备注', trigger: 'blur'},
                        {max: 256, message: '名称不得超过256个字符'}],


            },
            pageParam: pageParamInit(),
            formVisible: false,
            dialogDetail: false,
            dialogCorrelation: false,
            errorTip: "",
            errorLine: 5,
            options: [],
            items: [],
            sensingDeviceId : ''
        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示感应设备
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
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
        handleSelectionChangeCorrelation(selection) {
            this.selectionDataCorrelation = selection
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
        onDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sensingDeviceId = row.id;
            this.pageParam.type = 1;
            this.getByIdControlList(this.pageParam)
            /*弹框是否显示*/
            this.dialogDetail = true;
        },
        getByIdControlList(pageParam) {
            GetByIdControlList(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableDataControl = response.data;
                    } else {
                        this.tableDataControl = [];
                    }

                })
        },

        //查看门禁删除
        onDetailDelete(row) {
            let obj = {};
            obj['sensingDeviceId'] = this.pageParam.sensingDeviceId;
            obj['controlDeviceId'] = row.id;
            console.log(obj);
            // sensingDeviceId: page.sensingDeviceId,
            //     controlDeviceId: page.controlDeviceId,
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DetailDelete(obj).then(() => {
                        this.getByIdControlList(this.pageParam);
                    })
                })

        },
        /*展示当前摄像头没有关联的门禁*/
        onCorrelation(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sensingDeviceId = row.id;
            this.pageParam.type = 2;
            this.editByIdControlList(this.pageParam)
            /*弹框是否显示*/
            this.dialogCorrelation = true;
        },
        editByIdControlList(pageParam) {
            GetByIdControlList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableDataEditControl = response.data;
                    } else {
                        this.tableDataEditControl = [];
                    }

                })
        },
        onBatchCorrelation() {
            if (this.selectionDataCorrelation == undefined || this.selectionDataCorrelation.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            console.log("***************************************************************");
            var param = [];
            var sensingDeviceId = this.pageParam.sensingDeviceId;
            var ids = this.selectionDataCorrelation.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    sensingDeviceId: sensingDeviceId,
                    controlDeviceId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联门禁？')
                .then(() => {
                    InfoInsertBatch(param)
                        .then(() => {
                            this.editByIdControlList(this.pageParam);
                        })
                })
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
            // this.temp.aiServerId=this.temp.aiServerId+"";
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
            // this.temp.aiServerId=this.temp.aiServerId+"";
            this.temp.prot = this.temp.prot + "";
            this.temp.bitStreamPort = this.temp.bitStreamPort + "";
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
        /*关闭查看门禁弹框*/
        closeDetailForm() {
            this.temp = tempInit()
            this.tableDataControl = []
            this.tableDataEditControl = []
            this.dialogDetail = false;
            this.dialogCorrelation = false;
            this.dialogAddData = false;
        },
        aiServiceList(page) {
            GetAiServerList(page).then(data => {
                this.options = data.data;
            });
        },
        /**
         * 场景分布
         * @param row
         */
        sceneDistribution(row) {
            this.$router.push({path: '/guard/sceneCanvas', query: {sensingId: row.id}});
        },


        DetailHumanResourceRef(row) {
            this.tableDataDetail = [];
            this.temp = $.extend(tempInit(), row);
            this.sensingDeviceId = row.id;
            //this.pageParam.type = "1";
            this.getByIdResourceList(row.id)
            /*弹框查看组织*/
            this.dialogResourceDetail = true;
        },
        getByIdResourceList(serverId) {
            GetRescourceBySensingDeviceId(serverId)
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
            this.sensingDeviceId = row.id;
            this.addByIdList(row.id)
            /*弹框是否显示*/
            this.dialogAddData = true;
        },
        addByIdList(sensingDeviceId) {
            GetCommunityList(sensingDeviceId)
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
            /*let obj = {};
            obj['id'] = this.sensingDeviceId;
            obj['tenantId'] = row.id;*/
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    CancleAssociate(this.sensingDeviceId).then(() => {
                        this.dialogResourceDetail = false;
                        this.getByIdResourceList(this.sensingDeviceId);
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
            var id = this.sensingDeviceId;
            var tenantId = this.selectionDataResource[0].orgId;
            //获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认关联资源？')
                .then(() => {
                    ResourceSensingDeviceRefInsertBatch(id,tenantId)
                        .then(() => {
                            this.dialogAddData = false;
                            this.getList(this.pageParam);;
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
        aiServerId: null,
        mac: '',
        ip: '',
        prot: '',
        bitStreamAddr: '',
        bitStreamPort: '',
        remark: '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        aiServerId: '',
        id: '',
        mac: '',
        ip: '',
        prot: '',
        bitStreamAddr: '',
        bitStreamPort: '',
        remark: '',
        organizationId: ''
    }
}

