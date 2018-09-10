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
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus} from "./api/humanResourceRefApi";

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
        //显示人员、资源关系
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
                humanId : '',
                resourceId : '',
                                }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
            humanId : '',
            resourceId : '',
    }
}

