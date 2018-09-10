<template>
    <div>
        <el-button @click="getMaterial" v-if="showBtn">请选择素材</el-button>
        <el-button style="margin-left:0;" @click="getMaterial" v-else>
            <svg class="wscn-icon" aria-hidden="true" style="width: 24px;height: 18px;fill: currentColor;margin-top: -1px;overflow: hidden;">
                <use xlink:href="#icon-sucai"></use>
            </svg>
        </el-button>


        <el-dialog class="dialogForm" :visible.sync="materialSelectBoxVisible" @close="reset" :modal="true"
                   ref="dialog">

            <el-tabs @tab-click="materialTabClick" v-model="activeName">
                <el-tab-pane label="外链" name="link">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-wrapper">
                                <div class="it-img" style="position: relative">
                                    <img width="100%" height="120px" :src="baseUrl + x.picUrl" alt="">
                                </div>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="图文" name="news">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-wrapper">
                                <div class="it-img" style="position: relative">
                                    <img width="100%" height="120px" :src="baseUrl + x.serverUrl" alt="">
                                </div>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="文字" name="text">

                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-text-wrapper">
                                <div class="text-wrapper">
                                    <p :title="x.content">{{x.content}}</p>
                                </div>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="图片" name="image">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-wrapper">
                                <div class="it-img" style="position: relative">
                                    <img :src="baseUrl + x.serverUrl" alt="">
                                </div>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="语音" name="voice">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-wrapper">
                                <audio style="width: 100%" class="audio" controls="controls"
                                       :src="baseUrl + x.serverUrl">
                                    <source :src="baseUrl + x.serverUrl">
                                </audio>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="视频" name="video">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item itemGroup" :span="8" v-for="x in dataList" :key="x.id">
                            <div class="item-wrapper">
                                <video width="100%" controls="controls" :src="baseUrl + x.serverUrl">
                                    <source :src="baseUrl + x.serverUrl">
                                </video>
                                <p class="material-title" :title="x.name">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>

            <pagination :total="totalPage" :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>


            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel" type="default">取 消</el-button>

                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="./materialSelectBox.js">

</script>

<style scoped>
    .item-wrapper .it-img{
        padding:3px;height:120px;text-align: center;overflow: hidden;line-height:0;
        display:table-cell;
        display:block\0;
        vertical-align: middle;
        width:560px;
        width:100%\0;
    }
    .item-wrapper .it-img img{
        max-height: 100%;max-width: 100%;vertical-align: middle;border:0;margin:0;padding:0;

    }
    .item-wrapper p,.item-text-wrapper p{
        height:30px;line-height:30px;padding:0 5px;margin:0;text-align: left;background-color: rgba(0, 0, 0, 0.1);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100%;
    }
    .select-radio{
        margin-top:5px;
    }
    .item-text-wrapper{
        border:solid 1px #d5d5d5;
    }
    .item-wrapper video,.item-wrapper audio{
        height:120px;background-color: #eee;background-repeat: no-repeat;background-position:center 30%;background-size: 25%;
    }
    .item-wrapper video{
        background-image:url('../../../static/img/video.png');
    }
    .item-wrapper audio{
        background-image:url('../../../static/img/music.png');
    }
    .text-wrapper{
        padding:3px 3px 0;height: 120px;text-align: left;overflow: hidden;display: block;background-color: #eee;
    }
    .text-wrapper p{
        margin:30% 0 0 0;padding:0;text-align: center;display: inline-block;background: none;
    }
    .itemGroup{
        margin-bottom:15px;text-align: center;
    }
    .btn-msgBox{border-radius: 0;}
    .btn-msgBox:hover{
        background:#eee;
    }
</style>