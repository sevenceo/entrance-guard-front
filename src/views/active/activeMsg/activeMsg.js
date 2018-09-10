import moment from 'moment'
import permission from 'store/permission';

import dataTable from 'components/table.vue'
import store from 'store'
import {GetList, CreatActive, UpdateActive} from 'api/activities'

const activeTypeOptions = [
    { key: 'FD', display_name: '技术分享' },
    { key: 'FE', display_name: '招聘会' },
//    { key: 'BI', display_name: '发布会' },
//    { key: 'VN', display_name: '宣传活动' }
];

export default {
    name: 'activeMsg',
    created(){
        this.getList();
    },
    data() {
        return {
            textMap: {
                update: '编辑',
                create: '创建'
            },
            dialogStatus:'',
            activeTypeOptions,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            formInline: {
                user: '',
                region: ''
            },
            dialogFormVisible: false,
            formData: [],
//        formData:[{
//          beginDate: '2016-05-02',
//          creator: '王小虎',
//          name: '活动一',
//          description: '描述',
//          type: '技术分享'
//        }],
            temp: {
                beginDate: "",
                creator: "",
                description: "",
                name: "",
                type: "技术分享"
            }
        }
    },
    components: {
        dataTable
    },
    methods: {
        hasAuthority:permission.hasAuthority,
        create(){
            this.temp.beginDate = moment(this.temp.beginDate).format("YYYY-MM-DD")
            this.temp.creator = store.getters.name
            CreatActive(this.temp)
                .then(()=> {
                   this.dialogFormVisible = false
                   this.dialogStatus = 'create';
                   this.getList()
                })
        },
        update(){
            this.temp.beginDate = moment(this.temp.beginDate).format("YYYY-MM-DD")
            this.temp.creator = store.getters.name
            UpdateActive(this.temp)
                    .then(()=> {
                        this.dialogFormVisible = false
                        this.getList()
                    })
        },
        getList() {
//        this.listLoading = true;
            GetList().then((result)=>{
                this.formData = result.data
            })
        },
        onSubmit() {
            console.log('submit!');
        },
        onAdd() {
            this.dialogFormVisible = true;
        },
        onDel() {
            console.log(this.$children)

            console.log('delete!');
        },
        incrementTotal: function (row) {
            console.log(row)
            $.extend(this.temp, row)
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
        },

    }
}
