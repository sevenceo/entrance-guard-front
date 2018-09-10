<template>
    <div>
        <div class="material-content">
            <div class=" account-filter-container">
                <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Material.Mine.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    新增
                </el-button>
                <el-button class="btn btn-edit" type="primary" @click="onSearch"  >
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
            </div>
            <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                <el-col class="control-bar" :span="24">
                    <label class="select-all-wrapper">
                        <input class="checkbox" type="checkbox" v-model="checkAll" @click="selectAll"><label
                            class="select-all">全选</label>
                    </label>
                    <a @click="setUnshared">设为非共享</a>
                </el-col>
                <el-col class="item" :span="6" v-for="x in dataList" :key="x.id">
                    <div>
                        <div class="triangle-topright" v-if="x.shared"></div>
                        <input type="checkbox" class="checkbox item-checkbox" :value="x.id" :id="x.id" v-if="x.shared" v-model="checkboxStatus" >
                        <label :for="x.id"></label>
                    </div>
                    <div class="item-wrapper">


                        <div class="item-wrapper-img">
                            <img :src="imageUrl + x.picUrl"
                                 alt="">
                            <!--三角-->


                            <!--黑色遮罩层-->
                            <!--<div class="image-cover image-cover-black"></div>-->

                            <!--白色遮罩层-->
                            <!--<div class="image-cover image-cover-white"></div>-->
                        </div>
                        <p class="material-title">{{x.name}}</p>
                        <div class="icon-container">
                            <!--<a class="icon-wrapper">-->
                                <!--<svg class="icon icon-edit1" aria-hidden="true">-->
                                    <!--<use xlink:href="#icon-download"></use>-->
                                <!--</svg>-->
                            <!--</a>-->
                            <a class="icon-wrapper" @click="onShare(x)" v-authority="'Material.Mine.Share'"  v-if="!x.shared">
                                <svg class="icon icon-edit1 material-share" aria-hidden="true">
                                    <use xlink:href="#icon-share"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper" @click="onEdit(x)" v-authority="'Material.Mine.Modify'">
                                <svg class="icon icon-edit1 material-edit" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper delete" @click="onDelete(x.id,x.account)" v-authority="'Material.Mine.Remove'">
                                <svg class="icon icon-edit1 material-delete" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <pagination :total="totalPage" ref="pages" :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>
        </div>

        <!--编辑区-->

        <el-dialog class="dialogForm" :visible.sync="dialogFormVisible" @close="resetForm">
            <div class="dialogFormBox">
                <el-form class="small-space" :model="temp" ref="temp" :rules="rules" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
                    <el-form-item label="素材名称" prop="name">
                        <el-input type="text" v-model="temp.name" placeholder="请输入素材名"></el-input>
                    </el-form-item>
                    <el-form-item label="素材标题" prop="title">
                        <el-input v-model="temp.title"></el-input>
                    </el-form-item>
                    <el-form-item label="封面图片" prop="picUrl">
                        <el-upload class="avatar-uploader" :action="upLoadApi" :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="avatarUpload">
                            <img v-if="picUrl" :src="picUrl" style="width: 100px;height: 100px;" class="avatar">
                            <i v-else class="el-icon-plus
                            avatar-uploader-icon
                             material-icon"></i>
                        </el-upload>
                        <el-input v-model="temp.picUrl" v-show="false"></el-input>
                    </el-form-item>

                    <el-form-item label="网页授权" prop="scopeType">
                        <el-select v-model="temp.scopeType">
                            <el-option
                                    v-for="(item , index) in scopeTypeOptions"
                                    :key="item.scopeValue"
                                    :label="item.label"
                                    :value="item.scopeValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接地址" prop="url">
                        <el-input v-model="temp.url"></el-input>
                    </el-form-item>
                    <el-form-item label="正文描述" prop="description">
                        <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4}" v-model="temp.description"></el-input>
                    </el-form-item>
                </el-form>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()" type="default">取 消</el-button>
                <el-button v-if="temp.id" type="primary" @click="update()" :loading="$store.state.app.onXHR">确 定</el-button>
                <el-button v-else="!temp.id" type="primary" :loading="$store.state.app.onXHR" @click="create()">确 定</el-button>
            </div>

        </el-dialog>

        <!--筛选区-->

        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form ref="searchForm">
                <el-form-item label="素材名称">
                    <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="请输入素材名称"></el-input>
                </el-form-item>
                <el-radio-group class="radio-menu" v-model="pageParam.viewMode" >
                    <el-radio-button label="MY_SHARED" size="large">仅显示我共享的</el-radio-button>
                    <br/>
                    <el-radio-button class="my-download-radio" label="MY_IMPORT" size="large">仅显示我下载的</el-radio-button>
                </el-radio-group>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="resetSearchForm" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search" type="default">
                    筛选
                </el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script src="./myMaterialLink.js">

</script>

<style scoped lang="scss">

</style>