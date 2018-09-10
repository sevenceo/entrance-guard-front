/**
 * Created by zhaimaojin on 2017/8/15.
 */
import{ GetList, DeleteRole ,GetRoleList} from '../api/rolesManageApi'

export default {
    data() {
        return {
            tableData: [],
            pageParam: {
                page: 0,
                size: 10
            },
            totalPage: 10
        }
    },
    created(){
        this.getList(this.pageParam)
    },
    methods:{
        getList(pageParam){
            GetRoleList(this.pageParam)
                .then((response)=>{
                    this.totalPage = response.headers['x-total-count']
                    this.tableData = response.data
                    console.log('this.tableData')
                    console.log(this.tableData)
                })
        },
        handleDelete(id){
            this.ConfirmBox("是否确认删除")
                .then(()=>{
                    // console.log(id)
                    DeleteRole(id)
                        .then((response) => {
                            this.getList(this.pageParam)
                        })

                })
        },
        handleCurrentChange(page){
            this.pageParam.page = page - 1;
            this.getList(this.pageParam)
        }
    }
}