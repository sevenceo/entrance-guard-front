import permission from 'store/permission'
import {parseTime} from 'utils'
import {isWscnEmail, ValidateEmail, ValidatePass} from 'utils/validate';
import {GetRolesList} from 'api/roles'
import {SearchByUserId, GetList, Create, Editor, GetModule, Delete, GetCode} from "./api/operationManageApi";
import {Message} from 'element-ui';

//每页显示的记录数

let selectionData = []

export default {
    created() {
        this.getUserId(this.systemCodes);
        //this.getList(this.pageParam);

    },
    data() {
        return {
            parentData: [],
            tableData: [],
            systemCodes: [],
            treeData: [],
            moduleId1:[],
            rowTotal: 10,
            textMap: {
                create: '新增操作',
                editor: "编辑操作"
            },
            props: {
                label: 'name'
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            pageParam: pageParamInit(),
            // rolesStr:'',

            rules: {
                name: [
                    {required: true, message: '操作名称不能为空', trigger: 'blur'}
                ],
                method: [
                    {required: true, message: '访问方式不能为空', trigger: 'blur'}
                ],
                moduleId: [
                    // {required: true, message: '所属模块不能为空', trigger: 'blur'},
                    // {max: 12},
                ],
                code: [
                    {required: true, message: '操作编码不能为空', trigger: 'blur'}
                ]
            },

            formVisible: false,
            errorTip: "",
            errorLine: 5
        }
    },
    // components: {
    //     trRoles
    // },
    methods: {
        hasAuthority: permission.hasAuthority,

        getUserId() {
            SearchByUserId()
                .then((res) => {
                    for (let j = 0; j < res.data.length; j++) {
                        this.systemCodes.push(res.data[j].systemCode);
                    }
                    this.getList(this.pageParam);
                    this.getModules();
                })
        },

        //  显示用户信息
        getList(pageParam) {

            pageParam.systemCodes = this.systemCodes;
            GetList(pageParam)
                .then((response) => {
                    this.rowTotal = response.rowTotal;
                    this.tableData = response.rows;
                })
        },
        //翻页功能
        handleCurrentChange1(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd() {
            this.temp = tempInit();
            GetCode()
                .then((response) => {
                    this.temp.code = response.data.code
                })
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
            console.log(this.temp)
            // this.moduleId1=this.getParentId(this.temp.moduleId,this.treeData);
            // console.log(this.moduleId1.length)
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },

        // getParentId(id){
        //     let arr = new Array();
        //     for(let i=0;i<tree.length;i++){
        //         console.log(tree[i])
        //         if(tree[i].value==id && tree[i].parentId!=0){
        //             arr.push(tree[i].parentId);
        //             arr = arr.concat(this.getParentId(tree[i].parentId));
        //         }
        //     }
            // $.each(this.treeData, function(i,item){
            //     if(item.value==id && item.parentId!=0){
            //         arr.push(item.parentId);
            //         arr = arr.concat(getParentId(item.parentId));
            //     }
            // });
        //     return arr;
        // },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        search: function () {
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },

        create() {
            this.temp.moduleId = this.moduleId1[this.moduleId1.length-1];
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    // delete this.temp("roleStr")
                    console.log("777777777"+this.temp.moduleId);
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
        update(formName) {
            this.temp.moduleId = this.moduleId1[this.moduleId1.length-1]
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // delete this.temp("roleStr")
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
            this.ConfirmBox('是否确认删除？')
                .then(() => {
                    Delete(row.id)
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })

        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        },
        getModules() {
            let data = {enabledFlag: '1', systemCodes: this.systemCodes};
            GetModule(data)
                .then((response) => {
                    let data = response.data;
                    this.treeData = this._treeDataHandler(data).treeData;
                })
        },
        handleSelect(item) {
            console.log(item);
        },
        _treeDataHandler: function (data) {
            let treeHashContainer = {};
            let rootNodes = [];
            let data2 = [];
            for (let i = 0; i < data.length; i++) {
                let a = {
                    value: data[i].id,
                    label: data[i].name,
                    parentId: data[i].parentId
                }
                data2.push(a);
            }
            for (let i = 0; i < data2.length; i++) {
                let d = data2[i];
                treeHashContainer[d.value] = d;
                if (d.parentId == "0") {
                    rootNodes.push(d);
                }
            }

            for (let i = 0; i < data2.length; i++) {
                let d = data2[i];
                if (d.parentId != "0") {
                    var parent = treeHashContainer[d.parentId];
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(d);
                        d.parent = parent;
                    }
                }
            }

            return {treeData: rootNodes, treeHashContainer};
        }

    }
}

function tempInit() {
    return {
        "name": "",
        "url": "",
        "method": "",
        "description": "",
        "moduleId": "",
        "code": "",
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        code: "",
        moduleName: "",
        name: "",
        systemCodes: "",

    }
}
