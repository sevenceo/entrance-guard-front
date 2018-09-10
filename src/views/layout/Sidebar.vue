<template>
    <div @click="handleOpenSider">
        <h2>
            <div class="h_logo">
                <!--<img src="~assets/logo-hypersmart.png" alt="" v-show="showHypersmart">
                <img src="~assets/logo-landingnext.png" alt="" v-show="showLandingnext">-->
                <img v-if="showLogo" :src="logo" width="100" height="100"/>
            </div>
            <!--~assets/logo.png-->
            <!--<img class="text_logo" src="~assets/logo-HS.jpg" alt="">-->
            <img @click="handleCollapse($event)" src="~assets/book-logo.png" v-show="!isCollapse" class="pointer book">
        </h2>
        <div class="barScroll">
            <el-menu :collapse="isCollapse"
                     :unique-opened='true'
                     mode="vertical"
                     class="el-menu-vertical"
            >
                <template v-for="item in permissionRoutes" v-if="!item.hidden">
                    <el-submenu :class="{'active':item.name == activeIndex}" :index="item.name" v-if="!item.noDropdown">

                        <template slot="title">
                            <wscn-icon-svg :icon-class="item.icon||'wenzhang1'"/>
                            <span slot="title">{{item.name}}</span>
                        </template>

                        <router-link v-for="child in item.children" :key="child.path"
                                     v-if="!child.hidden" class="title-link"
                                     :to="item.path+'/'+ (child.defPath || child.path)">
                            <el-menu-item :index="item.path+'/'+child.path"
                                          :class="{'active':child.name == activeIndex2}"
                                          style="padding:0 50px;"
                                          @click="handlerGo(child, item.path)">
                                {{child.tagName || child.name}}
                            </el-menu-item>
                        </router-link>
                    </el-submenu>
                    <!--<router-link v-if="item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">-->
                    <el-menu-item v-if="item.noDropdown&&item.children.length>0"
                                  @click="$router.push({path:item.path+'/'+item.children[0].path})"
                                  :index="item.path+'/'+item.children[0].path"
                                  :class="{'active-sub':item.name == activeIndex}"
                    >
                        <wscn-icon-svg :icon-class="item.icon ||'geren1'"/>
                        <span slot="title">{{item.children[0].name}}</span>
                        <!--{{item.children[0].name}}-->
                    </el-menu-item>
                    <!--</router-link>-->
                </template>
            </el-menu>
        </div>
        <span style="color: white;padding-left: 20%;position: absolute;bottom:20px;cursor:pointer" @click="showDetail()">当前版本: V0.8.0</span>
        <el-dialog title="版本介绍" class="dialogForm"  :visible.sync="formVisible" @close="closeForm()" :modal-append-to-body='false'>
            <div class="dialogFormBox">
                 <br/>
                <div style="font-size: 19px">智能门禁管理系统 V0.8.0</div>
                <br/>
                <br/>
                <div style="font-size: 16px">云端</div>
                <br/>
                <br/>
                <div>1、人员维护优化，人员管理增加资源树和查看详情调整；</div>
                <br/>
                <br/>
                <div>2、资源管理优化，资源管理页面调整和资源导入调整；</div>
                <br/>
                <br/>
                <div>3、预警机制优化，增加按星期日date设置报警；</div>
                <br/>
                <br/>
                <div>4、页面展示优化；</div>
                <br/>
                <br/>
                <div>5、页面整体弹框调整优化</div>
                <br/>
                <br/>
                <HR  align="center" style="color:#987cb9;" size="1"/><br/>
                <div style="font-size: 16px">小程序</div>
                <br/>
                <br/>
                <div>1、人员审核功能优化；</div>
                <br/>
                <br/>
                <div>2、微信快速登录；</div>
                <br/>
                <br/>
                <div>3、微信消息发送失败发送短信；</div>
                <br/>
                <br/>
                <!--<div>4、优化小程序人脸注册提示信息；</div>
                <br/>
                <br/>
                <div>5、优化终端安装配置流程；</div>
                <br/>
                <br/>
                <div>6、优化小程序访客邀请功能，查看未提交状态的访客邀请，修复邀请链接可重复提交问题；</div>
                <br/>
                <br/>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import store from 'store';

    export default {
        name: 'Sidebar',
        data() {

            return {
//                permissionRoutes: permissionRoutes.get(),
                showHypersmart:false,
                showLandingnext:false,
                formVisible : false,
                logo: ""
            }
        },
        computed: {
            isCollapse() {
                return this.$store.state.app.sidebar.isCollapse;
            },
            permissionRoutes() {
                return this.$store.state.permission.permissionRoutes
            },
            activeIndex() {
                return this.$route.matched[0].name
            },
            activeIndex2() {
                return this.$route.matched[1].name
            }
        },
        methods: {
            showDetail(){
                   this.formVisible = true;
            },
            handlerGo() {
                let routObj = $.extend({}, arguments[0]), pat = arguments[1]
                routObj.path = pat + '/' + (routObj.defPath || routObj.path)
                routObj.name = routObj.tagName || routObj.name
//                console.log("菜单点击")
//                console.log(routObj)
//                store.dispatch('AddTab', routObj)
            },
            handleCollapse(e) {
                e.stopPropagation();
                this.$store.commit("TOGGLE_SIDEBAR")
                $(".h_logo").addClass("h_logo_mini");
            },
            handleOpenSider() {
                this.$store.commit("OPEN_SIDEBAR")
                $(".h_logo").removeClass("h_logo_mini");
            },
        },
        created() {
            // 初始化logo
            /*let host2 = document.domain;
            //获取域名
            //获取页面完整地址
            /!*let host = window.location.host;
            let url = window.location.href;*!/

            if (host2) {
                if (host2.indexOf("hypersmart") > -1) {
                    this.showHypersmart = true;
                    this.showLandingnext = false;
                }
                if (host2.indexOf("landingnext") > -1) {
                    this.showHypersmart = false;
                    this.showLandingnext = true;
                }
            }*/

            // 判断当前登录人所属企业
            let corpId;
            if (store && store.getters.user && store.getters.user.user.roles) {
                if (store.getters.user.user.roles.length > 0) {
                    let roleType= store.getters.user.user.roles[0].roleType;
                    if(roleType =='ORG'){   //  组织
                        // 取得企业id
                        if (store.getters.corporation) {
                            corpId = store.getters.corporation.id;
                        }
                    }
                    if(roleType =='CORP'){  //  企业
                        if (store.getters.corporation) {
                            corpId = store.getters.corporation.id;
                        }
                    }

                    if(roleType=='PLATFORM'){   //  平台
                    }
                }
                if(corpId){
                    /*if(corpId == '29'){
                        // ld
                        this.showHypersmart = false;
                        this.showLandingnext = true;
                    }else{
                        this.showHypersmart = true;
                        this.showLandingnext = false;
                    }*/
                    this.showLogo = true;
                    this.logo = store.getters.corporation.logo;
                }else{
                    this.showLogo = false;
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

    .sidebar-container {
        .el-submenu__title {
            color: #fff;
        }
        .h_logo {
            width: 90px;
            overflow: hidden;
            margin: 0 auto;
            transition: all .28s linear;
        }
        .h_logo img {
            vertical-align: middle;
            width: 100%;
        }
        .h_logo_mini {
            width: 40px;

        }
        .barScroll {
            overflow-y: auto;
            overflow-x: hidden;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 65px;
            top: 105px;
        }
        .barScroll::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background-color: #45517b;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        .barScroll::-webkit-scrollbar-track {
            // -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
            border-radius: 0px;
            background-color: #45517b;
            border: 0;
        }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            // -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.2);
            background-color: #6976a2;
        }
        .el-menu-vertical:not(.el-menu--collapse) {
            width: 188px;
            overflow: hidden;
            background: none;
            .wscn-icon {
                margin-right: 2px;
            }
        }
        .text_logo {
            margin-top: 5px;
        }
        h2 {
            font-size: 18px;
            color: #fff;
            text-align: center;
            padding: 0;
            margin-top: 0;
            transition: all .28s linear;
            padding-top: 10px;
            height: 105px;
            // line-height:120px;
            position: relative;
            background: #363f5e;
            margin-bottom: 0;
            overflow: hidden;
            // border-bottom:solid 1px #9bb2c7;
            .book {
                position: absolute;
                right: 0;
                top: 2px;
                z-index: 100000;
            }
        }
        .el-submenu {
            .title {
                color: #fff;
            }
        }

        .el-menu {
            min-height: 100%;
            background: none;
        }
        .el-menu-item {
            color: #fff;
            // background-color: #5d8ab3;
            // border-left:4px solid #5d8ab3;
        }
        .is-opened .el-menu {
            background: #45517b;
        }
        .icon-wechat {
            width: 14px;
            height: 14px;
            vertical-align: middle;
            fill: #fff;
            /*margin-right: 10px;*/
        }

        .hideSidebar .title-link {
            display: inline-block;
            padding-left: 10px;
        }
        .el-submenu {
            &.is-active {
                background-color: transparent;
            }
            &.active {
                background-color: #50769a;
            }
        }

        .el-menu-item {
            &.is-active {
                background-color: transparent;
            }
            &.active {
                background-color: #2b77be;
            }
            &.active-sub {
                background-color: #50769a;
            }
            // border-left:4px solid #135f97;

        }
        .el-menu-item:hover {
            // border-left:4px solid #cc5f36;
            background: #6976a2;
            // color:#2e64ae;
        }
    }

    .el-submenu__title:hover {
        background: #6976a2;
    }

    .hideSidebar .text_logo {
        display: none;
    }

    .hideSidebar h2 {
        height: 58px;
    }

    .hideSidebar .barScroll {
        overflow: inherit;
    }

</style>
