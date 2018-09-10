import dataTable from './components/datatable/dataTable.vue'
import {SearchDataList, ModifyData, CreateData, Deletebrand} from './api/companyApi'

//组件级变量
let selectionData = [];

export default {
    created(){
        this.getDataList(this.pageParam);
    },
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: 'create',
            temp: tempInit(),
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

        getDataList (pageParam) {
            SearchDataList(pageParam).then((res) => {
                this.totalPage = res.headers['x-total-count']
                this.formData = res.data.rows;

            });
        },
        handleCurrentChange(page){
            this.pageParam.page = page - 1;
            this.getDataList(this.pageParam)
        },
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