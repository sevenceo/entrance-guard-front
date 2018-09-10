import moment from 'moment'
import permission from 'store/permission'
import {parseTime} from 'utils'
import {isWscnEmail, ValidateEmail, ValidatePass} from 'utils/validate';
import {GetRolesList} from 'api/roles'
import {GetList, Create, Editor, GetParentList, Delete} from "./api/dataDictionaryApi";
import {Message} from 'element-ui';


//每页显示的记录数

let selectionData = []

export default {
    created() {
        this.getList(this.pageParam);
    },
    data() {
        return {
            parentData: [],
            tableData: [],
            options:[{
                value: 1,
                label: '启用'
            }, {
                value: 0,
                label: '禁用'
            }],
            rowTotal: 10,
            textMap: {
                create: '新增数据字典项',
                editor: "编辑数据字典项"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            // rolesStr:'',

            rules: {
                dicText: [
                    {required: true, message: '字典名称是必需的', trigger: 'blur'},
                    {max: 50, message: '字典名称不得超过50个字符'}
                ],
                dicKey: [
                    {required: true, message: '字典项编码是必需的', trigger: 'blur'},
                    {max: 50, message: '字典项编码不得超过50个字符'}
                ],
                dicValue: [
                    {max: 50, message: '字典值不得超过50个字符'}
                ],
                description: [
                    {max: 50, message: '字典项说明不得超过50个字符'}
                ],
                enabledFlag: [
                    {required: true, message: '启用状态是必需的', trigger: 'blur'}
                ]
            },
            pageParam: pageParamInit(),
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

        //启用状态显示转换
        formatStatus: function (row, column) {
            return row.enabledFlag == 1 ? '启用' : row.enabledFlag == 0 ? '禁用' : '未知';
        },

        //  显示用户信息
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    this.rowTotal = response.data.rowTotal;
                    this.tableData = response.data.rows;
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
            GetParentList()
                .then((response) =>{
                this.parentData = response.data;
            });
            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);
            console.log("============"+this.temp.enabledFlag)
            GetParentList()
                .then((response) =>{
                    this.parentData = response.data;
                });
            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },
        // //启用
        // onUse(){
        //     if(this.pageParam.enabledFlag=='1'){
        //         this.$message({
        //             message: "当前状态无法启用",
        //             type: 'error'
        //         })
        //         return
        //     }
        //     if (selectionData.length == 0) {
        //         this.$message({
        //             message: "请至少选择一行数据",
        //             type: 'error'
        //         })
        //         return
        //     }
        //     this.ConfirmBox("是否确认启用")
        //         .then(()=>{
        //             Promise.all(selectionData.map(function (val) {
        //                 return Deletebrand(val.id)
        //             })).then(() => {
        //                 this.getList(this.pageParam)
        //             })
        //         })
        // },
        // //禁用
        // onBan() {
        //     if(this.pageParam.enabledFlag=='0'){
        //         this.$message({
        //             message: "当前状态无法禁用",
        //             type: 'error'
        //         })
        //         return
        //     }
        //     if (selectionData.length == 0) {
        //         this.$message({
        //             message: "请至少选择一行数据",
        //             type: 'error'
        //         })
        //         return
        //     }
        //     this.ConfirmBox("是否确认禁用")
        //         .then(()=>{
        //             Promise.all(selectionData.map(function (val) {
        //                 return Deletebrand(val.id)
        //             })).then(() => {
        //                 this.getList(this.pageParam)
        //             })
        //         })
        // },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        onSearch: function () {
            this.searchFormVisible = true;
            GetParentList()
                .then((response) =>{
                    this.parentData = response.data;
                });
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
            this.temp.enabledFlag = this.temp.enabledFlag+"";
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
        update(formName) {
            this.temp.enabledFlag = this.temp.enabledFlag+"";
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
        onChange(row) {
            this.temp = $.extend(tempInit(), row);
            if(row.enabledFlag=='1'){
                this.temp.enabledFlag = '0';
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        Editor(this.temp)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            if(row.enabledFlag=='0'){
                this.temp.enabledFlag = '1';
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        Editor(this.temp)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            // Editor(this.temp);
            // this.getList(this.pageParam);
        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
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

    }
}

function tempInit() {
    return {
        "enabledFlag": "",
        "dicKey": "",
        "dicText": "",
        "description": "",
        "dicValue": "",
        "parentId": "",
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        enabledFlag: 1,
        dicKey: "",
        dicText: "",
        parentName: "",

    }
}
