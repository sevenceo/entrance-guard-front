import {
    Page,
    GetAllSystem,
    Getcode,
    Create,
    Editor,
    Delete,
    GetParentRole,
    GetAllAuth,
    UpdateAuth,
    GetRoleAllAuth,
    GetCorporationAll,
    GetAllRoles
} from './api/roleApi';
import {Message} from 'element-ui';
import store from 'store';
import Cookies from 'js-cookie';
export default {
    created() {
        this.initCurrentUser();
        this.getList();
        this.getAllRoles();


    },
    data() {
        return {
            queryParameter: queryParameterInit(),
            searchFormVisible: false,
            dialogFormVisible: false,
            usersFormVisible: false,
            assigningAuthFormVisible: false,
            dialogStatus: 'create',
            rowTotal: 10,
            tableData: [],
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            temp: tempInit(),
            rules: {
                systemId: [
                    {required: true, message: '请选择所属系统', trigger: 'blur'},
                ],
                code: [
                    {required: true, message: '请输入角色编码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'},
                    {max: 30, message: '角色名称不能大于30位', trigger: 'blur'},
                ],
                roleType: [
                    {required: true, message: '请选择角色类型', trigger: 'blur'},
                ],
                // parentId: [
                //     {required: true, message: '请选择上级角色', trigger: 'blur'},
                // ],
                description: [
                    {max: 20, message: '角色描述不能大于20', trigger: 'blur'},
                ],
                corpCode: [
                    {required: true, message: '请选择所属企业', trigger: 'blur'},
                ]
            },
            props: {
                label: 'name'
            },
            //左侧数据
            treeLeftData: [],
            //右侧数据
            treeRightData: [],
            //原始数据
            oldTreeData: [],
            //原数据ids
            oldTreeDataIds: [],
            //记录右侧所有ids
            rightIds: [],
            //记录右侧修改的数据
            updateRightData: [],
            //记录右侧所有节点数据
            rightTreeHashContainer: {},

            currentUser: {},
            restaurants: [],

            //用于显示其他信息
            showOtherMsg:{
                roleTypeName:"",
                parentRoleName:""
            },
            //所有角色
            allRolesMsg:[],
        }
    },
    methods: {
        //翻页功能
        initCurrentUser: function () {
            let user = this.$store.state.user.user;
            let corporation = user.corporation;
            let orgId = user.orgId;
            let currentUser = this.currentUser;
            currentUser.roleType = user.roles[0].roleType;
            if(currentUser.roleType == "ORG"){
                currentUser.orgId = orgId;
                currentUser.corporationId = corporation.id;
            } else if(currentUser.roleType == "CORP"){
                currentUser.corporationId = corporation.id;
            }
            console.log("currentUser")
            console.log(currentUser.roleType)
            // let currentUser = this.currentUser;
            // let orgId = user.orgId;;
            // if (null != corporation && null != corporation.id && undefined != corporation.id && "" != corporation.id &&
            //     null != orgId && undefined != orgId && "" != orgId  && "null" != orgId
            // ) {
            //     currentUser.orgId = orgId;
            //     currentUser.roleType = "ORG";
            //     currentUser.corporationId = corporation.id;
            //     this.queryParameter.corporationId = currentUser.corporationId;
            // } else if (null != corporation.id && undefined != corporation.id && "" != corporation.id) {
            //     currentUser.roleType = "CORP";
            //     currentUser.corporationId = corporation.id;
            //     this.queryParameter.corporationId = currentUser.corporationId;
            // } else {
            //     currentUser.roleType = "PLATFORM";
            // }

        },
        handleCurrentChange1(page) {
            this.queryParameter.page = page;
            this.getList()
        },
        getList() {
            Page(this.queryParameter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != 0) {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                } else {
                    this.rowTotal = 0;
                    this.tableData = [];
                }
            });
        },
        getAllRoles(){
            //查询所有角色
            GetAllRoles().then((data) => {
                data.forEach((currentValue, index, arr)=>{
                    this.allRolesMsg[currentValue.id]=currentValue.name;
                }, data);
            });
        },
        parentNodeClick(data, node, object) {
            this.temp.parentId = data.id;
            this.temp.addParentName = data.text;
            this.parentTree = false;
        },
        //筛选div
        onSearch: function () {
            this.searchFormVisible = true;
        },
        //新增窗口
        onAdd: function () {
            this.initRoleType();
            this.temp = tempInit()
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            //获取所有系统
            GetAllSystem().then(data => {
                this.temp.systems = data.data;
            });
            //获取编码
            Getcode().then(data => {
                this.temp.code = data.data.code;
            });
        },
        onEdit(row) {

            if (this.currentUser.roleType == 'PLATFORM' && row.roleType == 'ORG') {
                Message({
                    message: '平台角色不能管理组织角色',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                });
                return;
            }
            GetAllSystem().then(data => {
                this.temp.systems = data.data;
            });
            this.initRoleType();
            this.getParentRole();
            // let queryParameter = {corporationId: "", roleType: ""};
            // GetParentRole(queryParameter).then(data => {
            //     this.queryParameter.parentRoles = data.data;
            // });
            this.parentTree = false;
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            this.temp = $.extend(tempInit(), row)
            let roleType = this.temp.roleType;
            if (roleType == 'CORP') {
                let corpCode = this.temp.corpCode;
                let restaurants = this.restaurants;
                for (let i in restaurants) {
                    if (restaurants[i].corpName == corpCode || restaurants[i].corpCode == corpCode) {
                        this.temp.corpCode = restaurants[i].corpName;
                        break;
                    }
                }
            }
        },
        initRoleType(){

            let roleTypes = [];
            // [{value: "PLATFORM", label: "平台"}, {value: "CORP", label: "企业"}, {value: "ORG", label: "组织"}];
            let roleType = this.currentUser.roleType;
            if (roleType == 'CORP') {
                roleTypes = [{"value": "CORP", "label": "企业"}, {"value": "ORG", "label": "组织"}];
            } else if (roleType == "PLATFORM") {
                roleTypes = [{"value": "PLATFORM", "label": "平台"}, {"value": "CORP", "label": "企业"}];
            } else if (roleType == "ORG") {
                roleTypes = [{"value": "ORG", "label": "组织"}];
            }
            this.queryParameter.roleTypes = roleTypes;
        },
        onUsersFormVisible: function (parentUser) {
            if (this.currentUser.roleType == 'PLATFORM' && parentUser.roleType == 'ORG') {
                Message({
                    message: '平台角色不能管理组织角色',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                });
                return;
            }
            this.$router.push({
                path: '/system/role/assigningUsers', params: {}, query: {
                    parentUser: parentUser,
                    currentUser:this.currentUser
                }
            });
        },
        onAssigningAuthFormVisible: function (row) {

            this.treeLeftData = [];
            this.treeRightData = [];
            this.oldTreeData = [];
            this.rightIds = [];
            this.updateRightData = [];
            this.rightTreeHashContainer = {};

            this.assigningAuthFormVisible = true;

            //初始化树
            GetAllAuth().then(data => {
                let oldData = JSON.parse(JSON.stringify(data));
                this.oldTreeData = oldData;
                //初始化右侧树
                let id = row.id;
                this.queryParameter.roleId = id;
                GetRoleAllAuth(id).then((ids) => {
                    this.rightIds = JSON.parse(JSON.stringify(ids));
                    let rightData = this._rightTreeDataHandler(ids);
                    this.treeRightData = rightData.treeData;
                    let treeHashContainer = rightData.treeHashContainer;
                    //初始化左侧树
                    let d = this._treeDataHandler(treeHashContainer, ids);
                    this.treeLeftData = d.treeData;
                });
            });

        },
        handleLeftTreeCheckChange: function () {
            //console.log(arguments);
        },
        nodeClick: function (node) {
            let checkedNodes = this.$refs.treeLeft.getCheckedNodes();
        },
        //左添加到右侧
        moveToRight: function () {
            let checkedNodes = this.$refs.treeLeft.getCheckedNodes();
            if (checkedNodes == null || checkedNodes.length == 0) {
                return;
            }
            //获取移动的节点id
            let allCheckedNodes = this.getMoveTreeIds(checkedNodes);
            //合并 节点
            this.rightIds = this.rightIds.concat(allCheckedNodes);
            this.initTree();
        },
        //右移动到左侧
        moveToLeft: function () {
            let checkedNodes = this.$refs.treeRight.getCheckedNodes();
            if (checkedNodes == null || checkedNodes.length == 0) {
                return;
            }
            let allCheckedNodes = this.getMoveTreeIds(checkedNodes);

            let ids = {};
            for (let index in allCheckedNodes) {
                let id = allCheckedNodes[index];
                ids[id] = id;
            }

            //删除右侧 需要移动的id
            let rightMap = this.rightTreeHashContainer;
            //需要删除的子节点
            let deleteIds = {};
            for (let index in allCheckedNodes) {
                let id = allCheckedNodes[index];
                //取数据判断是否有子集
                let nodeData = rightMap[id];
                let children = nodeData.children;
                if (children == null || children == undefined) {
                    //无子集直接删除
                    deleteIds[id] = id;
                } else {
                    //判断 子集是否包含 需要删除节点id
                    let isInDeleteIds = true;
                    for (let c in children) {
                        let cId = children[c].id;
                        if (ids[cId] == null || ids[cId] == undefined) {
                            isInDeleteIds = false;
                        }
                    }
                    //包含 则删除
                    if (isInDeleteIds) {
                        deleteIds[id] = id;
                    }
                }
            }
            //删除id
            let deleteCount = Object.keys(deleteIds).length;
            if (deleteCount > 0) {
                let rightIds = JSON.parse(JSON.stringify(this.rightIds));
                let rightRemove = this.rightIds;
                for (let rIndex in rightIds) {
                    if (deleteCount <= 0) {
                        break;
                    }
                    let id = rightIds[rIndex];
                    if (deleteIds[id] != null && deleteIds[id] != undefined) {
                        deleteCount--;
                        for (let rr in rightRemove) {
                            if (rightRemove[rr] == id) {
                                this.rightIds.splice(rr, 1);
                                break;
                            }
                        }
                    }

                }
            }
            this.initTree();

        },
        //左侧全部移动到右侧
        moveAllToRight: function () {
            this.rightIds = JSON.parse(JSON.stringify(this.oldTreeDataIds));
            this.initTree();
        },
        //右侧全部移动到左侧
        moveAllToLeft: function () {
            this.rightIds = [];
            this.initTree();
        },
        //移动后初始化树
        initTree: function () {
            let rightIds = JSON.parse(JSON.stringify(this.rightIds))
            let rightData = this._rightTreeDataHandler(rightIds);
            this.treeRightData = rightData.treeData;
            //重新初始初始化左侧数据
            let treeHashContainer = rightData.treeHashContainer;
            let d = this._treeDataHandler(treeHashContainer, rightIds);
            this.treeLeftData = d.treeData;
        },
        //找出移动的点
        getMoveTreeIds: function (checkedNodes) {
            let allCheckedNodesHash = {};
            let allCheckedNodes = [];
            let ids = {};
            for (let i = 0; i < checkedNodes.length; i++) {
                let node = checkedNodes[i];
                if (ids[node.id] == null || ids[node.id] == undefined) {
                    ids[node.id] = node.id;
                    allCheckedNodes.push(node.id);
                }
                let parentData = node.parent;
                while (true) {
                    if (!parentData) {
                        break
                    }
                    if (!allCheckedNodesHash[parentData.id]) {
                        if (ids[parentData.id] == null || ids[parentData.id] == undefined) {
                            ids[parentData.id] = parentData.id;
                            allCheckedNodes.push(parentData.id);
                        }
                        allCheckedNodesHash[parentData.id] = parentData;
                    }
                    parentData = parentData.parent;
                }
            }
            return allCheckedNodes;
        },
        //条件查询
        doSearch: function () {
            this.getList();
        },
        //添加
        create() {

            let roleType = this.temp.roleType;
            if (roleType == 'CORP' && this.currentUser.roleType == 'PLATFORM') {
                let corpCode = this.temp.corpCode;
                let restaurants = this.restaurants;
                let corpCodeIsTrue = false;
                for (let i in restaurants) {
                    if (restaurants[i].corpName == corpCode || restaurants[i].corpCode == corpCode) {
                        corpCodeIsTrue = true;
                        this.temp.corpCode = restaurants[i].corpCode;
                        this.temp.corpName = restaurants[i].corpName;
                        this.temp.corporationId = restaurants[i].id;
                        break;
                    }
                }
                if (!corpCodeIsTrue) {
                    Message({
                        message: '所属企业不存在,请选择',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    })
                    return;
                }
            } else {
                this.temp.corporationId = this.currentUser.corporationId;
            }

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
            });

        },
        //修改
        update(formName) {

            let roleType = this.temp.roleType;
            if (roleType == 'CORP') {
                let corpCode = this.temp.corpCode;
                let restaurants = this.restaurants;
                let corpCodeIsTrue = false;
                for (let i in restaurants) {
                    if (restaurants[i].corpName == corpCode || restaurants[i].corpCode == corpCode) {
                        corpCodeIsTrue = true;
                        this.temp.corpCode = restaurants[i].corpCode;
                        this.temp.corpName = restaurants[i].corpName;
                        this.temp.corporationId = restaurants[i].id;
                        break;
                    }
                }
                if (!corpCodeIsTrue) {
                    Message({
                        message: '所属企业不存在,请选择',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    })
                    return;
                }
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    Editor(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.temp = tempInit()
                        });
                } else {
                    return false;
                }
            });

        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id)
                        .then((data) => {
                            if (data) {
                                Message({
                                    message: '删除成功',
                                    type: 'success',
                                    customClass: 'msg-success',
                                    iconClass: 'ic'
                                })
                                this.getList(this.pageParam);
                            }
                        })
                })

        },
        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        handleCancel() {

            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        reset: function () {
            // this.queryParameter = queryParameterInit();
            this.queryParameter.name = null;
            this.queryParameter.code = null;
            this.queryParameter.roleType = "";
        },
        getParentRole: function () {
            let queryParameter = {corporationId: this.currentUser.corporationId, roleType: this.temp.roleType};
            if (this.currentUser.roleType == "PLATFORM" || this.dialogStatus == 'editor') {
                queryParameter.corporationId = "";
            }
            GetParentRole(queryParameter).then(data => {
                this.queryParameter.parentRoles = data.data;
            });
        },

        /**
         * 过滤已经选中的数据
         * @param data
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _treeDataHandler: function (rightTreeHashContainer, authIds) {
            let data = JSON.parse(JSON.stringify(this.oldTreeData));
            this.oldTreeDataIds = [];
            let treeHashContainer = {};
            let rootNodes = [];

            let ids = {};
            for (let index in authIds) {
                let id = authIds[index];
                ids[id] = id;
            }
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.id] = d;
                this.oldTreeDataIds.push(d.id);
                if (d.pid == "module0") {
                    rootNodes.push(d);
                }
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.pid != "module0") {
                    var parent = treeHashContainer[d.pid];
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(d);
                        d.parent = parent;
                    }
                }
            }

            //删除子集
            //被删除的 父节点
            let deleteParent = {};
            //被忽略的 父节点
            let parentIds = {};
            let _parentIds = [];

            let deleteFun = function () {
                for (let aIndex = 0; aIndex < authIds.length; aIndex++) {
                    let id = authIds[aIndex];
                    let leftParameter = treeHashContainer[id];

                    if (leftParameter.children == null || leftParameter.children == undefined || leftParameter.children.length == 0) {

                        if (null == leftParameter.parent || leftParameter.parent == undefined) {
                            for (let rIndex in rootNodes) {
                                if (rootNodes[rIndex].id == id) {
                                    rootNodes.splice(rIndex, 1);
                                    break;
                                }
                            }
                        } else {
                            let parentChildren = leftParameter.parent.children;
                            for (let c = 0; c < parentChildren.length; c++) {
                                if (parentChildren[c].id == id) {
                                    parentChildren.splice(c, 1);
                                    leftParameter.parent.children = parentChildren;
                                    break;
                                }
                            }
                        }
                    } else {
                        if (parentIds[id] == null || parentIds[id] == undefined) {
                            _parentIds.push(id);
                            parentIds[id] = id;
                            authIds.push(id);
                        }

                    }
                }
            }
            deleteFun();
            let parentIdsCount = _parentIds.length;
            authIds = JSON.parse(JSON.stringify(_parentIds));
            _parentIds = [];
            parentIds = {};
            deleteFun();
            while (true) {
                authIds = JSON.parse(JSON.stringify(_parentIds));
                _parentIds = [];
                parentIds = {};
                let parentIdsCount1 = authIds.length;
                if (parentIdsCount1 < parentIdsCount && parentIdsCount != 0) {
                    parentIdsCount = parentIdsCount1;
                    deleteFun();
                } else {
                    break;
                }
            }

            return {treeData: Object.assign([], rootNodes), treeHashContainer: Object.assign({}, treeHashContainer)};
        },

        /**
         * 根据id查询已经选中的数据
         * @param authIds
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _rightTreeDataHandler: function (authIds) {
            this.updateRightData = [];
            let data = JSON.parse(JSON.stringify(this.oldTreeData));
            let treeHashContainer = {};
            let rootNodes = [];
            let ids = {};
            for (let index in authIds) {
                let id = authIds[index];
                ids[id] = id;
            }
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.id] = d;
                if (d.pid == "module0" && ids[d.id] != null && ids[d.id] != undefined) {
                    //console.log(ids[d.id]);
                    //console.log(d);
                    rootNodes.push(d);
                    this.updateRightData.push(d);
                }
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.pid != "module0" && ids[d.id] != null && ids[d.id] != undefined) {
                    var parent = treeHashContainer[d.pid];
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(d);
                        d.parent = parent;
                        this.updateRightData.push(d);
                    }
                }
            }
            this.rightTreeHashContainer = treeHashContainer;
            return {treeData: Object.assign([], rootNodes), treeHashContainer: Object.assign({}, treeHashContainer)};
        }
        ,

        /**
         * 提交分配的权限
         */
        updateAuth: function (row) {
            let roleId = this.queryParameter.roleId;
            let data = [];
            for (let index in this.updateRightData) {
                let d = this.updateRightData[index]
                let p = {};
                p.code = d.code;
                p.id = d.id;
                p.name = d.name;
                p.optId = d.optId;
                p.pid = d.pid;
                p.resouce = d.resouce;
                data.push(p);
            }
            UpdateAuth(roleId, data).then(data => {
                this.assigningAuthFormVisible = false;
            });
        },
        /**
         * 树筛选
         */
        leftTreeSearch: function (val) {
            this.$refs.treeLeft.filter(val);
        },
        rightTreeSearch: function (val) {
            this.$refs.treeRight.filter(val);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        loadAll() {
            return [];
        },
        //下拉联想选择
        handleSelect(obj){
            console.log(obj);
        },
        querySearchAsync(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
            cb(results);

        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
    },
    mounted() {
        GetCorporationAll().then(result => {
            let data = result.data;
            for (let i in data) {
                data[i].value = data[i].corpName;
            }
            this.restaurants = data
        });
        // this.restaurants = this.loadAll();
    }

};


function tempInit() {
    return {
        systemId: 15,
        systems: [],
        code: null,
        name: null,
        roleType: null,
        corpCode: null,
        parentId: null,
        description: null,
        corporationId: null,
        roleTypes: {
            "PLATFORM": "平台",
            "CORP": "企业",
            "ORG": "组织"
        }
    }
}

function queryParameterInit() {
    return {
        code: null,
        name: null,
        roleType: "",
        roleTypes: [],
        page: 1,
        size: 10,
        corporationId: null,
        parentRoles: [],
        leftTreeFilterText: null,
        rightTreeFilterText: null,
        roleId: null,

    };
}