<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->

        <!--展示区-->
        <div style="clear:both;">
            <!-- <div>
                <h3 class="title">微信用户菜单管理</h3>
                <el-button type="primary" class="configure fr" v-authority="'ROLE_ADMIN'">
                    <svg class="icon icon-configure1" aria-hidden="true">
                        <use xlink:href="#icon-configure1"></use>
                    </svg>
                    配置
                </el-button>
            </div> -->
            <div class="menuSimulator">
                <div class="status">2017-08-01</div>
                <div class="header">官微</div>
                <div class="tipInfo">
                    <div class="text">微信菜单配置提示</div>
                    <div class="pic"></div>
                    <div class="memo">请您点击页面上方的“配置”按钮，对微信菜单进行配置。</div>
                </div>
                <div class="menuNone hide">
                </div>

                <div class="menuView">
                    <div class="ime"></div>
                    <div class="action">
                        <el-row>
                            <el-col v-for="(menu,index) in prevMenuData" :key="index" v-if="menu.subButton" :class="{hadChild: menu.subButton.buttonType == 'navigation'}" :span="24/prevTrueLength" class="buttonGroup">
                                <div class="menuG">
                                    <span class="button topBtn" @click="toggleVisible(index)">{{menu.subButton.text}}</span>
                                    <ul class="children">
                                        <li v-for="name in menu.buttons" v-show="index == showIndex" class="button chiBtn">
                                            {{name}}
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="menuSelector">
                <menu-group :menuData="menuData.menuGroup01" :group="'1'"></menu-group>
                <menu-group :menuData="menuData.menuGroup02" :group="'2'"></menu-group>
                <menu-group :menuData="menuData.menuGroup03" :group="'3'"></menu-group>
                <div class="filter-container"  v-authority="'WeChatMenuInfo.Modify'">
                        <el-button type="danger" class="cancel" @click="refresh">
                            <svg class="icon icon-cancel1" aria-hidden="true">
                                <use xlink:href="#icon-cancel1"></use>
                            </svg>
                            刷新
                        </el-button>
                    <el-button type="primary" class="save" @click="handleSave">
                        <svg class="icon icon-save1" aria-hidden="true">
                            <use xlink:href="#icon-save1"></use>
                        </svg>
                        保存
                    </el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script src="./wcMenu.js"></script>
<style scoped lang="scss" src="./wcMenu.scss"></style>
