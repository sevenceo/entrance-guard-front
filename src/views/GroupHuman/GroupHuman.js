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
 * 创建日期：2018-4-10
 * </pre>
 */
import {
    BatchDelete,
    BatchStatus,
    Create,
    Delete,
    DetailDelete,
    DetailDeleteGroupSceneRef,
    Editor,
    GetByIdHumanList,
    GetByIdSenceList,
    GetList,
    GetPageByIdHumanList,
    GroupSceneInsertBatch,
    HumanGroupInsertBatch,
    Status,
    VerifyHumanAndScene,
    GetAllOrgs,
    GetBuilding,
    GetUnit
} from "./api/groupHumanApi";

export default {
    created() {
        GetAllOrgs().then((result) =>{
            this.options = result.data;
        })
        this.getList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            tableDataHuman: [],
            tableDataAdd: [],
            tableDataSence: [],
            tableDataAddSence: [],
            options: [],
            rowTotal: 10,
            humanRowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            genderInfo: {
                "1": '男',
                "2": "女"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            searchHumanFormVisible: false,
            temp: tempInit(),
            rules: {

                groupName:
                    [

                        {required: true, max: 128, message: '组名不得超过128个字符'}],
                remark:
                    [
                        {required: true, message: '请输入备注', trigger: 'blur'},
                        {max: 256, message: '备注不得超过256个字符'}],


            },
            pageParam: pageParamInit(),
            formVisible: false,
            dialogHumanDetail: false,
            dialogAddData: false,
            dialogSceneDetail: false,
            dialogAddHumanSenctData: false,
            errorTip: "",
            errorLine: 5,
            genders: [{
                value: '1',
                label: '男'
            }, {
                value: '2',
                label: '女'
            }],
            building:buildingInit(),
            unit: unitInit(),
            buildings: [],
            units: [],
            tenantId:'',
        }
    },
    components: {
        //etc...
    },
    methods: {
        changeValue() {
            if(this.pageParam.building != null && this.pageParam.building != ''){
                this.unit.tenantId = this.tenantId;
                this.unit.parentId = this.pageParam.building;
                GetUnit(this.unit).then((response)=>{
                    if(response.data != null) {
                        console.log(response.data);
                        this.units = response.data.data;
                    }
                })
                /*console.log("bbbbb: " + this.pageParam.building);
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa:      " + this.pageParam.building + "     " + this.tenantId)*/
            }
        },
        //显示人员组
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
        handleSelectionChangeHGR(selection) {
            this.selectionDataHuman = selection
        },
        handleSelectionChangeGSR(selection) {
            this.selectionDataGSR = selection
        },

        //人员翻页功能
        handleHumanCurrentChange(page) {
            this.pageParam.page = page;
            this.addPageByIdList(this.pageParam)
        },
        handleHumanSelectionChange(selection) {
            this.selectionData = selection
        },
        handleHumanSelectionChangeHGR(selection) {
            this.selectionDataHuman = selection
        },
        handleHumanSelectionChangeGSR(selection) {
            this.selectionDataGSR = selection
        },
        /*************************************组成员，查看，删除，新增*******************************************************************/
        onHumanDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.groupId = row.id;
            this.pageParam.type = "1";
            this.addPageByIdList(this.pageParam)
            /*弹框查看组成员显示*/
            this.dialogHumanDetail = true;
        },
        getByIdHumanList(pageParam) {
            GetByIdHumanList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataHuman = response.data;
                    } else {
                        this.tableDataHuman = [];
                    }

                })
        },
        // 删除组成员
        onHumanDelete(row) {
            let obj = {};
            obj['groupId'] = this.pageParam.groupId;
            obj['humanId'] = row.id;
            console.log(obj);

            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DetailDelete(obj).then(() => {
                        this.pageParam.type = 1;
                        this.addPageByIdList(this.pageParam);
                    })
                })

        },
        /*添加组成员*/
        addHuman(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam = pageParamInit();
            this.pageParam.groupId = row.id;
            this.pageParam.tenantId = row.tenantId;
            this.tenantId = row.tenantId;
            this.pageParam.type = "2";
            this.addPageByIdList(this.pageParam)
            //加载楼栋数据
            this.building.tenantId = row.tenantId;
            this.building.resourceTypeId = '2';
            GetBuilding(this.building).then((response)=>{
                if(response.data != null) {
                    console.log(response.data);
                    this.buildings = response.data.data;
                }
            })
            /*弹框是否显示*/
            this.dialogAddData = true;
        },
        addByIdList(pageParam) {
            GetByIdHumanList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAdd = response.data;
                    } else {
                        this.tableDataAdd = [];
                    }

                })
        },
        addPageByIdList(pageParam) {
            GetPageByIdHumanList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.humanRowTotal = response.data.rowTotal;
                        this.tableDataAdd = response.data.rows;
                        this.tableDataHuman = response.data.rows;
                    } else {
                        this.tableDataAdd = [];
                        this.tableDataHuman = [];
                    }
                })
        },
        onBatchAdd() {
            if (this.selectionDataHuman == undefined || this.selectionDataHuman.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = [];
            var groupId = this.pageParam.groupId;
            var ids = this.selectionDataHuman.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    groupId: groupId,
                    humanId: ids[i]
                })
            }
            this.ConfirmBox('是否确认添加人员？')
                .then(() => {
                    HumanGroupInsertBatch(param)
                        .then(() => {
                            this.addPageByIdList(this.pageParam);
                        })
                })
        },
        /*关闭弹框*/
        closeDetailForm() {
            this.temp = tempInit()
            this.tableDataHuman = []
            this.tableDataAdd = []
            this.tableDataSence = [];
            this.tableDataAddSence = [];
            this.dialogSceneDetail = false;
            this.dialogAddHumanSenctData = false;
            this.dialogHumanDetail = false;
            this.dialogAddData = false;
        },
        /************************************* END 组成员，查看，删除，新增*******************************************************************/
        /*******************************查看场景 关联场景*********************************************************/
        onSenceDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.groupId = row.id;
            this.pageParam.type = "1";
            this.getByIdSenceList(this.pageParam)
            /*弹框查看组成员显示*/
            this.dialogSceneDetail = true;
        },
        getByIdSenceList(pageParam) {
            GetByIdSenceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataSence = response.data;
                    } else {
                        this.tableDataSence = [];
                    }

                })
        },
        // 删除场景
        onSenceDelete(row) {
            let obj = {};
            obj['groupId'] = this.pageParam.groupId;
            obj['sceneId'] = row.id;

            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DetailDeleteGroupSceneRef(obj).then(() => {
                        this.getByIdSenceList(this.pageParam);
                    })
                })

        },
        /*添加场景*/
        addSence(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.groupId = row.id;
            this.pageParam.type = "2";
            this.addByIdSenceList(this.pageParam)
            /*弹框是否显示*/
            this.dialogAddHumanSenctData = true;
        },
        addByIdSenceList(pageParam) {
            GetByIdSenceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAddSence = response.data;
                    } else {
                        this.tableDataAddSence = [];
                    }

                })
        },
        onBatchAddSenece() {
            if (this.selectionDataGSR == undefined || this.selectionDataGSR.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = [];
            var groupId = this.pageParam.groupId;
            var ids = this.selectionDataGSR.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    groupId: groupId,
                    sceneId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联场景？')
                .then(() => {
                    GroupSceneInsertBatch(param)
                        .then(() => {
                            this.addByIdSenceList(this.pageParam);
                        })
                })
        },
        /*******************************END 查看场景 关联场景*********************************************************/
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
        onHumanSearch() {
            let groupId = this.pageParam.groupId;
            this.pageParam = pageParamInit();
            this.pageParam.groupId = groupId;
            this.searchHumanFormVisible = true;
            console.log(this)
        },
        search() {
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        humanSearch() {
            this.pageParam.type = "2";
            this.pageParam.tenantId = this.tenantId;
            this.addPageByIdList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchHumanFormVisible = false;
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
                    var ids = [row.id];
                    // 验证
                    VerifyHumanAndScene(ids).then((response) => {
                        if (response && response.data) {
                            if (response.data.data == true) {
                                this.$message({
                                    message: "已关联人员或场景，不能直接删除",
                                    type: 'error'
                                })
                                return;
                            } else {
                                Delete(row.id)
                                    .then(() => {
                                        this.getList(this.pageParam);
                                    })
                            }
                        }
                    });
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
                    // 验证
                    VerifyHumanAndScene(ids).then((response) => {
                        if (response && response.data) {
                            if (response.data.data == true) {
                                this.$message({
                                    message: "已关联人员或场景，不能直接删除",
                                    type: 'error'
                                })
                                return;
                            } else {
                                BatchDelete(ids)
                                    .then(() => {
                                        this.getList(this.pageParam);
                                    })
                            }
                        }
                    });
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
        groupName: '',
        remark: '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        groupName: '',
        remark: '',
        gender: '',
        realName: '',
        mobilePhone: '',
        email: '',
        organizationId: '',
        tenantId: '',
        building: '',
        unit: ''
    }
}

function buildingInit() {
    return{
        tenantId: '',
        resourceTypeId: '',
    }
}

function unitInit(){
    return{
        tenantId: '',
        parentId: ''
    }
}

