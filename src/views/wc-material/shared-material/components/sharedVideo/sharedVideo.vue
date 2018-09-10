<template>
    <div>
        <div class="material-content">
            <div class=" account-filter-container">
                <el-button class="btn btn-edit" type="primary" @click="onSearch">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
            </div>
            <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;padding-top:0;">

                <el-col class="item" :span="6" v-for="x in dataList" :key="x.id">
                    <div class="item-wrapper">
                        <div class="item-wrapper-img">
                            <video height="155px" width="100%" :src="videoSrcPrefix + x.serverUrl"
                                   @click="showVideo(videoSrcPrefix + x.serverUrl)"></video>
                        </div>
                        <p class="material-title">{{x.name}}</p>
                        <div class="icon-container">
                            <a class="icon-wrapper" @click="onDownload(x)" v-authority="'Material.Share.download'">
                                <svg class="icon icon-edit1 material-download" aria-hidden="true">
                                    <use xlink:href="#icon-download"></use>
                                </svg>
                            </a>
                        </div>                    </div>
                </el-col>
            </el-row>
            <pagination :total="totalPage" ref="pages" :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>

            <el-dialog class="dialogForm" :visible.sync="videoDialogVisible" @close="stopPlay">
                <video controls="controls" width="100%" height="100%" :src="videoSrc">
                    您的浏览器不支持html5播放器，请升级浏览器或者使用chrome。
                    <source :src="videoSrc" type="video/mp4">
                </video>
            </el-dialog>


        </div>

        <!--筛选区-->
        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form ref="searchForm">
                <el-form-item label="素材名称">
                    <el-input style="ime-mode:disabled"   v-model="pageParam.name"  placeholder="请输入素材名称"></el-input>
                </el-form-item>

                <el-radio-group class="radio-menu" v-model="pageParam.viewMode">
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

<script src="./sharedVideo.js">

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