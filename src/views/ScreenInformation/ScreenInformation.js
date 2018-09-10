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
 * 创建日期：2018-7-12
 * </pre>
 */
import {
    GetList,
    Create,
    Editor,
    Delete,
    BatchDelete,
    Status,
    BatchStatus,
    UpdateFeature,
    SendScreenInformation,
    JudgeAdded,
    GetLvl,
    DeletePPT,
    GetBackgroundFromHighLevel,
} from "./api/screenInformationApi";
import EXIF from '../../utils/exif.js';
import store from '../../store';
export default {
    created() {
        this.getLvl();
        this.getList(this.pageParam);
    },
    data() {
        return {
            order : 0,
            chooseFullScreen:false,
            tableData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogFormVisibleCommunity: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            rules1: {
                useLogo: [{required: true, message: "请选择公司标识", type: "number"}],
                companyName:
                    [
                        {required: true, message: '请输入公司名称', trigger: 'blur'},
                        {max: 255, message: '公司名称不得超过255个字符'}],
                /*  imageUrl1:
                      [
                              {required: true, message: '请上传公司logo', trigger: 'blur'}],
                  imageUrl2:
                      [
                              {required: true, message: '请上传公司背景图', trigger: 'blur'}],*/
                /*usePortrait: [{required: true, message: "请选择使用人员头像或广告", type: 'number'}],*/
            },
            rules2: {
                communityName:
                    [
                        {required: true, message: '请输入小区名称', trigger: 'blur'},
                        {max: 255, message: '小区名称不得超过255个字符'}],
                /*  imageUrl3:
                      [
                          {required: true, message: '请上传小区背景图', trigger: 'blur'}],*/
           /*     communityAdRotationTime:
                    [
                        {required: true, message: '请输入小区广告轮播时间'}],*/
                usePortrait:[{required:true,message:'请选择是否显示业主头像',type:"number"}]
            },
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5,
            actionWhileAdd: '/dealer/screen-information/upload',
            upLoadData: {
                baseStr: ''
            },
            imageUrl1: '',
            imageUrl2: '',
            imageUrl3: '',
            img_loading: false,
            lvl: -1,
            imageDetail: '',
            picVisible: false,
            logoOptions: [{
                value: 1,
                label: 'logo'
            },
                {
                    value: 0,
                    label: '文字'
                }
            ],
            logoFlag: -1,
            adFlag: -1,
            adOptions: [
                {
                    value: 1,
                    label: "人员头像"
                },
                {
                    value: 0,
                    label: '广告'
                }],
            imgList: [],
            size: 0,
            pictureInfo:{},
            //标识 在编辑状态下点击 删除广告图片
            isEdit : false,
            //操作标识（平台 企业 还是组织）
            operateFlag:'',
            checkedAdvertisement:false,
            checkedPortrait:true,
            picturesFromPPT:[],
            headersGOT:{},
            loading2:false
        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    this.rowTotal = response.data.rowTotal;
                    this.tableData = response.data.rows;
                })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd1() {
            this.temp = tempInit();
            /*
            * Other init data
            *
            * */
            this.imageUrl1 = '';
            this.imageUrl2 = '';
            JudgeAdded().then((result) => {
                if (result.code == 1) {
                    this.$message({
                        message: "您已新增过，请在原来的基础上修改！",
                        type: 'error'
                    })
                } else {
                    this.dialogFormVisible = true;
                    this.dialogStatus = 'create';
                    this.operatorType = 'adminOrCrop'
                }
            })
        },
        onAdd2() {
            this.imageUrl3 = ''
            this.temp = tempInit();
            this.picturesFromPPT = []
            /*
            * Other init data
            *
            * */
            let that = this;
            JudgeAdded().then((result) => {
                if (result.code == 1) {
                    this.$message({
                        message: "您已新增过，请在原来的基础上修改！",
                        type: 'error'
                    })
                } else {
                    that.dialogFormVisibleCommunity = true;
                    that.dialogStatus = 'create';
                    that.operatorType = 'org';
                    if (that.lvl == 0){
                        GetBackgroundFromHighLevel().then((response)=>{
                            if (response.data != undefined && response.data != null && response.data != ''){
                                that.imageUrl3 = response.data;
                                that.temp.communityBackgroundImage = response.data;
                            }
                        })
                    }
                }
            })
            this.order = 0;
            this.temp.communityAdPathList = [];
        },
        onEdit1(row) {
            this.temp = $.extend(tempInit(), row);
            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.adFlag = -1;
            this.imageUrl1 = this.temp.companyLogo;
            this.imageUrl2 = this.temp.companyBackgroundImage;
            this.dialogStatus = 'editor';
            if (this.temp.useLogo == 1){
                this.logoFlag = 1;
            }
            if (this.temp.useLogo == 0){
                this.logoFlag = 0;
            }
            this.operatorType = 'adminOrCrop'
        },
        onEdit2(row) {
            this.temp = $.extend(tempInit(), row);
            this.temp.communityAdPathList = [];
            this.picturesFromPPT = []
            /*
            * Other init data
            *
            * */
            if(this.temp.usePortrait == 1){
                this.checkedPortrait = true;
            }else{
                this.checkedPortrait = false
            }
            if (this.temp.useAdvertisement == 1){
                this.checkedAdvertisement = true;
            }else{
                this.checkedAdvertisement = false
            }
            if (this.temp.fullScreen == 1){
                this.chooseFullScreen = true;
            }else{
                this.chooseFullScreen = false;
            }
            this.imgList = [];
            this.adFlag = -1;
            this.imageUrl3 = this.temp.communityBackgroundImage;
            this.dialogFormVisibleCommunity = true;
            this.dialogStatus = 'editor';
            this.isEdit = true;
            for (var i = 0; i < this.temp.advertisementList.length; i++) {
                let adImage = adImageInit();
                adImage.adImageId = this.temp.advertisementList[i].id;
                adImage.name = this.temp.advertisementList[i].imageName;
                adImage.baseStr = this.temp.advertisementList[i].adImage;
                adImage.order = this.temp.advertisementList[i].showOrder;
                this.imgList.push(adImage);
            }
            if(this.temp.usePortrait == 0){
                this.adFlag = 0;
            }
            if (this.temp.usePortrait == 1){
                this.adFlag = 1;
            }
            this.operatorType = 'org';
            if (this.imgList.length > 0){
                this.order = this.imgList[this.imgList.length - 1].order + 1;
            }
        },
        resetForm() {
            this.dialogFormVisibleCommunity = false;
            this.$refs['form'].resetFields();
            this.temp = tempInit();
            this.checkedAdvertisement = false;
            this.checkedPortrait = true;
            this.imageUrl3 = '';
            this.imageUrl2 = '';
            this.imageUrl1 = '';
        },
        closeCompanyAdd(){
            this.temp = tempInit();
            this.dialogFormVisible = false;
            this.size = 0;
            this.imgList = [];
            this.adFlag = -1;
            this.logoFlag = -1;
            this.imageUrl2 = '';
            this.imageUrl1 = '';
        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
        },

        create() {
            let that = this;
            this.$refs['form'].validate((valid) => {
                debugger
                if (valid) {
                    if(that.checkedAdvertisement){
                        that.temp.useAdvertisement = 1
                    }else{
                        that.temp.useAdvertisement = 0
                    }
                    if(that.checkedPortrait){
                        that.temp.usePortrait = 1
                    }else{
                        that.temp.usePortrait = 0
                    }
                        if (that.chooseFullScreen){
                            that.temp.fullScreen = 1;
                        }else{
                            that.temp.fullScreen = 0;
                        }
                        if (that.temp.usePortrait == 0 && that.operatorType == 'org' && that.temp.useAdvertisement == 0){
                            that.$message({
                                message: "请选择使用头像、广告！",
                                type: 'error'
                            })
                            return;
                        }
                        if (that.temp.useAdvertisement == 1 && that.operatorType == 'org'){
                            if (that.imgList.length <= 0){
                                that.$message({
                                    message: "广告图片必须上传！",
                                    type: 'error'
                                })
                                return;
                            }
                            if (that.temp.communityAdRotationTime == undefined || that.temp.communityAdRotationTime == ''){
                                that.$message({
                                    message: "广告轮播时间必填！",
                                    type: 'error'
                                })
                                return;
                            }else{
                                //that.temp.communityAdRotationTime = that.temp.communityAdRotationTime.replace(/\"/g, "");
                                if (that.temp.communityAdRotationTime <= 0){
                                    that.$message({
                                        message: "广告轮播时间必须大于0！",
                                        type: 'error'
                                    })
                                    return;
                                }
                            }
                           /* if (that.temp.fullScreen == '' || that.temp.fullScreen == undefined){
                                that.$message({
                                    message: "广告全屏展示必填！",
                                    type: 'error'
                                })
                                return;
                            }*/
                            if (that.chooseFullScreen && that.checkedAdvertisement && (that.temp.advertisementInterval == '' || that.temp.advertisementInterval == undefined)){
                                that.$message({
                                    message: "切换广告间隔时间必填！",
                                    type: 'error'
                                })
                                return;
                            }else if(that.chooseFullScreen && that.checkedAdvertisement){
                                //that.temp.advertisementInterval = that.temp.advertisementInterval.replace(/\"/g, "");
                                if (that.temp.advertisementInterval <= 0){
                                    that.$message({
                                        message: "切换广告间隔时间必须大于0！",
                                        type: 'error'
                                    })
                                    return;
                                }
                            }
                        }
                        if(that.operatorType == 'adminOrCrop'){
                            if (that.temp.useLogo == 0){
                                if (that.temp.textContent == undefined || that.temp.textContent == ''){
                                    that.$message({
                                        message: "公司标识文字必填！",
                                        type: 'error'
                                    })
                                    return;
                                }
                            }else{
                                if (that.temp.companyLogoBaseStr == '' || that.temp.companyLogoBaseStr == undefined){
                                    that.$message({
                                        message: "公司logo必须上传！",
                                        type: 'error'
                                    })
                                    return;
                                }
                            }
                        }
                       // debugger;
                        if (that.operatorType == 'adminOrCrop'){
                            if (!((that.temp.companyBackgroundImageBaseStr != '' && that.temp.companyBackgroundImageBaseStr != undefined))){
                                that.$message({
                                    message: "背景图必须上传！",
                                    type: 'error'
                                })
                                return;
                            }
                        }else{
                            if ((that.temp.communityBackgroundImage == '' || that.temp.communityBackgroundImage == undefined)&&(that.temp.communityBackgroundImageBaseStr == ''||that.temp.communityBackgroundImageBaseStr==undefined)){
                                that.$message({
                                    message: "背景图必须上传！",
                                    type: 'error'
                                })
                                return;
                            }
                        }

                    that.onXHR = true;
                        Create(that.temp)
                            .then(() => {
                                that.dialogFormVisible = false;
                                that.dialogFormVisibleCommunity = false;
                                that.dialogStatus = 'create';
                                that.imgList = [];
                                console.log(that.lvl)
                                that.getList(this.pageParam);
                                that.temp = tempInit();
                                that.logoFlag = -1;
                                that.adFlag = -1;
                                that.imgList = [];
                            })
                 /*   } else {
                        this.$message({
                            message: "图片必须上传！",
                            type: 'error'
                        })
                    }*/

                } else {
                    return false;
                }
            });
            //this.operatorType = '';
        },
        update(formName) {
            let that = this;
            console.log(this.transferToBaseArray(this.imgList));
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  /*  if (that.temp.enable) {
                        that.temp.enable = 'true'
                    } else {
                        that.temp.enable = 'false'
                    }*/
                    if(that.checkedAdvertisement){
                        that.temp.useAdvertisement = 1
                    }else{
                        that.temp.useAdvertisement = 0
                    }
                    if(that.checkedPortrait){
                        that.temp.usePortrait = 1
                    }else{
                        that.temp.usePortrait = 0
                    }
                    if (that.chooseFullScreen){
                        that.temp.fullScreen = 1;
                    }else{
                        that.temp.fullScreen = 0;
                    }
                    if(that.operatorType == 'adminOrCrop'){
                        if (that.temp.useLogo == 0){
                            if (that.temp.textContent == undefined || that.temp.textContent == ''){
                                that.$message({
                                    message: "公司标识文字必填！",
                                    type: 'error'
                                })
                                return;
                            }
                        }else{
                            if ((that.temp.companyLogoBaseStr == '' || that.temp.companyLogoBaseStr == undefined)&&(that.temp.companyLogo == '' || that.temp.companyLogo == undefined)){
                                that.$message({
                                    message: "公司logo必须上传！",
                                    type: 'error'
                                })
                                return;
                            }
                        }
                    }
                    if (that.temp.usePortrait == 0 && that.operatorType == 'org' && that.temp.useAdvertisement == 0){
                        that.$message({
                            message: "请选择使用头像、广告！",
                            type: 'error'
                        })
                        return;
                    }

                    if (that.temp.useAdvertisement == 1 && that.operatorType == 'org'){
                        if (that.imgList.length <= 0){
                            that.$message({
                                message: "广告图片必须上传！",
                                type: 'error'
                            })
                            return;
                        }
                        if (that.temp.communityAdRotationTime == undefined || that.temp.communityAdRotationTime == ''){
                            that.$message({
                                message: "广告轮播时间必填！",
                                type: 'error'
                            })
                            return;
                        }else{
                            //that.temp.communityAdRotationTime = that.temp.communityAdRotationTime.replace(/\"/g, "");
                            if (that.temp.communityAdRotationTime <=0 ){
                                that.$message({
                                    message: "广告轮播时间必须大于0！",
                                    type: 'error'
                                })
                                return;
                            }
                        }
                        /*if (that.temp.fullScreen == '' || that.temp.fullScreen == undefined){
                            that.$message({
                                message: "广告全屏展示必填！",
                                type: 'error'
                            })
                            return;
                        }*/
                        if (that.temp.chooseFullScreen && that.checkedAdvertisement && (that.temp.advertisementInterval == '' || that.temp.advertisementInterval == undefined)){
                            that.$message({
                                message: "切换广告间隔时间必填！",
                                type: 'error'
                            })
                            return;
                        }else if(that.chooseFullScreen && that.checkedAdvertisement){
                            if(that.temp.advertisementInterval <=0 ){
                                that.$message({
                                    message: "切换广告时间必须大于0！",
                                    type: 'error'
                                })
                                return;
                            }
                        }
                    }
                    if (that.operatorType == 'adminOrCrop'){
                        if (that.temp.useLogo == 0){
                            if (that.temp.textContent == undefined || that.temp.textContent == ''){
                                that.$message({
                                    message: "公司标识文字必填！",
                                    type: 'error'
                                })
                                return;
                            }
                        }
                    }
                    if (that.operatorType == 'org'){
                        that.temp.companyName = '';
                        that.temp.companyLogo = '';
                        that.temp.companyBackgroundImage = '';
                    }
                    Editor(that.temp)
                        .then(() => {
                            that.dialogFormVisible = false;
                            that.dialogFormVisibleCommunity = false;
                            that.dialogStatus = 'create';
                            that.getList(this.pageParam);
                            that.temp = tempInit();
                            that.logoFlag = -1;
                            that.adFlag = -1;
                            that.imgList = []
                        });
                    //that.operatorType = ''
                } else {
                    return false;
                }
            })
            ;

        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id
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
        onStatus(row, type) {
            if (type == '1') {
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        Status(row.id, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        Status(row.id, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
        },
        onBatchStatus(type) {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            if (type == '1') {
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then(() => {
                                this.getList(this.pageParam);
                            })
                    })
            }
        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.dialogFormVisibleCommunity = false;
            this.$refs['form'].resetFields()
            this.temp = tempInit();
            this.logoFlag = -1;
            this.adFlag = -1;
            if (this.picturesFromPPT != undefined &&this.picturesFromPPT.length != 0){
                DeletePPT(this.picturesFromPPT)
            }
            this.imgList = [];
            this.checkedAdvertisement = false;
            this.checkedPortrait = true;
            this.imageUrl3 = '';
            this.imageUrl2 = '';
            this.imageUrl1 = '';
        },
        closeForm() {
            this.formVisible = false;
        },
        beforeAvatarUpload(file) {
            return true;
        },
        changeFeature1(file, fileList) {
            // this.img_loading = true;
            let suffixArry = file.name.toLowerCase().split('.');
            let suffix = suffixArry[suffixArry.length - 1];
            if (suffix == 'jpg') {
                suffix = 'jpeg';
            }
            this.temp.suffix = suffix;
            let self = this;
            /*  let imgContent1 = {};
              imgContent1.name = file.name;*/

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/' + suffix, maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;
                        self.temp.companyLogoBaseStr = self.base64;
                        self.imageUrl1 = self.base64;
                        self.temp.suffix = self.base64.split(';base64')[0].split('/')[1];
                        // 手动上传
                        /*       UpdateFeature(self.upLoadData);
                               setTimeout(function () {
                                   self.dialogImg = false;
                               }, 3000);*/
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        changeFeature2(file, fileList) {
            // this.img_loading = true;
            let self = this;
            let suffixArry = file.name.toLowerCase().split('.');
            let suffix = suffixArry[suffixArry.length - 1];
            if (suffix == 'jpg') {
                suffix = 'jpeg';
            }
            this.temp.suffix = suffix;
            /*  let imgContent = {};
              imgContent.name = file.name;*/

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/' + suffix, maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;
                        self.temp.companyBackgroundImageBaseStr = self.base64;
                        self.imageUrl2 = self.base64;
                        self.temp.suffix = self.base64.split(';base64')[0].split('/')[1];
                        // 手动上传
                        /*       UpdateFeature(self.upLoadData);
                               setTimeout(function () {
                                   self.dialogImg = false;
                               }, 3000);*/
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        changeFeature3(file, fileList) {
            // this.img_loading = true;
            let self = this;
            let suffixArry = file.name.toLowerCase().split('.');
            let suffix = suffixArry[suffixArry.length - 1];
            if (suffix == 'jpg') {
                suffix = 'jpeg';
            }
            this.temp.suffix = suffix;
            /*  let imgContent = {};
              imgContent.name = file.name;
  */
            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/' + suffix, maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.temp.communityBackgroundImageBaseStr = self.base64;
                        self.imageUrl3 = self.base64;
                        self.temp.suffix = self.base64.split(';base64')[0].split('/')[1];
                        // 手动上传
                        /*       UpdateFeature(self.upLoadData);
                               setTimeout(function () {
                                   self.dialogImg = false;
                               }, 3000);*/
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        handleUploadCompanylogoSuccess(result) {
            this.temp.companyLogo = result;
        },
        handleUploadCompanyBgSuccess(result) {
            this.temp.companyBackgroundImage = result;
        },
        handleUploadCommunitylogoSuccess(result) {
            this.temp.communityLogo = result;
        },
        handleUploadCommunityBgSuccess(result) {
            this.temp.communityBackgroundImage = result;
        },
        sendScreenInformation(row) {
            this.temp = $.extend(tempInit(), row);
            console.log(this.temp);
         /*   if(this.checkedAdvertisement){
                this.temp.useAdvertisement = 1
            }else{
                this.temp.useAdvertisement = 0
            }
            if(this.checkedPortrait){
                this.temp.usePortrait = 1
            }else{
                this.temp.usePortrait = 0
            }*/
            SendScreenInformation(this.temp).then((result) => {
                if (result.code == 1) {
                    this.$message({
                        message: "请先关联终端服务",
                        type: 'error'
                    })
                } else {
                    this.$message({
                        message: "下发成功！",
                        type: 'success'
                    })
                }
            })
        },
        getLvl() {
            GetLvl().then((result) => {
                this.lvl = result.data;
            })
        },
        picDetail(src) {
            //src = 'http://www.txahz.com/data/attachment/portal/201510/05/215027qzskl44x4666xczr.jpg'
            $("#pic").removeAttr("src");
            this.picVisible = true;
            let image = new Image();
            image.src = src;
            let that = this;
            if (image.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                /* callback.call(img);
                 return; // 直接返回，不用再处理onload事件*/
                that.showPicture(image,src);
            }
            image.onload = function () { //图片下载完毕时异步调用callback函数。
                /* callback.call(img);//将回调函数的this替换为Image对象*/
                if (image.width > 0 && image.height > 0){
                    that.showPicture(image,src)
                }
            };
        },
        closeViewPicture() {
            this.picVisible = false;
        },
        showPicture(image,src){
            let width = 700;
            let height = 500;
            let img_width = image.width;
            let img_height = image.height;
            let temp_width = 0;
            let temp_height = 0;
            if (img_width > width) {
                temp_width = width;
                temp_height = (width / img_width) * img_height;
                if (temp_height > height) {
                    img_width = img_width * (height / img_height);
                    img_height = height;
                } else {
                    img_width = temp_width;
                    img_height = temp_height;
                }
            } else {
                if (img_height > height) {
                    img_width = img_width * (height / img_height)
                    img_height = height;
                }
            }
            $("#pic").attr("src", src);
            $("#pic").css("height", img_height);
            $("#pic").css("width", img_width);
        },
        closePic() {
            this.picVisible = false;
        },
        setLogoFlag() {
            this.logoFlag = this.temp.useLogo;
        },
        setPortraitFlag() {
            this.adFlag = this.temp.usePortrait;
        },
        fileClick() {
            document.getElementById('upload_file').click()
        },
        fileChange(el) {
            if (!el.target.files[0].size) return;
            this.fileList(el.target.files);
            el.target.value = ''
        },
        fileList(files) {
            for (let i = 0; i < files.length; i++) {
                this.fileAdd(files[i]);
            }
        },
        fileAdd(file) {
            this.size = this.size + file.size;//总大小
           /* let reader = new FileReader();
            reader.vue = this;
            reader.readAsDataURL(file);
            reader.onload = function () {
                file.src = this.result;
                this.vue.imgList.push({
                    file
                });
            }*/
           this.transferToBase(file);
           /*this.imgList.push(this.transferToBase(file));*/
           /*console.log(this.imgList);*/
        },
        fileDel(index) {
            let that = this;
            this.ConfirmBox('确认删除?')
                .then(() => {
                    if (that.isEdit && that.imgList[index].adImageId != -1 && that.imgList[index].adImageId != -2){
                        that.temp.deletedAdIds.push(that.imgList[index].adImageId)
                    }
                    if (!that.isEdit){
                        for (let j=0; j<that.temp.communityAdList.length; j++){
                            if (that.imgList[index].baseStr == that.temp.communityAdList[j].baseStr){
                                that.temp.communityAdList.splice(j,1);
                            }
                        }
                    }
                    if (that.imgList[index].adImageId == -2){
                        let name = that.imgList[index].name
                        for( let i=0; i<that.temp.communityAdPathList.length; i++){
                            if (that.temp.communityAdPathList[i].name == name){
                                that.temp.fileToDelete.push(that.temp.communityAdPathList[i].name);
                                that.temp.communityAdPathList.splice(i,1);
                            }
                        }
                    }
                    that.imgList.splice(index, 1);
                })
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            let k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        dragenter(el) {
            el.stopPropagation();
            el.preventDefault();
        },
        dragover(el) {
            el.stopPropagation();
            el.preventDefault();
        },
        drop(el) {
            el.stopPropagation();
            el.preventDefault();
            this.fileList(el.dataTransfer.files);
        },
        transferToBaseArray(fileList) {
            let baseArry = [];
            for (var i = 0; i < fileList.length; i++) {
                baseArry.push(this.transferToBase(fileList[i]));
            }
            return baseArry;
        },
        transferToBase(file) {
           // console.log(file.name);
            //console.log(file);
            let self = this;
            let that = this;
            let suffixArry = file.name.toLowerCase().split('.');
            let suffix = suffixArry[suffixArry.length - 1];
            if (suffix == 'jpg') {
                suffix = 'jpeg';
            }
            // ppt or pptx
            if (suffix == 'ppt' || suffix == 'pptx') {
                that.loading2 = true;
                this.headers();
                // upload and show images
                console.log("选择文件类型为ppt，导入中……");

                var url = "dealer/screen-information/uploadPPT";
                // FormData 对象
                var form = new FormData();// 可以增加表单数据
                form.append("pptFile", file);// 文件对象
                $.ajax({
                    headers:this.headersGOT,
                    url: url,
                    type: "post",
                    data: form,
                    //dataType:"json",
                    cache:false,
                    //关闭序列化
                    processData: false,
                    contentType: false,
                    //async:false,
                    success: function (response) {
                        console.log(">>>>导入完成。");
                        //console.log(response);
                        if (response.data.converReturnResult){
                            for (let j=0;j<response.data.imgNames.length;j++){
                                that.picturesFromPPT .push(response.data.imgNames[j])
                                that.temp.communityAdPathList.push({path:response.data.imgNames[j],showOrder:that.order});
                                let adImage = adImageInit();
                                let n = response.data.imgNames[j].split("/");
                                adImage.adImageId = -2;
                                adImage.name = n[n.length - 1];
                                adImage.baseStr = response.data.imgNames[j];
                                adImage.order = that.order;
                                that.order = that.order + 1;
                                that.imgList.push(adImage);
                            }
                            /*that.picturesFromPPT = response.data.imgNames;
                            that.temp.communityAdPathList = response.data.imgNames;*/
                           /* for (let i=0;i<that.picturesFromPPT.length;i++){
                                that.temp.communityAdPathList.push({path:that.picturesFromPPT[i],showOrder:that.order});
                                let adImage = adImageInit();
                                let n = that.picturesFromPPT[i].split("/");
                                adImage.adImageId = -2;
                                adImage.name = n[n.length - 1];
                                adImage.baseStr = that.picturesFromPPT[i];
                                adImage.order = that.order;
                                that.order = that.order + 1;
                                that.imgList.push(adImage);
                            }*/
                        }
                        that.loading2 = false;
                    }
                });

            }else{

                // 看支持不支持FileReader
                if (!file ||  !window.FileReader) return;
                if (/^image/.test(file.type)) {

                    var ff = file;
                    EXIF.getData(ff, function () {
                        self.Orientation = EXIF.getTag(this, 'Orientation');
                    });

                    // 创建一个reader
                    let fileReader = new FileReader();
                    // 读取成功后的回调
                    fileReader.onprogress = function (e) {
                        console.log((e.loaded / e.total * 100).toFixed() + "%");
                    };
                    fileReader.onloadend = function (e) {
                        let IMG = new Image();
                        IMG.src = this.result;
                        IMG.onload = function () {
                            let w = this.naturalWidth,
                                h = this.naturalHeight,
                                resizeW = 0,
                                resizeH = 0;
                            //压缩设置
                            let maxSize = {
                                width: 1080,      //图片最大宽度
                                height: 1080,     //图片最大高度
                                level: 0.6       //图片保存质量
                            };
                            //计算缩放比例
                            if (w > maxSize.width || h > maxSize.height) {
                                let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                                resizeW = w / multiple;
                                resizeH = h / multiple;
                            } else {
                                resizeW = w;
                                resizeH = h;
                            }
                            let canvas = document.createElement("canvas"),
                                cxt = canvas.getContext('2d');
                            //根据拍摄的角度进行图片旋转调整
                            if (self.Orientation == 3) {
                                canvas.width = resizeW;
                                canvas.height = resizeH;
                                cxt.rotate(Math.PI);
                                cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                            } else if (self.Orientation == 8) {
                                canvas.width = resizeH;
                                canvas.height = resizeW;
                                cxt.rotate(Math.PI * 3 / 2);
                                cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                            } else if (self.Orientation == 6) {
                                canvas.width = resizeH;
                                canvas.height = resizeW;
                                cxt.rotate(Math.PI / 2);
                                cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                            } else {
                                canvas.width = resizeW;
                                canvas.height = resizeH;
                                cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                            }
                            //base64,最终输出的压缩文件
                            self.base64 = canvas.toDataURL('image/' + suffix, maxSize.level);
                            suffix = self.base64.split(';base64')[0].split('/')[1];
                            self.pictureInfo = {baseStr: self.base64, suffix: suffix,name:file.name,showOrder : that.order};
                            let adImage = adImageInit();
                            adImage.name = file.name;
                            adImage.baseStr = self.base64;
                            adImage.order = that.order;
                            that.order = that.order + 1;
                            self.imgList.push(adImage);
                            self.temp.communityAdList.push(self.pictureInfo);
                            self.pictureInfo = {}
                        }
                    }
                    fileReader.onerror = function (e) {
                        console.log("图片加载失败");
                    };

                    // 将图片将转成 base64 格式
                    fileReader.readAsDataURL(file);
                }
            }
        },
        chooseAdOrNot(){
            if(this.checkedAdvertisement && this.checkedPortrait){
                this.temp.useAdvertisement = 1
                this.chooseFullScreen = true;
                $("#fullScreenSwitch").css("disabled","true")
            }else{
                $("#fullScreenSwitch").css("disabled","false")
            }
        },
        choosePortraitOrNot(){
            if(this.checkedAdvertisement && this.checkedPortrait){
                this.temp.useAdvertisement = 1
                $("#fullScreenSwitch").css("disabled","true")
            }else{
                $("#fullScreenSwitch").css("disabled","false")
            }
        },
        headers() {
            let c_token, tenantId, xuid, xorgid;
            if (store.getters.token) {
                c_token = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            }
            if (store.getters.corporation) {
                tenantId = store.getters.corporation.id;
            }

            if (store.getters.user.user.id) {
                xuid = store.getters.user.user.id;
            }

            if (store.getters.user.user.extend) {
                if (store.getters.user.user.extend.brands.length > 0) {
                    xorgid = store.getters.user.user.extend.brands[0].id;
                }
            }
            this.headersGOT = {
                'token': c_token,
                'tenant-id': tenantId,
                'x-uid': xuid,
                'x-org-id': xorgid
            }
        },
        deleteScreenInformation(row){
            let that = this;
            that.ConfirmBox('是否确认删除').then(()=>{
                Delete(row.id).then((resp)=>{
                    that.getList(this.pageParam);
                })
            })
        }
    },
/*    computed: {
        headers() {
            let c_token, tenantId, xuid, xorgid;
            if (store.getters.token) {
                c_token = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            }
            if (store.getters.corporation) {
                tenantId = store.getters.corporation.id;
            }

            if (store.getters.user.user.id) {
                xuid = store.getters.user.user.id;
            }

            if (store.getters.user.user.extend) {
                if (store.getters.user.user.extend.brands.length > 0) {
                    xorgid = store.getters.user.user.extend.brands[0].id;
                }
            }
            return {
                'token': c_token,
                'tenant-id': tenantId,
                'x-uid': xuid,
                'x-org-id': xorgid
            }
        },
    }*/
}


function tempInit() {
    return {
        companyName: '',
        companyLogo: '',
        companyBackgroundImage: '',
        companyAdRotationTime: '',
        communityName: '',
        communityBackgroundImage: '',
        communityAdRotationTime: '',
        tenantId: '',
        companyLogoBaseStr: '',
        companyBackgroundImageBaseStr: '',
        communityBackgroundImageBaseStr: '',
        suffix: '',
        useLogo: '',
        usePortrait: '',
        textContent: '',
        companyAdList:[],
        communityAdList:[],
        deletedAdIds:[],
        advertisementList:[],
        fullScreen:'0',
        advertisementInterval:'',
        useAdvertisement:'',
        communityAdPathList:[],
        fileToDelete:[]
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        companyName: '',
        companyLogo: '',
        companyBackgroundImage: '',
        companyAdRotationTime: '',
        communityName: '',
        communityBackgroundImage: '',
        communityAdRotationTime: '',
        tenantId: '',
    }
}

function adImageInit() {
    return {
        adImageId: -1,
        name:'',
        baseStr:'',
        order : 0
    }
}


