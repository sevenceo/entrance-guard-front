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
                            class="select-all" v-if="!checkAll">全选</label><label class="select-all" v-else="checkALl">全不选</label>
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
                            <video height="155px" width="100%" :src="videoUrl + x.serverUrl" @click="showVideo(x.serverUrl)"></video>
                            <!--三角-->
                          <!--黑色遮罩层-->
                            <!--<div class="image-cover image-cover-black"></div>-->
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
            <pagination :total="totalPage" ref="pages"  :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>

            <el-dialog class="dialogForm"  :visible.sync="videoDialogVisible" @close="stopPlay">
                <div style="width: 560px;height: 300px;">
                    <video controls="controls" width="100%" height="100%" :src="videoSrc">
                        您的浏览器不支持html5播放器，请升级浏览器或者使用chrome。
                        <source :src="videoSrc" type="video/mp4">
                    </video>
                </div>
            </el-dialog>


        </div>

        <el-dialog class="dialogForm" :visible.sync="dialogFormVisible" @close="resetForm">
            <div class="dialogFormBox">
                <el-form class="small-space" :model="temp" :rules="rules" ref="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>

                    <el-form-item label="素材名称" prop="name">
                        <el-input v-model="temp.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="temp.title"></el-input>
                    </el-form-item>

                    <el-form-item label="视频" prop="serverUrl">
                        <el-upload class="avatar-uploader" :action="upLoadApi"  :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="avatarUpload">
                            <video v-if="serverUrl" :src="serverUrl" style="width: 100px;height: 100px;" class="avatar">
                                <source :src="serverUrl">
                            </video>
                            <i v-else class="el-icon-plus
                             avatar-uploader-icon material-icon"></i>
                        </el-upload>
                        <el-input v-model="temp.serverUrl" v-show="false"></el-input>
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
                    <el-input   v-model="pageParam.name" style="ime-mode:disabled" placeholder="请输入素材名称"></el-input>
                </el-form-item>

                <el-radio-group class="radio-menu" v-model="pageParam.viewMode" >
                    <el-radio-button label="MY_SHARED" size="large">仅显示我共享的</el-radio-button>
                    <br/>
                    <el-radio-button class="my-download-radio" label="MY_IMPORT" size="large">仅显示我下载的</el-radio-button>
                </el-radio-group>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" type="default" @click="resetSearchForm">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" type="default" @click="search">
                    筛选
                </el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script src="./myMaterialVideo.js">

</script>

<style scoped lang="scss">
    .text-wrapper {
        padding: 20px;
        position: relative;
        background-color: #f2f2f2;
        p {
            text-align: center;
        }
    }

</style>