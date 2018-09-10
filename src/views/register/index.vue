<template>
  <div class="reg-container">

    <el-form class="reg-form" :model="regForm" :rules="regRules"  ref="regForm">
      <h3 class="title">用户注册</h3>
      <!--account-->
      <el-form-item prop="login">
        <span class="svg-container"><i class="iconfont icon-touxiang"></i></span>
        <el-input name="login" type="text" v-model="regForm.login" autoComplete="on"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <!--email-->
      <el-form-item prop="email">
        <span class="svg-container"><i class=" el-icon-message"></i></span>
        <el-input name="email" type="email" v-model="regForm.email" autoComplete="on" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <!--password-->
      <el-form-item prop="password">
        <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
        <el-input name="password" type="password" v-model="regForm.password" placeholder="密码" ></el-input>
      </el-form-item>
      <!--check password-->
      <el-form-item prop="checkpsw">
        <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
        <el-input name="password"  type="password" v-model="regForm.checkpsw"
                  placeholder="请再次输入密码" @keyup.enter.native="handleRegister">
        </el-input>
      </el-form-item>
      <!--reg-button-->
      <el-form-item>
        <el-button type="primary"  style="width: 100%;"   @click.native.prevent="handleRegister" >
          注册
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {register} from 'api/register';
  import axios from 'axios';
  import {isWscnEmail} from 'utils/validate';
  import Router from 'router';

  export default{
    name:'register',
    data(){
      const validateEmail = (rule, value, callback) => {
        if (!isWscnEmail(value)) {
          callback(new Error('请输入正确的合法邮箱'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'));
        } else {
          callback();
        }
      };
      //验证2次密码是否一致
      const checkPass = (rule, value, callback) => {
          if(value !== this.regForm.password) {
              callback(new Error('两次输入的密码不一致'));
          }else{
              callback();
          }
      };
      return {
        regForm: {
         // langkey: 'en',
          email: '',
          password: '',
          login: '',
          checkpsw: '',
        },
        regRules: {
          login: [
            {required: true, message: '请输入用户名',trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱',trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码',trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkpsw: [
            {required: true, message: '请再次输入密码', trigger:'blur'},
            {validator: checkPass, trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      handleRegister(){
        console.log(this.regForm);
        register(this.regForm)
          .then(function () {
//            Router.push({path: 'dashboard'})
//              Router.push({path: 'guard/controlDevice'});    // 登陸成功，展示控制設備頁面
              this.$router.push({path: '/guard/human'});    // 登陸成功，展示控制設備頁面
          })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  .reg-container{
    height: 100vh;
    background-color: #2d3a4b;

    input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;}

    .reg-form{
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto; }
    .el-input{
      display: inline-block;
      width: 85%;}
    input {
     background: transparent;
     border: 0px;
     -webkit-appearance: none;
     border-radius: 0px;
     padding: 12px 5px 12px 15px;
     color: #eeeeee;
     height: 47px;}
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;}
    .title{
      font-size: 26px;
      font-weight: 400;
      color: #eeeeee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;}
    .svg-container{
      padding: 6px 5px 6px 15px;
      color: #889aa4; }
  }

</style>
