<template>

    <header>
        <h3>
            智能门禁管理系统
        </h3>
        <a class="btn-group btn-exit" @click="logout">
            <svg class="icon icon-exit" width="18" height="18" aria-hidden="true">
                <use xlink:href="#icon-tuichu2"></use>
            </svg>
            退出系统
        </a>


        <el-dropdown class="avatar-container" style="display: none;"><!--trigger="click"-->
            <a type="primary" class="user-avatar btn-group">
                <img width="22" height="22" src="~assets/logo.png">
                <!--{{$store.state.weChatAccount.accountInfo.name}}-->
            </a>
            <el-dropdown-menu class="user-dropdown" id="guanwei-dropdown" slot="dropdown">
                <!--<img width="65" height="65" onerror="this.onerror=null;this.src='static/img/replace.png'" :src="$store.state.weChatAccount.accountInfo.accountImg">-->
                <p>
                    <!--名称：{{$store.state.weChatAccount.accountInfo.name}} <br>-->
                    <!--机构：{{$store.state.weChatAccount.accountInfo.organizationName}} <br>-->
                    <!--账号：{{$store.state.weChatAccount.accountInfo.account}}-->
                </p>
                <el-dropdown-item>
                    <a class='inlineBlock wechat-Switch' @click="changePublicId">
                        <svg class="icon icon-change" aria-hidden="true">
                            <use xlink:href="#icon-change"></use>
                        </svg>
                        切换公众号
                    </a>
                </el-dropdown-item>

            </el-dropdown-menu>
        </el-dropdown>



        <el-dropdown class="avatar-container" v-show="showDropDown"><!--trigger="click"-->
            <a type="primary" class="user-avatar btn-group">
                切换组织【<b id="showOrgName">{{orgName}}</b>】
                <!--{{$store.state.weChatAccount.accountInfo.name}}-->
            </a>
            <el-dropdown-menu class="user-dropdown" id="org-dropdown" slot="dropdown">

                <el-dropdown-item v-for="item in currentOrgs">
                    <a class='inlineBlock wechat-Switch' @click="changeOrg(item.id)" :id="item.id" :title="item.brandName">
                        <svg class="icon icon-change" aria-hidden="true">
                            <use xlink:href="#icon-change"></use>
                        </svg>
                        {{item.newName}}
                    </a>
                </el-dropdown-item>

            </el-dropdown-menu>
        </el-dropdown>


        <a class="btn-group btn-exit" @click="editAdmin" title="修改个人密码">
            <svg class="icon icon-save1" width="18" height="18" aria-hidden="true">
                <use xlink:href="#icon-admin1"></use>
            </svg>
            <!--{{$store.state.user.name}}-->
            {{userName}}
        </a>

        <a type="primary" class="user-avatar btn-group" v-show="!showDropDown && showOrg">
            当前组织【<b>{{orgName}}</b>】
        </a>
    </header>

</template>

<style lang="scss" scoped>
    .navbar {
        text-align: right;
        position: fixed;
        top: 0;
        right: 0;
        left: 188px;
        border-bottom: solid 1px #c8cbd0;
        height: 58px;
        line-height: 58px;
        transition: all .28s linear;
        padding-left: 25px;
        background-color: #fff;
        box-shadow: #c8cbd0 0px 2px 3px;
        -webkit-box-shadow: #c8cbd0 0px 2px 3px;
        -o-box-shadow: #c8cbd0 0px 2px 3px;
        -moz-box-shadow: #c8cbd0 0px 2px 3px;
        z-index: 1000;
        &.hideSidebar {
            left: 64px;
        }
        h3 {
            float: left;
            vertical-align: middle;
            margin: 0;
            font-weight: normal;
            font-size: 18px;
        }
        header {
            /*background-color: #fff;*/
            /*border-bottom:1px solid #edeff4;*/

        }

        .btn-group {
            display: block;
            float: right;
            // background-color: #fff;
            border: none;
            font-size: 14px;
            margin-right: 30px;
            // margin-top: 20px;
        }

        .btn-group svg {
            fill: #363f5e;
            vertical-align: middle;
        }

        .btn-group img {
            fill: #363f5e;
            vertical-align: middle;
        }

    }

    .navbar .btn-group .icon-exit {
        fill: #de5237
    }

    /*官微下拉*/
    #guanwei-dropdown, #org-dropdown {
        width: 220px;
        // height: 254px;
        border-top: 3px solid #46be94;
        background: rgba(255, 255, 255, 0.9);
        margin-top: 0;
        top: 58px;
        padding: 0 0 15px;
        margin-right: -61px;
        img {
            display: block;
            margin: 10px auto 0;
            border: solid 1px #ccc;
            background-color: #fff;
            padding: 3px;
            border-radius: 100%;
        }
        p {
            width: 100%;
            padding: 0 20px;
            font-size: 14px;
            line-height: 22px;
            margin: 10px auto 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .wechat-Switch {
            width: 100%;
            height: 33px;
            line-height: 33px;
            margin: 10px auto;
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            background: #46be94;
            border-radius: 5px;
        }

        .icon-change {
            overflow: hidden;
            width: 25px;
            height: 22px;
            fill: #ffffff;
            vertical-align: middle
        }

    }

    .el-dropdown-menu__item {
        /*width: 136px;*/
        margin: 0 auto;
    }

    .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: transparent;
    }
</style>

<script>
    export {default} from './navbar.js';
</script>
<!--<script src="./navbar.js"></script>--!>
