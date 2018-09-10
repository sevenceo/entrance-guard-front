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
 * 作   者：胡跃峥
 * 创建日期：2018-4-8
 * </pre>
 */
import {
    GetList,
    GetResourceOrgList,
    AddVistorRecord,
    EditorVisitorRecord,
    GetFacePhotoByPhone
} from "./api/visitorRecordApi";
import store from '../../store';
import {Editor, GetIdentityList, GetResourceTree, UpdateFeature} from "../Human/api/HumanApi";
import EXIF from "../../utils/exif";
import moment from "moment/moment";
import {GetAllModule, SearchTree} from "../module-manage/api/moduleManageApi";
import VueCropper from 'vue-cropper';

export default {
    watch: {
        filterText(val) {
            this.$refs.tenantTree.filter(val);
        }
    },
    created() {
        this.getList(this.pageParam);
    },
    components: {
        VueCropper
    },
    data() {
        return {
            tableData: [],
            rowTotal: 0,
            dialogStatus: 'create',
            dialogStateDetail: false,
            dialogFormVisible: false,
            dialogCropperFormVisible: false,
            searchFormVisible: false,
            pageParam: pageParamInit(),
            temp: tempInit(),
            resourceOrgList: [],
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            actionWhileAdd: '/dealer/human/uploadImgWhileAddHuman',
            upLoadData: {
                id: '',
                baseStr: ''
            },
            files: [],
            imageUrl: '',
            rules: {
                visitorName:
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
                auditorPhone:
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
                resourceId:
                    [
                        {required: true, message: '请选择资源', trigger: 'blur'}
                    ],
                beginTime:
                    [
                        {required: true, message: '请选择开始时间'}
                    ],
                endTime:
                    [
                        {required: true, message: '请选择结束时间'}
                    ],
                imageUrl:
                    [{required: true, message: '请上传人员照片'}],
            },
            parentTree: false,
            props: {
                children: 'children',
                id: 'id',
                label: 'label',
                // isLeaf: 'isLeaf'
            },
            filterText: '',
            treeData: [],

            //----裁剪区域参数----
            headImg: '',
            //剪切图片上传
            crap: false,
            previews: {},
            option: optionInit(),
            fileName: '',  //本机文件地址
            downImg: '#',
            imgFile: '',
            uploadImgRelaPath: '', //上传后的图片的地址（不带服务器域名）
        }
    },
    methods: {
        //显示人员
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableData = response.data.rows;
                    }
                })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam);
        },
        onSearch() {
            this.searchFormVisible = true;
        },
        search() {
            this.getList(this.pageParam);
            this.$refs.pages.changePage(1);
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit();
        },
        /*关闭弹框*/
        closeDetailForm() {
            this.dialogStateDetail = false;
            this.getList(this.pageParam);
        },
        formatSex(row, column) {
            let sex = row[column.property];
            if (sex == 1) {
                return "男";
            } else if (sex == 2) {
                return "女";
            }
        },
        formatApproval(row, column) {
            let approval = row[column.property];
            if (approval == 0) {
                return "未审核";
            } else if (approval == 1) {
                return "成功";
            } else if (approval == 2) {
                return "拒绝";
            } else if (approval == 3) {
                return "待提交";
            }
        },
        formatType(row, column) {
            let type = row[column.property];
            if (type == 0) {
                return "访客申请";
            } else if (type == 1) {
                return "业主邀请";
            } else {
                return "平台新增";
            }
        },
        showParentTree() {
            this.parentTree = true;
            this.loadTreeNode();
        },
        //添加界面的树
        loadTreeNode() {
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });
        },
        nodeClick(data, node, object) {
            // this.selectedCommunity = data;
            this.temp.resourceId = data.id;
            this.temp.resourceName = data.label;
            this.parentTree = false;
        },
        filterTenantNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        onAdd() {
            this.temp = tempInit();
            this.imageUrl = "";
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            if (this.$refs.cropper) {
                this.$refs.cropper.refresh();
                $(".cropper-box-canvas").css("display", "none");
                this.previews.url = null;
            }
        },
        showCropperDialog() {
            this.dialogCropperFormVisible = true;
        },
        create(formName) {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.temp.visitorPhotoURL = '';
                    var start = new Date(this.temp.beginTime);
                    var end = new Date(this.temp.endTime);
                    if (start >= end) {
                        this.$message({
                            message: "结束时间必须大于开始时间",
                            type: 'error'
                        })
                        return
                    } else if (this.temp.resourceId == '') {
                        this.$message({
                            message: "请选择资源",
                            type: 'error'
                        })
                        return
                    }
                    this.temp.beginTime = moment(this.temp.beginTime).format("YYYY-MM-DD HH:mm:ss");
                    this.temp.endTime = moment(this.temp.endTime).format("YYYY-MM-DD HH:mm:ss");
                    AddVistorRecord(this.temp).then((result) => {
                        if (result.data.code == 0) {
                            this.dialogFormVisible = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.getList(this.pageParam);
                        } else {
                            this.$message({
                                message: result.data.msg,
                                type: 'error'
                            })
                            return false;
                        }
                    })
                }
            });
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);
            this.temp.resourceId = this.temp.resourceId + "";
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            this.imageUrl = this.temp.visitorPhoto;
            this.temp.imageUrl = this.temp.visitorPhoto;
            this.onEditShowCropperImg(this.imageUrl);
        },
        onEditShowCropperImg(url) {
            // let url = "https://o90cnn3g2.qnssl.com/0C3ABE8D05322EAC3120DDB11F9D1F72.png";
            var image = new Image();
            var _this = this;
            image.src = url;
            image.crossOrigin = 'Anonymous';
            image.onload = function () {
                let file = _this.dataURLtoFile(_this.getBase64Image(image), "aaa.png");
                _this.fileName = file.name;
                var reader = new FileReader();
                reader.onload = (e) => {
                    let data;
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    }
                    else {
                        data = e.target.result
                    }
                    _this.option.img = data
                }
                // 转化为base64
                reader.readAsDataURL(file)
                // 转化为blob
                // reader.readAsArrayBuffer(file);

                /*$(".cropper-box-canvas").css("display","block");
                $(".cropper-box-canvas").find("img").attr("src", that.getBase64Image(image));
                that.$refs.cropper.showPreview();*/
                // that.$refs.cropper.imgs(that.getBase64Image(image));
            }
        },
        dataURLtoFile(dataurl, filename) {//将base64转换为文件
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        },
        getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            return dataURL;
        },
        initCropper() {
            /*if(this.dialogStatus = 'editor'){
                this.option.img  = "https://fengyuanchen.github.io/cropper/images/picture.jpg";
            }*/
        },
        update(formName) {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var start = new Date(this.temp.beginTime);
                    var end = new Date(this.temp.endTime);
                    if (start > end) {
                        this.$message({
                            message: "开始时间不能大于结束时间",
                            type: 'error'
                        })
                        return
                    } else if (this.temp.resourceId == '') {
                        this.$message({
                            message: "请选择资源",
                            type: 'error'
                        })
                        return
                    }
                    this.temp.beginTime = moment(this.temp.beginTime).format("YYYY-MM-DD HH:mm:ss");
                    this.temp.endTime = moment(this.temp.endTime).format("YYYY-MM-DD HH:mm:ss");
                    EditorVisitorRecord(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.getList(this.pageParam);
                            this.temp = tempInit();
                        })
                    ;
                }
            });

        },
        closeAdd() {
            this.dialogFormVisible = false;
        },
        closeCropper() {
            this.dialogCropperFormVisible = false;
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload(file) {
            let extension2 = file.name.split('.')[1].toLowerCase() === 'jpg';
            let extension3 = file.name.split('.')[1].toLowerCase() === 'png';
            let extension4 = file.name.split('.')[1].toLowerCase() === 'jpeg';
            if (!extension2 && !extension3 && !extension4) {
                this.$message({
                    message: "上传的图片只能是 jpg、png、jpeg 格式!",
                    type: 'error'
                })
            }

            return extension2 || extension3 || extension4;
        },
        changeFeature(file, fileList) {

            // this.img_loading = true;
            let self = this;
            let imgContent = {};
            imgContent.name = file.name;

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
                        self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.upLoadData.baseStr = self.base64;
                        self.imageUrl = self.base64;
                        self.temp.imageUrl = self.base64;
                        self.temp.visitorPhoto = self.base64;

                        // 手动上传
                        // UpdateFeature(self.upLoadData);
                        // setTimeout(function () {
                        //     self.dialogImg = false;
                        // }, 3000);
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        handleUploadSuccess(result) {
            console.log(result);
            if (result != 'fail') {
                this.temp.visitorPhoto = result;
                this.upLoadData = [];
            } else {
                this.$message({
                    message: "上传失败！",
                    type: 'error'
                })
            }

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
                    this.temp.visitorPhoto = data;
                    this.imageUrl = data;
                    this.temp.imageUrl = data;
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
            reader.onload = (e) => {
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
        imgLoad(msg) {
            // console.log(this.option.img+"1111");
            console.log(msg)
        },
        getFacePhotoByPhone(){
            GetFacePhotoByPhone(this.temp.mobilePhone).then((resp)=>{
                if (resp.data != null && resp.data != ''){
                    this.imageUrl = resp.data;
                    this.temp.imageUrl = resp.data;
                    this.temp.visitorPhotoURL = resp.data;
                }
            })
        }
    },
}

function tempInit() {
    return {
        visitorName: '',
        mobilePhone: '',
        auditorPhone: '',
        resourceId: '',
        resourceName: '',
        beginTime: '',
        endTime: '',
        visitorPhoto: '',
        sex: '1',
        identityCard: '',
        email: '',
        visitorPhotoURL:''
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        visitorName: '',
        mobilePhone: '',
        isApproval: '',
        isFilter: '1'
    }
}

function optionInit() {
    return {
        img: '',
        outputSize: 1, //剪切后的图片质量（0.1-1）
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
