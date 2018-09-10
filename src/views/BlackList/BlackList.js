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
    GetOutBlackListHuman,
    CreateNewHuman,
    Editor
} from "./api/BlackListApi";
import EXIF from "../../utils/exif";
import {GetIdentityList} from "../Human/api/HumanApi";
import vueCropper from 'vue-cropper';
import {Message} from "element-ui";

export default {
    created() {
        this.getList(this.pageParam);
    },
    components: {
        vueCropper
    },
    data() {
        return {
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
            searchFormVisible: false,
            blackListEdit:false,
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
            reasonRules:{
                blackListRemark:[{required:true, message:'请输入加入黑名单原因',trigger:'blur'}]
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
            //----裁剪区域参数----
            headImg:'',
            //剪切图片上传
            crap: false,
            previews: {},
            option : optionInit(),
            fileName:'',  //本机文件地址
            downImg: '#',
            imgFile:'',
            uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
            paginationShow: false
        }
    },
    methods: {
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
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd() {
            this.paginationShow = false;
            this.temp = tempInit();
            this.humanPageParam = humanPageParamInit();
            this.getHuman(this.humanPageParam);
            this.dialogFormVisible = true;
            this.$nextTick(function () {
                this.paginationShow = true
            })
        },
        getHuman(humanPageParam) {
            GetOutBlackListHuman(humanPageParam).then((response) => {
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
        showCropperDialog() {
            this.dialogCropperFormVisible = true;
        },
        resetForm() {
            this.temp = tempInit();
            this.dialogFormVisible = false;

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
        addHuman() {
            this.imageUrl = '';
            this.newHumanVisible = true;
            GetIdentityList().then((result) => {
                this.identityList = result.data;
                // console.log(this.identityList);
                /*this.dialogFormVisible = false;*/
                /* this.dialogChooseIdentity = true;*/
            });
            if(this.$refs.cropper){
                this.$refs.cropper.refresh();
                this.previews.url=null;
            }
        },
        closeAddHuman() {
            this.$refs['form'].resetFields();
            this.newHumanVisible = false;
            this.addHumanTemp = addHumanTempInit();
        },
        matchHuman(){
            let that = this;
            this.$refs['blackListReason'].validate((valid) => {
                if(valid){
                    if (that.humanSelection == undefined || that.humanSelection.length == 0) {
                        that.$message({
                            message: "请至少选择一行数据",
                            type: 'error'
                        })
                        return;
                    }
                    that.humanSelection.map(item=>that.temp.blackList.push({
                        humanId:item.id,
                        tenantId:item.tenantId,
                        blackListRemark:that.temp.blackListRemark
                    }));
                    Create(that.temp)
                        .then(() => {
                            that.dialogFormVisible = false;
                            that.dialogStatus = 'create';
                            that.getList(that.pageParam);
                        })
                }
            })
        },
        picDetail(src){
            this.picVisible = true;
            this.imageDetail = src;
            setTimeout(()=>{
                let width= $(".viewOriginalImage").css("width").replace("px","");
                let height= $(".viewOriginalImage").css("height").replace("px","");
                let wHeight= $(window).height();
                let wWidth=  $(window).width();
                console.log("oiuytrewq",width,height);
                $(".viewOriginalImage").css("left",(wWidth-width)/2+"px");
                $(".viewOriginalImage").css("top",(wHeight-height)/2+"px");

                $(".viewOriginalImage").css("display","block");
            },100);
        },
        closePic(){
            this.picVisible = false;
        },
        initCropper(){
            /*if(this.dialogStatus = 'editor'){
                this.option.img  = "https://fengyuanchen.github.io/cropper/images/picture.jpg";
            }*/
        },
        closeCropper(){
            this.dialogCropperFormVisible = false;
        },
        //放大/缩小
        changeScale(num) {
            console.log('changeScale')
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        //坐旋转
        rotateLeft() {
            console.log('rotateLeft')
            this.$refs.cropper.rotateLeft();
        },
        //右旋转
        rotateRight() {
            console.log('rotateRight')
            this.$refs.cropper.rotateRight();
        },
        //上传图片（点击上传按钮）
        finish(type) {
            this.addHumanTemp.imageUrlFlag = true
            console.log('finish')
            let _this = this;
            let formData = new FormData();
            // 输出
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    let img = window.URL.createObjectURL(data);
                    // this.model = true;
                    this.modelSrc = img;
                    formData.append("file", data, this.fileName);
                    /*this.$http.post(Api.uploadSysHeadImg.url, formData, {contentType: false, processData: false, headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
                        .then((response)=>{
                            var res = response.data;
                            if(res.success == 1){
                                $('#btn1').val('');
                                _this.imgFile = '';
                                _this.headImg = res.realPathList[0];  //完整路径
                                _this.uploadImgRelaPath = res.relaPathList[0];  //非完整路径
                                _this.$message({　　//element-ui的消息Message消息提示组件
                                    type: 'success',
                                    message: '上传成功'
                                });
                            }
                        })*/
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    // this.model = true;
                    // this.modelSrc = data;
                    this.addHumanTemp.baseStr = data;
                    this.imageUrl = data;
                    this.addHumanTemp.imageUrl = data;
                    this.dialogCropperFormVisible = false;
                })
            }
        },
        // 实时预览函数
        realTime(data) {
            console.log('realTime')
            this.previews = data
        },
        //下载图片
        down(type) {
            console.log('down')
            var aLink = document.createElement('a')
            aLink.download = 'author-img'
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    this.downImg = window.URL.createObjectURL(data)
                    aLink.href = window.URL.createObjectURL(data)
                    aLink.click()
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    this.downImg = data;
                    aLink.href = data;
                    aLink.click()
                })
            }
        },
        //选择本地图片
        uploadImg(e, num) {
            console.log('uploadImg');
            var _this = this;
            //上传图片
            var file = e.target.files[0]
            _this.fileName = file.name;
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                return false
            }
            var reader = new FileReader();
            reader.onload =(e) => {
                let data;
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                }
                else {
                    data = e.target.result
                }
                if (num === 1) {
                    _this.option.img = data
                } else if (num === 2) {
                    _this.example2.img = data
                }
            }
            // 转化为base64
            reader.readAsDataURL(file)
            // 转化为blob
            // reader.readAsArrayBuffer(file);

        },
        imgLoad (msg) {
            // console.log(this.option.img+"1111");
            console.log(msg)
        },
        createNewHuman() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    console.log(this.addHumanTemp);
                    CreateNewHuman(this.addHumanTemp)
                        .then((response) => {
                            console.log(response);
                            if (response.code != 1) {
                                Message({
                                    message: '创建成功',
                                    type: 'success',
                                    customClass: 'msg-success',
                                    iconClass: 'ic'
                                })
                                this.newHumanVisible = false;
                                this.getHuman(this.humanPageParam);
                            }else{
                                Message({
                                    message:response.msg,
                                    type: 'error',
                                    customClass: 'msg-error',
                                    iconClass: 'sc'
                                })
                                this.newHumanVisible = true;
                            }


                        })
                } else {
                    return false;
                }
            })
            ;
        },
        onEdit(row){
            this.temp = $.extend(tempInit(), row);
            this.blackListEdit = true;
        },
        closeDetailForm(){
            this.blackListEdit = false;
        },
        cancelEdit(){
            this.blackListEdit = false;
        },
        update(formName){
            this.$refs[formName].validate((valid) => {
                if (valid){
                    Editor(this.temp)
                        .then(() => {
                            this.blackListEdit = false;
                            this.getList(this.pageParam);
                            this.temp = tempInit()
                        })
                    ;
                }
            })
        }
    }
}

function tempInit() {
    return {
        humanId: '',
        tenantId: '',
        blackList:[],
        blackListRemark:''
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
        tenantId: '',
    }
}

function humanPageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        realName:'',
        mobilePhone:''
    }
}

function optionInit() {
    return {
        img: '',
        outputSize:1, //剪切后的图片质量（0.1-1）
        full: false,//输出原图比例截图 props名full
        outputType: 'jpeg',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 238,
        autoCropHeight: 238,
        fixedBox: true
    }
}