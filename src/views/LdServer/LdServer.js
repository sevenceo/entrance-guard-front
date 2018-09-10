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
    Create,
    Editor,
    Delete,
    BatchDelete,
    Status,
    BatchStatus,
    GetCommunityList,
    ResourceLdServerRefInsertBatch,
    GetRescourceByLdServerId,
    ResourceLdServerIdDelete,
    GetVersion,
    Upgrade,
    GetVersionList,
    dataIssue,
    CancleAssociate,
    GetAllOrgs,
    DeviceDataIssue
} from "./api/LdServerApi";
import {HumanResourceDelete, HumanResourceInsertBatch} from "../Human/api/HumanApi";
import {dataSend} from "../dataSend/api/dataSendApi";
import {Message} from "element-ui";

export default {
    created() {
        GetAllOrgs().then((result) =>{
            this.options = result.data;
        })
        this.getList(this.pageParam);
        this.getVersion();
    },
    data() {
        return {
            tableData: [],
            tableDataAdd: [],
            resourceVersionDetail: [],
            tableDataSence: [],
            tableDataAddSence: [],
            tableDataDetail: [],
            versionList: [],
            rowTotal: 10,
            versionRowTotal: 10,
            ldServerId: "",
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            status: {
                "1": '正常',
                "0": "异常"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            rules: {
                ip:
                    [
                        {required: true, message: '请输入IP地址', trigger: 'blur'},
                        {max: 128, message: 'IP不得超过128个字符'}
                    ],
                /*mqttPort:
                    [
                        {required: true, message: '请输入MQTT端口', trigger: 'blur'}
                    ],*/
                clientId:
                    [
                        {required: true, message: '请输入客户端唯一标识', trigger: 'blur'},
                        {max: 50, message: '客户端唯一标识不得超过50个字符'}
                    ],
                topic:
                    [
                        {required: true, message: '请输入订阅主题', trigger: 'blur'},
                        {max: 50, message: '订阅主题不得超过50个字符'}
                    ],
                userName:
                    [
                        {required: true, message: '请输入登录名', trigger: 'blur'},
                        {max: 50, message: '登录名不得超过50个字符'}
                    ],
                password:
                    [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {max: 50, message: 'IP不得超过50个字符'}
                    ]
            },
            pageParam: pageParamInit(),
            options: [],
            dialogResourceDetail: false,
            dialogAddData: false,
            dialogResourceVersionDetail: false,
            formVisible:
                false,
            errorTip:
                "",
            errorLine:
                5

        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示LD服务器
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
            console.log(this.pageParam);
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        getVersion() {
            GetVersionList().then((response) => {
                this.versionList = response.data;
            })
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
        addHumanResourceRef(row) {
            this.temp = $.extend(tempInit(), row);
            this.ldServerId = row.id;
            this.pageParam.type = "2";
            this.addByIdList(row.id)
            /*弹框是否显示*/
            this.dialogAddData = true;
        },
        addByIdList(ldServerId) {
            GetCommunityList(ldServerId)
                .then((response) => {
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAdd = response.data;
                    } else {
                        this.tableDataAdd = [];
                    }

                })
        },
        DetailHumanResourceRef(row) {
            this.tableDataDetail = [];
            this.temp = $.extend(tempInit(), row);
            this.ldServerId = row.id;
            this.pageParam.type = "1";
            this.getByIdResourceList(row.id)
            /*弹框查看组成员显示*/
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
        closeDetailForm() {
            this.temp = tempInit();
            this.tableDataAdd = [];
            this.tableDataSence = [];
            this.tableDataAddSence = [];
            this.tableDataDetail = [];
            // this.dialogAddData = false;
            // this.dialogSenceDetail = false;
            // this.dialogAddHumanSenctData = false;
            this.dialogResourceDetail = false;
            this.dialogAddData = false;
            this.files = [];
            this.getList(this.pageParam);
        },
        onResourceDelete(row) {
           /* let obj = {};
            obj['id'] = this.ldServerId;
            obj['tenantId'] = row.id;*/
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    CancleAssociate(this.ldServerId).then(() => {
                        this.dialogResourceDetail = false;
                        this.getByIdResourceList(this.ldServerId);
                        this.getList(this.pageParam);
                    })
                })
        },
        handleSelectionChangeResource(selection) {
            this.selectionDataResource = selection
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
            var id = this.ldServerId;
            var tenantId = this.selectionDataResource[0].orgId;
            //获取所有选中行的id组成的数组，以逗号分隔
           /* param = {
                "tenantId": tenantId
            };*/

            this.ConfirmBox('是否确认关联资源？')
                .then(() => {
                    ResourceLdServerRefInsertBatch(id,tenantId)
                        .then(() => {
                            this.dialogAddData = false;
                            this.getList(this.pageParam);
                            //this.addByIdList(this.pageParam);
                        })
                })
        },
        send(row) {
            /*GetRescourceByLdServerId(row.id)
                .then((response) => {
                    if (response.data != null) {
                        dataSend(response.data.id,row.id)
                            .then((reps) => {
                                Message({
                                    message: '下发成功',
                                    type: 'success',
                                    customClass: 'msg-success',
                                    iconClass: 'ic'
                                })
                            });
                    } else {
                        this.$message({
                            message: "必须关联一条资源才能下发",
                            type: 'error'
                        })
                        return;

                    }
                });*/
            this.ConfirmBox('是否确认数据下发？')
                .then(() => {
                    dataIssue(row.id)
                        .then((reps) => {
                            Message({
                                message: '下发成功',
                                type: 'success',
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            })
                        });
                })
        },
        manualUpgrade(row) {
            this.ldServerId = row.id;
            let param = {
                page: 1,
                size: 10,
                rowTotal: 0
            }
            GetVersion(param)
                .then((response) => {
                    if (response.data != null) {
                        this.versionRowTotal = response.data.rowTotal;
                        this.resourceVersionDetail = response.data.rows;
                    } else {
                        this.resourceVersionDetail = [];
                    }
                });
            this.dialogResourceVersionDetail = true;
        },
        versionHandleCurrentChange(page) {
            let param = {
                page: page,
                size: 10,
                rowTotal: 0
            }
            GetVersion(param).then((response) => {
                if (response.data != null) {
                    this.versionRowTotal = response.data.rowTotal;
                    this.resourceVersionDetail = response.data.rows;
                } else {
                    this.resourceVersionDetail = [];
                }
            });
        },
        fullSend(row) {
            Upgrade(row.id, 1, this.ldServerId)
                .then((response) => {
                    Message({
                        message: '升级成功',
                        type: 'success',
                        customClass: 'msg-success',
                        iconClass: 'ic'
                    })
                });
            console.log(row.versionNum);

        },
        incrementalSend(row) {
            Upgrade(row.id, 2, this.ldServerId)
                .then((response) => {
                    if (response.data == 1) {
                        Message({
                            message: '升级成功',
                            type: 'success',
                            customClass: 'msg-success',
                            iconClass: 'ic'
                        });
                        this.dialogResourceVersionDetail = false;
                    } else {
                        this.$message({
                            message: "升级失败",
                            type: 'error'
                        })
                    }

                });
            console.log(row.versionNum);
        }
        ,
        sendDevice(row) {
            this.ConfirmBox('是否确认设备数据下发？')
                .then(() => {
                    DeviceDataIssue(row.id)
                        .then((reps) => {
                            Message({
                                message: '下发成功',
                                type: 'success',
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            })
                        });
                })
        },
    }
}

function tempInit() {
    return {
        ip: '',
        currentVersion: '',
        factoryVersion: '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        ip: '',
        organizationId:''
    }
}

