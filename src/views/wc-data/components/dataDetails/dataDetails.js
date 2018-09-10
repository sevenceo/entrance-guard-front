/**
 * Created by zhaimaojin on 2017/8/16.
 */
import store from "store"
import {GetDataById, GetAccountMoveList, GetAccountData,GetAccountHistories,MoveComplete,MoveShardingTable} from 'src/views/wc-data/api/wcDataApi'
import router from "src/router"
import{ loginByEmail } from 'src/api/login'
import moment from 'moment'



export default {
    created(){
        this.getDataById();
        // this.getAccountData();
    },
    data(){
        return {
            formData: '',
            id: '',
            wcAccountData: {
                name: '',
                account: '',
                organizationId: '',
                dbInstanceId: '',
                headImgUrl: '',
                appId: '',
                appSecret: '',
                appToken: '',
                aesKey: '',
                accessToken: '',
                expiresTime: '',
                isInit: '',
                isTokenCreating: '',
            },
            deleteFormVisible: false,
            dialogFormVisible: false,
            temp:tempInit(),
            wcModifyAccount: [],
            wcAccountHistory: [

            ],
            moveCompleteParams : {
                mainDbInstanceId : '',
                destDbInstanceId : '',
                account : ''
            },
            routerId: this.$route.params.id,
            history: '',
            tempHistory:{
                radio: '',
                password:''
            },
            moveShardingTableData:{
                mainDbInstanceId : '',
                destDbInstanceId : '',
                account : ''
            },
            account: this.$store.state.user.name,
            baseUrl: process.env.MATERIAL_API
        }
    },
    methods: {
        getDataById(){
            GetDataById(this.routerId)
                .then((response) => {
                    this.formData = response.data
                    if(this.formData.free){
                        this.formData.isFree = '是'
                    }else {
                        this.formData.isFree = '否'
                    }
                })
        },
        getAccountData(){
            GetAccountData(this.routerId)
                .then((response) => {
                    this.wcModifyAccount = response.data
                })
        },
        changeAccountTarget(){
            GetAccountMoveList(this.routerId)
                .then((response) => {
                    this.history = response.data
                })
        },
        getAccountHistories(){
            GetAccountHistories(this.routerId)
                .then((response) => {
                    this.wcAccountHistory = response.data;
                    for (let time in this.wcAccountHistory){

                        if(this.wcAccountHistory[time].completeTime === null){
                            this.wcAccountHistory[time].scheduleTime = moment(this.wcAccountHistory[time].scheduleTime).format("YYYY-MM-DD")
                            this.wcAccountHistory[time].completeTime = ''
                        }else {

                            this.wcAccountHistory[time].completeTime = moment(this.wcAccountHistory[time].completeTime).format("YYYY-MM-DD")
                            this.wcAccountHistory[time].scheduleTime = moment(this.wcAccountHistory[time].scheduleTime).format("YYYY-MM-DD")
                        }

                    }
                })
        },
        getAccountDataClick(tab, event){
            let index = tab.index
            if (index === '1') {
                this.getAccountData()
            } else if (index === '2') {
                this.getAccountHistories();
            }
        },
        onModify(row){
            this.dialogFormVisible = true;
            this.changeAccountTarget()
            this.moveShardingTableData.mainDbInstanceId = row.dbInstanceId
            this.moveShardingTableData.account = row.account
        },
        onMoveComplete(row){
            this.moveCompleteParams.mainDbInstanceId = row.mainDbInstanceId
            this.moveCompleteParams.destDbInstanceId = row.destDbInstanceId
            this.moveCompleteParams.account = row.account
            if (!row.completeTime){
                this.ConfirmBox("是否确认迁移")
                    .then(()=>{
                        // console.log(id)
                        MoveComplete(this.moveCompleteParams.mainDbInstanceId,this.moveCompleteParams.destDbInstanceId,this.moveCompleteParams.account)
                            .then((response) => {
                                console.log('params')
                                console.log(response)
                                this.getAccountHistories()
                            })

                    })
            }else {
                this.ConfirmBox("迁移已经完成")
            }



        },
        confirmMoveCompelete(){
            console.log(this.moveCompleteParams.mainDbInstanceId)
            MoveComplete(this.moveCompleteParams.mainDbInstanceId,this.moveCompleteParams.destDbInstanceId,this.moveCompleteParams.account)
                .then((response) => {
                    console.log('params')
                    console.log(response)
                    this.getAccountHistories()
                })
            this.deleteFormVisible = false;
        },
        update(){


            loginByEmail(this.account,this.tempHistory.password)
                .then(() => {
                    MoveShardingTable(this.moveShardingTableData.mainDbInstanceId,this.tempHistory.radio,this.moveShardingTableData.account)
                        .then((response) => {
                            console.log('params')
                            console.log(response)
                            this.dialogFormVisible = false
                        })

                }
            )




        },
        resetForm(){
            this.$refs['temp'].resetFields();
            this.temp = tempInit()
        },
    },
    computed: {
        dataDetails(){
            return store.state.weChatData.formData
        }
    }
}
function tempInit() {
    return {
        name: '',
        instanceType: '',
        databaseType: "",
        destDbInstanceId: '',
        host: "",
        port: "",
        pwd: "",
        bewrite: "",
        free: true,
        user: ''
    }
}

