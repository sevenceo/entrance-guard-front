import {GetList,audit,Reject,GetResourceTree,GetResourceTypeByResourceId,GetResourceName} from "../humanAudit/api/humanAuditApi";
import {GetResourceCode, HumanResourceDelete} from "../Human/api/HumanApi";
import {
    Create, GetCurrentListType, GetLeafTree, GetListSelective, GetRootTree,
    TreeSearchFunction
} from "../Resource/api/ResourceApi";
import EXIF from "../../utils/exif";

export default {
    created() {
        this.getList(this.pageParam);
        this.getResourceTree();
    },
    data() {
        return {
            tableData: [],
            tableDataAdd: [],
            tableDataSence: [],
            tableDataAddSence: [],
            tableDataDetail: [],
            treeData: [],
            selectedCommunity:{},
            selectedRow:{},
            rowTotal: 10,
            auditFlags: {
                "1": '通过',
                "0": "待审核",
                "2": "驳回",
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            addFormVisible: false,
            picVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            rejectVisible: false,
            resourceType: resourceType(),
            temp: tempInit(),
            addTemp: addTempInit(),
            files: [],
            pageParam: pageParamInit(),
            rules: {

                remark:
                    [{required: true, message: '驳回理由', trigger: 'blur'}]
            },
            addRules: {


                name:
                    [

                        {required: true, max: 128, message: '资源名称不得超过128个字符'}],
                code:
                    [

                        {required: true, max: 128, message: '资源编码不得超过128个字符'}],
                resourceTypeId:
                    [
                        {required: true, message: '请输入资源类型id', trigger: 'blur'},
                    ],
                city:
                    [{required: true, message: '请输入城市', trigger: 'blur'}],
                telephone:
                    [{required: true, message: '请输入社区电话', trigger: 'blur'}],
                address:
                    [{
                        required: true, message: '请输入社区地址', trigger: 'blur'
                    }]


            },
            formVisible: false,
            resourceVisible: false,
            errorTip: "",
            errorLine: 5,
            statusInfo: [{
                value: 1,
                label: '通过'
            }, {
                value: 2,
                label: '驳回'
            }, {
                value: 0,
                label: '待审核'
            }],
            props: {
                children: 'children',
                id: 'id',
                label: 'label',
                // isLeaf: 'isLeaf'
            },
            optionsType: [],
            options: [],
            imageUrlFlag: false,
            imageUrl: '',
            action: "",
            upLoadData: {
                id: '',
                baseStr: ''
            },
            imageDetail:'',
            dialogResourceName: '',
            treeSearch: '',
            treeSearchFlag: false,
            props1: {
                label: 'label',
                id: 'id',
                isLeaf: 'leaf',
                children: 'children',
            },
            rootTreeData: []
        }

    },
    components: {
        //etc...
    },
    methods: {
        treeSearchClick() {
            let param={
                'name':this.treeSearch,
                'enabledFlag':1
            }
            console.log(this.treeSearch);
            TreeSearchFunction(param).then((response) => {
                if (response.code == 1) {
                    this.initTree();
                    this.treeSearchFlag = false;

                }
                if (response.code == 0) {
                    this.treeSearchFlag = true;
                    setTimeout(() => {
                        this.treeData = response.data;
                    }, 100);

                    // this.initTree();


                }
            })
        },
        loadNode1(node, resolve) {
            this.node = node;
            this.resolve = resolve;

            if (node.level === 0) {
                // GetRootTree().then((response) => {
                //     return resolve(response.data);
                // });


            }
            if (node.level >= 1) {
                let param = {'parentId':node.data.id,'enabledFlag':1}
                this.getLeafTree(param, resolve);
            }
            ;


        },
        initTree() {
            this.treeSearch = null;
            this.treeSearchFlag = false;
            GetRootTree({"enabledFlag":1}).then((response) => {
                this.rootTreeData = response.data;
            });
        },

        getLeafTree(param, resolve) {
            GetLeafTree(param).then((response) => {
                resolve(response.data);
            })
        },
        //显示人员
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
        getResourceTree(){
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });

        },
        nodeClick(data, node, object){
            this.selectedCommunity = data;
            console.log(data);
            this.treeSearch = data.label;
        },
        auditSave(){
            let community = this.selectedCommunity;
            let selectedRow = this.selectedRow;
            if(selectedRow.room==null){
                if(community.id == null || community.id == undefined){
                    this.$message({
                        message: "请选择社区资源",
                        type: 'error'
                    })
                    return;
                }
            }else{
                community.id = selectedRow.roomId;
                console.log(selectedRow);
            }
            // if(community.children!=null && community.children.length > 0){
            //     this.$message({
            //         message: "只能选择最底层资源",
            //         type: 'error'
            //     })
            //     return;
            // }
            GetResourceTypeByResourceId(community.id).then((response) =>{
                if(response.data.code == 'QY'){
                    this.ConfirmBox('确认通过')
                        .then(() => {
                            audit(selectedRow.id,community.id).then((response) => {
                                this.$message({
                                    message: "审核成功",
                                    type: 'success'
                                })
                                this.resourceVisible = false;
                                this.getList(this.pageParam);
                            })
                        })
                }else{
                    if(selectedRow.room!=null){
                        this.ConfirmBox('确认通过')
                            .then(() => {
                                audit(selectedRow.id,community.id).then((response) => {
                                    this.$message({
                                        message: "审核成功",
                                        type: 'success'
                                    })
                                    this.resourceVisible = false;
                                    this.getList(this.pageParam);
                                })
                            })
                    }else{
                        if(community.lvl != 3){
                            this.$message({
                                message: "只能选择户级资源",
                                type: 'error'
                            })
                            return;
                        }
                        this.ConfirmBox('确认通过')
                            .then(() => {
                                audit(selectedRow.id,community.id).then((response) => {
                                    this.$message({
                                        message: "审核成功",
                                        type: 'success'
                                    })
                                    this.resourceVisible = false;
                                    this.getList(this.pageParam);
                                })
                            })
                    }
                }
            })
        },
        closeAudit(){
            this.getResourceTree();
            this.rootTreeData = [];
            this.selectedCommunity = {};
            this.resourceVisible = false;
        },
        getListTypeInfo() {
            var storage=window.localStorage;
            // this.resourceType.sysId = storage.getItem("sysId");
            GetCurrentListType(this.resourceType).then(response=>{
                this.optionsType = response.data;
            })
        },

        addResource(){
            this.addFormVisible = true;
            this.getListTypeInfo();
            this.getResourceCode();
        },
        //获取资源编码
        getResourceCode() {
            GetResourceCode()
                .then((response) => {
                    this.addTemp.code = response.data;
                })
        },
        handleCancel(){
            this.addFormVisible = false;
            this.addTemp = addTempInit();
        },
        resetForm() {
            this.$refs['form'].resetFields();
            this.addTemp = addTempInit();

        },
        changeValue() {
            /*alert(this.temp.resourceTypeId);*/
            var storage=window.localStorage;
            // this.resourceType.sysId = storage.getItem("sysId");
            this.resourceType.resourceTypeId = this.addTemp.resourceTypeId
            GetListSelective(this.resourceType).then((response) => {
                this.options = response.data;
            })
        },
        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    var storage=window.localStorage;
                    // this.temp.sysId = storage.getItem("sysId");
                    this.addTemp.baseStr = this.upLoadData.baseStr;
                    Create(this.addTemp)
                        .then(() => {
                            this.addFormVisible = false;
                            this.getResourceTree();
                        })
                } else {
                    return false;
                }
            })
            ;

        },
        handleSelectionChange(selection) {
            this.selectionData = selection
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
        detail(row){
            this.temp = $.extend(tempInit(), row);
            this.temp.resourceDetail = this.temp.building + " - " +this.temp.unit+ " - " + this.temp.room;

            this.dialogFormVisible = true;
            //查询人员关联的资源
            GetResourceName(row.resourceId).then(response=>{
                /*console.log(response);*/
                this.dialogResourceName = response.data;
            })
        },
        closeDetailForm(){
            this.dialogFormVisible = false;
        },
        /*picDetail(src){
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
        },*/
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
        closeViewPicture() {
            this.picVisible = false;
        },
        closePic(){
            this.picVisible = false;
        },
        audit(row){
            this.initTree();
            this.temp = $.extend(tempInit(), row);
            this.temp.resourceDetail = this.temp.building + " - " +this.temp.unit+ " - " + this.temp.room;
            this.getResourceTree();
            this.selectedRow = row;
            this.resourceVisible = true;
        },
        reject(row){
            this.temp = $.extend(tempInit(), row);
            this.temp.resourceDetail = this.temp.building + " - " +this.temp.unit+ " - " + this.temp.room;
            this.pageParam.id = row.id;
            this.rejectVisible = true;
        },
        rejectSave(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    Reject(this.pageParam).then(()=>{
                        this.$message({
                            message: "已驳回！",
                            type: 'success'
                        })
                        this.getList(this.pageParam);
                        this.rejectVisible = false;
                    })
                }else{
                    return false;
                }
            })
            ;

        },
        closeReject(){
            this.$refs['form'].resetFields();
            this.rejectVisible = false;
        },
    changeFeature(file, fileList) {
            this.addTemp.imageUrlFlag = true;
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
        status:'',
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        email: '',
        remark: '',
        idPhoto:'',
        propertyPhoto:'',
        building:'',
        unit:'',
        room:'',
        resourceDetail:'',
        roomId:''
    }
}

function addTempInit() {
    return {
        resourceTypeId: '',
        name: '',
        code: '',
        parentId: '',
        remark: '',
        city: '',
        fullPinYin: '',
        longitude: '',
        latitude: '',
        telephone: '',
        address: '',
        upLoadData: {
            id: '',
            base64: ''
        },
        communityPhoto: '',
        imageUrl: '',
        imageUrlFlag: false,
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        facePhoto: '',
        realName: '',
        gender: '',
        age: '',
        mobilePhone: '',
        phone: '',
        email: '',
        remark: '',
        status: '',
    }
}

function resourceType() {
    return {
        sysId: ''
    }
}