import {
    Unassigned,
    Delete,
    Create,
    AlreadyAssigned,
    GetOrgTree,
    GetOrgStemUser
} from './api/assigningUsersApi';
import {Message} from 'element-ui';
import Cookies from 'js-cookie';
import {GetOrgTreeInfo} from "../saasOrganization/api/saasOrganizationApi";

export default {
    created() {
        this.initParentUser();
        this.getListAlready();
    },
    data() {
        return {
            queryParameter: queryParameterInit(),
            userQueryParameter: userParameterInit(),
            dialogFormVisible: false,
            usersFormVisible: false,
            assigningUsersFormVisible: false,
            assigningOrgUsersFormVisible: false,
            searchFormVisible: false,
            dialogStatus: 'create',
            rowTotal: 10,
            rowTotal1: 10,
            unassignedTableData: [],
            alreadyAssignedTableData: [],
            parentUser: {},
            currentUser: {},
            selectedUsers: [],
            // props: {
            //     label: 'text',
            //     children: 'zones',
            //     isLeaf: 'isLeaf'
            // },
            props: {
                label: 'orgName',
            },

            orgList: [],
            includeChildrenData: [],
            isIncludeChildren:false,
            orgId:"",
            treeLeftData:[],
        }
    },
    methods: {
        initParentUser: function () {
            if (this.$route.query == null
                || this.$route.query == undefined
                || this.$route.query.parentUser == null
                || this.$route.query.parentUser == undefined
                || this.$route.query.parentUser.id == null
                || this.$route.query.parentUser.id == undefined) {
                this.$router.push('/system/role/index');
            }
            let routerParams = this.$route.query.parentUser;
            this.parentUser = routerParams;
            this.orgId = this.$store.state.user.user;
            this.currentUser=this.$route.query.currentUser;
            console.log("分配用户",this.currentUser);
        },
        //翻页功能
        handleCurrentChange(page) {
            this.queryParameter.page = page;
            this.getListAlready()
        },
        handleCurrentChange1(page) {
            this.userQueryParameter.page = page;
            if (this.parentUser.roleType == "CORP" || this.parentUser.roleType == "PLATFORM") {
                this.getListUnassigned();
            } else {
                this.getOrgStemUser();
            }
        },
        getListAlready(){
            let routerParams = this.parentUser;
            this.queryParameter.id = routerParams.id;
            // this.queryParameter.corporationId = routerParams.corporationId;
            this.userQueryParameter.typeName = this.userQueryParameter.roleTypes[routerParams.roleType];
            this.userQueryParameter.name = routerParams.name;
            AlreadyAssigned(this.queryParameter).then((data) => {
                let rowTotal = data.data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != 0) {
                    let rows = data.data.rows;
                    this.rowTotal = rowTotal;
                    this.alreadyAssignedTableData = rows;
                } else {
                    this.rowTotal = 0;
                    this.alreadyAssignedTableData = [];
                }
            });
        },
        getListUnassigned(){
            this.userQueryParameter.roleId = this.parentUser.id;
            this.userQueryParameter.corporationId = this.parentUser.corporationId;
            Unassigned(this.userQueryParameter).then((data) => {
                let rowTotal = data.data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != 0) {
                    let rows = data.data.rows;
                    this.rowTotal1 = rowTotal;
                    this.unassignedTableData = rows;
                } else {
                    this.rowTotal1 = 0;
                    this.unassignedTableData = [];
                }
            });
        },
        getOrgStemUser(){
            this.userQueryParameter.roleId = this.parentUser.id;
            this.userQueryParameter.corporationId = this.parentUser.corporationId;
            GetOrgStemUser(this.userQueryParameter).then(data => {
                let rowTotal = data.data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != 0) {
                    let rows = data.data.rows;
                    this.rowTotal1 = rowTotal;
                    this.unassignedTableData = rows;
                } else {
                    this.rowTotal1 = 0;
                    this.unassignedTableData = [];
                }
            });
        },
        onAssigningUsersFormVisible: function () {
            if (this.parentUser.roleType == "CORP" || this.parentUser.roleType == "PLATFORM") {
                this.getListUnassigned();
                this.assigningUsersFormVisible = true;
            } else {
                this.orgList = [];
                this.includeChildrenData = [];
                this.getOrgStemUser();
                this.assigningOrgUsersFormVisible = true;
            }
            this.initTree();
        },
        //获取组织树
        parentLoadNode(node, resolve) {
            let queryParameter = {};
            if (node.level === 0) {
                queryParameter.corporationId = this.parentUser.corporationId;
                if (null != this.orgId && undefined != this.orgId
                    && "" != this.orgId && "null" != this.orgId){
                    queryParameter.id=this.orgId;
                }else{
                    queryParameter.id = "#";
                }
                GetOrgTree(queryParameter).then(data => {
                    if (data.code == 0) {
                        let resultData = data.data;
                        return resolve(resultData);
                    }
                });
            } else {
                queryParameter.corporationId = this.parentUser.corporationId;
                queryParameter.parentId = node.data.id;
                //查询树  数据
                GetOrgTree(queryParameter).then(data => {
                    if (data.code == 0) {
                        return resolve(data.data);
                    }
                });
            }
        },
        initTree: function () {
            if (null != this.currentUser.corporationId && undefined != this.currentUser.corporationId && "" != this.currentUser.corporationId) {
                this.queryParameter.corporationId = this.currentUser.corporationId;
            }
            if (this.currentUser.orgId != undefined && null != this.currentUser.orgId && "" != this.currentUser.orgId) {
                this.queryParameter.id = this.currentUser.orgId;
            }
            let p = {};
            p.corporationId = this.currentUser.corporationId;
            p.enabledFlag = 1;
            //p.corpIsRoot = "Y";
            if (null != this.currentUser.orgId && undefined != this.currentUser.orgId
                && "" != this.currentUser.orgId && "null" != this.currentUser.orgId) {
                p.id = this.currentUser.orgId;
            }
            let userId = this.$store.state.user.user.id;
            let brandId = this.$store.state.user.brandId;
            // if(this.currentUser.roleType == "ORG"){
            //
            // }
            GetOrgTreeInfo(userId,brandId).then(response=>{
                this.treeLeftData = this._treeDataHandler(response).treeData;
                // this.getList();
            });
            // SearchTree(p).then((data) => {
            //     if (data.code == 0) {
            //         let resultData = data.data;
            //         this.getList();
            //         this.treeLeftData = this._treeDataHandler(resultData).treeData;
            //     }
            // });

            // getOrgTreeInfo(userId, brandId).then(response => {
            //     this.treeLeftData = this._treeDataHandler(response).treeData;
            // });
            // searchOrgTreeByCondition(user,brandId).then(response=>{
            //     var data=response.data.data;
            //     this.structrueData = this._treeDataHandler(data).treeData;
            // })

        },
        _treeDataHandler: function (data) {
            let orgId = this.$store.state.user.user.orgId;
            let treeHashContainer = {};
            let rootNodes = [];
            for (let i = 0; i < data.length; i++) {
                if (this.currentUser.roleType == "ORG") {
                    if (data[i].id == orgId || data[i].parentId == orgId || data[i].parentId == "0") {
                        let d = data[i];
                        treeHashContainer[d.id] = d;
                    }
                } else {
                    let d = data[i];
                    treeHashContainer[d.id] = d;

                }
            }

            for (let i = 0; i < data.length; i++) {
                if (this.currentUser.roleType == "ORG") {
                    if (data[i].id == orgId || data[i].parentId == orgId || data[i].parentId == "0") {
                        let d = data[i];
                        // if (d.treeParentId != null && d.treeParentId != undefined && d.treeParentId != "") {
                        var parent = treeHashContainer[d.parentId];
                        if (parent) {
                            parent.children = parent.children || [];
                            parent.children.push(d);
                            d.parent = parent;
                        } else {
                            rootNodes.push(d);
                        }
                        // }
                    }
                } else {
                    let d = data[i];
                    var parent = treeHashContainer[d.parentId];
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(d);
                        d.parent = parent;
                    } else {
                        rootNodes.push(d);
                    }
                }
            }
            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },
        //点击选择 树  数据
        nodeCheckChange(e, data, node, obj){
            if (data) {
                //选中
                let text = e.text;
                let id = e.id;
                let p = {};
                p.name = text;
                p.id = id;
                this.orgList.push(p);
            } else {
                //取消
                let orgList = this.orgList;
                let list=[];
                for (let i in orgList) {
                    if (orgList[i].id != e.id) {
                        list.push(orgList[i]);
                    }
                }
                this.orgList=list;
            }

        },
        //是否及一下  包含子集
        includeChildren(selection, row){
            this.includeChildrenData = selection;
        },
        //全部 包含/不包含  子集
        includeChildrenAll(selection){
            this.includeChildrenData = selection;
        },
        //多选绑定
        handleSelectionChange(val) {
            this.selectedUsers = val;
        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete({userId: row.id, roleId: row.roleId})
                        .then(() => {
                            this.getListAlready();
                        })
                })

        },
        handleCancel() {

            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        reset: function () {
            this.userQueryParameter.userName = null;
            this.userQueryParameter.mobile = null;
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        doSearch: function () {
            if (this.parentUser.roleType == "CORP" || this.parentUser.roleType == "PLATFORM") {
                this.getListUnassigned();
            } else {
                this.getOrgStemUser();
            }
        },
        create() {
            if (this.selectedUsers.length > 0) {
                this.onXHR = true;
                let userIds = [];
                this.selectedUsers.forEach(function (p) {
                    userIds.push(p.id);
                });
                let saveData = {
                    corpName: this.parentUser.corpName,
                    corporationId: this.parentUser.corporationId,
                    roleId: this.parentUser.id,
                    roleType: this.parentUser.roleType,
                    userIds: userIds
                }
                if (this.parentUser.roleType != "CORP" && this.parentUser.roleType != "PLATFORM") {
                    let orgIds="";
                    let orgIncludeSubFlags=""
                    let orgList=this.orgList;
                    if(orgList.length>0){
                        let isIncludeChildren=this.isIncludeChildren;
                        if(orgList.length>1){
                            isIncludeChildren=false;
                        }
                        for(let i in orgList){
                            let org=orgList[i];
                            orgIds=orgIds+org.id;
                            if(isIncludeChildren){
                                orgIncludeSubFlags=orgIncludeSubFlags+"1 "+org.id;
                            }else{
                                orgIncludeSubFlags=orgIncludeSubFlags+"0 "+org.id;
                            }
                            if(i!=orgList.length-1){
                                orgIds=orgIds+",";
                                orgIncludeSubFlags=orgIncludeSubFlags+",";
                            }
                        }
                        if(orgIds!=""){
                            saveData.orgIds=orgIds;
                        }
                        if(orgIncludeSubFlags!=""){
                            saveData.orgIncludeSubFlags=orgIncludeSubFlags;
                        }
                    }
                }else{
                    Message({
                        message: '当前分配角色类型为组织类型,请选择组织',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });
                    return;
                }
                Create(saveData).then(() => {
                    this.assigningUsersFormVisible = false;
                    this.assigningOrgUsersFormVisible = false;
                    this.getListAlready();
                })
            } else {
                Message({
                    message: '请选择用户',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                })
            }

        },
        back: function () {
            this.$router.push('/system/role/index');
        },
    }
};
function queryParameterInit() {
    return {
        corporationId: null,
        id: null,
        page: 1,
        size: 10,
        pageNum: 1,
        pageSize: 10,
    };
}
function userParameterInit() {
    return {
        // typeName: null,
        // name: null,
        userName: null,
        mobile: null,
        roleId: null,
        corporationId: null,
        page: 1,
        size: 10,
        pageNum: 1,
        pageSize: 10,
        roleTypes: {
            "PLATFORM": "平台",
            "CORP": "企业",
            "ORG": "组织"
        }
    };
}

