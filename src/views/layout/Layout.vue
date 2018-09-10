<template>
    <div class="app-wrapper" :class="{hideSidebar:isCollapse}">
        <div class="sidebar-wrapper">
            <Sidebar class="sidebar-container"/>
        </div>
        <div class="main-container flex" style="overflow: auto;">
            <Navbar @showDialogAccount="toshow" @showDialogUser="tousershow" class="navbar" :class="{hideSidebar:isCollapse}" />
            <App-main/>
        </div>
        <el-dialog title="选择公众号" class="dialogForm selAccount" :visible.sync="$store.state.weChatAccount.showAccountDialog">
            <change-account @changeAid="setAid"></change-account>
        </el-dialog>
        <editUser/>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "src/assets/styles/mixin.scss";

    .main-container{
        background-color: #d6dae3;
    }

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        padding-left:188px;
        overflow: hidden;
        &.hideSidebar {
            .main-container {
                left: 64px;
            }
        }
        .sidebar-wrapper {
            position: fixed;
            top: 0px;
            bottom: 0;
            left: 0;
            z-index: 1001;
            //overflow-x: hidden;
            background-color: #3d496f;
            transition: all .28s linear;
            width:188px;
            @include scrollBar;
        }
        .sidebar-container {
            transition: all .28s linear;
            height:100%;
        }
        .main-container {
            padding: 0 20px 0 20px;
            transition: all .28s linear;
            overflow: auto;
            display: block;
            position: absolute;
            top: 0px;
            right: 0;
            bottom: 0;
            left:188px;
        }
        
        // TODO 用@meida 控制在小屏幕上的表现状态
        // 或者用后添加的class 自定义dialog element-ui 表现
        /*.el-dialog{*/
            /*bottom:10%;margin-bottom:0;*/
        /*}*/
    }
    .hideSidebar .sidebar-wrapper{
        width:64px;
    }
    .selAccount .el-dialog__body{
            height: 94%;padding:25px 20px;height:550px;
        }
</style>
<script>
    import {Navbar, Sidebar, AppMain} from 'views/layout';
    import changeAccount from 'src/components/changeAccount/changeAccount.vue';
    import editUser from 'src/components/editUser/editUser.vue';
    import store from 'store';

    export default {
        name: 'layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            changeAccount,
            editUser
        },
        methods: {
            toshow(msg){
                this.$store.commit('SET_ACC_DIALOG', msg);
            },
            setAid(msg){
                this.$store.commit('SET_ACC_DIALOG', msg);
            },
            tousershow(msg){
                this.$store.commit('SET_USER_DIALOG', msg);
            }
        },
        computed: {
            isCollapse() {
                return this.$store.state.app.sidebar.isCollapse;
            }
        }
    }
</script>

