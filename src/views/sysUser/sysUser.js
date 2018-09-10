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
    ResetPassword,
    ListQuery,
    GetByRoleType,
    RoleSave,
    CreateSysResource,
    SelectBySysId
} from './api/sysUserApi';
import {ResourceList} from '../Resource/api/resourceApi'
import {Message} from 'element-ui';

export default {
    created() {
        this.getList();
        this.getResource();
        //需要初始化 currentUser
        // $scope.currentUser
        this.currentUser.roleType == "PLATFORM"
    },
    data() {
        return {
            value5: [1,2,3],
            data2: [],
            queryParameter: queryParameterInit(),
            searchFormVisible: false,
            dialogFormVisible: false,
            usersFormVisible: false,
            assigningAuthFormVisible: false,
            assigningRoleFormVisible: false,
            resourceRoleFormVisible: false,
            dialogStatus: 'create',
            rowTotal: 10,
            tableData: [],
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            temp: tempInit(),
            sysResource: sysResourceInit(),
            rules: {
                account: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {max: 30, message: '用户名不能大于30位', trigger: 'blur'},
                ],
                userName: [
                    {required: true, message: '请输入用户姓名', trigger: 'blur'},
                    {max: 20, message: '用户姓名不能大于20位', trigger: 'blur'},
                ],
                mobile: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {max: 11, message: '手机号不能大于11位', trigger: 'blur'},
                ]
            },
            props: {
                label: 'name'
            },
            treeLeftData: [],
            treeRightData: [],
            oldTreeData: [],
            rightIds: [],
            updateRightData: [],
            roles: [{id: 0}],
            currentUser: {roleType: "PLATFORM"},
            roleIds: [],
            sysUser: {},
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([
                    {
                        id:'1',
                        name: 'region1' },
                    {
                        id:'2',
                        name: 'region2'
                    }
                    ]);
            }
            if (node.level > 3) return resolve([]);

            var hasChild;
            if (node.data.id === '1') {
                hasChild = true;
            } else if (node.data.id === '2') {
                hasChild = false;
            }

            setTimeout(() => {
                var data;
                if (hasChild) {
                    data = [{
                        name: 'zone' + this.count++
                    }, {
                        name: 'zone' + this.count++
                    }];
                } else {
                    data = [];
                }
                resolve(data);
            }, 500);
        },
        //翻页功能
        handleCurrentChange1(page) {
            this.queryParameter.page = page;
            this.getList();

        },
        getResource(){
            if(this.data2.length == 0){
                ResourceList().then(response=>{
                    this.data2 = response.data.data;
                })
            }
        },
        getList() {
            Page(this.queryParameter).then((data) => {
                let rowTotal = data.data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.data.rows;
                    this.rowTotal = data.data.rowTotal;
                    this.tableData = rows;
                } else {
                    this.rowTotal = 0;
                    this.tableData = [];
                }
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
            this.parentTree = false;
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            this.temp = $.extend(tempInit(), row)
        },
        onUsersFormVisible: function (parentUser) {
            this.$router.push({
                path: '/weChat/role/assigningUsers', params: {
                    parentUser: parentUser
                }, query: {
                    parentUser: parentUser
                }
            });
        },
        onAssigningAuthFormVisible: function (row) {
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
        //分配资源
        onResourceRoleFormVisible: function (row) {
            this.resourceRoleFormVisible = true;
            this.sysResource.sysId = row;
            SelectBySysId(row).then(data => {

                if(data.data){
                    this.value5 = data.data.resourceId.split(",");
                    this.$refs.tree.setCheckedKeys(this.value5);
                }else{
                    this.value5 = [];
                    this.$refs.tree.setCheckedKeys(this.value5);
                }
            })
        },
        //分配角色
        onAssigningRoleFormVisible: function (row) {
            this.temp.roleIds = [];
            this.temp.roleTypes = [];
            this.queryParameter.roleTypes = [];
            this.roleIds = [];

            this.roles = [{id: 0}];
            this.sysUser = row;
            let addParams = row;
            let roleLists = [];
            let userType = "";
            let showFlag = false;
            let roleTypes = [];
            let currentUser = this.currentUser;
            if (addParams.corpCode == null) {
                addParams.role = "无";
                userType = "PLATFORM";
            } else {
                userType = "";
            }

            ListQuery(addParams.id).then(data => {
                let obj = {};
                let temp = {};
                addParams.roleType = "";
                if (data.code == '0') {
                    addParams.userMembership = data.data;
                    roleLists = data.data;
                    if (null != data.data && data.data.length > 0) {
                        obj.roleType = data.data[0].roleType;
                    }
                    if (obj.roleType == "ORG" && currentUser.roleType == "PLATFORM") {
                        Message({
                            message: '平台不可为组织用户分配角色!',
                            type: 'success',
                            customClass: 'msg-success',
                            iconClass: 'ic'
                        });
                        return;
                    }
                    if (userType == "" && currentUser.roleType == "PLATFORM") {
                        obj.roleType = "CORP";
                    } else if (userType == "PLATFORM" && currentUser.roleType == "PLATFORM") {
                        obj.roleType = "PLATFORM";
                    }
                    if (obj.roleType == 'CORP') {
                        roleTypes = [{"value": "CORP", "name": "企业"}, {"value": "ORG", "name": "组织"}];
                    } else if (obj.roleType == "PLATFORM") {
                        roleTypes = [{"value": "PLATFORM", "name": "平台"}];
                    } else if (obj.roleType == "ORG") {
                        roleTypes = [{"value": "ORG", "name": "组织"}];
                    }

                    // GetByRoleType(obj).then(resultRoleType => {
                    //     this.roleIds = resultRoleType.data;
                    // });

                    this.queryParameter.roleTypes = roleTypes;
                    this.queryParameter.oldRoleTypes = JSON.parse(JSON.stringify(roleTypes));

                    if (roleLists.length > 0) {
                        for (let _index in roleTypes) {
                            if (roleTypes[_index].value == obj.roleType) {
                                if (_index == 0) {
                                    roleTypes.splice(1, roleTypes.length - 1);
                                } else if (_index == roleTypes.length - 1) {
                                    roleTypes.splice(0, roleTypes.length - 1);
                                } else {
                                    roleTypes.splice(0, _index);
                                    roleTypes.splice(1, roleTypes.length - 1);
                                }
                                this.getByRoleType(_index);

                                break;
                            }
                        }
                    }
                    //显示已经分配的 角色
                    let _roleIds = [];
                    let _roleTypes = [];
                    for (let role in roleLists) {
                        _roleIds.push(roleLists[role].roleId);
                        _roleTypes.push(obj.roleType);
                        if (role != 0) {
                            this.addRole();
                        }
                    }
                    this.temp.roleIds = _roleIds;
                    this.temp.roleTypes = _roleTypes;
                }
            });
            this.assigningRoleFormVisible = true;
        },
        //根据角色类型查询角色下级所有该角色类型
        getByRoleType: function (index) {

            if (index != 0) {
                this.temp.roleIds[index] = null;
            }
            let obj = {};
            obj.roleType = this.temp.roleTypes[index];
            obj.corporationId = this.queryParameter.corporationId;
            let roleTypes = this.queryParameter.roleTypes;
            if (roleTypes.length > 1) {
                this.temp.roleIds[index] = null;
                for (let _index in roleTypes) {
                    if (roleTypes[_index].value == this.temp.roleTypes[index]) {
                        if (_index == 0) {
                            roleTypes.splice(1, roleTypes.length - 1);
                        } else if (_index == roleTypes.length - 1) {
                            roleTypes.splice(0, roleTypes.length - 1);
                        } else {
                            roleTypes.splice(0, _index);
                            roleTypes.splice(1, roleTypes.length - 1);
                        }
                        break;
                    }
                }
            }
            GetByRoleType(obj).then(resultRoleType => {
                this.roleIds = resultRoleType.data;
            });
        },
        //分配角色
        saveRole: function () {
            let sysUser = this.sysUser;
            let userMembership = [];
            let _roleIds = this.temp.roleIds;
            for (let role in _roleIds) {
                for (let index in this.roleIds) {
                    if (_roleIds[role] == this.roleIds[index].id) {
                        let role = {};
                        role.roleId = this.roleIds[index].id;
                        role.roleType = this.roleIds[index].roleType;
                        // userMembership.push(this.roleIds[index]);
                        userMembership.push(role);
                    }
                }
            }
            sysUser.userMembership = userMembership;
            RoleSave(sysUser).then(data => {
                Message({
                    message: '分配成功',
                    type: 'success',
                    customClass: 'msg-success',
                    iconClass: 'ic'
                });
                this.assigningRoleFormVisible = false;
            });
        },
        //分配资源
        saveResource: function () {
            this.sysResource.resourceId = this.$refs.tree.getCheckedKeys().toString();
            CreateSysResource(this.sysResource).then(data => {
                this.resourceRoleFormVisible = false;
            })
        },
        handleLeftTreeCheckChange: function () {
            console.log(arguments);
        },
        //左侧树
        loadLeftNode(node, resolve) {
            if (node.level === 0) {
                //初始化树
                GetAllAuth().then(data => {
                    let hashContainer = {};
                    let rootNodes = [];
                    for (let i = 0; i < data.length; i++) {
                        let d = data[i];
                        hashContainer[d.i] = d;
                        if (d.pid == "module0") {
                            rootNodes.push(d);
                        }
                    }

                    for (let i = 0; i < data.length; i++) {
                        let d = data[i];
                        if (d.pid != "module0") {
                            if (hashContainer[d.pid]) {
                                hashContainer[d.pid].children = hashContainer[d.pid].children || [];
                                hashContainer[d.pid].children.push(d);
                            }
                        }
                    }

                    this.treeLeftData = rootNodes

                    console.log(rootNodes);


                    // console.log("树数据", data);
                    // //第一级
                    // let level = 1;
                    // //最大层级
                    // let maxLevel = 11;
                    // //所有层级数据
                    // let allLevelData = {};
                    // // let allLevelData={1:[{}],2:{"1pid":[{}],},3:{"2pid":[{}],}};
                    // let allLevelDataIds = {};
                    // // let allLevelDataIds = {1:{},2:{}};
                    // let otherLevelData = [];
                    //
                    // while (true) {
                    //     if (level >= maxLevel) {
                    //         break;
                    //     }
                    //     //当 不是父级 且剩下数据为空 直接退出
                    //     if (level != 1 && otherLevelData.length == 0) {
                    //         break;
                    //     }
                    //     //获取所有父类id
                    //     let parentIds = allLevelDataIds[level - 1];
                    //     //父id为空直接退出
                    //     if (level != 1 && (parentIds == null || parentIds == undefined)) {
                    //         break;
                    //     }
                    //     //当前层级数据
                    //     let levelData = [];
                    //     //其他层级数据
                    //     let otherData = [];
                    //     //当前层级id
                    //     let ids = {};
                    //     if (level == 1) {
                    //         data.forEach(function (p) {
                    //             //第一级
                    //             if (p.pid == "module0") {
                    //                 levelData.push(p);
                    //                 ids[p.id] = p.id;
                    //             } else {
                    //                 otherData.push(p);
                    //             }
                    //         });
                    //         //添加 数据
                    //         if (levelData.length > 0) {
                    //             allLevelData[level] = levelData;
                    //         }
                    //     } else if (allLevelData[level] == null || allLevelData[level] == undefined) {
                    //
                    //         //除了第一层级的数据封装格式
                    //         let childrenData = {};
                    //         // let childrenData={"1pid":[{}],};
                    //         otherLevelData.forEach(function (p) {
                    //             if (p.pid != null && p.pid != undefined) {
                    //                 //判断父id是否存在
                    //                 if (parentIds[p.pid] != null && parentIds[p.pid] != undefined) {
                    //                     let childrenList = childrenData[p.pid];
                    //                     if (childrenList == null || childrenList == undefined) {
                    //                         childrenList = [];
                    //                     }
                    //                     childrenList.push(p);
                    //                     ids[p.id] = p.id;
                    //                     childrenData[p.pid] = childrenList;
                    //                 } else {
                    //                     otherData.push(p);
                    //                 }
                    //             } else {
                    //                 //扔掉脏数据
                    //             }
                    //         });
                    //         if (Object.keys(childrenData).length > 0) {
                    //             allLevelData[level] = childrenData;
                    //         }
                    //     }
                    //     if (Object.keys(ids).length > 0) {
                    //         allLevelDataIds[level] = ids;
                    //     }
                    //     if (otherData.length > 0) {
                    //         otherLevelData = otherData;
                    //     }
                    //     level++;
                    //     data = otherLevelData;
                    // }
                    // //初始化数据完毕  赋值第一级菜单
                    // this.leftAlLevelData = allLevelData;
                    // if (Object.keys(allLevelData).length > 0) {
                    //     this.treeLeftData = allLevelData[1];
                    // }
                    console.log("所有层级数据", allLevelData);
                    console.log("所有层级ids", allLevelDataIds);
                    console.log("其他数据", otherLevelData);

                    return resolve(this.treeLeftData);
                });
            } else {
                let childrenData = this.leftAlLevelData[node.level + 1][node.data.id];
                if (childrenData == null || childrenData == undefined) {
                    return resolve([]);
                } else {
                    return resolve(childrenData);
                }

            }
        },
        //获取左侧数选中数据
        // getCheckedLeftNodes() {
        //     return this.$refs.treeLeft.getCheckedNodes();
        // },
        nodeClick: function (node) {
            let checkedNodes = this.$refs.treeLeft.getCheckedNodes();
            console.log("单个节点", checkedNodes);
        },
        //添加到右侧
        moveToRight: function () {
            let checkedNodes = this.$refs.treeLeft.getCheckedNodes();
            let allCheckedNodesHash = {};
            let allCheckedNodes = [];

            //1、找出需要移到右侧的节点
            for (let i = 0; i < checkedNodes.length; i++) {
                let node = checkedNodes[i];
                allCheckedNodes.push(node.id);
                let parentData = node.parent;
                while (true) {
                    if (!parentData) {
                        break
                    }
                    if (!allCheckedNodesHash[parentData.id]) {
                        allCheckedNodes.push(parentData.id);
                        allCheckedNodesHash[parentData.id] = parentData;
                    }
                    parentData = parentData.parent;
                }

            }
            //右侧所有数据ids
            let ids = {};
            for (let id of this.rightIds) {
                ids[id] = id;
            }
            for (let id of allCheckedNodes) {
                if (ids[id] == null || ids[id] == undefined) {
                    this.rightIds.push(id);
                }
            }
            // this.rightIds = this.rightIds.concat(allCheckedNodes);
            let rightData = this._rightTreeDataHandler(this.rightIds);
            this.treeRightData = rightData.treeData;
            //重新初始初始化左侧数据
            let treeHashContainer = rightData.treeHashContainer;
            let d = this._treeDataHandler(treeHashContainer, this.rightIds);
            this.treeLeftData = d.treeData;
        },
        moveToLeft: function () {
            let checkedNodes = this.$refs.treeLeft.getCheckedNodes();
            let allCheckedNodesHash = {};
            let allCheckedNodes = [];

            //1、找出需要移到右侧的节点
            for (let i = 0; i < checkedNodes.length; i++) {
                let node = checkedNodes[i];
                allCheckedNodes.push(node.id);
                let parentData = node.parent;
                while (true) {
                    if (!parentData) {
                        break
                    }
                    if (!allCheckedNodesHash[parentData.id]) {
                        allCheckedNodes.push(parentData.id);
                        allCheckedNodesHash[parentData.id] = parentData;
                    }
                    parentData = parentData.parent;
                }

            }
            //右侧所有数据ids
            this.rightIds = this.rightIds.concat(allCheckedNodes);
            let rightData = this._rightTreeDataHandler(this.rightIds);
            this.treeRightData = rightData.treeData;
            //重新初始初始化左侧数据
            let treeHashContainer = rightData.treeHashContainer;
            let d = this._treeDataHandler(treeHashContainer, this.rightIds);
            this.treeLeftData = d.treeData;
        },
        //条件查询
        doSearch: function () {
            this.getList();
        },
        //添加
        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    this.temp.corpName = this.queryParameter.corpName;
                    this.temp.corpCode = this.queryParameter.corpCode;
                    Create(this.temp)
                        .then(() => {
                            Message({
                                message: '新增成功',
                                type: 'success',
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            });
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    Editor(this.temp)
                        .then(() => {
                            Message({
                                message: '修改成功',
                                type: 'success',
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            });
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'update';
                            this.getList(this.pageParam);
                            this.temp = tempInit()
                        });
                } else {
                    return false;
                }
            });

        },
        //启用禁用
        updateEnabledFlag: function (row, val) {
            this.temp = $.extend(tempInit(), row);
            this.temp.enabledFlag = val;
            Editor(this.temp)
                .then(() => {
                    let msg = "";
                    if (val == 0) {
                        msg = "禁用";
                    } else {
                        msg = "启用";
                    }
                    Message({
                        message: msg + '成功',
                        type: 'success',
                        customClass: 'msg-success',
                        iconClass: 'ic'
                    });
                    this.getList(this.pageParam);
                    this.temp = tempInit()
                });
        },
        resetPassword: function (id) {
            ResetPassword(id).then(data => {

            });
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
            this.queryParameter = queryParameterInit();
        },
        getParentRole: function () {
            let queryParameter = {corporationId: 1, roleType: this.temp.roleType};
            GetParentRole(queryParameter).then(data => {
                this.queryParameter.parentRoles = data.data;
            });
        },
        /**
         * jstree全部转移
         * @param treeFrom   需要转移的（id）
         * @param treeTo      要转移到的（id）
         */
        allToall: function (treeFrom, treeTo) {
        },

        /**
         * 过滤已经选中的数据
         * @param data
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _treeDataHandler: function (rightTreeHashContainer, authIds) {
            let data = JSON.parse(JSON.stringify(this.oldTreeData));
            let treeHashContainer = {};
            let rootNodes = [];

            let ids = {};
            for (let id of authIds) {
                ids[id] = id;
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.id] = d;
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
            let deleteParent = {};
            for (let id of authIds) {

                let leftParameter = treeHashContainer[id];
                if (leftParameter.parent) {
                    if (deleteParent[leftParameter.parent.id] != null && deleteParent[leftParameter.parent.id] != undefined) {
                        break;
                    }
                }

                if (leftParameter.children == null || leftParameter.children == undefined || leftParameter.children.length == 0) {
                    //右侧树 子集列表
                    let rightPC = rightTreeHashContainer[id].parent.children;
                    let rightChildrenMap = {};
                    for (let rightChildren in rightPC) {
                        rightChildrenMap[rightChildren.id] = rightChildren;
                    }
                    //左侧树子集列表
                    let parentChildren = leftParameter.parent.children;
                    //左侧包含右侧
                    let rightContainsLeft = true;
                    for (let leftChildren in parentChildren) {
                        if (rightChildrenMap[leftChildren.id] == null || rightChildrenMap[leftChildren.id] == undefined) {
                            rightContainsLeft = false;
                        }
                    }
                    //包含则删除 父类
                    if (rightContainsLeft) {
                        let parent = leftParameter.parent;
                        deleteParent[parent.id] = parent;
                        //父级 的children
                        let ppChildren = parent.children;
                        for (let c = 0; c < ppChildren.length; c++) {
                            if (ppChildren[c].id == parent.id) {
                                ppChildren.splice(c, 1);
                                parent.parent.children = ppChildren;
                                break
                            }
                        }

                    } else {
                        for (let c = 0; c < parentChildren.length; c++) {
                            if (parentChildren[c].id == id) {
                                parentChildren.splice(c, 1);
                                leftParameter.parent.children = parentChildren;
                                break
                            }
                        }
                    }
                }
            }

            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },
        /**
         * 根据id查询已经选中的数据
         * @param authIds
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _rightTreeDataHandler: function (authIds) {
            let data = JSON.parse(JSON.stringify(this.oldTreeData));
            let treeHashContainer = {};
            let rootNodes = [];
            let ids = {};
            for (let id of authIds) {
                ids[id] = id;
            }
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.id] = d;
                if (d.pid == "module0" && ids[d.id] != null && ids[d.id] != undefined) {
                    console.log(ids[d.id]);
                    console.log(d);
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

            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },

        /**
         * 提交分配的权限
         */
        updateAuth: function (row) {
            let roleId = this.queryParameter.roleId;
            let data = [];
            for (let d in this.updateRightData) {
                let p = {};
                p.code = d.code;
                p.id = d.id;
                p.name = d.name;
                p.optId = d.optId;
                p.pid = d.pid;
                p.resouce = d.resouce;
                data.push(p);
            }
            UpdateAuth(roleId, data).then(function () {

            });
        },
        addRole: function (val) {
            let index = this.roles.length;
            this.roles.push({id: index});
            this.temp.roleIds[index] = null;
            this.temp.roleTypes[index] = null;
            console.log(index);
        },
        removeRole: function (val) {
            if (this.roles.length > 1) {
                this.roles.splice(val, 1)
                this.temp.roleIds.splice(val, 1);
                this.temp.roleTypes.splice(val, 1);
            } else {
                this.temp.roleIds.splice(val, 1);
                this.temp.roleTypes.splice(val, 1);
                this.queryParameter.roleTypes = JSON.parse(JSON.stringify(this.queryParameter.oldRoleTypes));
            }
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

    }
};


function tempInit() {
    return {
        account: null,
        userName: null,
        corpCode: null,
        corpName: null,
        mobile: null,
        enabledFlag: null,
        roleIds: [],
        roleTypes: [],

    }
}

function queryParameterInit() {
    return {
        roleTypes: [{value: "CORP", label: "企业"}, {value: "ORG", label: "组织"}],
        oldRoleTypes: [{value: "CORP", label: "企业"}, {value: "ORG", label: "组织"}],
        userClassNameArr: {
            "1": "平台",
            "2": "企业",
            "3": "组织"
        },
        page: 1,
        pageNum: 1,
        pageSize: 10,
        size: 10,
        parentRoles: [],
        leftTreeFilterText: null,
        rightTreeFilterText: null,
        roleId: null,
        corpCode: "CCPG",
        corpName: "长城物业",
        corporationId: "1",
        account: null,
        userName: null,
        mobile: null,
        corpNameId: null,
        enabledFlag: '',
        enabledFlags: [{label: "启用", value: "1"}, {label: "禁用", value: "0"}],

    };
}

function sysResourceInit() {
    return {
        sysId: '',
        resourceId: '',
    }
}



