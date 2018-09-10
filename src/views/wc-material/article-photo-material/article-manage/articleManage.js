/**
 * Created by Micheal Xiao on 2017/10/9.
 */
import 'static/UE/ueditor.config.js'
import 'static/UE/ueditor.all.js'
import 'static/UE/lang/zh-cn/zh-cn.js'
import 'static/UE/ueditor.parse.min.js'
import {mapState} from 'vuex'
import editiongContent from '../components/editingContent.vue'
import selectGallery from '../components/selectGallery.vue'
import uploadComp from '../components/uploadImg.vue'
import Editor from '../components/wangEditor.js'
import {
    GetArticlePhotoById,
    CreateArticlePhotoList,
    GetImageList,
    GetImageById,
    UpdateArticlePhoto
} from "src/views/wc-material/my-material/api/myMaterialApi";
import {GetTpls,GetImagePaths} from "../api/articlePhotoApi";
// import editiongContent from '../components/editingContent.js'
import Vue from 'vue'
import VueVisible from 'vue-visible';
import { validateURL } from "utils/validate"
let UEditor = {};

Vue.use(VueVisible);
const retainArea = ['#edui_fixedlayer', '.el-select-dropdown', '.el-dropdown-menu', '.el-color-dropdown', 'dock-dropdown']
const baseStyle = ['bold', 'italic', 'underline', 'strikethrough', 'justify']
const computedStyles = ['font-size', 'color', 'font-weight', 'font-family', 'text-align']
let startBtnId = 20;

import tplDeal from "./components/templateDeal.vue"
// import UEditor from '../../../../components/ue/ue.vue';
export default {
    components: {editiongContent, uploadComp, selectGallery, tplDeal},
    data() {
        return {
            tpls: [],
            imgpaths:[],
            rules: {
                name: [
                    {required: true, message: '请输入活动名称', trigger: 'blur'},
                    {min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur'}
                ]
            },
            srcRules:[
                {validator: validateURL,trigger: 'blur'}
                ],
            items: [],
            focusBox: boxInit(),
            focusEle: focusEleInit(),
            cellType: '',
            photoDialogShow: false,
            selectImg: {
                src: ''
            },
            dialogStatus: 'cover',
            totalPage: 10,
            editor: {},
            templateSectionList: '',
            templateSection: templateSectionInit(),
            newsId: this.$router.currentRoute.params.id,
            account: this.$store.state.weChatAccount.accountInfo.account,
            picUrl: '',
            baseUrl: process.env.MATERIAL_API,
            temp: tempInit(),
            selectedSectionData: [],
            selectedTemplateIndex: 0,
            coverPhotoDialogShow: false,
            imageListData: '',
            pageParam: {
                page: 1,
                size: 6,
                account: this.$store.state.weChatAccount.accountInfo.account
            },
            selectedRadio: '',
            textMap: {
                cover: '选择封面图片素材',
                image: '选择图片素材'
            },
            classImg: 'img',
            classTitle: 'title',
            // isEdit:true,
            isEdit: false,
            editClass: '',
            //full-text 数据
            fontSize: {
                value: '',
                options: initFontSize(),
            },
            border: {
                show: false,
                style: 'none',
                width: '0',
                color: '',
                options: initBorderOpt(),
            },
            justify: "left",
            imageWidth: 80,
            opDockTop: 0,
            pickColor: '',
            backColor: '',
            bgEle: {element: {}, color: "", show: false,},
            tags: {
                list: [
                    {name: "全部", tag: "all"},
                    {name: "文字", tag: "text"},
                    {name: "单图", tag: "single-image"},
                    {name: "多图", tag: "multi-image"},
                    {name: "视频", tag: "video"},
                    {name: "标题", tag: "title"},
                    {name: "分割线", tag: "line"},
                    {name: "组合", tag: "set"},
                    {name: "图标", tag: "stickers"},
                ],
                active: "all",

            },
            videoCode: '',
        }
    },
    created() {
        this.getArticlePhotoById(this.newsId, this.account)
        // this.getTpls()
        this.getImagePaths();
    },
    methods: {
        getImagePaths() {
            GetImagePaths()
                .then((response) => {
                    this.imgpaths = []
                    this.imgpaths = response.data;
                    this.getTpls()
                })
        },
        getTpls(tag) {
            GetTpls(tag)
                .then((response) => {
                    this.tpls = []
                    this.tpls = response.data;
                    for(let index in this.tpls){
                        for(let i in this.imgpaths){
                            if(this.tpls[index].content.indexOf(this.imgpaths[i].name) != -1){
                                if(this.imgpaths[i].name=="IMG006"){
                                    this.tpls[index].content = this.tpls[index].content.replace(new RegExp('"'+this.imgpaths[i].name+'"',"gm"),this.imgpaths[i].serverUrl);
                                } else {
                                    this.tpls[index].content = this.tpls[index].content.replace(this.imgpaths[i].name,this.imgpaths[i].serverUrl);
                                }

                            }
                        }
                    }
                })
        },
        handleMaterialClick(event) {
            let curTarget = event.currentTarget
            let material = $(curTarget).find(".js-tpl").html()
            console.log(material)
            if (this.focusEle.onFocus) {
                this.items.splice(this.focusEle.index + 1, 0, {html: material})
            } else {
                this.items.push({html: material})
            }
            // console.log(material)
        },
        goBacktoMaterial() {
            this.$router.push({path: '/sys-material/my-material/myMaterialNews'});
        },
        handleMaterialSelect(material) {
            // console.log(material)
            if (this.focusEle.onFocus) {
                this.items.splice(this.focusEle.index + 1, 0, {html: material})
            } else {
                this.items.push({html: material})
            }
        },
        handleTplFocus(focusEle) {
            this.upFocEleToItems()
            // this.updateContentToItems()
            console.log("当前被选中对象")
            console.log(focusEle)
            console.log($(focusEle.element).html())

            this.focusEle = $.extend(focusEleInit(), focusEle)
            this.focusEle.onFocus = true
            this.syncFoucsBox()

            if (this.showFullText) {
                let self = this

                let compStyle = window.getComputedStyle(focusEle.element)
                // console.log("compStyle")
                // console.log(compStyle.getPropertyValue("line-height"))
                let textarea = document.getElementById('textEditor').childNodes[0].contentWindow.document.body
                for (let styleName of computedStyles) {
                    // console.log(styleName + ": " + compStyle.getPropertyValue(styleName))
                    UE.dom.domUtils.setStyle(textarea, styleName, compStyle.getPropertyValue(styleName))
                }
                //  对line-height的特殊处理
                let lineH = parseFloat(compStyle.getPropertyValue("line-height")) / parseFloat(compStyle.getPropertyValue("font-size"))
                UE.dom.domUtils.setStyle(textarea, "line-height", lineH)

                UEditor.setContent($(focusEle.element).html())
                $(focusEle.element).addClass("vhidden")

                function judgeArea(e) {
                    let slectArr = ['#textEditor', '.op-dock',].concat(retainArea)
                    let bool = slectArr.findIndex((selectStr) => {
                        return $(selectStr).is(e.target) || $(selectStr).has(e.target).length > 0
                    })
                    if (bool === -1) {
                        console.log("退出文字编辑")
                        $(self.focusEle.element).removeClass("vhidden")
                        $(self.focusEle.element).html(UEditor.getContent())
                        document.removeEventListener('click', judgeArea, true);
                    }
                }

                document.addEventListener('click', judgeArea, true);

            }
            if (this.showImage) {
                this.imageWidth = parseInt($(focusEle.element).parent()[0].style.width.toString())
                this.syncborder()
            }

            let bgArr = $(focusEle.element).parents("[cell-type='bg']")
            if (bgArr.length > 0) {
                this.bgEle.element = bgArr[0]
                this.bgEle.show = true
                this.bgEle.color = this.bgEle.element.style.backgroundColor
            } else {
                this.bgEle.show = false
            }
        },
        clearFocus() {
            console.log("clear focus")
            this.focusBox = boxInit()
            this.updateContentToItems()
            this.focusEle = focusEleInit()
            this.clearEditingStyle()
        },
        clearEditingStyle() {
            this.border = $.extend(this.border, {
                show: false,
                style: 'none',
                width: '0',
                color: '',
            })
        },
        getContent() {
            console.log(this.temp);
            // let tempContent = ''
            // let content = this.items.map(function (v) {
            //     tempContent = tempContent + v.html
            // })
            // console.log(tempContent)
        },
        upFocEleToItems() {
            if (this.focusEle.onFocus === true) {
                this.focusEle.ref.changeText()
            }
        },
        updateContentToItems() {
            this.upFocEleToItems()
            let tempContent = ''
            let content = this.items.map(function (v) {
                tempContent = tempContent + v.html
            })
            this.temp.newsItemList[this.selectedTemplateIndex].content = tempContent
        },
        updateTempToContent() {
            let content = this.temp.newsItemList[this.selectedTemplateIndex].content
            let el = document.createElement("div");
            el.innerHTML = content
            this.items = []
            for (let v of el.children) {
                this.items.push({html: v.outerHTML})
            }
        },
        handleDelete() {
            this.items.splice(this.focusEle.index, 1)
            this.clearFocus()
            this.focusEle = focusEleInit()
            // this.$store.commit("CLEAR_FOCUSELE")
        },
        handleChangeImg() {

        },
        handleSelectImg(imgSrc) {
            this.selectImg.src = imgSrc
        },
        handleSelectedImg() {
            if (this.dialogStatus === 'image') {
                this.photoDialogShow = false
                console.log(this.selectImg.src)
                console.log(this.focusEle.element)
                this.focusEle.element.src = this.selectImg.src
            } else {
                console.log(this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl)
                this.photoDialogShow = false

            }

        },
        handleVideoCodeChange(videoCode) {
            if(videoCode.length === 0){
                // console.log("没有输入代码")
            }else{
                let patt = /src\=\"([^\"]+)\"/g;
                let str = ''
                videoCode.replace(patt,function($0, $1){
                    str = $1
                });
                if(!videoCode.match('iframe')){
                    this.$message({
                        message: "输入代码不是通用代码",
                        type: "error"
                    })
                    return
                }
                // console.log(str)
                console.log(this.focusEle.element.children[0])
                if(this.focusEle.element.children[0]){
                    this.focusEle.element.children[0].src = str
                }else{
                    this.focusEle.element.innerHTML = `<iframe marginheight="0"
                                                                frameborder="0"
                                                                allowfullscreen
                                                                scrolling="no"
                                                                style="max-height: 100%; border: none; overflow: hidden; max-width: 100%;"
                                                                src="${str}">
                    </iframe>`
                }
            }
        },
        addSection() {
            if ($('.template-child').length >= 8) {
                this.ConfirmBox("最多添加8条素材！")
                    .then(() => {
                        return false
                    })
            } else {
                let data = {}
                $.extend(data, this.templateSection)
                this.temp.newsItemList.push(data)
            }
            console.log('temp')
            console.log(this.temp)
        },
        clearTextEditor() {

        },
        deleteTemplateSection(index, event) {
            if (this.temp.newsItemList.length > 1) {
                if (this.selectedTemplateIndex == 0) {
                    this.selectedTemplateIndex = this.selectedTemplateIndex + 1
                    this.temp.newsItemList.splice(index, 1)
                } else {
                    this.selectedTemplateIndex = this.selectedTemplateIndex - 1
                    this.temp.newsItemList.splice(index, 1)
                }
            } else {
                this.$message(
                    {
                        message: "至少保留一条数据",
                        type:'error'
                    }
                )
            }
            event.stopPropagation()
            this.updateTempToContent()

        },
        getArticlePhotoById(id, account) {
            if (id) {
                GetArticlePhotoById(id, account)
                    .then(response => {
                        // console.log('res')
                        // console.log(this.temp)
                        this.temp = response.data
                        this.updateTempToContent()
                    })
            }
        },
        handleSectionSelected(index) {
            let vaildate = true;
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                } else {
                    vaildate = false
                    this.$message(
                        {
                            message: "请完成必填项",
                            type:'error'
                        }
                    )
                }
            });
            if (vaildate) {
                this.selectedTemplateIndex = index
                this.updateTempToContent()
            }


        },
        avatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message(
                    {
                        message: "上传头像图片大小不能超过 2MB!",
                        type:'error'
                    }
                )
            }
        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl = file.response
            console.log(this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl)
            console.log(this.temp)
            // this.temp.serverUrl = file.response
            // this.picUrl = this.serverUrl
        },
        handleUploadSuccess(res) {
            console.log(res)
            if (this.dialogStatus === 'image') {
                this.selectImg.src = process.env.MATERIAL_API + res;
            } else {
                this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl = res
            }
            this.temp.newsItemList[this.selectedTemplateIndex].thumbMediaId = ''
            this.temp.newsItemList[this.selectedTemplateIndex].thumbUrl = ''
        },
        handleGallerySelect(img) {
            console.log('img')
            console.log(img)

            this.temp.newsItemList[this.selectedTemplateIndex].thumbMediaId = img.mediaId
            this.temp.newsItemList[this.selectedTemplateIndex].thumbUrl = img.remoteUrl

            if (this.dialogStatus === 'image') {
                this.selectImg.src = process.env.MATERIAL_API + img.serverUrl
            } else {
                this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl = img.serverUrl
                console.log('直接上传')
                console.log(this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl)
            }
        },
        getImageList() {
            GetImageList(this.pageParam).then(response => {
                this.imageListData = response.data
                this.totalPage = response.headers['x-total-count']
                console.log(this.imageListData)
            })
        },
        getImageById(id, account) {
            GetImageById(id, account)
                .then(response => {
                    this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl = response.data.serverUrl
                    console.log(this.temp.newsItemList[this.selectedTemplateIndex].localThumbUrl)
                })
        },
        createNews() {
            let vaildate = true;
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                } else {
                    vaildate = false
                    this.$message(
                        {
                            message: '请完成必填项',
                            type:'error'
                        }
                    )
                }
            });

            if (this.temp.newsItemList.findIndex((v) => {
                    if (v.content === '') {
                        return true
                    }
                }) !== -1) {
                vaildate = false
                this.$message(
                    {
                        message: '请完成正文',
                        type:'error'
                    }
                )
            }
            if (this.temp.newsItemList.findIndex((v) => {
                    if (v.localThumbUrl === '') {
                        return true
                    }
                }) !== -1) {
                vaildate = false
                this.$message(
                    {
                        message: '请完成封面选择',
                        type:'error'
                    }
                )
            }

            if (this.temp.newsItemList.findIndex((v) => {
                    if (v.author.length > 8) {
                        return true
                    }
                }) !== -1) {
                vaildate = false
                this.$message(
                    {
                        message: '文章作者不得超过8个字符',
                        type:'error'
                    }
                )
            }



            // console.log(this.items)
            // console.log(this.temp.newsItemList[0])
            if (vaildate) {
                this.temp.serverUrl = this.temp.newsItemList[0].localThumbUrl
                this.temp.account = this.account
                if(this.$router.currentRoute.params.id){
                    this.temp.id = this.$router.currentRoute.params.id
                    UpdateArticlePhoto(this.temp)
                        .then(response => {
                            console.log(response)
                            this.$message({
                                type: "success",
                                message: "编辑成功",
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            })
                        })
                } else {
                    CreateArticlePhotoList(this.temp)
                        .then(response => {
                            console.log(response)
                            this.$message({
                                type: "success",
                                message: "创建成功",
                                customClass: 'msg-success',
                                iconClass: 'ic'
                            })
                            // this.$router.push({ path: `/sys-material/article-manage/${response.data.id}` })
                            this.$router.push({name: '编辑图文', params: {id: response.data.id}})

                        })
                }
            }

        },
        onSelectCover() {
            this.photoDialogShow = true
            this.dialogStatus = 'cover'
        },
        onChangePhoto() {
            this.photoDialogShow = true
            this.dialogStatus = 'image'
        },
        confirm() {
            this.getImageById(this.selectedRadio.id, this.selectedRadio.account)
            this.coverPhotoDialogShow = false
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getImageList()
        },
        setUp(index, event) {
            [this.temp.newsItemList[index], this.temp.newsItemList[index - 1]] = [this.temp.newsItemList[index - 1], this.temp.newsItemList[index]]
            event.stopPropagation();
            this.updateTempToContent();
        },
        setDown(index, event) {
            [this.temp.newsItemList[index], this.temp.newsItemList[index + 1]] = [this.temp.newsItemList[index + 1], this.temp.newsItemList[index]]
            event.stopPropagation();
            this.updateTempToContent();
        },
        addMaterial: function () {
            this.isEdit = true;
        },
        handleContextSave() {
            this.isEdit = false;
        },
        textCommd(commd) {
            if (UEditor.queryCommandState(commd)) {
                $(`#${commd}-btn`).removeClass("active")
            } else {
                $(`#${commd}-btn`).addClass("active")
            }
            UEditor.execCommand(commd)
        },
        textMutilCommd(commd, str) {
            UEditor.execCommand(commd, str)
        },
        handleFontChange(val) {
            UEditor.execCommand("fontSize", val + "px")
        },
        handlebordDropDown() {
            this.border.show = !this.border.show
        },
        handleBoderStyleChange(val) {
            this.border.style = val
        },
        initShowTextEditor() {
            let fontSize = $("#edui3_button_body")
            this.fontSize.value = parseInt(fontSize.html())
        },
        syncborder() {
            let conStyle = $(this.focusEle.element).parent()[0].style
            this.border.style = conStyle.borderStyle
            if (conStyle.borderWidth === "") {
                this.border.width = 0
            } else {
                this.border.width = parseFloat(conStyle.borderWidth)
            }
            if (conStyle.borderColor === "") {
                this.border.color = "#000000"
            } else {
                this.border.color = conStyle.borderColor
            }
        },
        syncFoucsBox() {
            let offset = $(this.focusEle.element).offset();
            let offsetParent = $(".wxap-layer").offset()

            this.focusBox.top = offset.top - offsetParent.top
            this.focusBox.left = offset.left - offsetParent.left
            this.focusBox.width = $(this.focusEle.element).outerWidth()
            this.focusBox.height = $(this.focusEle.element).outerHeight()

            //init videoCode
            this.videoCode = ''
        },
        syncBtnStatByEvent($e) {
            let $target = $e.target
            let fontSize = parseInt($($target).css("font-size"))
            this.fontSize.value = fontSize
            // let parent = $($target).parents()
            // console.log($($target))
        },
        syncBtnStatByApi() {
            // console.log('选区发生改变');
            $(this.focusEle.element).html(UEditor.getContent())
            this.syncFoucsBox()
            this.justify = UEditor.queryCommandValue('justify')
            this.pickColor = UEditor.queryCommandValue('forecolor')
            this.backColor = UEditor.queryCommandValue('backcolor')
            this.fontSize.value = parseInt(UEditor.queryCommandValue('fontsize'))
            for (let commd of baseStyle) {
                if (UEditor.queryCommandState(commd)) {
                    $(`#${commd}-btn`).addClass("active")
                } else {
                    $(`#${commd}-btn`).removeClass("active")
                }
            }

        },
    },
    mounted() {
        // console.log(tpls)
        let self = this;
        selectArea($('.wxap-layer'), this.clearFocus, 200)
        // this.editor = initTextEditor("#textEditor")
        UEditor = new UE.Editor()
        UEditor.render("textEditor")
        UEditor.ready(function () {
            let textarea = document.getElementById('textEditor').childNodes[0].contentWindow.document.body
            UEditor.addListener('selectionchange', function (type, causeByUi, uiReady) {
                self.syncBtnStatByApi()
            })

            UEditor.addListener('afterSetContent', function (type, causeByUi, uiReady) {
                UEditor.focus(!isIE())
            })

        })
    },
    computed: {
        // 使用对象展开运算符将此对象混入到外部对象中
        // ...mapState({
        //     focusEle: state => state.weChatArticle.focusEle,
        //     hasFocusEle: state => state.weChatArticle.hasFocusEle,
        // })
        showFullText: function () {
            return this.focusEle.cellType.includes('fulltext')
        },
        showImage: function () {
            return this.focusEle.cellType.includes('image')
        },
        showVideo: function () {
            return this.focusEle.cellType.includes('video')
        },

    },
    watch: {
        "tags.active": function (newVal) {
            this.getTpls(newVal)
        },
        "imageWidth": function (newVal) {
            $(this.focusEle.element).parent()[0].style.width = newVal + "%"
            this.syncFoucsBox()
        },
        "pickColor": function (newVal) {
            UEditor.execCommand('forecolor', newVal)
        },
        "backColor": function (newVal) {
            UEditor.execCommand('backcolor', newVal)
        },
        "focusBox.top": function (newVal) {
            if (newVal < 120) {
                this.opDockTop = this.focusBox.top + this.focusBox.height + 125
            } else {
                this.opDockTop = this.focusBox.top
            }
        },
        "focusBox.height": function (newVal) {
            if (this.focusBox.top < 120) {
                this.opDockTop = this.focusBox.top + newVal + 125
            } else {
                this.opDockTop = this.focusBox.top
            }
        },
        "border": {
            handler: function (newVal) {
                if (this.focusEle.onFocus) {
                    let conStyle = $(this.focusEle.element).parent()[0].style
                    conStyle.borderStyle = newVal.style
                    conStyle.borderWidth = newVal.width + 'px'
                    conStyle.borderColor = newVal.color
                    this.syncFoucsBox()

                }
            },
            deep: true
        },
        "bgEle.color": function (newVal) {
            console.log(newVal)
            console.log(this.bgEle.element.style.backgroundColor)
            if (this.focusEle.onFocus) {
                this.bgEle.element.style.backgroundColor = newVal
            }
        },
    },
    updated: function () {
        this.$nextTick(function () {
            // console.log("DOM 更新")
            // Code that will run only after the
            // entire view has been re-rendered
        })
    },
    destroyed() {
        UEditor.destroy()
        UEditor = {}
        console.log("destroy")
    },

};

function initFontSize() {
    let opt = []
    for (let i = 12; i < 37; i += 2) {
        opt.push({value: i, label: i})
    }
    return opt
}

function initBorderOpt() {
    let opt = {}
    opt.style = [
        {value: 'none', label: "无边框"},
        {value: 'solid', label: "实线"},
        {value: 'dashed', label: "虚线"},
    ]
    return opt
}

function initTextEditor(ele) {
    // var editor = new Editor('#op-text',ele)
    // editor.create()
    // return editor
    return UE.getEditor("textEditor")
}

function focusEleInit() {
    return {
        element: '',
        cellType: '',
        onFocus: false,
        src: ''
    }
}

function boxInit() {
    return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    }
}

function templateSectionInit() {
    return {
        author: "",
        content: "",
        contentSourceUrl: "",
        digest: "",
        localThumbUrl: "",
        showCoverPic: "",
        thumbUrl: "",
        thumbMediaId: "",
        title: "",
        url: ""
    }
}

function tempInit() {
    return {
        "account": "",
        "name": "",
        "updateTime": "2017-10-20T03:28:41.179Z",
        "serverUrl": "",
        "remoteUrl": "",
        "mediaId": "",
        "newsItemList": [{
            "title": "",
            "thumbUrl": "",
            "localThumbUrl": "",
            "thumbMediaId": "",
            "author": "",
            "digest": "",
            "content": "",
            "contentSourceUrl": "",

        }],
        "shared": false,

    }
}

function selectArea($ele, fn, delay) {

    document.body.addEventListener('click', (e) => {
        let slectArr = ['.tpl-box', '.el-dialog',].concat(retainArea)
        let bool = slectArr.findIndex((selectStr) => {
            return $(selectStr).is(e.target) || $(selectStr).has(e.target).length > 0
        })
        if (!$ele.is(e.target) && $ele.has(e.target).length === 0 && bool === -1) { // Mark 1
            fn()
        }
    }, true);
}

function MutilSelectArea($ele, fn) {

}

let rgbToHex = function (rgb) {
    // rgb(x, y, z)
    let color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
    let hex = "#";

    for (let i = 0; i < 3; i++) {
        // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
        // 'color[i]' 是数组，要转换成字符串.
        // 如果结果是一位数，就在前面补零。例如： A变成0A
        hex += ("0" + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
};

let hexToRgb = function (hex) {
    let rgb = [];

    hex = hex.substr(1);//去除前缀 # 号

    if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
        hex = hex.replace(/(.)/g, '$1$1');
    }

    hex.replace(/../g, function (color) {
        rgb.push(parseInt(color, 0x10));//按16进制将字符串转换为数字
    });

    return "rgb(" + rgb.join(",") + ")";
};

function isIE(){
    return ("ActiveXObject" in window);
}




