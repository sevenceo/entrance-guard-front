<template>
    <div>
        <breadcrumb></breadcrumb>

        <div class="menuSimulator" style="height: 538px" >
            <div class="status">2017-11-16</div>
            <!--<div class="header"></div>-->
            <div class="menuNone hide">
            </div>
            <div :style="{background: bgcolor}" style=" height: 475px; margin-top: 37px; text-align: center">
                <div style="height: 20px"></div>
                <div  style="float: left;margin-left: 144px">
                    <img class="shopImg" v-if="accountImg"  :src="imageUrl+accountImg" >
                    <img v-else class="shopImg" src="~assets/replace.png">
                </div>
                <div class="cardDetail" >
                    <div style="height: 10px"></div>
                    <div class="shopName">{{temp.general_coupon.base_info.brand_name}}</div>
                    <div class="cardTitle">{{temp.general_coupon.base_info.title}}</div>
                    <div class="cardBorder"></div>
                    <div class="cardTime"><div style="float: left">可用时间：</div>{{value1_show}}～{{value2_show}}</div>
                    <div class="cardDes"><div style="float: left">使用须知：</div><textarea style="border: none;width: 200px; height: 60px;">{{temp.general_coupon.base_info.description}}</textarea><div></div></div>

                </div>
                <div>
                    <img v-if="coverImg" :src="imageUrl+coverImg" class="coverImg">
                    <img v-else class="coverImg"  src="~assets/264-136.png">
                </div>

            </div>
        </div>
        <div  style="margin-left:350px;height:538px; clear: both;background-color: white;overflow-y:scroll">
            <el-tabs class="v-content" @tab-click="tabchange">
                <el-tab-pane label="基本信息">
                    <div>
                <el-form class="small-space" label-position="left" label-width="100px" style='width:  90%;  margin-left:30px;'
                         :model="temp" ref="temp" :rules="rules">
                    <div style="height:15px;"></div>
                    <!--<div style="color:gray;font-size:15px; margin: 15px 0px ; border-bottom: solid 1px gray"> 基本信息</div>-->
                    <el-form-item v-if="codeImg!=''" label="卡券二维码" prop="realname">
                        <img v-if="codeImg" :src="codeImg" style="width: 100px;height: 100px;" class="avatar">
                    </el-form-item>
                    <el-form-item label="商户图标" prop="general_coupon.base_info.logo_url">

                            <el-upload class="avatar-uploader" :action="upLoadApi" :on-success="handleImgSuccess" :show-file-list="false" :before-upload="avatarUpload">
                                <img v-if="accountImg" :src="imageUrl+accountImg" style="width: 100px;height: 100px;" class="avatar">
                                <i v-else class="el-icon-plus
                            avatar-uploader-icon
                             material-icon"></i>
                            </el-upload>
                    </el-form-item>
                    <el-form-item label="商户名称" prop="general_coupon.base_info.brand_name" >
                        <el-input   :disabled="isUpdate"  class="cardInput" :maxlength="12" v-model="temp.general_coupon.base_info.brand_name"  placeholder="请输入商户名称"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="编码类型"  prop="general_coupon.base_info.code_type">-->
                        <!--<el-select  :disabled="isUpdate"  class="cardInput" v-model="temp.general_coupon.base_info.code_type" placeholder="请选择">-->
                            <!--<el-option-->
                                    <!--v-for="item in typeMap"-->
                                    <!--:key="item.value"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item.value">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="卡券颜色" prop="general_coupon.base_info.color">
                        <template>
                            <el-radio-group v-model="temp.general_coupon.base_info.color" @change="colorChange">
                                <el-col style="margin-bottom: 5px">
                                    <el-radio label="Color010"><div class="bgColor" style="background-color: #63B359;"></div></el-radio>
                                    <el-radio label="Color020"><div class="bgColor" style="background-color: #2C9F67;"></div></el-radio>
                                    <el-radio label="Color030"><div class="bgColor" style="background-color: #509FC9;"></div></el-radio>
                                    <el-radio label="Color040"><div class="bgColor" style="background-color: #5885CF;"></div></el-radio>
                                    <el-radio label="Color050"><div class="bgColor" style="background-color: #9062C0;"></div></el-radio>
                                </el-col>
                                <el-col>
                                    <el-radio label="Color060"><div class="bgColor" style="background-color: #D09A45;"></div></el-radio>
                                    <el-radio label="Color070"><div class="bgColor" style="background-color: #E4B138;"></div></el-radio>
                                    <el-radio label="Color080"><div class="bgColor" style="background-color: #EE903C;"></div></el-radio>
                                    <el-radio label="Color090"><div class="bgColor" style="background-color: #DD6549;"></div></el-radio>
                                    <el-radio label="Color100"><div class="bgColor" style="background-color: #CC463D;"></div></el-radio>
                                </el-col>
                            </el-radio-group>
                        </template>
                    </el-form-item>
                    <el-form-item label="优惠券标题"  prop="general_coupon.base_info.title" >
                        <el-input  :disabled="isUpdate"   class="cardInput" :maxlength="9"  v-model="temp.general_coupon.base_info.title"  placeholder="请输入卡券标题" ></el-input>
                    </el-form-item>
                    <el-form-item label="有效期" prop="timerange">
                        <template>
                            <el-row>
                                <el-col>
                                    <!--<el-radio v-model="temp.general_coupon.base_info.date_info.type" label="DATE_TYPE_FIX_TIME_RANGE">固定日期</el-radio>-->
                                    <el-date-picker style="width: 120px"
                                                    v-model="value1"  :disabled="isUpdate"
                                                    type="date" @change="startTimeChange" :clearable="false"
                                                    placeholder="选择日期" >
                                    </el-date-picker>
                                    至
                                    <el-date-picker style="width: 120px"  :disabled="isUpdate"
                                                    v-model="value2" :clearable="false"
                                                    type="date" :picker-options="pickerOptions0" @change="endTimeChange"
                                                    placeholder="选择日期" >
                                        <!--@change="endTimeChange"-->
                                    </el-date-picker>
                                </el-col>
                            </el-row>
                        </template>
                    </el-form-item>
                    <!--<div style="color:gray;font-size:15px; margin: 15px 0px ; border-bottom: solid 1px gray"> 优惠详情</div>-->

                    <el-form-item label="库存" prop="general_coupon.base_info.sku.quantity"  >
                        <el-input  :disabled="isUpdate"  type="number"  class="numInput"  v-model="temp.general_coupon.base_info.sku.quantity" placeholder="请输入张数"></el-input>张
                    </el-form-item>
                    <el-form-item label="领券限制" prop="general_coupon.base_info.get_limit">
                            <el-input  :disabled="isUpdate"  type="number" class="numInput"  v-model="temp.general_coupon.base_info.get_limit" placeholder="请输入张数"></el-input>张
                        </el-form-item>
                    <!--<el-form-item label="使用条件">-->
                    <!--优惠同享<el-select style="width: 120px;margin: 0px 10px" v-model="temp.general_coupon.base_info.use_condition.can_use_with_other_discount" placeholder="请选择">-->
                    <!--<el-option key="" label="无" value=""></el-option>-->
                    <!--<el-option key="false" label="不与其他优惠同时使用" value="false"></el-option>-->
                    <!--<el-option key="true" label="可与其他优惠同时使用" value="true"></el-option>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="封面图片" prop="general_coupon">
                        <div v-if="isUpdate==false">
                            <el-upload class="avatar-uploader" :action="upLoadApi" :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="avatarUpload">
                                <img v-if="coverImg" :src="imageUrl+coverImg" style="width: 170px;height: 70px;" class="avatar">
                                <i v-else class="el-icon-plus
                            avatar-uploader-icon
                             material-icon"></i>
                            </el-upload>
                        </div>
                        <div v-else>
                            <img v-if="coverImg" :src="imageUrl+coverImg" style="width: 170px;height: 70px;" class="avatar">
                            <i v-else class="el-icon-plus
                            avatar-uploader-icon
                             material-icon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="封面简介">
                        <el-input  :disabled="isUpdate"  class="cardInput" :maxlength="8"  placeholder="请输入封面简介" v-model="temp.general_coupon.advanced_info.abstract.abstract">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="优惠说明" prop="general_coupon.default_detail">
                        <el-input :disabled="isUpdate"  type="textarea"  :maxlength="1024" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入优惠说明" v-model="temp.general_coupon.default_detail">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="卡券使用提醒">
                        <el-input class="cardInput" :maxlength="16"  placeholder="请输入卡券使用提醒" v-model="temp.general_coupon.base_info.notice">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="使用须知" prop="general_coupon.base_info.description">
                        <el-input type="textarea" :maxlength="1024" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入使用须知" v-model="temp.general_coupon.base_info.description">
                        </el-input>
                    </el-form-item>
                </el-form>

                <el-row>
                    <el-col>
                        <div class="grid-content bg-purple" style="text-align: center;">
                            <div v-if="canSave==true"  class="filter-container">
                                <router-link :to="'/card-coupons/cardCoupons'">
                                    <el-button type="danger" class="cancel">
                                        <svg class="icon icon-cancel1" aria-hidden="true">
                                            <use xlink:href="#icon-cancel1"></use>
                                        </svg>
                                        取消
                                    </el-button>
                                </router-link>
                                <el-button type="primary" class="save" @click="handleSave" :loading="$store.state.app.onXHR" >
                                    <svg class="icon icon-save1" aria-hidden="true">
                                        <use xlink:href="#icon-save1"></use>
                                    </svg>
                                    保存
                                </el-button>


                            </div>
                            <div v-else  class="filter-container">
                                <router-link :to="'/card-coupons/cardCoupons'">
                                    <el-button type="danger" class="cancel">
                                        <svg class="icon icon-cancel1" aria-hidden="true">
                                            <use xlink:href="#icon-cancel1"></use>
                                        </svg>
                                        返回
                                    </el-button>
                                </router-link>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
                </el-tab-pane>
                <el-tab-pane v-if="isUpdate==true" label="卡券报表" name="cardReport">
                    <div style="text-align: center;margin-bottom: 10px">
                            <!--<el-radio v-model="temp.general_coupon.base_info.date_info.type" label="DATE_TYPE_FIX_TIME_RANGE">固定日期</el-radio>-->
                            <el-date-picker style="width: 120px" v-model="reportTime1"  :clearable="false"
                                            type="date" placeholder="选择日期" >
                            </el-date-picker>
                            至
                            <el-date-picker style="width: 120px;" v-model="reportTime2" :clearable="false" :picker-options="pickerOptions1"
                                            type="date" placeholder="选择日期" >
                                <!--@change="endTimeChange"-->
                            </el-date-picker>

                            <el-button type="primary" class="save" style="margin-left: 10px" @click="searchReport" >
                                查找
                            </el-button>
                    </div>
                        <div class="chartRoom" style="max-width: 800px">
                            <!-- 	        	<h5>粉丝增长</h5> -->
                            <div id="cardAdd" class="chartShow" style="max-width: 100%">
                            </div>
                        </div>
                </el-tab-pane>
            </el-tabs>
        </div>


    </div>
</template>

<script src="./cardDetails.js">

</script>

<style scoped src="./cardDetails.scss">
</style>