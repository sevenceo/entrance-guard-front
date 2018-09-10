/**
 * Created by Micheal Xiao on 2017/10/10.
 */
import { GetArticlePhotoList } from "../api/articlePhotoApi";

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
        this.getList()
    },
    methods:{
        getList(){
            GetArticlePhotoList(this.pageParam)
                .then((response)=>{
                    this.totalPage = response.headers['x-total-count']
                    this.tableData = response.data
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