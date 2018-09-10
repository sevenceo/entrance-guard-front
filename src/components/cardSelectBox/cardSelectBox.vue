<template>
    <div>
        <el-tabs @tab-click="cardTabClick">
            <el-tab-pane label="优惠券">
                <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                    <el-col class="item" :span="8" v-for="x in cardList" :key="x.cardId"
                            style="text-align:center;margin-bottom:20px;">
                        <div class="cardBack">
                            <div class="cardBorder">
                                <div class="shopImgBorder">
                                    <img  class="shopImg" v-if="x.logoUrlPath"  :src="imageUrl+x.logoUrlPath" >
                                    <img class="shopImg"  v-else  src="~assets/replace.png">
                                </div>
                                <div style="margin:18px 0px; float: left">
                                    {{x.cardTitle}}
                                </div>
                            </div>
                            <div class="footFont">
                                微信卡券
                            </div>
                        </div>
                        <!--<div class="text-wrapper">-->
                            <!--<p>{{x.cardTitle}}</p>-->
                        <!--</div>-->
                        <!--<p class="material-title">{{x.cardTitle}}</p>-->
                        <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                    </el-col>
                </el-row>
                <!--翻页-->
                <pagination :total="totalPage" ref="pages" :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer" style="text-align: right">
            <!--<el-button @click="cancel" type="default">取 消</el-button>-->

            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>

<script src="./cardSelectBox.js">

</script>

<style scoped src="./cardSelectBox.scss">
</style>