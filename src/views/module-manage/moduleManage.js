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
} from './api/moduleManageApi';
import {Message} from 'element-ui';

export default {
    data() {
        return {

            //系统编码
            systemCode: "",
            addSystemCode: "",
            qSystemCode: "",
            //树  参数 懒加载
            props: {
                label: 'text',
                children: 'zones',
                isLeaf: 'isLeaf'
            },
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            //模块类型
            types: [{value: 0, label: "菜单"}, {value: 1, label: "接口"}],
            tableShowType: {
                "0": "菜单",
                "1": "接口",
            },
            dialogStatus: 'create',
            //分页数据
            tableData: [],
            treeData: [],
            parentTreeData: [],
            //微服务列表
            moduleList: [],
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
        };
    },
    methods: {
        //翻页功能
        handleCurrentChange1(page) {
            this.getList(page)
        },
        //树
        loadNode(node, resolve) {
            let p = {};
            if (node.level === 0) {
                //查询所有 模块
                SearchByUserId().then((data) => {
                    let list = data.data;
                    this.moduleList = list;
                    this.systemCode = list[0].systemCode;
                    this.qSystemCode = this.systemCode;
                    p = {id: "#", systemCode: this.systemCode};
                    SearchTree(p).then((data) => {
                        if (data.code == 0) {
                            let resultData = data.data;
                            this.temp.id = resultData[0].id;
                            this.treeData = resultData;
                            //查询所有模块
                            this.getList();
                            return resolve(resultData);
                        }
                    });
                });
            } else
            // if (node.level == 1)
            {
                p = {parentId: node.data.id, systemCode: this.systemCode};
                //查询树  数据
                SearchTree(p).then(function (data) {
                    if (data.code == 0) {
                        let resultData = data.data;
                        //let list = [];
                        // resultData.forEach(function (p) {
                        //     p.isLeaf = true;
                        //     //list.push({text: p.text, id: p.id, leaf: true});
                        // });
                        return resolve(resultData);
                    }
                });

            }
            // else {
            //     return resolve(this.treeData);
            // }
        },
        //添加界面的树
        parentLoadNode(node, resolve) {
            let p = {};
            if (node.level === 0) {
                p = {enabledFlag: 1, systemCode: this.addSystemCode ? this.addSystemCode : ""};
                GetAllModule(p).then((data) => {
                    if (data.code == 0) {
                        let resultData = data.data;
                        let parentModuls = [];
                        resultData.forEach(function (p) {
                            if (p.parentId == 0 || p.parentId == null || p.parentId == "") {
                                p.text = p.name;
                                parentModuls.push(p);
                            }
                        });
                        this.parentTreeData = parentModuls;
                        return resolve(parentModuls);
                    }
                });
            } else
            // if (node.level == 1)
            {
                p = {parentId: node.data.id, systemCode: this.addSystemCode};
                //查询树  数据
                SearchTree(p).then(function (data) {
                    if (data.code == 0) {
                        let resultData = data.data;
                        // resultData.forEach(function (p) {
                        //     p.isLeaf = true;
                        // });
                        return resolve(resultData);
                    }
                });

            }
            // else {
            //     return resolve(this.parentTreeData);
            // }
        },
        getList(page){
            let pageQueryParmeter = {
                page: page ? page : 1,
                pageNum: 1,
                pageSize: this.size,
                systemCode: this.systemCode,
                id: ""
            };
            Page(pageQueryParmeter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                }
            });
        },
        //树节点点击事件
        nodeClick(data, node, object){
            //分类查询模块
            let pageQueryParmeter = {
                page: 1,
                pageNum: 1,
                pageSize: this.size,
                systemCode: this.systemCode,
                id: data.id
            };
            if (node.level == 1) {
                pageQueryParmeter.id = "";
            }
            Page(pageQueryParmeter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                }
            });
        },
        parentNodeClick(data, node, object){
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
            this.parentTree = false;
            this.dialogStatus = 'create';
            //获取编码
            Getcode().then(data => {
                this.temp.code = data.data.code;
            });
        },
        onEdit(row) {
            this.parentTree = false;
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            row.displayIndex = row.displayIndex + "";
            if (row.parentId != null && row.parentId != "") {
                GetParentName(row.parentId).then(data => {
                    row.addParentName = data.data.name;
                    this.temp = $.extend(tempInit(), row)

                })
            } else {
                this.temp = $.extend(tempInit(), row);

            }
        },
        //切换 微服务模块
        changeModule: function () {
            this.systemCode = this.qSystemCode;
            this.temp.page = 1;
            let p = {id: "#", systemCode: this.systemCode};
            //查询树  数据
            SearchTree(p).then((data) => {
                if (data.code == 0) {
                    let resultData = data.data;
                    this.treeData = resultData;
                    //查询所有模块
                    this.getList();
                }
            });
        },
        parentModuleChange(){
            this.addSystemCode = this.temp.systemCode;
            this.temp.page = 1;
            let p = {id: "#", systemCode: this.temp.systemCode};
            //查询树  数据
            SearchTree(p).then((data) => {
                if (data.code == 0) {
                    let resultData = data.data;
                    this.parentTreeData = resultData;
                }
            });
        },
        //条件查询
        doSearch: function () {
            //分类查询模块
            let pageQueryParmeter = {
                page: 1,
                pageNum: 1,
                pageSize: this.pageSize,
                systemCode: this.qSystemCode,
                id: "",
                code: this.temp.code,
                name: this.temp.name
            };
            Page(pageQueryParmeter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = data.rowTotal;
                    this.tableData = rows;
                } else {
                    this.tableData = [];
                }
            });
        },
        //添加
        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    // delete this.temp("roleStr")
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // delete this.temp("roleStr")
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
            this.temp.code = "";
            this.temp.name = "";
        },
        showParentTree(){
            this.parentTree = true;
        }
    }
};
function tempInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        id: null,
        code: null,
        name: null,
        systemCode: null,
        type: null,
        parentName: null,
        addParentName: null,
        parentId: null,
        organizationId: null,
        logo: null,
        displayIndex: null,
        description: null
    }
}