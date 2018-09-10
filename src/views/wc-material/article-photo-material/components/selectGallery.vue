<template>
    <div class="dialogFormBox">
        <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
            <el-col class="item" :span="8" v-for="x in imageListData" :key="x.id"
                    style="text-align:center;margin-bottom:20px;" >
                <div class="item-wrapper" :class="{active: x.id == activeId}" @click="selectImg(x)">
                    <div style="position: relative">
                        <img width="100%" height="120px" :src="baseUrl + x.serverUrl" alt="">
                    </div>
                    <p class="material-title">{{x.name}}</p>
                </div>
            </el-col>
        </el-row>
        <pagination :total="totalPage" :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>
    </div>
</template>

<script>
    import {GetArticlePhotoById,CreateArticlePhotoList,GetImageList, GetImageById,UpdateArticlePhoto} from "src/views/wc-material/my-material/api/myMaterialApi";

    export default {
        data() {
            return {
                totalPage:10,
                picUrl:'',
                baseUrl:process.env.MATERIAL_API,
                imageListData:'',
                pageParam: {
                    page: 1,
                    size: 6,
                    account: this.$store.state.weChatAccount.accountInfo.account
                },
                selectedRadio: '',
                activeId:0
            }
        },
        created(){
            this.getImageList()
        },
        methods:{
            getImageList(){
                GetImageList(this.pageParam).then(response => {
                    this.imageListData = response.data
                    this.totalPage = response.headers['x-total-count']
                    console.log(this.imageListData)

                })
            },
            handleCurrentChange(page) {
                this.pageParam.page = page;
                this.getImageList()
            },
            selectImg(x){
//                let $curTarget = $(event.currentTarge)
                this.activeId = x.id
                this.$emit("success",x)
//                $curTarget.addClass("active").parent().siblings().children().removeClass("active")
            }
        },

    }
</script>
<style scoped lang="scss">
    .item-wrapper{
        margin-top: 1px;
        &.active{
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
        }
    }
</style>