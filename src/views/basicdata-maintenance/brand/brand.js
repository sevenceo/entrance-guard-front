/**
 *
 */
import dataTable from './components/datatable/dataTable.vue'
import {SearchDataList, ModifyData, CreateData, Deletebrand,ExportAll} from './api/brandApi'

const statusOption = [
    {key: '停用', label:'停用'},
    {key: '启用', label:'启用'}
];

//组件级变量
let selectionData = [];

export default {
    created() {
        this.getDataList(this.pageParam);
    },

    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: 'create',
            temp: tempInit(),
            statusOption,
            textMap: {
                update: '编辑',
                create: '创建'
            },
            pageParam:pageParamInit(),
            totalPage: 10,
            formData: [],
            property: '',
            searchFormVisible: false,
            deleteId: '',
            rules: {
                name: [
                    {required: true, message: '请输入名称'},
                    {max:255, message:"最多输入255个字符", trigger:'blur'}
                ],
                enName: [
                    {max:255, message:"最多输入255个字符", trigger:'blur'}
                ],
                code: [
                    {required: true, message: '请输入编号'},
                    {max:36, message:"最多输入36个字符", trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        getDataList(pageParam) {
            SearchDataList(pageParam).then((response) => {
                this.totalPage = response.headers['x-total-count']
                this.formData = response.data
            })
        },
        onAdd: function() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true;
            this.temp = tempInit();
        },
        resetForm(){
            this.$refs['temp'].resetFields();
            this.temp = tempInit()
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        search: function () {
            this.pageParam.page = 0;
            this.pageParam.size = 10;
            this.getDataList(this.pageParam);
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam.code = "";
            this.pageParam.name = "";
            this.pageParam.enName = "";
            this.pageParam.status = "";
        },
        edit: function (visible, row, dialogStatus) {
            this.dialogFormVisible = visible;
            this.dialogStatus = dialogStatus
            this.temp = $.extend(tempInit(), row)
        },
        deleteRow(row) {
            this.ConfirmBox()
                .then(()=>{
                    Deletebrand(row.id)
                        .then((response) => {
                            this.getDataList(this.pageParam);
                        })
                })
        },
        create(temp) {
            this.$refs[temp].validate((valid) => {
                if (valid) {
                    CreateData(this.temp)
                        .then((response) => {
                            this.dialogFormVisible = false;
                            this.temp = tempInit();
                            this.pageParam.page = 0;
                            this.pageParam.size = 10;
                            this.getDataList(this.pageParam);
                            this.$refs[temp].resetFields();
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        cancel(){
            this.dialogFormVisible = false;
            this.temp = tempInit();
            this.resetForm();
        },
        handleCurrentChange(page){
            this.pageParam.page = page - 1;
            this.getDataList(this.pageParam)
        },
        update(temp) {
            this.$refs[temp].validate((valid) => {
                if (valid) {
                    ModifyData(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.getDataList(this.pageParam);
                            this.$refs[temp].resetFields();
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onDel() {
            if (selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return
            }
            this.ConfirmBox("是否确认删除")
                .then(()=>{
                Promise.all(selectionData.map(function (val) {
                    return Deletebrand(val.id)
                })).then(() => {
                    this.getDataList(this.pageParam)
                })
            })
        },
        handleSelectionChange(selection){
            selectionData = selection
        },
        exportAll(){
            ExportAll(this.pageParam);
        }
    },
    components: {
        dataTable,
    },
}

function tempInit() {
    return {
        "id": "",
        "code": "",
        "name": "",
        "enName": "",
        "status": "启用",
        "updateTime": "",
        "createTime": ""
    }
}
function pageParamInit() {
    return {
        page: 0,
        size: 10,
        code:'',
        name:'',
        enName:'',
        status:''
    }
}
