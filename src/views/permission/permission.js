/**
 * Created by Micheal Xiao on 2017/6/19.
 */

import {GetAuthoritiesList,ImplementAuthorities} from 'api/authorities'
import dataTable from './components/permissionTable.vue'

const activeStatusOptions = [
  { key: 'FD', display_name: 'ACTIVATED' },
  { key: 'FE', display_name: 'UNACTIVATED' },
];
const activeAuthTypeOptions = [
  { key: 'BD', display_name: 'FRONT' },
  { key: 'BE', display_name: 'SERVICE' },
];

export default {
    data(){
        return{
            formData:[],
            selectionData:[],
            totalPage:10,
            pageParam:{
                page:1,
                size:15
            },
          textMap: {
            create: '创建'
          },
            dialogStatus:'create',
            dialogFormVisible: false,
            temp: {
                module: "",
                status: "",
                description: "",
                name: "",
                authType: "",
                service: ''
            },
            activeStatusOptions,
            activeAuthTypeOptions
        }
    },
    methods:{
      create(){
          console.log("this.temp")
          console.log(this.temp)
        ImplementAuthorities(this.temp)
          .then(()=> {
            this.dialogFormVisible = false;
            this.dialogStatus = 'create';
            this.getList(this.pageParam)
          })
      },
      // update(){
      //   ImplementAuthorities(this.temp)
      //     .then(()=> {
      //       this.dialogFormVisible = false;
      //       this.getList(this.pageParam)
      //     })
      // },
        handleSelectionChange(selection){
            this.selectionData = selection
        },
        getList(pageParam) {
            GetAuthoritiesList(pageParam).then((response)=>{
                this.totalPage = Math.ceil(response.headers['x-total-count']/pageParam.size * 10)
                this.formData = response.data
            })
        },
        handleCurrentChange(page){
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        onAdd(){
             this.dialogStatus = 'create';
             this.dialogFormVisible = true;
             this.temp = tempInit()
        }
    },
    created(){
      this.getList(this.pageParam)
    },
    components: {
        dataTable,
    },
}
function tempInit() {
  return {
    module: "",
    status: "",
    description: "",
    name: "",
    authType: "",
    service: ''
  }
}
