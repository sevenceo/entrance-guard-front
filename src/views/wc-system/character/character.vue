<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <div class="userInfo-tabs">
            <el-tabs class="v-content">
                <el-tab-pane label="基本信息">
                    <!--<span class="text-title">角色名称<i>*</i></span>-->
                    <!--<el-input-->
                            <!--style="width: 600px;padding-left: 90px"-->
                            <!--type="textarea"-->
                            <!--autosize-->
                            <!--placeholder="填写用户角色名称"-->
                            <!--:maxlength= '50'-->
                    <!--&gt;-->
                    <!--</el-input>-->
                    <!--<div style="margin: 20px 0;"></div>-->
                    <!--<span class="text-title">摘要信息<i></i></span>-->
                    <!--<el-input-->
                            <!--style="width: 600px;padding-left: 90px"-->
                            <!--type="textarea"-->

                            <!--placeholder="填写关于该用户角色的摘要信息"-->

                            <!--:maxlength= '200'-->
                    <!--&gt;-->
                    <!--</el-input>-->


                    <el-form class="small-space" :model="roleInfo" ref="roleInfo" :rules="rules" label-position="left" label-width="90px" style='width: 400px; '>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model.trim="roleInfo.name" style="width: 600px" placeholder="填写用户角色名称"></el-input>
                        </el-form-item>

                        <el-form-item label="摘要信息" prop="description">
                            <el-input type="textarea" style="width: 600px" :autosize="{ minRows: 4, maxRows: 6}" v-model="roleInfo.description" placeholder="填写关于该用户角色的摘要信息"></el-input>
                        </el-form-item>

                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="功能权限">
                    <div class="row_box">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple user_title">模块名称</div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light user_title">功能权限</div>
                            </el-col>
                        </el-row>
                        <div class="js-checkbox-con" v-for="(row,index) in tableList" :key="index">
                            <row-module :row="row"></row-module>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
                    <div class="grid-content bg-purple">
                        <div class="filter-container">
                            <router-link :to="'/weChat/roles-manage'">
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
                    </div>
        </div>
    </div>
</template>


<script src="./character.js"></script>
<style scoped src="./character.scss"></style>
