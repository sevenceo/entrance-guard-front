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
 * 创建日期：2018-3-23
 * </pre>
 */
import {GetList, Create, Editor, Delete,BatchDelete,Status,BatchStatus} from "./api/dealerInfoApi";

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

                brandCode:
                    [
                        {required: true, message: '请输入所属品牌', trigger: 'blur'},
                        {
                            max: 36,
                            message: '所属品牌不得超过36个字符'
                        }],
                code:
                    [

                        {
                            max: 36,
                            message: '经销商编码不得超过36个字符'
                        }],
                name:
                    [

                        {
                            max: 36,
                            message: '经销商名称不得超过36个字符'
                        }],


                address:
                    [
                        {required: true, message: '请输入地址', trigger: 'blur'},
                        {
                            max: 100,
                            message: '地址不得超过100个字符'
                        }],
                contractName:
                    [

                        {
                            max: 12,
                            message: '联系名称不得超过12个字符'
                        }],
                contractPhone:
                    [

                        {
                            max: 12,
                            message: '联系电话不得超过12个字符'
                        }],
                salesTel:
                    [

                        {
                            max: 12,
                            message: '销售电话不得超过12个字符'
                        }],
                aftermarketPhone:
                    [
                        {required: true, message: '请输入售后电话', trigger: 'blur'},
                        {
                            max: 12,
                            message: '售后电话不得超过12个字符'
                        }],
                areaCode:
                    [

                        {
                            max: 36,
                            message: '区域编码不得超过36个字符'
                        }],
                mediaCode:
                    [
                        {required: true, message: '请输入垂直媒体编码', trigger: 'blur'},
                        {
                            max: 72,
                            message: '垂直媒体编码不得超过72个字符'
                        }],
                tdImageId:
                    [
                        {required: true, message: '请输入经销商店二维码图片Id', trigger: 'blur'},
                        {
                            max: 36,
                            message: '经销商店二维码图片Id不得超过36个字符'
                        }],
                imageId:
                    [
                        {required: true, message: '请输入门店形象图片Id', trigger: 'blur'},
                        {
                            max: 36,
                            message: '门店形象图片Id不得超过36个字符'
                        }],
                warpLatitude:
                    [
                        {required: true, message: '请输入经纬度', trigger: 'blur'},
                        {
                            max: 36,
                            message: '经纬度不得超过36个字符'
                        }],

                siteUrl:
                    [
                        {required: true, message: '请输入网站地址', trigger: 'blur'},
                        {
                            max: 36,
                            message: '网站地址不得超过36个字符'
                        }],


                //corpName: [
                //    {required: true, message: '请输入企业名称', trigger: 'blur'},
                //    {max: 20, message: '企业名称不得超过20个字符'}
                //]
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
        //显示经销商信息
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
        // handleRowClick(row, event, column) {
        //     this.$refs.table.toggleRowSelection(row)
        // },
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
        'brandCode': '',
        'code': '',
        'name': '',
        'provinceId': '',
        'cityId': '',
        'address': '',
        'contractName': '',
        'contractPhone': '',
        'salesTel': '',
        'aftermarketPhone': '',
        'areaCode': '',
        'mediaCode': '',
        'tdImageId': '',
        'imageId': '',
        'warpLatitude': '',
        'enabledSite': '',
        'siteUrl': '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        'brandCode': '',
        'code': '',
        'name': '',
        'provinceId': '',
        'cityId': '',
        'address': '',
        'contractName': '',
        'contractPhone': '',
        'salesTel': '',
        'aftermarketPhone': '',
        'areaCode': '',
        'mediaCode': '',
        'tdImageId': '',
        'imageId': '',
        'warpLatitude': '',
        'enabledSite': '',
        'siteUrl': '',
    }
}

