/**
 * Created by zyk on 2017/9/25.
 */
import {GetFansGroupManufacturerData,GetFansGroupAgencyData,GetFansList,ExportFansGroup,CountFansGroup} from '../api/fansgroupManageApi'

export default {
    created() {
        this.getFansGroupData();
        this.getFansList(this.id,this.account,this.pageParam);
    },
    watch: {

    },
    methods: {
        getFansGroupData: function () {
            if((this.isMaster+"") == "true") {
                GetFansGroupManufacturerData(this.id,this.account).then((response) => {
                    this.fansGroupData = handleFansGroupData(response.data);
                })
            } else {
                GetFansGroupAgencyData(this.id,this.account).then((response) => {
                    this.fansGroupData = handleFansGroupData(response.data);
                })
            }
        },
        //  显示用户信息
        getFansList(groupId,account,pageParam){
            GetFansList(groupId,account,pageParam)
                .then((response) => {
                    this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10);
                    this.tableData = response.data;
                    for (let i in this.tableData) {
                        if (this.tableData[i].gender==1) {
                            this.tableData[i].newGender = '男';
                        }else if(this.tableData[i].gender==2) {
                            this.tableData[i].newGender = '女';
                        }else {
                            this.tableData[i].newGender ='-';
                        }
                        if(this.tableData[i].headImgUrl){
                            this.tableData[i].headImgUrl = this.tableData[i].headImgUrl.substring(0,this.tableData[i].headImgUrl.lastIndexOf("/")+1)+"64";
                        }
                    }
                })
        },
        //翻页功能
        handleCurrentChange(page){
            this.pageParam.page = page;
            this.getFansList(this.id,this.account,this.pageParam)
        },
        countFans: function() {
            this.ConfirmBox("是否计算") .then(()=>{
                CountFansGroup(this.fansGroupData,this.account).then((response) => {
                    this.fansGroupData = {};
                    this.tableData =  [];
                    this.totalPage = 10;
                    this.getFansGroupData();
                    this.getFansList(this.id,this.account,this.pageParam);
                });
            })
        },
        exportFanGroup: function() {
            if(this.tableData.length == 0){
                this.$message({
                    message: "数据为空无法导出",
                    type: 'error'
                })
                return;
            }
            ExportFansGroup(this.id,this.account);
        }
    },
    data() {
        return {
            id: this.$route.params.id,
            isMaster: this.$route.params.isMaster,
            fansGroupData: {},
            account: localStorage.getItem("aid"),
            pageParam: pageParamInit(),
            tableData: [],
            totalPage: 10
        };
    }
};
function pageParamInit() {
    return {
        page: 1,
        size: 10
    }
}
function handleFansGroupData(data) {
    if (data.state == 'ON') {
        data.state = "启用"
    } else {
        data.state = "停用"
    }
    if(data.createTime) {
        data.createTime = data.createTime.replace('T',' ');
    }
    let chooseTags = data.chooseTags;
    if(chooseTags && chooseTags.split(',').length > 1) {
        data.chooseTags = chooseTags.substring(0,chooseTags.lastIndexOf(','))
        if(data.chooseTags){
            data.chooseTags = data.chooseTags.split(",and,").join(";").split(",or,").join("/");
        }
    }
    return data;
}