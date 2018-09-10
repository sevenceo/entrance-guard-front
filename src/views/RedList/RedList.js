/**************************************************************************/
/*                                                                        */
/* Copyright (c) 2017 HyperSmart Company                                  */
/* 深圳市超智慧信息科技有限公司版权所有                                     */
/*                                                                        */
/* PROPRIETARY RIGHTS of HyperSmart Company are involved in the           */
/* subject matter of this material. All manufacturing, reproduction, use, */
/* and sales rights pertaining to this subject matter are governed by the */
/* license agreement. The recipient of this software implicitly accepts   */
/* the terms of the license.                                              */
/* 本软件文档资料是深圳市超智慧信息科技有限公司的资产，任何人士阅读和        */
/* 使用本资料必须获得相应的书面授权，承担保密责任和接受相应的法律约束。      */
/*                                                                        */
/**************************************************************************/

/**
 * <pre>
 * 作   者：Allison
 * 创建日期：2018-7-20
 * </pre>
 */
import {
    GetList,
    Create,
    Delete,
    BatchDelete,
    GetOutRedListHuman,
    CreateNewHuman,
    Editor,
    GetOptions,
    GetHumanNotInWarningList
} from "./api/RedListApi";
import EXIF from "../../utils/exif";
import {GetIdentityList} from "../Human/api/HumanApi";
import vueCropper from 'vue-cropper';
import {Message} from "element-ui";

export default {
    created() {
        this.getList(this.pageParam);
        this.getOptions();
    },
    components: {
        vueCropper
    },
    data() {
        return {
            humanIdsInWarningList:'',
            warningHumanDialogFormVisible: false,
            warningHumanSelect: [],
            options: [],
            pushScreenMessageFlag: true,
            sendWarningAlertFlag: false,
            tableData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            genderInfo: {
                "1": '男',
                "2": "女"
            },
            OneZeroInfo: {
                0: '否',
                1: '是'
            },
            searchFormVisible: false,
            blackListEdit: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogCropperFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            addHumanTemp: addHumanTempInit(),
            rules: {

                realName:
                    [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {max: 128, message: '姓名不得超过128个字符'}],
                /*idNo:
                    [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {max: 18, message: '身份证号不得超过18个字符'},
                        {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '身份证号码格式有误！', trigger: 'blur'}
                    ],*/
                mobilePhone:
                    [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {required: true, max: 11, message: '手机号不得超过11个字符'},
                        {
                            required: true,
                            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            message: '手机号格式有误',
                            trigger: 'blur'
                        }
                    ],
                identity:
                    [{required: true, message: '请选择新增人员身份'}],
                imageUrl:
                    [{required: true, message: '请上传人员照片'}],
            },
            reasonRules: {
                redListRemark: [{required: true, message: '请输入加入黑名单原因', trigger: 'blur'}]
            },
            genders: [{
                value: '1',
                label: '男'
            }, {
                value: '2',
                label: '女'
            }],
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5,
            newHumanVisible: false,
            imageUrl: '',
            action: '',
            humanPageParam: humanPageParamInit(),
            humanSelection: [],
            humanSelect: [],
            rowHumanTotal: 10,
            identityList: [],
            picVisible: false,
            imageDetail: '',
            warningHumanPageParam: warningHumanPageParamInit(),
            rowWarningHumanTotal: 10,
            humanInWarningListSelected:[],
            humanNotInEarningListDialog:false,
            redListDetailDialog:false,
            redListEdit:false,
            paginationShow: false,
            paginationShow1:false
        }
    },
    methods: {
        getOptions() {
            GetOptions().then((response) => {
                this.options = response.data;
            })
        },
        //显示
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    this.rowTotal = response.data.rowTotal;
                    console.log(response.data.rows)
                    this.tableData = response.data.rows;
                })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleWarningHumanCurrentChange(page) {
            this.warningHumanPageParam.page = page;
            this.getHumanNotInWarningList(this.warningHumanPageParam);
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        changeCount(value){
            this.temp.warningMessage = "【智慧通行】红名单人员通行提醒，{name}已从{场景名}通过，加入原因{："+ this.temp.redListRemark+"}";
        },
        onAdd() {
            this.humanInWarningListSelected = [];
            this.pushScreenMessageFlag = true;
            this.sendWarningAlertFlag = false;
            this.temp = tempInit();
            this.temp.warningMessage = "【智慧通行】红名单人员通行提醒，{name}已从{场景名}通过，加入原因{："+ this.temp.redListRemark+"}";
            this.humanPageParam = humanPageParamInit();
            this.paginationShow = false;
            this.$nextTick(function () {
                this.paginationShow = true
            })
            this.dialogFormVisible = true;
            this.getHuman(this.humanPageParam);
        },
        getHuman(humanPageParam) {
            GetOutRedListHuman(humanPageParam).then((response) => {
                this.humanSelect = response.data.rows;
                this.rowHumanTotal = response.data.rowTotal;
            });
        },
        handleHumanCurrentChange(page) {
            this.humanPageParam.page = page;
            this.getHuman(this.humanPageParam)
        },
        humanSelectionChange(selection) {
            this.humanSelection = selection;
        },
        warningHumanSelectionChange(selection) {
            for(let j=0; j<selection.length; j++){
                let existFlag = false;
                for(let k=0; k<this.humanInWarningListSelected.length; k++){
                    if (selection[j].id == this.humanInWarningListSelected[k].id){
                        existFlag = true;
                        break;
                    }
                }
                if (!existFlag){
                    this.humanInWarningListSelected.push(selection[j]);
                }
            }
            //this.humanInWarningListSelected = selection;
            this.humanIdsInWarningList = ''
            for (let i=0; i<this.humanInWarningListSelected.length; i++){
                if (i == this.humanInWarningListSelected.length - 1){
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id
                }else{
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id+','
                }
            }
        },
        showCropperDialog() {
            this.dialogCropperFormVisible = true;
        },
        resetForm() {
            this.temp = tempInit();
            this.pushScreenMessageFlag = true;
            this.sendWarningAlertFlag = false;
            this.dialogFormVisible = false;
            this.humanInWarningListSelected = []

        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.getHuman(this.humanPageParam);
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.humanPageParam = humanPageParamInit()
        },

        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                        })
                } else {
                    return false;
                }
            })
            ;

        },
        onDelete(row) {
            var ids = [];
            ids.push(row.id);
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    BatchDelete(ids
                    )
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })

        },
        onBatchDelete() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认批量删除')
                .then(() => {
                    BatchDelete(ids)
                        .then(() => {
                            this.getList(this.pageParam);
                        })
                })

        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        },
        matchHuman() {
            let that = this;
            this.$refs['redListReason'].validate((valid) => {
               if (valid) {
                   /*   let pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
                     if(pat.test(that.temp.redListRemark) ){
                             //非法
                             that.$message({
                                 message: "对不起!您输入的加入红名单原因含非法字符!请重新输入!",
                                 type: 'error'
                             })
                             return ;
                         }*/
                  /*  if (that.temp.redListRemark.length > 2){
                        that.$message({
                            message: "对不起!您输入的加入红名单原因已超过2字!请重新输入!",
                            type: 'error'
                        })
                        return ;
                    }*/
                    if (that.humanSelection == undefined || that.humanSelection.length == 0) {
                        that.$message({
                            message: "请至少选择一行数据",
                            type: 'error'
                        })
                        return;
                    }
                    if (that.sendWarningAlertFlag){
                        if(that.temp.warningType == undefined || that.temp.warningType ==''){
                            that.$message({
                                message: "请填选择预警方式",
                                type: 'error'
                            })
                            return;
                        }
                        if(that.temp.warningMessage == undefined || that.temp.warningMessage ==''){
                            that.$message({
                                message: "请填选择预警消息内容",
                                type: 'error'
                            })
                            return;
                        }
                        if(that.humanIdsInWarningList == '' || that.humanIdsInWarningList == undefined){
                            that.$message({
                                message: "请填选择预警接收人员",
                                type: 'error'
                            })
                            return;
                        }
                        that.temp.sendWarningAlert = 1
                    }else{
                        that.temp.sendWarningAlert = 0;
                    }
                    if (that.pushScreenMessageFlag){
                        if(that.temp.screenMessage == undefined || that.temp.screenMessag == ''){
                            that.$message({
                                message: "请填写大屏信息内容",
                                type: 'error'
                            })
                            return;
                        }
                        that.temp.pushScreenMessage = 1
                    }else{
                        that.temp.pushScreenMessage = 0
                    }
                    that.humanSelection.map(item => that.temp.redListList.push({
                        humanId: item.id,
                        tenantId: item.tenantId,
                        redListRemark: that.temp.redListRemark,
                        pushScreenMessage:that.temp.pushScreenMessage,
                        sendWarningAlert:that.temp.sendWarningAlert,
                        screenMessage:that.temp.screenMessage,
                        warningType : that.temp.warningType,
                        warningMessage : that.temp.warningMessage,
                        humanIds:that.humanIdsInWarningList
                    }));
                    //console.log(this.temp)
                    Create(that.temp)
                        .then(() => {
                            that.dialogFormVisible = false;
                            that.temp = tempInit();
                            that.pushScreenMessageFlag = true;
                            that.sendWarningAlertFlag = false;
                            that.humanIdsInWarningList = '';
                            that.getList(that.pageParam);
                        })
                }
            })
        },
        onEdit(row) {
            this.humanInWarningListSelected = [];
            if(row.humanList != undefined &&row.humanList.length > 0){
                for(let i=0; i<row.humanList.length; i++){
                    this.humanInWarningListSelected.push(row.humanList[i])
                }
            }
            this.humanIdsInWarningList = ''
            for (let i=0; i<this.humanInWarningListSelected.length; i++){
                if (i == this.humanInWarningListSelected.length - 1){
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id
                }else{
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id+','
                }
            }
            this.temp = $.extend(tempInit(), row);
            this.temp.warningMessage = "【智慧通行】红名单人员通行提醒，{name}已从{场景名}通过，加入原因{："+ this.temp.redListRemark+"}";
            if (this.temp.warningType == null){
                this.temp.warningType = '';
            }
            if (row.pushScreenMessage == 1){
                this.pushScreenMessageFlag = true;
            }else{
                this.pushScreenMessageFlag = false;
            }
            if (row.sendWarningAlert == 1){
                this.sendWarningAlertFlag = true;
            }else{
                this.sendWarningAlertFlag = false;
            }
            this.temp.warningType = this.temp.warningType + '';
            this.redListEdit = true;
        },
        closeDetailForm() {
            this.blackListEdit = false;
        },
        cancelEdit() {
            this.redListEdit = false;
            this.humanInWarningListSelected = [];
            this.temp = tempInit();
            this.sendWarningAlertFlag = false;
            this.pushScreenMessageFlag = true;
        },
        update(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    if(this.humanIdsInWarningList != undefined && this.humanIdsInWarningList != ''){
                        this.temp.humanIds = this.humanIdsInWarningList;
                    }
                    if (this.sendWarningAlertFlag){
                        if(this.temp.warningType == undefined || this.temp.warningType ==''){
                            this.$message({
                                message: "请填选择预警方式",
                                type: 'error'
                            })
                            return;
                        }
                     /*   if(this.temp.warningMessage == undefined || this.temp.warningMessage ==''){
                            this.$message({
                                message: "请填选择预警消息内容",
                                type: 'error'
                            })
                            return;
                        }*/
                        if(this.humanIdsInWarningList == '' || this.humanIdsInWarningList == undefined){
                            this.$message({
                                message: "请填选择预警接收人员",
                                type: 'error'
                            })
                            return;
                        }
                        this.temp.sendWarningAlert = 1
                    }else{
                        this.temp.sendWarningAlert = 0;
                    }
                    if (this.pushScreenMessageFlag){
                        if(this.temp.screenMessage == undefined || this.temp.screenMessag == ''){
                            this.$message({
                                message: "请填写大屏信息内容",
                                type: 'error'
                            })
                            return;
                        }
                        this.temp.pushScreenMessage = 1
                    }else{
                        this.temp.pushScreenMessage = 0
                    }
                    Editor(this.temp)
                        .then(() => {
                            this.redListEdit = false;
                            this.getList(this.pageParam);
                            this.temp = tempInit();
                            this.sendWarningAlertFlag = false;
                            this.pushScreenMessageFlag = true;
                            this.humanInWarningListSelected = [];
                            this.humanIdsInWarningList = '';
                        })
                    ;
                }
            })
        },
        picDetail(src) {
            this.picVisible = true;
            this.imageDetail = src;
            setTimeout(() => {
                let width = $(".viewOriginalImage").css("width").replace("px", "");
                let height = $(".viewOriginalImage").css("height").replace("px", "");
                let wHeight = $(window).height();
                let wWidth = $(window).width();
                console.log("oiuytrewq", width, height);
                $(".viewOriginalImage").css("left", (wWidth - width) / 2 + "px");
                $(".viewOriginalImage").css("top", (wHeight - height) / 2 + "px");

                $(".viewOriginalImage").css("display", "block");
            }, 100);
        },
        closeWarningHumanDialog() {
            this.warningHumanDialogFormVisible = false;
            this.warningHumanPageParam = warningHumanPageParamInit();
        },
        getHumanNotInWarningList(pageParam) {
            GetHumanNotInWarningList(pageParam).then((response) => {
                this.warningHumanSelect = response.data.rows;
                this.rowWarningHumanTotal = response.data.rowTotal
            })
        },
        addWarningHuman() {
            let that = this;
            if (that.warningHumanSelect == undefined || that.warningHumanSelect.length == 0) {
                that.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            this.warningHumanDialogFormVisible = false;
        },
        chooseHuman() {
            for (let i=0; i<this.humanInWarningListSelected.length;i++){
                this.warningHumanPageParam.humanIdsChoosed.push(this.humanInWarningListSelected[i].id)
            }
            this.warningHumanDialogFormVisible = true;
            this.paginationShow1 = false
            this.getHumanNotInWarningList(this.warningHumanPageParam);
            this.$nextTick(function () {
                this.paginationShow1 = true
            })
        },
        deleteHumanSelected(row){
           this.humanInWarningListSelected.remove(row);
            this.humanIdsInWarningList = ''
            for (let i=0; i<this.humanInWarningListSelected.length; i++){
                if (i == this.humanInWarningListSelected.length - 1){
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id
                }else{
                    this.humanIdsInWarningList += this.humanInWarningListSelected[i].id+','
                }
            }
        },
        onSearchWarningHuman(){
            this.humanNotInEarningListDialog = true;
        },
        resetSearchCondition(){
            this.warningHumanPageParam = warningHumanPageParamInit();
        },
        searchWithCondition(){
            this.getHumanNotInWarningList(this.warningHumanPageParam);
        },
        redListDetail(row){
            this.temp = $.extend(tempInit(), row);
            if (row.pushScreenMessage == 1){
                this.pushScreenMessageFlag = true;
            }else{
                this.pushScreenMessageFlag = false;
            }
            if (row.sendWarningAlert == 1){
                this.sendWarningAlertFlag = true;
            }else{
                this.sendWarningAlertFlag = false;
            }
            this.temp.warningType = this.temp.warningType + '';
            this.redListDetailDialog = true;
        },
        closeDetail(){
            this.temp = tempInit();
            this.pushScreenMessageFlag = true;
            this.sendWarningAlertFlag = false;
            this.redListDetailDialog =false;
        },
        closePic(){
            this.picVisible = false;
        }
    }
}

function tempInit() {
    return {
        humanId: '',
        tenantId: '',
        redListList: [],
        redListRemark: '',
        pushScreenMessage: false,
        screenMessage: '',
        sendWarningAlert: '',
        warningType: '',
        warningMessage: '',
        humanIds: '',
        humanList:[]
    }
}

function addHumanTempInit() {
    return {
        realName: '',
        mobilePhone: '',
        identity: '',
        gender: '',
        idNo: '',
        age: '',
        email: '',
        remark: '',
        imageUrlFlag: false,
        baseStr: ''
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        humanId: '',
        tenantId: ''
    }
}

function humanPageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        realName: '',
        mobilePhone: ''
    }
}

function warningHumanPageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        realName: '',
        mobilePhone: '',
        humanIdsChoosed:[]
    }
}

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
