import {
    SearchTree,
    Page,
    SearchByUserId,
    Getcode,
    Create,
    Editor,
    Delete,
    GetParentName,
    GetAllModule
} from './api/saasOrganizationApi';
import {Message} from 'element-ui';

export default {
    created() {
        this.initTree();
    },
    data() {
        return {

            props: {
                label: 'orgName',
            },
            treeLeftData: [],
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            dialogStatus: 'create',
            temp: tempInit(),
            //分页
            rowTotal: 10,
            //是否显示查询条件
            searchFormVisible: false,
            parentTree: false,
            //添加界面
            dialogFormVisible: false,
            rules: {
                systemCode: [
                    {required: true, message: '请选择所属微服务', trigger: 'blur'},
                ],
                code: [
                    {required: true, message: '请输入模块编码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入模块名称', trigger: 'blur'},
                    {max: 30, message: '模块名称不得超过30个字符'}
                ],
                // parentName: [
                //     {required: true, message: '请选择父模块', trigger: 'blur'},
                // ],
                // type: [
                //     {required: true, message: '请选择模块类型', trigger: 'blur'},
                // ],
                organizationId: [
                    {max: 100, message: '模块路径不得超过100个字符', trigger: 'blur'}
                ],
                logo: [
                    {max: 20, message: '模块LOGO不得超过20个字符', trigger: 'blur'}
                ],
                displayIndex: [
                    {required: true, message: '请输入排序号', trigger: 'blur'},
                    {max: 3, message: '排序号不得超过3个字符'},
                ],
                description: [
                    {max: 255, message: '模块描述超过255个字符', trigger: 'blur'}
                ]
            },
            leftTreeFilterText: '',
            tableData: [],
            size: 10,
            queryParameter: queryParameterInit(),
            orgOptions: [],
            currentUser: {corpName: "超智慧", roleType: 'CORP', corporationId: "1"},
            //所属企业
            corpList: [],
            parentOrgData: {}
        };
    },
    methods: {
        //翻页功能
        handleCurrentChange1(page) {
            this.getList(page)
        },
        initTree: function () {
            let p = {};
            p.corpIsRoot = "Y";
            p.corporationId = this.currentUser.corporationId;
            p.enabledFlag = 1;
            SearchTree(p).then((data) => {
                if (data.code == 0) {
                    let resultData = data.data;
                    this.getList();
                    this.treeLeftData = this._treeDataHandler(resultData).treeData;
                }
            });
        },
        getList(page){

            this.queryParameter.page = (page ? page : 1);
            Page(this.queryParameter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                } else {
                    this.rowTotal = 0;
                    this.tableData = [];
                }
            });
        },
        //树节点点击事件
        nodeClick(data, node, object){
            this.queryParameter.page = 1;
            this.queryParameter.pageNum = 1;
            // this.queryParameter.pageSize = this.rowTotal;
            if (node.level == 1) {
                this.queryParameter.parentType = null;
                this.queryParameter.parentId = null;
            } else {
                this.queryParameter.parentType = data.orgType;
                this.queryParameter.parentId = data.id;
            }
            Page(this.queryParameter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                } else {
                    this.rowTotal = 0;
                    this.tableData = [];
                }
            });
        },
        //新增窗口
        onAdd: function () {
            this.temp = tempInit()
            this.dialogFormVisible = true;
            this.parentTree = false;
            this.dialogStatus = 'create';

            this.corpList = [];
            if (this.currentUser.roleType != 'PLATFORM') {
                // let obj = {};
                // obj.corpName = this.currentUser.corpName;
                // obj.id = this.currentUser.corporationId;
                // this.corpList.push(obj);
                let This = this;
                this.treeLeftData.forEach(function(item,index,arr){
                    if(item && item.orgType =='CORP'){
                        let obj = {};
                        obj.corpName = item.orgName;
                        obj.id = item.corporationId;
                        This.corpList.push(obj);
                    }
                });
            } else {
                var obj = {};
                obj.enabledFlag = 1;
                this.corpList = [];
            }
            let p = {};
            p.corporationId = this.currentUser.corporationId;
            p.enabledFlag = 1;
            SearchTree(p).then((data) => {
                if (data.code == 0) {
                    let resultData = data.data;
                    this.orgOptions = this._parentTreeDataHandler(resultData).treeData;
                }
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
            this.temp = $.extend(tempInit(), row);
        },
        //添加
        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    console.log("保存", this.temp);
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            // this.getList();
                            this.initTree();
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
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            // this.getList();
                            this.initTree();
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
                        .then(() => {
                            // this.getList();
                            this.initTree();
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
            this.temp.code = "";
            this.temp.name = "";
        },
        /**
         * 树筛选
         */
        leftTreeSearch: function (val) {
            this.$refs.treeLeft.filter(val);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        /**
         * 组装树  数据
         * @param data
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _treeDataHandler: function (data) {
            let treeHashContainer = {};
            let rootNodes = [];
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.treeId] = d;
                if (d.treeParentId == null || d.treeParentId == undefined || d.treeParentId == "") {
                    rootNodes.push(d);
                }
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.treeParentId != null && d.treeParentId != undefined && d.treeParentId != "") {
                    var parent = treeHashContainer[d.treeParentId];
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(d);
                        d.parent = parent;
                    }
                }
            }
            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },
        /**
         * 上级树
         * @param data
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _parentTreeDataHandler: function (data) {
            let treeHashContainer = {};
            let rootNodes = [];
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                treeHashContainer[d.treeId] = d;
                if (d.treeParentId == null || d.treeParentId == undefined || d.treeParentId == "") {
                    d.label = d.orgName;
                    d.value = d.treeId;
                    rootNodes.push(d);
                }
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.treeParentId != null && d.treeParentId != undefined && d.treeParentId != "") {
                    var parent = treeHashContainer[d.treeParentId];
                    if (parent) {
                        parent.children = parent.children || [];
                        d.label = d.orgName;
                        d.value = d.treeId;
                        parent.children.push(d);
                        d.parent = parent;
                    }
                }
            }
            this.parentOrgData = treeHashContainer;
            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },
        selectParentOrg: function (data) {
            let parentId = data[data.length - 1];
            this.temp.parentId =this.parentOrgData[parentId].id ;
            this.temp.parentName = this.parentOrgData[parentId].label;
        },
        onUsersFormVisible:function (row) {
            this.$router.push({
                path: '/weChat/saasOrganization/users', params: {
                }, query: {
                    org: {corporationId:row.corporationId,orgId:row.id}
                }
            });
        }
    }
};
function tempInit() {
    return {
        id: "",
        parentId: null,
        // organizationId: null,
        // description: null,
        corporationId: null,
        parentName: null,
        orgName: null,
        code: null,
    }
}
function queryParameterInit() {
    return {
        page: 1,
        pageNum: 1,
        pageSize: 10,
        corporationId: "1",
        parentType: null,
        parentId: null,
    };
}