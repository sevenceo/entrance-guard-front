import store from "store"
import {
    GetCardsList,GetCardData
} from "src/views/card-coupons/api/cardCouponsApi";



export default {
    // mounted() {
    //     this.account=this.$store.state.weChatAccount.accountInfo.account
    // },
    created() {
        this.account=this.$store.state.weChatAccount.accountInfo.account
        this.getCardsList()

    },
    data() {
        return {
            temp: tempInit(),
            account: "",
            fansGroupOption: '',
            dialogFormVisible: false,
            cardList: [],
            imageUrl: process.env.MATERIAL_API,
            pageParam: {
                page: 1,
                size: 12,
                exp:true
            },
            totalPage: 10,
            selectedRadio: '',
            baseUrl: process.env.MATERIAL_API,
            titleTabIndex: '',
            materialTabIndex: '',
            selectedId: '',
            selectedData: '',
            historyData:[],
            cardSelectBoxVisible:false,
            cardType: 'link'
        }
    },
    methods: {
        getCard(){
            this.cardSelectBoxVisible = true
            this.getCardsList()
        },
        cardTabClick(tab, event) {
            // this.materialTabIndex = tab.index
            // this.dialogFormVisible = true;
            // this.selectedRadio = ''
            // this.selectedData = ''
            // console.log(this)
            //
            // if (this.materialTabIndex === '0') {
            //     this.getLinkDataList()
            // }
        },
        getCardsList() {
            console.log(this.account)
            GetCardsList(this.account,this.pageParam).then(response => {
                this.cardList = response.data
                console.log(this.cardList)
                this.totalPage = response.headers['x-total-count']

            })
        },
        getCardData(id, account) {
            GetCardData(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.cardType = 'GENERAL_COUPON'
                    this.temp.cardId = this.selectedData.id
                })
        },
        reset(){
            this.cardList = ''
        },
        clearData() {
            this.cardSelectBoxVisible = false;
            this.cardList = ''
        },
        clearSelectedData() {
            this.selectedData = ''
        },
        confirm(){
            this.$emit("selectedCard",this.selectedRadio,this.materialType);
            this.cardSelectBoxVisible = false;
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getCardsList(this.account, this.pageParam)
        }
    }
}


function tempInit() {
    return {
        cardId: "",
        cardName: "",
    }
}

