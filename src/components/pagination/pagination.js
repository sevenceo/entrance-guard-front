/**
 * Created by Micheal Xiao on 2017/6/2.
 */
export default {
    props:{
        total:null,
        pagesize:null,
    },
    data(){
        return{
            currentPage:1
        }
    },
    methods:{
        pageChange(page) {
            this.$emit('pageChange',page)
        },
        changePage(page){
            this.currentPage = page
        }
    },
    computed:{
        totalNum(){
            return Number(this.total)
        },
        pageSizeNum(){
            return Number(this.pagesize || 10)
        }
    },
}