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
    BatchAudit,
    BatchDelete,
    BatchStatus,
    Create,
    Delete,
    DetailDeleteHumanSenceRef,
    Editor,
    GetByIdResourceList,
    GetByIdSenceList,
    GetList,
    GetRelationship,
    HumanResourceDelete,
    HumanResourceInsertBatch,
    HumanSenceInsertBatch,
    Reject,
    Status,
    UpdateFeature,
    GetAllOrgs,
    GetResourceTree,
    JudgeHumanExistByPhone,
    CreateResource,
    GetIdentityList,
    GetResourceByLvlAndTenantIds,
    CreateHuman,
    GetResourceCode,
    GetIdentity,
    GetResourceTreeForSearch,
    GetIsOrg,
    GetOrgIdentity,
    GetSenceListNotAssociated,
    GetAssociatedSenceList,
    GetHumanByResource,
    GetResourceIdsByHumanId,
    GetHumanResourceRefByIds,
    BeforeDelete,
    DeleteAttendance,
    GetAssociatedResource,
} from "./api/humanApi";
import {
    GetCurrentListType,
    GetLeafTree,
    GetListSelective,
    GetRootTree,
    TreeSearchFunction
} from "../Resource/api/ResourceApi";

import EXIF from '../../utils/exif.js';
import store from '../../store';
import VueCropper from 'vue-cropper';

export default {
    watch: {
        filterText(val) {
            this.$refs.tenantTree.filter(val);
        },
        resourceFilterText(val) {
            this.$refs.resourceTree.filter(val);
        }
    },
    created() {
        this.initTree();
        this.getIsOrg();
       // this.getResourceTree();
        /*GetAllOrgs().then((result) => {
            this.options = result.data
        });*/
        //this.getResourceTreeForSearch();
        let refreash = false;
        this.$root.eventHub.$on('changeOrg', (data) => {
            console.log(data);
            refreash = true;
            this.getList(this.pageParam);
        });
        if (!refreash) this.getList(this.pageParam);
    },
    data() {
        //自定义验证
        var checkMobilePhone = (rule, value, callback) => {
            let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
            if (value != '') {
                if (!reg.test(value)) {
                    return callback(new Error('手机格式不正确'));
                }
            }
            callback();
        };
        var checkEmail = (rule, value, callback) => {

            var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (value != '') {
                if (!regEmail.test(value)) {
                    return callback(new Error('邮箱格式不正确'));
                }
            }
            callback();
        };

        var checkAge = (rule, value, callback) => {

            var regAge = /^[0-9]*[1-9][0-9]*$/;
            if (value != '') {
                if (!regAge.test(value)) {
                    return callback(new Error('年龄只能输入数字'));
                }
            }
            callback();
        };
        return {
            props1: {
                label: 'label',
                id: 'id',
                isLeaf: 'leaf',
                children: 'children',
            },
            rootTreeData: [],
            treeSearchFlag:false,
            buttonPane:false,
            activeNameWhileEdit: 'first',
            resourcePaginationShow: false,
            resourcePaginationShowEdit: false,
            scenePaginationShow: false,
            scenePaginationShowEdit: false,
            resourcePageParam: resourcePageParamInit(),
            scenePageParam: scenePageParamInit(),
            viewResourceRowTotal: 0,
            viewSceneRowTotal: 0,
            activeName: 'first',
            dialogCropperFormVisible: false,
            tableData: [],
            ckeckedData: [],
            treeData1: [],
            selectedResourceId: [],
            tableDataAdd: [],
            tableDataSence: [],
            tableDataAddSence: [],
            dataImportFail: [],
            tableDataDetail: [],
            relationshipDetail: [],
            options: [],
            optionsType: [],
            addTemp: addTempInit(),
            rowTotal: 10,
            currentOrgId: '',
            props: {
                children: 'children',
                id: 'id',
                label: 'label',
                // isLeaf: 'isLeaf'
            },
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            auditFlags: {
                "1": '已审核',
                "0": "未审核",
                "2": "驳回",
            },
            genderInfo: {
                "1": '男',
                "2": "女"
            },
            judgeManager: {
                "1": '是',
                "0": '否'
            },
            judgeIncumbencyOrNot: {
                "1": '在职',
                "0": '离职'
            },
            addRules: {


                name:
                    [

                        {required: true, max: 128, message: '资源名称不得超过128个字符'}],
                code:
                    [

                        {required: true, max: 128, message: '资源编码不得超过128个字符'}],
                resourceTypeId:
                    [
                        {required: true, message: '请输入资源类型id', trigger: 'blur'},
                    ],
                city:
                    [{required: true, message: '请输入城市', trigger: 'blur'}],
                telephone:
                    [{required: true, message: '请输入社区电话', trigger: 'blur'}],
                address:
                    [{
                        required: true, message: '请输入社区地址', trigger: 'blur'
                    }]


            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            dialogBatchImport: false,
            dialogImportFail: false,
            addFormVisible: false,
            resourceVisible: false,
            dialogChooseIdentity: false,
            selectedCommunity: {},
            identity: {},
            identityList: [],
            treeData: [],
            resourceType: resourceType(),
            temp: tempInit(),
            action: `/dealer/human/upload`,
            actionWhileAdd: '/dealer/human/uploadImgWhileAddHuman',
            upLoadData: {
                id: '',
                baseStr: ''
            },
            files: [],

            rulesEdit: {
                realName:
                    [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {max: 128, message: '姓名不得超过128个字符'}],
            },

            rules: {

                facePhoto:
                    [
                        {required: true, message: '请输入人脸照片', trigger: 'blur'},
                        {max: 120, message: '人脸照片不得超过120个字符'}],
                realName:
                    [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {max: 128, message: '姓名不得超过128个字符'}],
                /*idNo:
                    [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {max: 18, message: '身份证号不得超过18个字符'},
                        {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '身份证号码格式有误！', trigger: 'blur'}
                    ],*/
                mobilePhone:
                    [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {required: true, max: 11, message: '手机号不得超过11个字符'},
                        {
                            required: true,
                            pattern: /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/,
                            message: '手机号格式有误',
                            trigger: 'blur'
                        }
                    ],
            },
            identityRules: {
                identity:
                    [{required: true, message: '请选择新增人员身份', trigger: 'blur'}],
            },
            pageParam: pageParamInit(),
            formVisible: false,
            dialogAddData: false,
            dialogSenceDetail: false,
            dialogAddHumanSenctData: false,
            dialogResourceDetail: false,
            relationshipDetailVisiable: false,
            dialogImg: false,
            imageUrl: '',
            img_loading: false,
            excel_loading: false,
            errorTip: "",
            errorLine: 5,
            isMemberList: [{
                value: 1,
                label: '是'
            }, {
                value: 0,
                label: '否'
            }],
            genders: [{
                value: '1',
                label: '男'
            }, {
                value: '2',
                label: '女'
            }],
            auditFlagInfo: [{
                value: '1',
                label: '已审核'
            }, {
                value: '2',
                label: '驳回'
            }, {
                value: '0',
                label: '未审核'
            }],
            resourcelvl0: [],
            resourceLvl0Table: false,
            imageUrlFlag: false,
            communityImageUrl: '',
            actionCommunity: "",
            upLoadCommunityData: {
                id: '',
                baseStr: ''
            },
            imageDetail: '',
            picVisible: false,

            //----裁剪区域参数----
            headImg: '',
            //剪切图片上传
            crap: false,
            previews: {},
            option: optionInit(),
            fileName: '',  //本机文件地址
            downImg: '#',
            imgFile: '',
            uploadImgRelaPath: '', //上传后的图片的地址（不带服务器域名）,
            parentTree: false,
            resourceName: '',
            tenantTreeDate: [],
            tenantProps: {
                children: 'child',
                id: 'id',
                label: 'text',
                // isLeaf: 'isLeaf'
            },
            filterText: '',
            isOrg: false,
            optionsArray: [],
            dialogBatchImportEntrepreneur: false,
            isMemberFlag: 0,
            resourceFilterText: '',
            editDialogFormVisible: false,
            viewDialogFormVisible: false,
            humanName: '',
            treeSearch:'',
            treeDataAsync:[],
        }
    },
    components: {
        //etc...
        VueCropper
    },
    methods: {
        treeSearchClick() {
            let param={
                'name':this.treeSearch,
                'enabledFlag':1
            }
            TreeSearchFunction(param).then((response) => {
                if (response.code == 1) {
                    this.initTree();
                    this.treeSearchFlag = false;
                }
                if (response.code == 0) {
                    this.treeSearchFlag = true;
                    setTimeout(() => {
                        this.treeDataAsync = response.data;
                    }, 100);
                }
            })
        },
        loadNode1(node, resolve) {
            this.node = node;
            this.resolve = resolve;
            if (node.level === 0) {
            }
            if (node.level >= 1) {
                this.getLeafTree(node.data.id, resolve);
            }
        },
        initTree() {
            GetRootTree({"enabledFlag":1}).then((response) => {
                this.rootTreeData = response.data;
            });
        },
        initResourceTree() {
            GetRootTree({"enabledFlag":1}).then((response) => {
                this.treeData = response.data;
            });
        },
        getLeafTree(id, resolve) {
            let param ={'enabledFlag':1,'parentId':id}
            GetLeafTree(param).then((response) => {
                resolve(response.data);
            })
        },
        loadNode2(node, resolve) {
            this.node = node;
            this.resolve = resolve;
            if (node.level === 0) {
            }
            if (node.level >= 1) {
                this.getLeafTree2(node.data.id, resolve);
            }
        },
        getLeafTree2(id, resolve) {
            let param ={'enabledFlag':1,'parentId':id}
            GetLeafTree(param).then((response) => {
                resolve(response.data);
            })
        },
        loadNode3(node, resolve) {
            this.node = node;
            this.resolve = resolve;
            if (node.level === 0) {
            }
            if (node.level >= 1) {
                this.getLeafTree3(node.data.id, resolve);
            }
        },
        getLeafTree3(id, resolve) {
            let param ={'enabledFlag':1,'parentId':id}
            GetLeafTree(param).then((response) => {
                resolve(response.data);
                this.$refs.associate.setCheckedKeys(this.ckeckedData);
            })
        },
        closeEditPane() {
            this.editDialogFormVisible = false;
            this.activeNameWhileEdit = 'first'
        },
        resourceFilterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getIsOrg() {
            GetIsOrg().then((response) => {
                console.log(12345);
                if (response.data == '1') {
                    this.isOrg = true;
                } else {
                    this.isOrg = false;
                }
            });
        },
        //显示人员
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    if (response && response.data) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableData = response.data.rows;
                    } else {
                        this.rowTotal = 0;
                        this.tableData = [];
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
        handleSelectionChangeResource(selection) {
            this.selectionDataResource = selection
        },
        handleSelectionChangeResourceLvl0(selection) {
            this.selectionResourceLvl0 = selection;
        },
        handleSelectionChangeScene(selection) {
            this.handleSelectionChangeHSR = selection
        },
        /**************************  关联建筑  ****************************************/

        DetailHumanResourceRef(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.humanId = row.id;
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
                        this.viewResourceRowTotal = response.data.rowTotal;
                        this.tableDataDetail = response.data;
                    } else {
                        this.tableDataDetail = [];
                    }

                })
        },

        onResourceDelete(row) {
            let obj = {};
            obj['humanId'] = this.resourcePageParam.humanId;
            obj['resourceId'] = row.id;
            let items = [];
            let resourceIds = [];
            resourceIds.push(row.id);
            items.push({humanId: this.resourcePageParam.humanId, humanName: this.humanName, resourceIds: resourceIds});
            let that = this;
            that.beforeDelete(items).then((response) => {
                if (response.data == null || response.data == undefined || response.data.length == 0) {
                    let mes = '是否确认删除？'
                    if(that.tableDataDetail.length == 1){
                        mes = '是否确认删除该用户？'
                    }
                    that.ConfirmBox(mes)
                        .then(() => {
                            DeleteAttendance(items);
                            HumanResourceDelete(obj).then(() => {
                                that.resourcePaginationShowEdit = false;
                                GetAssociatedResource(that.resourcePageParam).then((response) => {
                                    console.log(response);
                                    if (response.data != null) {
                                        that.viewResourceRowTotal = response.data.rowTotal;
                                        that.tableDataDetail = response.data.rows;
                                    } else {
                                        that.tableDataDetail = [];
                                        that.viewResourceRowTotal = 0;
                                    }
                                })
                                that.$nextTick(function () {
                                    that.resourcePaginationShowEdit = true
                                    if(that.tableDataDetail.length == 1){
                                       that.editDialogFormVisible = false;
                                       that.getList(that.pageParam);
                                    }
                                })
                            })
                        })
             } else {
                 let message = '';
                 for (let i = 0; i < response.data.length; i++) {
                     message = message + response.data[i].name + "、"
                 }
                 message = message.substr(0, message.length - 1);
                 message += "是考勤组组长，是否确认删除";
                 if (that.tableDataDetail.length == 1){
                     message += "该用户？"
                 } else{
                     message += "?";
                 }
                 that.ConfirmBox(message)
                     .then(() => {
                         DeleteAttendance(items);
                         HumanResourceDelete(obj).then(() => {
                             that.resourcePaginationShowEdit = false;
                             GetAssociatedResource(that.resourcePageParam).then((response) => {
                                 console.log(response);
                                 if (response.data != null) {
                                     that.viewResourceRowTotal = response.data.rowTotal;
                                     that.tableDataDetail = response.data.rows;
                                 } else {
                                     that.tableDataDetail = [];
                                     that.viewResourceRowTotal = 0;
                                 }
                             })
                             that.$nextTick(function () {
                                 that.resourcePaginationShowEdit = true
                             })
                         })
                     })
             }
            })
            /*this.ConfirmBox('是否确认删除')
                .then(() => {
                    HumanResourceDelete(obj).then(() => {
                        this.getByIdResourceList(this.pageParam);
                    })
                })*/
        },
        addHumanResourceRef(row) {
            this.isMemberFlag = 0;
            this.optionsArray = [];
            if (this.isOrg) {
                GetOrgIdentity().then((response) => {
                    let options = [];
                    let communityArray = response.data.communityIdentity;
                    let orgArray = response.data.orgIdentity;
                    let communityObj = {
                        label: '社区身份',
                        options: communityArray
                    }
                    let orgObj = {
                        label: '写字楼身份',
                        options: orgArray
                    }
                    this.optionsArray.push(communityObj);
                    this.optionsArray.push(orgObj);
                })
            } else {
                GetIdentityList().then((result) => {
                    this.identityList = result.data;
                })
            }

            this.temp = $.extend(tempInit(), row);
            this.pageParam.humanId = row.id;
            //debugger;
            this.ckeckedData = [];
            this.selectedResourceId = [];
            let that = this;
            GetRootTree({"enabledFlag":1})
                .then((response) => {
                    //debugger
                    that.treeData1 = response.data;
                    //debugger;
                    for (let i = 0; i < row.resourceIds.length; i++) {
                        that.ckeckedData.push(row.resourceIds[i]);
                        that.selectedResourceId.push(row.resourceIds[i]);
                    }
                    console.log(that.ckeckedData);
                    console.log(that.selectedResourceId);

                });
            /*弹框是否显示*/
            that.dialogAddData = true;
            /* this.temp = $.extend(tempInit(), row);
             this.pageParam.humanId = row.id;
             this.pageParam.type = "2";
             this.addByIdList(this.pageParam)
             /!*弹框是否显示*!/
             this.dialogAddData = true;*/
        },
        handleCheckChange(data, checked, indeterminate) {
            //debugger;
            if (checked) {
                let flag = true;
                for (let i = 0; i < this.ckeckedData.length; i++) {
                    if (this.ckeckedData[i] == data.id) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    console.log(this.identity);
                    if (this.identity.value == '' || this.identity.value == undefined) {
                        this.setChecked(data.id, 1);
                    } else if (this.identity.needLeaf == 1) {
                        if (data.leaf == false) {
                            //debugger;
                            this.setChecked(data.id, 2);
                        } else {
                            this.selectedResourceId.push(data.id);
                        }
                    } else {
                        this.selectedResourceId.push(data.id);
                    }

                }
            } else {
                let flag = true;
                for (let i = 0; i < this.ckeckedData.length; i++) {
                    if (this.ckeckedData[i] == data.id) {
                        flag = false;
                        continue;
                    }
                }
                if (flag){
                    this.selectedResourceId.remove(data.id);
                }
            }
            console.log(this.selectedResourceId);
        },
        setChecked(id, type) {
            if (this.$refs.associate) {
                if (type == 1) {
                    this.$message({
                        message: "请先选择人员身份！",
                        type: 'error'
                    });
                }
                if (type == 2) {
                    this.$message({
                        message: "只能选择最最底层资源",
                        type: 'error'
                    });
                }
                this.$refs.associate.setChecked(id, false, false);
            }
        },
        addByIdList(pageParam) {
            GetByIdResourceList(pageParam)
                .then((response) => {
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAdd = response.data;
                    } else {
                        this.tableDataAdd = [];
                    }

                })
        },
        onBatchAdd() {
           // debugger;
            if (this.selectedResourceId == undefined || this.selectedResourceId.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            if (this.identity.needLeaf == 1) {

            }
            if (this.identity.value == '' || this.identity.value == undefined) {
                this.$message({
                    message: "请先选择人员身份！",
                    type: 'error'
                });
                return;
            }
            var param = [];
            var humanId = this.pageParam.humanId;
            //debugger;
            this.selectedResourceId.map(item =>
                param.push({
                    humanId: humanId,
                    resourceId: item
                })
            )//获取所有选中行的id组成的数组，以逗号分隔

            console.log(param);
            /*for (var i = 0; i < ids.length; i++) {
                param.push({
                    humanId: humanId,
                    resourceId: ids[i]
                })
            }*/
            this.ConfirmBox('是否确认关联资源？')
                .then(() => {
                    HumanResourceInsertBatch(param, this.identity.value, this.isMemberFlag)
                        .then(() => {
                            this.addByIdList(this.pageParam);
                            this.isMemberFlag = 0;
                            this.dialogAddData = false;
                        })
                })
        },

        /*关闭弹框*/
        closeDetailForm() {
            //this.temp = tempInit();
            this.tableDataAdd = [];
            this.tableDataSence = [];
            this.tableDataAddSence = [];
            this.tableDataDetail = [];
            this.dialogAddData = false;
            this.dialogSenceDetail = false;
            this.dialogAddHumanSenctData = false;
            this.dialogResourceDetail = false;
            this.dialogBatchImport = false;
            this.dataImportFail = [];
            this.dialogImportFail = false;
            this.files = [];
            this.getList(this.pageParam);
            this.identity = {}
            this.dialogBatchImportEntrepreneur = false;
        },
        closeBatchImportPane() {
            this.dialogImportFail = false;
            this.dialogBatchImport = false;
            this.dialogBatchImportEntrepreneur = false;
            this.buttonPane = false;
        },
        /****************************END 关联建筑***********************************/

        /*********************** 查看场景   关联场景 *********************************************************/
        onSenceDetail(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.humanId = row.id;
            this.pageParam.type = "1";
            //this.getByIdSenceList(this.pageParam)
            GetAssociatedSenceList(this.pageParam).then((response) => {
                console.log(response);
                if (response.data != null) {
                    //this.rowTotal = response.data;
                    this.tableDataSence = response.data;
                } else {
                    this.tableDataSence = [];
                }
            })
            /*弹框查看组成员显示*/
            this.dialogSenceDetail = true;
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
            obj['humanId'] = this.scenePageParam.humanId;
            obj['sceneId'] = row.id;
            console.log(obj);
            let that = this;
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DetailDeleteHumanSenceRef(obj).then(() => {
                        that.scenePaginationShowEidt = false;
                        GetAssociatedSenceList(that.scenePageParam).then((response) => {
                            console.log(response);
                            if (response.data != null) {
                                that.viewSceneRowTotal = response.data.rowTotal;
                                that.tableDataSence = response.data.rows;
                            } else {
                                that.tableDataSence = [];
                                that.viewSceneRowTotal = 0;
                            }
                        })
                        this.$nextTick(function () {
                            that.scenePaginationShowEdit = true
                        })
                    })
                })

        },
        reject(row) {
            this.ConfirmBox('确认驳回')
                .then(() => {
                    Reject(row.id).then(() => {
                        this.$message({
                            message: "驳回成功！",
                            type: 'success'
                        })
                        this.getList(this.pageParam)
                    });

                })
        },
        /*添加场景*/
        addSence(row) {
            this.temp = $.extend(tempInit(), row);
            this.pageParam.humanId = row.id;
            this.pageParam.type = "2";
            //this.addByIdSenceList(this.pageParam)
            GetSenceListNotAssociated(this.pageParam).then((response) => {
                if (response.data != null) {
                    //this.rowTotal = response.data;
                    this.tableDataAddSence = response.data;
                }
            })
            /*弹框是否显示*/
            this.dialogAddHumanSenctData = true;
        },
        addByIdSenceList(pageParam) {
            GetByIdSenceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        //this.rowTotal = response.data;
                        this.tableDataAddSence = response.data;
                    }

                })
        },
        onBatchAddSenece() {
            if (this.handleSelectionChangeHSR == undefined || this.handleSelectionChangeHSR.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = [];
            var humanId = this.pageParam.humanId;
            var ids = this.handleSelectionChangeHSR.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    humanId: humanId,
                    sceneId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联场景？')
                .then(() => {
                    HumanSenceInsertBatch(param)
                        .then(() => {
                            this.addByIdSenceList(this.pageParam);
                            this.dialogAddHumanSenctData = false;
                        })
                })
        },

        /*********************** END关联场景   关联场景 *********************************************************/
        /******************************END 上传照片**********************************************************/
        /**
         * 上传图片，成功后回调
         * @param res
         * @param file
         */
        handleAvatarSuccess(res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw);
            // this.img_loading = false;

            this.getList(this.pageParam);
            this.$message({
                message: "上传成功！",
                type: 'success'
            })
        },
        handleImportSuccess(response) {
            /*console.log("**********************");
            console.log(response);*/
            // this.dialogBatchImport = false;
            this.excel_loading = false;
            this.dataImportFail = response.data;
            if (response.code == 0) {
                this.$message({
                    message: "批量导入成功！",
                    type: 'success'
                })
                this.dialogBatchImport = false;
                this.dialogBatchImportEntrepreneur = false;
                this.buttonPane = false;
            } else {
                this.dialogImportFail = true;
            }
            /*console.log("start");
            console.log(this.dataImportFail);*/
            /*console.log("end");*/
           /* this.dialogBatchImport = false;
            this.dialogBatchImportEntrepreneur = false;
            this.buttonPane = false;*/
            this.initTree();
            this.getList(this.pageParam);
        },
        // beforeAvatarUpload(file) {
        //     const isJPG = file.type === 'image/jpeg';
        //     const isLt2M = file.size / 1024 / 1024 < 2;
        //
        //     if (!isJPG) {
        //         this.$message({
        //             message: "上传头像图片只能是 JPG 格式!",
        //             type: 'error'
        //         })
        //     }
        //     if (!isLt2M) {
        //         this.$message({
        //             message: "上传头像图片大小不能超过 2MB!",
        //             type: 'error'
        //         })
        //     }
        //     return isJPG && isLt2M;
        // },
        closePic() {
            this.picVisible = false;
        },

        /******************************************/
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview: function () {
        },
        handleRemove: function () {
        },
        // 上传成功后的回调
        uploadSuccess(response, file, fileList) {
            this.files = response.data;
            console.log('上传文件', response)
        },
        // 上传错误
        uploadError(response, file, fileList) {
            this.$message({
                message: "上传失败，请重试！",
                type: 'error'
            })
            console.log('上传失败，请重试！')
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload(file) {
            /*const h = this.$createElement;
            const extension2 = file.name.split('.')[1].toLowerCase() === 'jpg'
            const extension3 = file.name.split('.')[1].toLowerCase() === 'png'
            const extension4 = file.name.split('.')[1].toLowerCase() === 'jpeg'
            const isLt2M = file.size / 1024 / 1024 < 0.5
            if (!extension2 && !extension3 && !extension4) {
                console.log('上传的图片只能是 jpg、png、jpeg 格式!')
                this.$message({
                    message: "上传的图片只能是 jpg、png、jpeg 格式!",
                    type: 'error'
                })
            }
            if (!isLt2M) {
                console.log('上传模板大小不能超过 0.5MB!')
                this.$message({
                    message: "上传模板大小不能超过 0.5MB!",
                    type: 'error'
                })
            }
            return extension2 || extension3 || extension4 && isLt2M*/

            return true;
        },
        changeFeature(file, fileList) {

            // this.img_loading = true;
            let self = this;
            let imgContent = {};
            imgContent.name = file.name;

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.upLoadData.baseStr = self.base64;
                        self.imageUrl = self.base64;

                        // 手动上传
                        UpdateFeature(self.upLoadData);
                        setTimeout(function () {
                            self.dialogImg = false;
                        }, 3000);
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        changeFeature1(file, fileList) {

            // this.img_loading = true;
            let self = this;

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.temp.baseStr = self.base64;
                        self.imageUrl = self.base64;

                        // 手动上传
                        /*  UpdateFeature(self.upLoadData);
                          setTimeout(function () {
                              self.dialogImg = false;
                          }, 3000);*/
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },

        /*导入Excel*/
        importExcel() {
            return '/dealer/human/batchImport'
            /*console.log("============");
            console.log(file);
            let name = file.name;
            let fd = new FormData(file);
          /!*  fd.append('file', file, name);*!/
            BatchImport(fd);*/
        },
        importExcelEntrepreneur() {
            return '/dealer/human/batchImportCorp'
        },

        /******************************END 上传照片**********************************************************/
        onAdd() {
            this.previews = {};
            this.option = optionInit();
            this.temp = tempInit();
            this.imageUrl = '';
            /*
            * Other init data
            *
            * */
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            this.optionsArray = [];
            if (this.isOrg) {
                GetOrgIdentity().then((response) => {
                    let options = [];
                    let communityArray = response.data.communityIdentity;
                    let orgArray = response.data.orgIdentity;
                    let communityObj = {
                        label: '社区身份',
                        options: communityArray
                    }
                    let orgObj = {
                        label: '写字楼身份',
                        options: orgArray
                    }
                    this.optionsArray.push(communityObj);
                    this.optionsArray.push(orgObj);
                })
            } else {
                GetIdentityList().then((result) => {
                    this.identityList = result.data;
                })
            }
            if (this.$refs.cropper) {
                this.$refs.cropper.refresh();
                $(".cropper-box-canvas").css("display", "none");
            }
        },
        onEdit(row) {
            //this.imageUrl = '';
            this.temp = $.extend(tempInit(), row);
            if (!this.temp.age || this.temp.age == null) {
                this.temp.age = "";
            } else {
                this.temp.age = this.temp.age + "";
            }

            this.imageUrl = this.temp.facePhoto;
            this.onEditShowCropperImg(this.imageUrl, row);
            this.$nextTick(function () {
                this.pageParam.humanId = row.id;
                this.pageParam.type = "1";
                this.humanName = row.realName;
                this.scenePageParam.humanId = row.id;
                this.resourcePageParam.humanId = row.id;
                this.editDialogFormVisible = true;
            })
            // this.getByIdResourceList(this.pageParam)
            /*GetAssociatedSenceList(this.pageParam).then((response) => {
                console.log(response);
                if (response.data != null) {
                    this.tableDataSence = response.data;
                } else {
                    this.tableDataSence = [];
                }
            })*/
        },
        onEditShowCropperImg(url, row) {
            //url = "http://imgsrc.baidu.com/image/c0%3Dpixel_huitu%2C0%2C0%2C294%2C40/sign=ed78b181df3f8794c7f2406ebb636b98/72f082025aafa40f34c69ce4a064034f78f01982.jpg";
            //debugger;
            if (this.$refs.cropper) {
                //debugger;
               // this.$refs.cropper =

                //$(".cropper-box-canvas").css("display", "none");
                this.previews = {};
            }
            this.option = optionInit();
            let image = new Image();
            let _this = this;
            image.crossOrigin = 'Anonymous';
            image.src = url;
            image.onload = function () {
                let data;
                data = _this.getBase64FromImage(image);
                _this.option.img = data;
            }
        },
        getBase64FromImage(img) {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            let dataURL = canvas.toDataURL("image/jpeg");
            return dataURL;
        },
        dataURLtoFile(dataurl, filename) {//将base64转换为文件
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        },
        getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            return dataURL;
        },
        resetForm() {
            this.$refs['form'].resetFields();
            //this.temp = tempInit();
            this.addTemp = addTempInit();
            this.dialogFormVisible = false;
            this.addFormVisible = false;
            /* this.dialogChooseIdentity =false;*/

        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            if (this.pageParam.page == 1) {
                this.getList(this.pageParam)
            } else {
                this.$refs.pages.changePage(1)
            }
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
            this.resourceName = ''
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
                            this.editDialogFormVisible = false;
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
            let that = this;
            GetResourceIdsByHumanId(row.id).then((response) => {
                let items = [];
                items.push({humanId: row.id, humanName: row.realName, resourceIds: response.data});
                let that = this;
                that.beforeDelete(items).then((response) => {
                    if (response.data == null || response.data == undefined || response.data.length == 0) {
                        that.ConfirmBox('是否确认删除')
                            .then(() => {
                                DeleteAttendance(items);
                                Delete(row.id)
                                    .then(() => {
                                        this.getList(this.pageParam);
                                    })
                            })
                    } else {
                        let message = '';
                        for (let i = 0; i < response.data.length; i++) {
                            message = message + response.data[i].name + "、"
                        }
                        message = message.substr(0, message.length - 1);
                        message += "是考勤组组长，是否确认删除？";
                        that.ConfirmBox(message)
                            .then(() => {
                                DeleteAttendance(items);
                                Delete(row.id)
                                    .then(() => {
                                        this.getList(this.pageParam);
                                    })
                            })
                    }
                })
            })
            /*this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id
                    )
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })*/

        },
        onAddImg(row) {
            this.upLoadData.id = row.id;
            this.temp = tempInit();
            this.imageUrl = false;
            this.dialogImg = true;
        },
        onBatchDelete() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            let ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            let that = this;
            GetHumanResourceRefByIds(ids).then((response) => {
                let items = response.data;
                that.beforeDelete(response.data).then((resp) => {
                    if (resp.data == null || resp.data == undefined || resp.data.length == 0) {
                        that.ConfirmBox('是否确认删除')
                            .then(() => {
                                DeleteAttendance(items);
                                BatchDelete(ids)
                                    .then(() => {
                                        that.getList(this.pageParam);
                                    })
                            })
                    } else {
                        let message = '';
                        for (let i = 0; i < resp.data.length; i++) {
                            message = message + resp.data[i].name + "、"
                        }
                        message = message.substr(0, message.length - 1);
                        message += "是考勤组组长，是否确认删除？";
                        that.ConfirmBox(message)
                            .then(() => {
                                DeleteAttendance(items);
                                BatchDelete(ids)
                                    .then(() => {
                                        that.getList(this.pageParam);
                                    })
                            })
                    }
                })
            })
            /*this.ConfirmBox('是否确认批量删除')
                .then(() => {
                    BatchDelete(ids)
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })*/

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
            this.editDialogFormVisible = false;
            this.addFormVisible = false;
            //this.temp = tempInit()
            this.$refs['form'].resetFields()
            this.activeNameWhileEdit = false;
        },
        closeForm() {
            this.formVisible = false;
        },
        onBatchAudit() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var is_exist = false;
            this.selectionData.forEach(function (e, i) {
                if (e.isApproval == 1) {
                    is_exist = true;
                    return;
                }
            });

            if (is_exist) {
                this.$message({
                    message: "存在已审核数据，请重新选择",
                    type: 'error'
                })
                return;
            }

            var ids = this.selectionData.map(item => item.id)   //  获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认审核通过？')
                .then(() => {
                    BatchAudit(ids)
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })
        },
        downTemplate() {
            //测试服
            //location.href = 'http://172.16.0.162/template/人员导入模板.zip';
            //生产
            let host2 = document.domain;
            let host = window.location.host;
            let url = window.location.href;
            console.log(host2)
            console.log(host)
            console.log(url)
            location.href = '/template/社区人员导入模板.xls';
        },
        downTemplateEntrepreneur() {
            location.href = '/template/企业人员导入模板.xls';
        },
        onBatchImport() {
            this.dialogBatchImport = true;
        },
        onBatchImportEntrepreneur() {
            this.dialogBatchImportEntrepreneur = true;
        },
        beforeExcelUpload(file) {
            console.log("上传Excel");
            const h = this.$createElement;
            const extension1 = file.name.split('.')[1].toLowerCase() === 'xls';
            /* const extension2 = file.name.split('.')[1].toLowerCase() === 'xlsx';*/
            if (!extension1) {
                console.log('只能导入Excel文件!')
                this.$message({
                    message: "请上传与模板文件格式一致的文件!",
                    type: 'error'
                })
            } else {
                this.excel_loading = true;
            }
            return extension1;
        },
        relationship(row) {
            GetRelationship(row.id).then((response) => {
                this.relationshipDetail = response.data.data;
                this.relationshipDetailVisiable = true;
            });
        },
        closeRelationshipDetailDetailForm() {
            this.relationshipDetailVisiable = false;
        },


        addResource() {
            this.addFormVisible = true;
            this.getListTypeInfo();
            this.getResourceCode();
        },
        getListTypeInfo() {
            var storage = window.localStorage;
            // this.resourceType.sysId = storage.getItem("sysId");
            GetCurrentListType(this.resourceType).then(response => {
                this.optionsType = response.data;
            })
        },
        //获取资源编码
        getResourceCode() {
            GetResourceCode()
                .then((response) => {
                    this.addTemp.code = response.data;
                })
        },
        nodeClick(data, node, object) {
            this.selectedCommunity = data;
        },
        resourceNodeClick(data, node, object) {
            this.pageParam.resourceId = data.id;
            this.pageParam.page = 1;
            GetHumanByResource(this.pageParam).then((response) => {
                this.rowTotal = response.data.rowTotal;
                this.tableData = response.data.rows;
            })
        },
        back() {
            console.log(this.temp);
            this.resourceLvl0Table = false;
            this.resourceVisible = false;
            this.dialogChooseIdentity = true;
        },
        closeViewPicture() {
            this.picVisible = false;
        },
        picDetail(src) {
            //src = 'http://www.txahz.com/data/attachment/portal/201510/05/215027qzskl44x4666xczr.jpg'
            $("#pic").removeAttr("src");
            this.picVisible = true;
            let image = new Image();
            image.src = src;
            let that = this;
            if (image.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                /* callback.call(img);
                 return; // 直接返回，不用再处理onload事件*/
                that.showPicture(image, src);
            }
            image.onload = function () { //图片下载完毕时异步调用callback函数。
                /* callback.call(img);//将回调函数的this替换为Image对象*/
                if (image.width > 0 && image.height > 0) {
                    that.showPicture(image, src)
                }
            };
        },
        showPicture(image, src) {
            let width = 700;
            let height = 500;
            let img_width = image.width;
            let img_height = image.height;
            let temp_width = 0;
            let temp_height = 0;
            if (img_width > width) {
                temp_width = width;
                temp_height = (width / img_width) * img_height;
                if (temp_height > height) {
                    img_width = img_width * (height / img_height);
                    img_height = height;
                } else {
                    img_width = temp_width;
                    img_height = temp_height;
                }
            } else {
                if (img_height > height) {
                    img_width = img_width * (height / img_height)
                    img_height = height;
                }
            }
            $("#pic").attr("src", src);
            $("#pic").css("height", img_height);
            $("#pic").css("width", img_width);
        },
        changeValue() {
            /*alert(this.temp.resourceTypeId);*/
            var storage = window.localStorage;
            // this.resourceType.sysId = storage.getItem("sysId");
            this.resourceType.resourceTypeId = this.addTemp.resourceTypeId
            GetListSelective(this.resourceType).then((response) => {
                this.options = response.data;
            })
        },
        createResource() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    var storage = window.localStorage;
                    // this.temp.sysId = storage.getItem("sysId");
                    this.addTemp.baseStr = this.upLoadCommunityData.baseStr;
                    CreateResource(this.addTemp)
                        .then(() => {
                            this.addFormVisible = false;
                            this.initResourceTree();
                        })
                } else {
                    return false;
                }
            })
        },


        getResourceTree() {
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });

        },
        previous() {
            console.log(this.temp);
            this.dialogChooseIdentity = false;
            this.dialogFormVisible = true;
        },


        //填写信息，下一步选择身份
        create() {
            let that = this;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // JudgeHumanExistByPhone(this.temp.mobilePhone).then((result)=>{
                    //     if (result.code != 1){
                    /*GetIdentityList().then((result)=>{
                        this.identityList = result.data;
                        // console.log(this.identityList);
                        this.dialogFormVisible = false;
                        this.dialogChooseIdentity = true;
                    })*/
                    //this.addFormVisible = true;
                    //     }else{
                    //         this.$message({
                    //             message: "改手机号已经被添加！",
                    //             type: 'error'
                    //         })
                    //     }
                    // })
                    if (that.identity.value != undefined) {
                        /* if (this.identity.needLeaf == 1){
                             this.getResourceTree();
                             this.dialogChooseIdentity =false;
                             this.resourceVisible = true;
                         }else{
                             GetResourceByLvlAndTenantIds().then((result) =>{
                                 this.resourcelvl0 = result.data;
                                 this.dialogChooseIdentity =false;
                                 this.resourceLvl0Table = true;
                             })
                         }*/
                        //this.getResourceTree();
                        that.initResourceTree();
                        that.resourceVisible = true;
                    } else {
                        that.$message({
                            message: "请选择新增人员身份！",
                            type: 'error'
                        })
                    }
                } else {
                    return false;
                }
            })
        },
        //选择身份 下一步 选择资源
        nextStep() {
            if (this.identity.value != undefined) {
                if (this.identity.needLeaf == 1) {
                    this.getResourceTree();
                    this.dialogChooseIdentity = false;
                    this.resourceVisible = true;
                } else {
                    GetResourceByLvlAndTenantIds().then((result) => {
                        this.resourcelvl0 = result.data;
                        this.dialogChooseIdentity = false;
                        this.resourceLvl0Table = true;
                    })
                }
            } else {
                this.$message({
                    message: "请选择新增人员身份！",
                    type: 'error'
                })
            }
        },
        //创建绑定到房间的人员
        auditSave() {
            let community = this.selectedCommunity;
            //let selectedRow = this.selectedRow;
            if (community.id == null || community.id == undefined) {
                this.$message({
                    message: "请选择社区资源",
                    type: 'error'
                })
                return;
            }
            if (this.identity.needLeaf == 1) {
                /*if (community.children != null && community.children.length > 0) {
                    this.$message({
                        message: "只能选择最最底层资源",
                        type: 'error'
                    })
                    return;
                }*/
                if (community.lvl != 3) {
                    this.$message({
                        message: "只能选择户级资源",
                        type: 'error'
                    })
                    return;
                }
            }
            this.ConfirmBox('确认新增？')
                .then(() => {
                    this.temp.resourceId = community.id;
                    this.temp.refType = this.identity.value;
                    console.log(this.temp);
                    /*   CreateHuman(this.temp).then((response) => {
                           this.temp = tempInit();
                           this.identity = {};
                           this.resourceVisible = false;
                           this.getList(this.pageParam);
   */
                    JudgeHumanExistByPhone(this.temp.mobilePhone, community.id).then((result) => {
                        if (result.code != 1) {
                            CreateHuman(this.temp).then((response) => {
                                this.temp = tempInit();
                                this.identity = {};
                                this.imageUrl = '';
                                this.resourceVisible = false;
                                this.dialogFormVisible = false;
                                this.getList(this.pageParam);
                            })
                        } else {
                            this.$message({
                                message: "手机号已经被添加！",
                                type: 'error'
                            })
                        }
                    })
                })
        },
        //创建绑定到小区的人员
        onBatchAddResourceLvl0() {
            if (this.selectionResourceLvl0 == undefined || this.selectionResourceLvl0.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = [];
            /*var humanId = this.pageParam.humanId;*/
            var ids = this.selectionResourceLvl0.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            /*  for (var i = 0; i < ids.length; i++) {
                  param.push({
                      /!*humanId: humanId,*!/
                      resourceId: ids[i]
                  })
              }*/
            this.temp.resourceIds = ids;
            this.temp.refType = this.identity.value;
            this.ConfirmBox('是否确认新增人员？')
                .then(() => {
                    CreateHuman(this.temp)
                        .then(() => {
                            this.resourceLvl0Table = false;
                            this.temp = tempInit();
                            this.getList(this.pageParam);
                        })
                })
        },
        closeAudit() {
            /* this.temp = tempInit();
             this.addTemp = addTempInit();*/
            /*this.selectedCommunity = {};*/
            this.resourceVisible = false;

        },
        closeAddPane() {
            this.dialogFormVisible = false;
            this.identity = {}
        },
        closeDialogChooseIdentity() {
            this.dialogChooseIdentity = false;
        },
        closeResourceLvl0Table() {
            this.resourceLvl0Table = false;
        },
        handleUploadSuccess(result) {
            console.log(result);
            if (result != 'fail') {
                this.temp.facePhoto = result;
                this.upLoadData = [];
            } else {
                this.$message({
                    message: "上传失败！",
                    type: 'error'
                })
            }

        },
        changeCommunityFeature(file, fileList) {
            this.addTemp.imageUrlFlag = true;
            // this.img_loading = true;
            let self = this;
            let imgContent = {};
            imgContent.name = file.name;

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.upLoadCommunityData.baseStr = self.base64;
                        self.communityImageUrl = self.base64;

                        // 手动上传
                        // UpdateFeature(self.upLoadData);
                        // setTimeout(function () {
                        //     self.dialogImg = false;
                        // }, 3000);
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        //放大/缩小
        changeScale(num) {
            console.log('changeScale')
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        //坐旋转
        rotateLeft() {
            console.log('rotateLeft')
            this.$refs.cropper.rotateLeft();
        },
        //右旋转
        rotateRight() {
            console.log('rotateRight')
            this.$refs.cropper.rotateRight();
        },
        //上传图片（点击上传按钮）
        finish(type) {
            //debugger;
            console.log('finish')
            let _this = this;
            let formData = new FormData();
            // 输出
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    let img = window.URL.createObjectURL(data);
                    // this.model = true;
                    this.modelSrc = img;
                    formData.append("file", data, this.fileName);
                    /*this.$http.post(Api.uploadSysHeadImg.url, formData, {contentType: false, processData: false, headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
                        .then((response)=>{
                            var res = response.data;
                            if(res.success == 1){
                                $('#btn1').val('');
                                _this.imgFile = '';
                                _this.headImg = res.realPathList[0];  //完整路径
                                _this.uploadImgRelaPath = res.relaPathList[0];  //非完整路径
                                _this.$message({　　//element-ui的消息Message消息提示组件
                                    type: 'success',
                                    message: '上传成功'
                                });
                            }
                        })*/
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    // this.model = true;
                    // this.modelSrc = data;
                    this.temp.baseStr = data;
                    this.imageUrl = data;
                    this.dialogCropperFormVisible = false;
                })
            }
        },
        // 实时预览函数
        realTime(data) {
            console.log('realTime')
            this.previews = data
        },
        //下载图片
        down(type) {
            console.log('down')
            var aLink = document.createElement('a')
            aLink.download = 'author-img'
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    this.downImg = window.URL.createObjectURL(data)
                    aLink.href = window.URL.createObjectURL(data)
                    aLink.click()
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    this.downImg = data;
                    aLink.href = data;
                    aLink.click()
                })
            }
        },
        //选择本地图片
        uploadImg(e, num) {
            console.log('uploadImg');
            var _this = this;
            //上传图片
            var file = e.target.files[0]
            _this.fileName = file.name;
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                return false
            }
            var reader = new FileReader();
            reader.onload = (e) => {
                let data;
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                }
                else {
                    data = e.target.result
                }
                if (num === 1) {
                    _this.option.img = data
                } else if (num === 2) {
                    _this.example2.img = data
                }
            }
            // 转化为base64
            reader.readAsDataURL(file)
            // 转化为blob
            // reader.readAsArrayBuffer(file);

        },
        imgLoad(msg) {
            // console.log(this.option.img+"1111");
            console.log(msg)
        },
        showCropperDialog() {
            this.dialogCropperFormVisible = true;
        },
        initCropper() {
            /*if(this.dialogStatus = 'editor'){
                this.option.img  = "https://fengyuanchen.github.io/cropper/images/picture.jpg";
            }*/
        },
        closeCropper() {
            this.dialogCropperFormVisible = false;
           // this.$refs.cropper.$delete();
        },
        showParentTree() {
            this.parentTree = true;
            /*  this.pageParam.sceneId = ''*/
            /* this.loadTreeNode();*/
        },
        tenantNodeClick(data, node, object) {
            // this.selectedCommunity = data;
            //this.pageParam.operator = data.id;
            /*  this.pageParam.sceneId = '';*/
            this.resourceName = data.text;
            this.parentTree = false;
            if (data.children) {
                this.pageParam.corpId = '';
                this.pageParam.orgId = data.id;
            } else {

                this.pageParam.orgId = '';
                this.pageParam.corpId = data.id;
            }
        },
        filterTenantNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
        getResourceTreeForSearch() {
            GetResourceTreeForSearch()
                .then((response) => {
                    this.tenantTreeDate = response.data;
                });
        },
        closeViewPane() {
            this.activeName = 'first';
            this.viewDialogFormVisible = false;
        },
        closeView() {
            this.activeName = 'first';
            this.viewDialogFormVisible = false;
        },
        onView(row) {
            this.viewDialogFormVisible = true;
            this.temp = $.extend(tempInit(), row);
            if (!this.temp.age || this.temp.age == null) {
                this.temp.age = "";
            } else {
                this.temp.age = this.temp.age + "";
            }

            this.imageUrl = this.temp.facePhoto;
            this.onEditShowCropperImg(this.imageUrl);
            this.resourcePageParam.humanId = row.id;
            this.resourcePageParam.type = "1";
            this.scenePageParam.humanId = row.id;
            this.scenePageParam.type = '1';

        },
        beforeDelete(items) {
            return BeforeDelete(items);
        },
        handleTabClick(tab, event) {
            if (tab.label == '关联资源') {
                this.resourcePaginationShow = false;
                this.resourcePageParam.page = 1;
                GetAssociatedResource(this.resourcePageParam).then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.viewResourceRowTotal = response.data.rowTotal;
                        this.tableDataDetail = response.data.rows;
                    } else {
                        this.tableDataDetail = [];
                        this.viewResourceRowTotal = 0;
                    }
                })
                this.$nextTick(function () {
                    this.resourcePaginationShow = true
                })
            }
            if (tab.label == '关联场景') {
                this.scenePageParam.page = 1;
                this.scenePaginationShow = false;
                GetAssociatedSenceList(this.scenePageParam).then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.viewSceneRowTotal = response.data.rowTotal;
                        this.tableDataSence = response.data.rows;
                    } else {
                        this.tableDataSence = [];
                        this.viewSceneRowTotal = 0;
                    }
                })
                this.$nextTick(function () {
                    this.scenePaginationShow = true
                })
            }
        },
        handleViewResourceChange(page) {
            this.resourcePageParam.page = page;
            GetAssociatedResource(this.resourcePageParam).then((response) => {
                console.log(response);
                if (response.data != null) {
                    this.viewResourceRowTotal = response.data.rowTotal;
                    this.tableDataDetail = response.data.rows;
                } else {
                    this.tableDataDetail = [];
                    this.viewResourceRowTotal = 0;
                }
            })
        },
        handleViewSceneChange(page) {
            this.scenePageParam.page = page;
            GetAssociatedSenceList(this.scenePageParam).then((response) => {
                console.log(response);
                if (response.data != null) {
                    this.viewSceneRowTotal = response.data.rowTotal;
                    this.tableDataSence = response.data.rows;
                } else {
                    this.tableDataSence = [];
                    this.viewSceneRowTotal = 0;
                }
            })
        },
        handleTabClickWhileEdit(tab, event) {
            if (tab.label == '关联资源') {
                this.resourcePaginationShowEdit = false;
                this.resourcePageParam.page = 1;
                GetAssociatedResource(this.resourcePageParam).then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.viewResourceRowTotal = response.data.rowTotal;
                        this.tableDataDetail = response.data.rows;
                    } else {
                        this.tableDataDetail = [];
                        this.viewResourceRowTotal = 0;
                    }
                })
                this.$nextTick(function () {
                    this.resourcePaginationShowEdit = true
                })
            }
            if (tab.label == '关联场景') {
                this.scenePageParam.page = 1;
                this.scenePaginationShowEidt = false;
                GetAssociatedSenceList(this.scenePageParam).then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.viewSceneRowTotal = response.data.rowTotal;
                        this.tableDataSence = response.data.rows;
                    } else {
                        this.tableDataSence = [];
                        this.viewSceneRowTotal = 0;
                    }
                })
                this.$nextTick(function () {
                    this.scenePaginationShowEdit = true
                })
            }
        },
        changeInNo() {
            let idNo = this.temp.idNo;
            let leh = idNo.length;
            let dates = '';
            if (leh == 18 || leh == 15) {
                if (leh == 18) {
                    dates = idNo.substring(6, 10);
                } else {
                    dates = idNo.substring(6, 8);
                    dates = "19" + dates;
                }
                let date = new Date;
                let year = date.getFullYear();
                this.temp.age = year - dates;
            } else {
                this.temp.age = ''
            }
        },
        showButtons(){
            this.buttonPane = true;
        },
        closeButtonPane(){
            this.buttonPane = false;
        },
        handleCommand1(command){
            if (command == 'a'){
                this.downTemplate();
            }
            if (command == 'b'){
                this.downTemplateEntrepreneur();
            }
        },
        handleCommand2(command){
            if (command == 'c'){this.onBatchImport();}
            if (command == 'd'){this.onBatchImportEntrepreneur();}
        },
    },
    computed: {
        headers() {
            let c_token, tenantId, xuid, xorgid;
            if (store.getters.token) {
                c_token = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            }
            if (store.getters.corporation) {
                tenantId = store.getters.corporation.id;
            }

            if (store.getters.user.user.id) {
                xuid = store.getters.user.user.id;
            }

            if (store.getters.user.user.extend) {
                if (store.getters.user.user.extend.brands.length > 0) {
                    xorgid = store.getters.user.user.extend.brands[0].id;
                }
            }
            return {
                'token': c_token,
                'tenant-id': tenantId,
                'x-uid': xuid,
                'x-org-id': xorgid
            }
        },
    }
}

function tempInit() {
    return {
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        email: '',
        remark: '',
        idNo: '',
        resourceIds: [],
        resourceId: '',
        refType: '',
        baseStr: '',
        isMember: 0,
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        email: '',
        remark: '',
        isApproval: '',
        organizationId: '',
        resourceId: '',
        orgId: '',
        corpId: ''
    }
}

function resourcePageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        email: '',
        remark: '',
        isApproval: '',
        organizationId: '',
        resourceId: '',
        orgId: '',
        corpId: ''
    }
}

function scenePageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        email: '',
        remark: '',
        isApproval: '',
        organizationId: '',
        resourceId: '',
        orgId: '',
        corpId: ''
    }
}

function addTempInit() {
    return {
        resourceTypeId: '',
        name: '',
        code: '',
        parentId: '',
        remark: '',
        city: '',
        fullPinYin: '',
        longitude: '',
        latitude: '',
        telephone: '',
        communityPhoto: '',
        imageUrlFlag: false,
        communityImageUrl: '',
        actionCommunity: "",
        upLoadCommunityData: {
            id: '',
            baseStr: ''
        },
    }
}

function resourceType() {
    return {
        sysId: ''
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

function optionInit() {
    return {
        img: '',
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false,//输出原图比例截图 props名full
        outputType: 'jpeg',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 238,
        autoCropHeight: 238,
        fixedBox: true,
        info: true
    }
}

(function (window) {
    var svgSprite = '<svg><symbol id="icon-chakan" viewBox="0 0 1024 1024"><path d="M512 237.7152C237.7152 237.7152 128 512 128 512s109.7152 274.2912 384 274.2912S896 512 896 512 786.2848 237.7152 512 237.7152L512 237.7152zM512 676.576c-90.8544 0-164.5696-73.664-164.5696-164.576 0-90.9056 73.7152-164.5696 164.5696-164.5696S676.5696 421.088 676.5696 512C676.5696 602.912 602.8544 676.576 512 676.576L512 676.576zM512 676.576M594.2784 512c0 45.4272-36.8512 82.2912-82.2784 82.2912S429.7216 557.4272 429.7216 512c0-45.4272 36.8512-82.2784 82.2784-82.2784C557.4336 429.7088 594.2784 466.5664 594.2784 512L594.2784 512zM594.2784 512"  ></path></symbol></svg>';
    var script = function () {
        var scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1]
    }();
    var shouldInjectCss = script.getAttribute("data-injectcss");
    var ready = function (fn) {
        if (document.addEventListener) {
            if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
                setTimeout(fn, 0)
            } else {
                var loadFn = function () {
                    document.removeEventListener("DOMContentLoaded", loadFn, false);
                    fn()
                };
                document.addEventListener("DOMContentLoaded", loadFn, false)
            }
        } else if (document.attachEvent) {
            IEContentLoaded(window, fn)
        }

        function IEContentLoaded(w, fn) {
            var d = w.document, done = false, init = function () {
                if (!done) {
                    done = true;
                    fn()
                }
            };
            var polling = function () {
                try {
                    d.documentElement.doScroll("left")
                } catch (e) {
                    setTimeout(polling, 50);
                    return
                }
                init()
            };
            polling();
            d.onreadystatechange = function () {
                if (d.readyState == "complete") {
                    d.onreadystatechange = null;
                    init()
                }
            }
        }
    };
    var before = function (el, target) {
        target.parentNode.insertBefore(el, target)
    };
    var prepend = function (el, target) {
        if (target.firstChild) {
            before(el, target.firstChild)
        } else {
            target.appendChild(el)
        }
    };

    function appendSvg() {
        var div, svg;
        div = document.createElement("div");
        div.innerHTML = svgSprite;
        svgSprite = null;
        svg = div.getElementsByTagName("svg")[0];
        if (svg) {
            svg.setAttribute("aria-hidden", "true");
            svg.style.position = "absolute";
            svg.style.width = 0;
            svg.style.height = 0;
            svg.style.overflow = "hidden";
            prepend(svg, document.body)
        }
    }

    if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
        window.__iconfont__svg__cssinject__ = true;
        try {
            document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
        } catch (e) {
            console && console.log(e)
        }
    }
    ready(appendSvg)
})(window)
