import {parseTime} from 'utils'
import {
    GetCardsList,
    DeleteCard,
    GetRefreshResult,
    EditSkuNum
} from "../card-coupons/api/cardCouponsApi";
import moment from 'moment'


export default {
    created() {
        this.account = this.$store.state.weChatAccount.accountInfo.account;
        this.getCardsList(this.account, this.pageParam);
    },
    data() {
        return {
            temp:tempInit(),
            tableData: [],
            totalPage: 10,
            account: "",
            openId: "",
            onXHR:false,
            validValue:false,
            pageParam: pageParamInit(),
            skuNum:0,
            isChange:false,
            searchFormVisible:false
            }
    },
    methods: {
        //  显示卡券列表
        getCardsList(account, pageParam) {
            GetCardsList(account, pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.tableData = response.data
                        for (let i =0;  i < this.tableData.length;i++)
                        {
                            this.tableData[i].index= i
                            this.tableData[i].skuNum= this.tableData[i].sku
                        }
                        this.$set(this.tableData,'isChange',false)

                        // console.log(this.tableData)
                    } else {
                        this.totalPage = 0
                    }
                })
        },
        formatter(row,column){
            let issub = row[column.property];
            if(issub == 'CARD_STATUS_NOT_VERIFY'){
                return "未投放";
            } else {
                return "已投放";
            }
        } ,
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getCardsList(this.account, this.pageParam)
        },
        onAdd(){
        },
        search: function () {
            this.getCardsList(this.account, this.pageParam);
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        handleDelete(id){
            this.ConfirmBox("是否确认删除")
                .then(()=>{
                    // console.log(id)
                    DeleteCard(this.account,id)
                        .then((response) => {
                            this.getCardsList(this.account,this.pageParam)
                        })

                })
        },
        onRefresh: function () {
            this.getRefreshResult(this.account);
        },
        getRefreshResult(account) {
            GetRefreshResult(account)
                .then((response) => {
                    if (response.data=="success") {
                        this.$message(
                            {
                                message: '同步成功',
                                type:'success'
                            })
                        this.getCardsList(this.account,this.pageParam)
                        return
                    } else {
                        this.$message({
                            message: '同步失败',
                            type:'error'
                        });
                        return
                    }
                })
        },
        changeIcon(row){
            this.$set(this.tableData[row.index],'isChange',true)
            // this.skuNum=row.sku
        },
        handleCurrentChange(page){
            this.pageParam.page = page;
            this.getCardsList(this.account,this.pageParam)
        },
        cancelChange(row){
            this.$set(this.tableData[row.index],'isChange',false)
            console.log(row)
            this.temp=tempInit();
            // this.getCardsList(this.account,this.pageParam)
        },
        validateSkuNum(value){
            var num = Number.parseInt(value)
            const reg = /^[0-9]\d*$/
            if (!reg.test(value) || typeof(num) !== 'number' || num < 0) {
                this.$message({
                    message: '请输入一个0-100000000之间的整数',
                    type:'error'
                });
                this.validValue=false;
            }else if (num > 100000000) {
                this.$message({
                    message: '不可超过100000000',
                    type:'error'
                });
                this.validValue=false;
            } else {
                this.validValue=true;
            }

        },
        changeNum(row){
            this.validateSkuNum(row.skuNum)
            if(this.validValue) {
                this.temp.card_id = row.cardId
                var num = row.skuNum - row.sku;
                if (num > 0) {
                    this.temp.increase_stock_value = num
                } else {
                    this.temp.reduce_stock_value = -num;
                }
                EditSkuNum(this.account, row.cardId,row.id, this.temp)
                    .then((response) => {
                        if (response.data == "success") {
                            this.$message(
                                {
                                    message: '修改成功',
                                    type:'success'
                                }
                            )
                            this.$set(this.tableData[row.index],'isChange',false)
                            row.sku=row.skuNum
                            this.temp = tempInit();
                            // this.getCardsList(this.account, this.pageParam)
                            return
                        } else {
                            this.$message({
                                message: '修改失败',
                                type:'error'
                            });
                            return
                        }
                    })
            }
        }
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        cardTitle: '',
        exp:false
    }
}


function tempInit() {
    return{
        card_id: "",
        increase_stock_value: 0,
        reduce_stock_value: 0
    }
}