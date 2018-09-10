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
  * 创建日期：2018-6-29
  * </pre>
  */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus, GetAllVersion} from "./api/upgradeRecordApi";

export default {
    created() {
        this.getList(this.pageParam);
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
            upgradeTypeFlags: {
                "1": '手动升级',
                "0": "自动升级"
            },
            upgradeStatusFlags: {
                "1": '成功',
                "0": "失败"
            },
            temp: tempInit(),
            rules: {

                idServerId:
                    [
                            {required: true, message: '请输入终端服务id', trigger: 'blur'},
],
                beforeVersion:
                    [
                            {required: true, message: '请输入升级前版本', trigger: 'blur'},
],
                afterVersion:
                    [
                            {required: true, message: '请输入升级后版本', trigger: 'blur'},
],
                remark:
                    [
                            {required: true, message: '请输入升级记录，备注信息', trigger: 'blur'},
                            {max: 255, message: '升级记录，备注信息不得超过255个字符'}],
                upgradeType:
                    [
                            {required: true, message: '请输入升级类型', trigger: 'blur'},
],






                tenantId:
                    [
                            {required: true, message: '请输入租户id', trigger: 'blur'},
                            {max: 128, message: '租户id不得超过128个字符'}],


                ldServerNumber:
                    [

                            {max: 255, message: '终端服务器编号不得超过255个字符'}],
            },
            upgradeTypes :
                [
                    { value: '0', label: '自动升级'},
                    { value: '1', label: '手动升级'}
                ],
            upradeStatuses:
                [
                    { value: '0', label: '失败'},
                    { value: '1', label: '成功'}
                ],
            pageParam: pageParamInit(),
            formVisible: false,
            versionList : [],
            errorTip: "",
            errorLine: 5
    }
    },
    components: {
        //etc...
    },
    methods: {
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
            this.temp = tempInit()

        },
        onSearch() {
            GetAllVersion().then((response) => {
                this.versionList = response.data;
                console.log(this.versionList);
            });
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
                beforeVersion : '',
                afterVersion : '',
                remark : '',
                upgradeType : '',
                tenantId : '',
                upgradeStatus : '',
                ldServerNumber : '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
            beforeVersion : '',
            afterVersion : '',
            upgradeType : '',
            upgradeStatus : '',
            ldServerNumber : '',
    }
}

