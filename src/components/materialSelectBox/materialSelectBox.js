/**
 * Created by zhaimaojin on 2017/8/16.
 */
import store from "store"
import {
    GetExternalLinksList,
    GetImageList,
    GetTextList,
    GetVideoList,
    GetVoiceList,
    GetExternalLinksById,
    GetTextById,
    GetVoiceById,
    GetVideoById,
    GetImageById,
    GetArticlePhotoList,
    GetArticlePhotoById
} from "src/views/wc-material/my-material/api/myMaterialApi";

import router from "src/router"
import {loginByEmail} from 'src/api/login'
import moment from 'moment'


export default {
    mounted() {
        document.body.appendChild(this.$refs.dialog.$el);
    },
    created() {

    },
    data() {
        return {
            temp: tempInit(),
            fansGroupOption: '',
            dialogFormVisible: false,
            dataList: '',
            pageParam: {
                page: 1,
                size:6,
                account: this.$store.state.weChatAccount.accountInfo.account
            },
            totalPage: 10,
            selectedRadio: '',
            baseUrl: process.env.MATERIAL_API,
            titleTabIndex: '',
            materialTabIndex: '0',
            selectedId: '',
            selectedData: '',
            historyData:[],
            materialSelectBoxVisible:false,
            activeName: 'link',
            materialType: 'link',
            showBtn: true
        }
    },
    methods: {
        getMaterial(){
            console.log(111)
            this.materialSelectBoxVisible = true
            this.getLinkDataList()
            this.activeName = 'link'
            this.materialType = 'link'
        },
        materialTabClick(tab, event) {
            this.materialTabIndex = tab.index
            this.dialogFormVisible = true;
            this.selectedRadio = ''
            this.selectedData = ''
            console.log(this)
            this.handleTabClick()
        },

        handleCurrentChange(page){
            this.pageParam.page = page;
            this.handleTabClick()
        },
        handleTabClick(){
            if (this.materialTabIndex === '0') {
                this.getLinkDataList()
                this.materialType = 'link'

            } else if (this.materialTabIndex === '1') {
                this.getArticlePhotoList()
                this.materialType = 'news'

            } else if (this.materialTabIndex === '2') {
                this.getTextDataList()
                this.materialType = 'text'

            } else if (this.materialTabIndex === '3') {
                this.getImageDataList()
                this.materialType = 'image'

            } else if (this.materialTabIndex === '4') {
                this.getVoiceDataList()
                this.materialType = 'voice'

            } else if (this.materialTabIndex === '5') {
                this.getVideoDataList()
                this.materialType = 'video'
            }
        },
        getLinkDataList() {
            GetExternalLinksList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']

                console.log('dataList')
                console.log(this.dataList)
            })
        },
        getTextDataList() {
            GetTextList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList)
            })
        },
        getImageDataList() {
            GetImageList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log(this.dataList)

            })
        },
        getVoiceDataList() {
            GetVoiceList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList.length)
            })
        },
        getVideoDataList() {
            GetVideoList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList.length)

            })
        },
        getArticlePhotoList(){
            this.pageParam.status = 1;
            GetArticlePhotoList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
                console.log('dataList')
                console.log(this.dataList.length)

            })
        },
        getLinkById(id, account) {
            GetExternalLinksById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'link'
                    this.temp.materialId = this.selectedData.id
                })
        },
        getTextById(id, account) {
            GetTextById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'text'
                    this.temp.materialId = this.selectedData.id
                })
        },
        getVoiceById(id, account) {
            GetVoiceById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'voice'
                    this.temp.materialId = this.selectedData.id

                })
        },
        getVideoById(id, account) {
            GetVideoById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'video'
                    this.temp.materialId = this.selectedData.id
                })
        },
        getImageById(id, account) {
            GetImageById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'image'
                    this.temp.materialId = this.selectedData.id
                })
        },
        getArticlePhotoById(id, account) {
            GetArticlePhotoById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'image'
                    this.temp.materialId = this.selectedData.id
                })
        },
        reset(){
            this.dataList = ''
        },
        cancel() {
            this.materialSelectBoxVisible = false;

        },
        clearData() {
            this.materialSelectBoxVisible = false;
            this.dataList = ''
        },
        clearSelectedData() {
            this.selectedData = ''
        },
        confirm(){
            console.log(this.selectedRadio)
            this.$emit("selectedMaterial",this.selectedRadio,this.materialType);
            this.materialSelectBoxVisible = false;
        }
    }
}


function tempInit() {
    return {
        materialId: "",
        materialType: "",
    }
}

