/**
 * Created by zhaimaojin on 2017/8/15.
 */
import dataTable from './components/datatable/dataTable.vue'
import {GetDataList,SearchDataList, ModifyData, CreateData, TestConnection, DeleteAccount} from './api/wcDataApi'
import { ValidateIP ,ValidatePort } from "utils/validate"


const activeTypeOptions = [
    {key: 'WN', objectType: 'SHARED'},
    {key: 'AC', objectType: 'NORMAL'},
];
const dataTypeOption = [
    {key: 'WN', dataType: 'SQL_SERVER'},
    {key: 'AC', dataType: 'MY_SQL'}
];
const dataFreeOption = [
    {key: 'WN', freeStatus: true,label:'是'},
    {key: 'AC', freeStatus: false,label:'否'}
];

export default {
    created() {
        this.getDataList(this.pageParam);
    },

    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: 'create',
            temp: tempInit(),
            activeTypeOptions,
            dataTypeOption,
            dataFreeOption,
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

                // instanceType: [
                //     {required: true, message: '请输入公众号账号'}
                // ],
                name: [
                    {required: true, message: '请输入名称'},
                    {max:100, message:"最多输入100个字符", trigger:'blur'}
                ],
                host: [
                    {required: true, message: '请输入主机号'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'},
                    { validator: ValidateIP, trigger: 'blur' }
                ],
                instanceType: [
                    {required: true, message: '请选择实例类型'}
                ],
                free: [
                    {required: true, message: '请选择是否空闲'}
                ],
                databaseType: [
                    {required: true, message: '请选择数据库类型'}
                ],
                port: [
                    {required: true, message: '请输入端口号'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'},
                    { validator: ValidatePort, trigger: 'blur' }
                ],
                user: [
                    {required: true, message: '请输入用户名'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'}
                ],
                pwd: [
                    {required: true, message: '请输入密码'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'}
                ],
                bewrite: [
                    {max:200, message:"最多输入200个字符", trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        getDataList(pageParam) {
            SearchDataList(pageParam).then((response) => {
                this.totalPage = response.headers['x-total-count']
                this.formData = response.data
                for (let i in this.formData) {
                    if (this.formData[i].free) {
                        this.formData[i].isFree = "是"
                    } else {
                        this.formData[i].isFree = "否"
                    }
                }
            })
        },
        onAdd: function() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true;
        },
        resetForm(){
            this.$refs['temp'].resetFields();
            this.temp = tempInit()
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        search: function () {
            console.log(this.pageParam);
            this.getDataList(this.pageParam);
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        edit: function (visible, row, dialogStatus) {
            this.dialogFormVisible = visible;
            this.dialogStatus = dialogStatus
            this.temp = $.extend(tempInit(), row)
            console.log('temptemp')
        },
        deleteRow(row) {
            this.ConfirmBox()
                .then(()=>{
                    DeleteAccount(row.id)
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
                            this.temp = tempInit()
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
        cancel(){
            this.dialogFormVisible = false
            this.resetForm()
        },
        handleCurrentChange(page){
            // console.log("page")
            // console.log(page)
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
        testConnection: function(){
            TestConnection(this.temp)
                .then((response) =>{
                    console.log("response-link")
                    console.log(response)
                    this.$message({
                        type:"success",
                        message:"测试通过",
                        customClass:'msg-success',
                        iconClass:'ic'
                    })
                })
        }
    },
    components: {
        dataTable,
    },
}

function tempInit() {
    return {
        name: '',
        instanceType: '',
        databaseType: "",
        host: "",
        port: "",
        pwd: "",
        bewrite: "",
        free: true,
        user: '',
        dbInstanceId:'',
    }
}
function pageParamInit() {
    return {
        page: 0,
        size: 10,
        keyword:'',
        instanceType:'',
        databaseType:''
    }
}
