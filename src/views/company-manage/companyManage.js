import moment from 'moment'
import permission from 'store/permission'
import {parseTime} from 'utils'
import {isWscnEmail, ValidateEmail, ValidatePass} from 'utils/validate';
import {GetRolesList} from 'api/roles'
import {GetList, Create, Editor, Delete} from "./api/companyManageApi";
import {Message} from 'element-ui';
import EXIF from "../../utils/exif";

//每页显示的记录数

let selectionData = []

export default {
    created() {
        this.getList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            // rolesStr:'',

            rules: {
                corpCode: [
                    {required: true, message: '请输入企业编码', trigger: 'blur'},
                    {max: 20, message: '企业编码不得超过20个字符'}
                ],
                corpName: [
                    {required: true, message: '请输入企业名称', trigger: 'blur'},
                    {max: 20, message: '企业名称不得超过20个字符'}
                ]
            },
            pageParam: pageParamInit(),
            formVisible: false,
            actionWhileAdd:'/api/auth/saas-corporation/uploadImg',
            errorTip: "",
            errorLine: 5,
            upLoadData: {
                baseStr: ''
            },
            imageUrl1:'',
            picVisible:false,
            imageDetail:'',
        }
    },
    // components: {
    //     trRoles
    // },
    methods: {
        hasAuthority: permission.hasAuthority,

        //  显示用户信息
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    this.rowTotal = response.data.rowTotal;
                    this.tableData = response.data.rows;


                })
        },
        //翻页功能
        handleCurrentChange1(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd() {
            this.temp = tempInit();
            this.imageUrl1 = '';
            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);
            this.imageUrl1 = this.temp.logo;
            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        onSearch: function () {
            this.searchFormVisible = true;
            console.log(this)
        },
        search: function () {
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },

        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    // delete this.temp("roleStr")
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                        })
                } else {
                    return false;
                }
            });

        },
        update(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // delete this.temp("roleStr")
                    if (this.temp.enable) {
                        this.temp.enable = 'true'
                    } else {
                        this.temp.enable = 'false'
                    }
                    Editor(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.temp = tempInit()
                        });
                } else {
                    return false;
                }
            });

        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id)
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
        handleUploadCompanylogoSuccess(result){
            this.temp.logo = result;
        },
        beforeAvatarUpload(file) {
            return true;
        },
        changeFeature1(file, fileList) {
            // this.img_loading = true;
            let suffix = file.name.toLowerCase().split('.')[1];
            if(suffix == 'jpg'){
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
                        self.base64 = canvas.toDataURL('image/'+ suffix, maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;
                        self.temp.logoBaseStr = self.base64;
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

    }
}

function tempInit() {
    return {
        "corpCode": "",
        "corpName": "",
        "domainName": "",
        "logo": "",
        "copyright": "",
        "logoBaseStr": "",
        "suffix": ""
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        corpCode: '',
        corpName: '',
    }
}