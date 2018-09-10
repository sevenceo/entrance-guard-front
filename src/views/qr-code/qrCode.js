import moment from 'moment'

import store from 'store'

import {GetActivityList,DeleteActivityById,GetActivityById} from "src/views/qr-code/api/qrCodeApi";


//组件级变量
let selectionData = []

export default {
    created() {
        this.getActivityList()
        // console.log("B")
        // console.log(this.activityData)
        // this.$store.commit('SET_ACTIVITYDATA',this.activityData)

    },
    data() {
        let that = this;
        return {
            tableData: [],
            account: this.$store.state.weChatAccount.accountInfo.account,
            pageParam: pageInit(),
            totalPage: 10,
            activityData: activityDataInit(),
            searchFormVisible: false,
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 ||
                        time.getTime() < new Date(that.pageParam.beginDate).getTime();
                }
            },
        }
    },
    components: {},
    methods: {
        getActivityList(){
            GetActivityList(this.account,this.pageParam)
                .then(response => {
                    // console.log(response.data)
                    this.tableData = response.data
                    this.totalPage = response.headers['x-total-count']
                    for(let i in this.tableData){
                        this.tableData[i].beginDate = this.getDate(this.tableData[i].beginDate)
                        this.tableData[i].endDate = this.getDate(this.tableData[i].endDate)
                    }
                })
        },
        onAdd() {
            this.$router.push({name: '基本信息'})
            this.$store.commit('SET_ACTIONTYPE', '新增')

        },
        onSearch() {
            this.searchFormVisible = true
        },
        onDel(id) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DeleteActivityById(this.account,id)
                        .then(response => {
                            this.getActivityList(this.pageParam)
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                        })
                })

        },
        getActivityById(id) {
            GetActivityById(this.account, id)
                .then(response => {
                    // console.log('列表页面根据id获取数据，commit')
                    // console.log(response.data)
                    console.log("D")
                    console.log(response.data)
                    this.$store.commit('SET_ACTIVITYDATA', response.data)

                })
        },
        onShow(id) {
            this.$router.push({path: 'view-activity/basic/' + id})
            this.$store.commit('SET_ACTIONTYPE', '查看')
            // this.getActivityById(id)
        },
        handleCurrentChange(page){
            this.pageParam.page = page - 1;
            this.getActivityList(this.pageParam)
        },
        getDate(source) {
            const time = new Date(source);

            return  time.getFullYear() + "-"
                + (time.getMonth() + 1) + "-"
                + time.getDate()
        },
        search(){
            this.getActivityList()
            this.searchFormVisible = false
            this.$refs.pages.changePage(1)
        },
        resetSearchForm(){
            this.pageParam = pageInit()
        },
        selectBeginDate(value) {
            this.pageParam.beginDate = value
        },
        selectEndDate(value) {
            this.pageParam.endDate = value
        }
    }
}
function pageInit() {
    return {
        page: 0,
        size: 10,
        activityCode:null,
        activityName:null,
        beginDate:null,
        endDate:null,
        sort:null
    }
}
function activityDataInit() {
    return {
        account: '',
        activityCode: '',
        activityName: '',
        activityTemplateCode: '',
        activityTemplateName: '',
        activityTypeCode: '',
        activityTypeName: '',
        activityRegionId: '',
        activityRegionName: '',
        beginDate: '',
        endDate: '',
        description: '',
        jsonDataDetail: {
            qrDTOS: [
                {
                    qrCodeName: '默认二维码',
                    qrUrl: '',
                    scene: '',
                    materialId: '',
                    materialName: '',
                    materialType: '',
                    materialContent: '{"picUrl":"","url":"","mediaId":"","serverUrl":"","content":""}',
                    organDTOS: [
                        {
                            organName: "",
                            qrCodeName: "",
                            tel: ""
                        }
                    ]
                },
            ],
            carSeriesDTOS: [{
                dossSend: '',
                seriesName: '',
                seriesEnName: '',
                dossCode: ''
            }]
        },

    }

}