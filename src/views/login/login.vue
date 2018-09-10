<template>
    <div class="login-container">
        <div class="top-bar">
            <!--<img class="logo" src="~assets/logo.png" alt="logo">-->
            <img class="logo" src="~assets/logo-hypersmart.png" alt="logo" v-show="showHypersmart">
            <img class="logo" src="~assets/logo-landingnext.png" alt="logo" v-show="showLandingnext">
            <span class="logo-title">智能门禁管理系统</span>
            <div class="right-area">
                <!--<img class="car-logo" src="~assets/login/631.png" >-->
                <!--<img class="car-logo" src="~assets/login/632.png" >-->
            </div>
        </div>

        <div class="formPlace">
            <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                 class="login-form">
                <p class="form-title">用户登录</p>
                <el-form-item prop="email">

                    <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on"
                              placeholder="请输入用户名">
                        <template slot="prepend">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-touxiang"></use>
                            </svg>
                        </template>

                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" type="password" @keyup.enter.native="handleLogin"
                              v-model="loginForm.password"
                              autoComplete="on" placeholder="请输入密码">
                        <template slot="prepend">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-quanxian"></use>
                            </svg>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item style="text-align: left;margin-top:-10px;">
                    <el-checkbox class="remember-pwd" v-model="rememberPwd" :true-label="'true'" :false-label="'false'">记住密码</el-checkbox>
                </el-form-item>
                <!--<div class="pwdEdit">-->
                    <!--<router-link to="/sendpwd" class="forget-pwd">-->
                        <!--忘记密码?-->
                    <!--</router-link>-->
                <!--</div>-->
                <el-form-item>
                    <el-button class="login-btn" type="primary"
                               :loading="$store.state.app.onXHR" @click.native.prevent="handleLogin">
                        登  录
                    </el-button>
                </el-form-item>
                <!--<el-form-item class="newUserReg">-->
                    <!--<router-link to="/register">-->
                        <!--<el-button type="primary" style="width:100%;">-->
                            <!--新用户注册-->
                        <!--</el-button>-->
                    <!--</router-link>-->
                <!--</el-form-item>-->
            </el-form>
        </div>
        <!--<p class="qyInfo">©2017 南京览笛信息科技有限公司 版权所有</p>-->
        <!--<p class="qyInfo" v-show="showHypersmart">©2018 深圳超智慧信息科技有限公司 版权所有</p>
        <p class="qyInfo" v-show="showLandingnext">©2018 南京览笛信息科技有限公司 版权所有</p>-->
        <p class="qyInfo" v-show="showHypersmart">©2018 深圳超智慧信息科技有限公司 版权所有</p>
        <p class="qyInfo" v-show="showLandingnext">©2018 南京览笛信息科技有限公司 版权所有 <a target="_blank" href="http://www.miitbeian.gov.cn">苏ICP备18038395号</a></p>
        <el-dialog title="第三方验证" :visible.sync="showDialog">
            邮箱登录成功,请选择第三方验证
            <socialSign></socialSign>
        </el-dialog>
        <!--     <el-dialog title="选择公众号" :visible.sync="$store.state.weChatAccount.showAccountDialog">
                <change-account @changeAid="toshow" :msg="msg" :visible.sync="$store.state.weChatAccount.showAccountDialog"></change-account>
            </el-dialog> -->
    </div>
</template>

<script src="./login.js"></script>
<style src="./login.scss" lang="scss"></style>
