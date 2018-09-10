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
    GetByIdsInfo,
    ScenceSenDevInsertBatch,
    GetByIdResourceList,
    SceneResourceDelete,
    SceneResourceInsertBatch,
    ScenceSenDevDelete,
    Create,
    Editor,
    Delete,
    BatchDelete,
    Status,
    BatchStatus,
    GetByIdControlList,
    InfoInsertBatch,
    DeleteSceneControlRef,
    SceneResourceUpdate
} from "./api/sceneApi";
import {GetResourceTree} from "../humanAudit/api/humanAuditApi";
// import {DetailDelete} from "../SensingDevice/api/SensingDeviceApi";


export default {
    created() {
        this.getList(this.pageParam);
        this.getResourceTree();
    },
    data() {
        return {
            tableData: [],
            resourceTreeData: [],
            ckeckedData: [],
            tableDataSensingDev: [],
            tableDataDetail: [],
            tableDataAdd: [],
            tableDataControl: [],
            tableDataControlDoor: [],
            tableDataEditControlDoor: [],
            treeData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            openedFlags:{
                '1':'开',
                '0':'关'
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            selectedResourceId: [],
            temp: tempInit(),
            rules: {

                sceneName:
                    [

                        {required: true, max: 128, message: '场景名称不得超过128个字符'}],
                remark:
                    [
                        {required: true, message: '请输入备注', trigger: 'blur'},
                        {max: 256, message: '备注不得超过256个字符'}],
                /*selectedResourceId:
                    [
                        {required: true, message: '选择关联资源',},
                    ]*/
            },
            pageParam: pageParamInit(),
            formVisible: false,
            dialogCorrelation: false,
            addResourceRef: false,
            dialogResourceDetail: false,
            dialogAddData: false,
            dialogDetail: false,
            dialogDetailDoor: false,
            dialogCorrelationDoor: false,
            errorTip: "",
            sceneId: "",
            errorLine: 5,
            props: {
                children: 'children',
                id: 'id',
                label: 'label',
                // isLeaf: 'isLeaf'
            },

            options: [{
                id: '1',
                label: '启用'
            }, {
                id: '0',
                label: '停用'
            }],
            value: '',
            timeSlot: timeSlotInit(),
            weekSlot: weekSlotInit(),

        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示场景
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
        getResourceTree() {
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });

        },
        handleCheckChange(data, checked, indeterminate) {
            if (checked) {
                this.selectedResourceId.push(data.id);
            } else {
                let thisId = data.id;
                this.selectedResourceId.remove(data.id);
                for (let i = 0; i < this.selectedResourceId; i++) {
                    if (this.selectedResourceId[i] == thisId) {
                        this.selectedResourceId.remove(this.selectedResourceId[i]);
                    }
                }
            }
            console.log(this.selectedResourceId);
        },
        handleSelectionChangeResource(selection) {
            this.selectionDataResource = selection
        },
        /**************************  关联资源（建筑）  ****************************************/

        DetailResource(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sceneId = row.id;
            this.pageParam.type = "1";
            this.getByIdResourceList(this.pageParam)
            /*弹框查看组成员显示*/
            this.dialogResourceDetail = true;
        },
        getByIdResourceList(pageParam) {
            GetByIdResourceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        // this.rowTotal = response.data;
                        this.tableDataDetail = response.data;
                    } else {
                        this.tableDataDetail = [];
                    }

                })
        },

        onResourceDelete(row) {
            let obj = {};
            obj['sceneId'] = this.pageParam.sceneId;
            obj['resourceId'] = row.id;
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    SceneResourceDelete(obj).then(() => {
                        this.getList(this.pageParam);
                        this.getByIdResourceList(this.pageParam);
                    })
                })
        },
        addSceneResourceRef(row) {
            this.temp = $.extend(tempInit(), row);
            this.sceneId = row.id;
            this.ckeckedData = [];
            this.selectedResourceId = [];
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                    for (let i = 0; i < row.resourceIds.length; i++) {
                        this.ckeckedData.push(row.resourceIds[i]);
                        this.selectedResourceId.push(row.resourceIds[i]);
                    }
                    console.log(this.ckeckedData);
                    console.log(this.selectedResourceId);
                });
            /*弹框是否显示*/
            this.dialogAddData = true;
        },
        addByIdList(pageParam) {
            GetByIdResourceList(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        // this.rowTotal = response.data;
                        this.tableDataAdd = response.data;
                    } else {
                        this.tableDataAdd = [];
                    }

                })
        },
        //查看门禁删除
        onDetailDelete(row) {
            let obj = {};
            obj['sceneId'] = this.pageParam.sceneId;
            obj['controlDeviceId'] = row.id;
            console.log(obj);
            // sensingDeviceId: page.sensingDeviceId,
            //     controlDeviceId: page.controlDeviceId,
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DeleteSceneControlRef(obj).then(() => {
                        this.getByIdControlList(this.pageParam);
                    })
                })

        },
        onBatchAdd() {
            if (this.selectedResourceId == null || this.selectedResourceId == '') {
                this.$message({
                    message: "请选择一条资源",
                    type: 'error'
                })
                return;
            }
            this.selectedResourceId = this.selectedResourceId.unique3();
            if (this.selectedResourceId != null && this.selectedResourceId.length > 1) {
                if (this.selectedResourceId.length == 2 && this.selectedResourceId[0] == this.selectedResourceId[1]) {

                } else {
                    this.$message({
                        message: "只能选择一条资源",
                        type: 'error'
                    })
                    return;
                }

            }
            this.temp.id = this.sceneId;
            this.temp.resourceIds = this.selectedResourceId;
            this.ConfirmBox('是否确认关联资源？')
                .then(() => {
                    SceneResourceUpdate(this.temp)
                        .then(() => {
                            this.dialogAddData = false;
                            this.getList(this.pageParam);
                            this.addByIdList(this.pageParam);
                        })
                })
        },
        /****************************END 关联资源***********************************/
        onAdd() {
            // this.ckeckedData=[1];
            // document.getElementById('resourceTree').onload(()=>{
            //     console.log(this.$refs.resourceTree);
            //     this.$refs.resourceTree.setCheckedKeys([])
            // })
            // console.log(this.$refs.resourceTree);
            // this.$refs.resourceTree.setCheckedKeys([])
            this.temp = tempInit();
            this.getResourceTree();

            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);
            this.temp.openDoorWarningFlag = this.temp.openDoorWarningFlag + '';
            this.temp.deviceWarningFlag = this.temp.deviceWarningFlag + '';
            this.temp.attendanceCard = this.temp.attendanceCard + '';
            this.ckeckedData = [];
            this.selectedResourceId = [];
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                    for (let i = 0; i < row.resourceIds.length; i++) {
                        this.ckeckedData.push(row.resourceIds[i]);
                        this.selectedResourceId.push(row.resourceIds[i]);
                    }
                    console.log(this.ckeckedData);
                    console.log(this.selectedResourceId);
                });


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
            this.selectedResourceId = [];
            this.ckeckedData = [];

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
        /*********************************************添加摄像头*********************************************************************/
        handleSelectionChangeCorrelation(selection) {
            this.selectionDataCorrelation = selection
        },
        /**查看关联摄像头*/
        onDetailSensingDev(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sceneId = row.id;
            this.pageParam.type = 1;
            this.getByIdsDetailInfo(this.pageParam)
            /*弹框是否显示*/
            this.dialogDetail = true;
        },
        getByIdsDetailInfo(pageParam) {
            GetByIdsInfo(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        // this.rowTotal = response.data.rowTotal;
                        this.tableDataControl = response.data;
                    } else {
                        this.tableDataControl = [];
                    }
                })
        },

        onSensingDevDelete(row) {
            let obj = {};
            obj['sceneId'] = this.pageParam.sceneId;
            obj['sensingDeviceId'] = row.id;
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    ScenceSenDevDelete(obj).then(() => {
                        this.getByIdsDetailInfo(this.pageParam);
                    })
                })
        },
        /*展示当前场景  没有关联的摄像头*/
        onSensingDev(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sceneId = row.id;
            this.pageParam.type = 2;
            //判断是否已经关联摄像头
            GetByIdsInfo(this.pageParam)
                .then((response) => {
                    if (response.data != null) {
                        console.log(response.data);
                        // console.log("已关联摄像头");
                        // this.$message({
                        //     message: "只能关联一个摄像头",
                        //     type: 'error'
                        // });
                        // return;
                        this.tableDataSensingDev = response.data;
                    } else {
                        // this.tableDataControl = [];
                        this.tableDataSensingDev = [];
                    }
                    /*弹框是否显示*/
                    this.dialogCorrelation = true;
                });
        },
        getByIdsInfo(pageParam) {
            GetByIdsInfo(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        // this.rowTotal = response.data.rowTotal;
                        this.tableDataSensingDev = response.data;
                    } else {
                        this.tableDataSensingDev = [];
                    }
                })
        },
        onBatchSensingDev() {
            if (this.selectionDataCorrelation == undefined || this.selectionDataCorrelation.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            if (this.selectionDataCorrelation != null && this.selectionDataCorrelation.length > 1) {
                this.$message({
                    message: "只能选择一行数据",
                    type: 'error'
                })
                return;
            }
            console.log("***************************************************************");
            var param = [];
            var sceneId = this.pageParam.sceneId;
            var ids = this.selectionDataCorrelation.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    sceneId: sceneId,
                    sensingDeviceId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联摄像头？')
                .then(() => {
                    ScenceSenDevInsertBatch(param)
                        .then(() => {
                            this.getByIdsInfo(this.pageParam);
                        })
                })
        },
        /*关闭弹框*/
        closeDetailForm() {
            this.temp = tempInit();
            this.ckeckedData = [];
            this.selectedResourceId = [];
            this.tableDataSensingDev = [];
            this.tableDataDetail = [];
            this.tableDataAdd = [];
            this.tableDataControl = [];
            this.dialogDetail = false;
            this.dialogCorrelation = false;
            this.dialogResourceDetail = false;
            this.dialogAddData = false;
            this.dialogDetailDoor = false;
            this.dialogCorrelationDoor = false;
        },
        /*********************************************END 添加摄像头*********************************************************************/
        create() {
            if (this.selectedResourceId == null || this.selectedResourceId == '') {
                this.$message({
                    message: "请至少选择一条资源",
                    type: 'error'
                })
                return;
            }
            this.selectedResourceId = this.selectedResourceId.unique3();
            if (this.selectedResourceId != null && this.selectedResourceId.length > 1) {
                if (this.selectedResourceId.length == 2 && this.selectedResourceId[0] == this.selectedResourceId[1]) {

                } else {
                    this.$message({
                        message: "只能选择一条资源",
                        type: 'error'
                    })
                    return;
                }

            }
            this.temp.resourceIds = this.selectedResourceId;
            this.temp.selectedResourceId = this.selectedResourceId[0];
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.selectedResourceId = [];
                            this.ckeckedData = [];
                        })
                } else {
                    return false;
                }
            })
            ;

        },
        update(formName) {
            if (this.selectedResourceId == null || this.selectedResourceId == '') {
                this.$message({
                    message: "请至少选择一条资源",
                    type: 'error'
                })
                return;
            }
            this.selectedResourceId = this.selectedResourceId.unique3();
            if (this.selectedResourceId != null && this.selectedResourceId.length > 1) {
                if (this.selectedResourceId.length == 2 && this.selectedResourceId[0] == this.selectedResourceId[1]) {

                } else {
                    this.$message({
                        message: "只能选择一条资源",
                        type: 'error'
                    })
                    return;
                }

            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.temp.enable) {
                        this.temp.enable = 'true'
                    } else {
                        this.temp.enable = 'false'
                    }
                    this.temp.resourceIds = this.selectedResourceId;
                    Editor(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'update';
                            this.selectedResourceId = [];
                            this.ckeckedData = [];
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
                    Delete(row.id)
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
            this.$refs['form'].resetFields();
            this.selectedResourceId = [];
            this.ckeckedData = [];
        },
        closeForm() {
            this.formVisible = false;
        },
        onDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sceneId = row.id;
            this.pageParam.type = 1;
            this.getByIdControlList(this.pageParam)
            /*弹框是否显示*/
            this.dialogDetailDoor = true;
        },
        getByIdControlList(pageParam) {
            GetByIdControlList(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        // this.rowTotal = response.data.rowTotal;
                        this.tableDataControlDoor = response.data;
                    } else {
                        this.tableDataControlDoor = [];
                    }
                })
        },
        /*展示当前摄像头没有关联的门禁*/
        onCorrelation(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.sceneId = row.id;
            this.pageParam.type = 2;
            this.editByIdControlList(this.pageParam)
            /*弹框是否显示*/
            this.dialogCorrelationDoor = true;
        },
        editByIdControlList(pageParam) {
            GetByIdControlList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        // this.rowTotal = response.data.rowTotal;
                        this.tableDataEditControlDoor = response.data;
                    } else {
                        this.tableDataEditControlDoor = [];
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
            if (this.selectionDataCorrelation != null && this.selectionDataCorrelation.length > 1) {
                this.$message({
                    message: "只能选择一行数据",
                    type: 'error'
                })
                return;
            }
            console.log("***************************************************************");
            var param = [];
            var sceneId = this.pageParam.sceneId;
            var ids = this.selectionDataCorrelation.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    sceneId: sceneId,
                    controlDeviceId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联门禁控制器？')
                .then(() => {
                    InfoInsertBatch(param)
                        .then(() => {
                            this.editByIdControlList(this.pageParam);
                        })
                })
        },
        editByIdControlList(pageParam) {
            GetByIdControlList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        // this.rowTotal = response.data.rowTotal;
                        this.tableDataEditControlDoor = response.data;
                    } else {
                        this.tableDataEditControlDoor = [];
                    }

                })
        }

    }
}

function tempInit() {
    return {
        sceneName: '',
        openDoorWarningFlag: '1',
        deviceWarningFlag: '1',
        openDoorWarningBeginHour: 0,
        openDoorWarningEndHour: 23,
        openDoorWarningBeginDay: 1,
        openDoorWarningEndDay: 7,
        enabledFlag: '',
        remark: '',
        selectedResourceId: '',
        attendanceCard: '0'
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        sceneName: '',
        enabledFlag: '',
        remark: '',
    }
}

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.unique3 = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

function timeSlotInit() {
    let timeArray = [];
    for (var i = 0; i < 24; i++) {
        let obj = {
            label: i,
            value: i,
        }
        timeArray.push(obj);
    }
    return timeArray;
}

function weekSlotInit() {
    let timeArray = [];
    let obj1 = {
        label: 1,
        value: '星期一',
    }
    timeArray.push(obj1);
    let obj2 = {
        label: 2,
        value: '星期二',
    }
    timeArray.push(obj2);
    let obj3 = {
        label: 3,
        value: '星期三',
    }
    timeArray.push(obj3);
    let obj4 = {
        label: 4,
        value: '星期四',
    }
    timeArray.push(obj4);
    let obj5 = {
        label: 5,
        value: '星期五',
    }
    timeArray.push(obj5);
    let obj6 = {
        label: 6,
        value: '星期六',
    }
    timeArray.push(obj6);
    let obj7 = {
        label: 7,
        value: '星期日',
    }
    timeArray.push(obj7);
    return timeArray;
}