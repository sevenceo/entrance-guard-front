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
  * 创建日期：2018-7-7
  * </pre>
  */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus,GetResourceTree,GetSceneList} from "./api/faceCompareHistoryApi";
import EXIF from "../../utils/exif";
import store from '../../store';

export default {
    watch: {
        filterText(val) {
            this.$refs.tenantTree.filter(val);
        }
    },
    created() {
        this.getList(this.pageParam);
        this.getResourceTree();
    },
    data() {
        return {
            tableData: [],
            filterText: '',
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
            compareFaceJson:false,
            temp: tempInit(),
            jsonData:'',
            rules: {

                compareJson:
                    [
                            {required: true, message: '请输入人脸比对', trigger: 'blur'},
],
                sensingDeviceId:
                    [
                            {required: true, message: '请输入摄像机id', trigger: 'blur'},
],
                sensingDeviceIp:
                    [
                            {required: true, message: '请输入摄像机IP', trigger: 'blur'},
                            {max: 128, message: '摄像机IP不得超过128个字符'}],
                sceneId:
                    [
                            {required: true, message: '请输入场景id', trigger: 'blur'},
],
                sceneName:
                    [
                            {required: true, message: '请输入场景名称', trigger: 'blur'},
                            {max: 255, message: '场景名称不得超过255个字符'}],
                aiServerId:
                    [
                            {required: true, message: '请输入AI服务器id', trigger: 'blur'},
],
                aiServerIp:
                    [
                            {required: true, message: '请输入盒子服务器ip', trigger: 'blur'},
                            {max: 255, message: '盒子服务器ip不得超过255个字符'}],
                ldServerNumber:
                    [
                            {required: true, message: '请输入终端服务器编号', trigger: 'blur'},
                            {max: 255, message: '终端服务器编号不得超过255个字符'}],







                tenantId:
                    [
                            {required: true, message: '请输入租户id', trigger: 'blur'},
                            {max: 128, message: '租户id不得超过128个字符'}],
            },
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5,
            compareJson: [],
            showType: {
                "1": '报警',
                "2": "警告",
                "3": "欢迎",
                "4": "其他",
            },
            value1:'',
            value2:'',
            pickerOptions0: {
                disabledDate: (time) => {
                        return time.getTime() > Date.now();

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();
                }
            },
            treeData:[],
            resourceName:'',
            parentTree:false,
            sceneList:[],
            props: {
                children: 'child',
                id: 'id',
                label: 'text',
                // isLeaf: 'isLeaf'
            },

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
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            if (this.pageParam.page == 1){
                this.getList(this.pageParam)
            }else{
                this.$refs.pages.changePage(1)
            }
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.value1 = '';
            this.value2 = '';
            this.pageParam = pageParamInit();
            this.resourceName = '';
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
            this.temp = tempInit();
            this.pageParam = pageParamInit();
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        },
        detail(row) {
            this.compareFaceJson = true;
            this.jsonData = JSON.parse(row.compareJson);
          /*  this.compareJson.push(this.jsonData);
            console.log(this.jsonData);*/
        },
        closeCompareFaceJson(){
            this.compareFaceJson = false;
           /* this.compareJson = [];
            this.jsonData = '';*/
        },
        setBeginDate(val){
            if (val != undefined){
                this.pageParam.beginTime = val
            }
        },
        setEndDate(val) {
            if (val != undefined){
                var start=new Date(this.pageParam.beginTime);
                var end=new Date(val);
                if (start>=end) {
                    this.$message({
                        message: "结束时间必须大于开始时间",
                        type: 'error'
                    })
                    this.value2 ='';
                    return
                }else{
                    this.pageParam.endTime = val;
                }
            }
        },
        getResourceTree(){
            GetResourceTree().then((result) =>{
                this.treeData = result.data;
            })
        },
        showParentTree(){
            this.parentTree = true;
            this.pageParam.sceneId = ''
           /* this.loadTreeNode();*/
        },
        //添加界面的树
        loadTreeNode() {
           /* GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });*/
        },
        nodeClick(data, node, object){
            // this.selectedCommunity = data;
            //this.pageParam.operator = data.id;
            this.pageParam.sceneId = '';
            this.resourceName = data.text;
            this.parentTree = false;
            if (data.children){
                GetSceneList(data.id,'org').then((result)=>{
                    this.sceneList = result.data;
                    this.pageParam.corpId = '';
                    this.pageParam.orgId = data.id;
                })
            }else{
                GetSceneList(data.id,'corp').then((result)=>{
                    this.sceneList = result.data;
                    this.pageParam.orgId = '';
                    this.pageParam.corpId = data.id;
                })
            }



        },
        filterTenantNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
    }
}

function tempInit() {
    return {
                compareJson : '',
                sensingDeviceId : '',
                sensingDeviceIp : '',
                sceneId : '',
                sceneName : '',
                aiServerId : '',
                aiServerIp : '',
                ldServerNumber : '',
                tenantId : '',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        pageSize:10,
        rowTotal: 0,
            compareJson : '',
            sensingDeviceId : '',
            sensingDeviceIp : '',
            sceneId : '',
            sceneName : '',
            aiServerId : '',
            aiServerIp : '',
            ldServerNumber : '',
            tenantId : '',
            beginTime:'',
            endTime:'',
            orgId:'',
            corpId:''
    }
}

