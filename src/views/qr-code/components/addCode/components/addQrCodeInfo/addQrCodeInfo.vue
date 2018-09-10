<template>
    <div>
        <div>
            <el-form class="small-space" label-position="left" label-width="100px" style='width: 400px; margin:50px;margin-top: 0'
                     ref="replyMForm" :model="tempMaterial">

                <el-form-item label="素材选择" v-if=" actionType !== '查看'" >
                    <MaterialSelectBox @selectedMaterial = 'getSelectedTempMaterial'></MaterialSelectBox>
                </el-form-item>

                <!--<el-form-item label="推送类型" prop="materialType">-->
                <!--<el-select @change="loadMName" style="float: left;width: 100%" v-model="materialContent.materialType"-->
                <!--placeholder="请选择推送类型">-->
                <!--<el-option label="文字" value="text"></el-option>-->
                <!--<el-option label="外链" value="link"></el-option>-->
                <!--<el-option label="图片" value="image"></el-option>-->
                <!--<el-option label="图文" value="news"></el-option>-->
                <!--<el-option label="视频" value="video"></el-option>-->
                <!--<el-option label="语音" value="voice"></el-option>-->
                <!--</el-select></el-form-item>-->
                <el-form-item label="素材名称" prop="materialName">
                    <span>{{tempMaterial.materialName}}</span>
                </el-form-item>

                <el-form-item label="素材预览">
                    <!-- 文本 -->
                    <div class="text"  v-if="tempMaterial.materialType=='text'">{{materialContent.content}}</div>

                    <!-- 图片 -->
                    <div class="text" v-else-if="tempMaterial.materialType=='image'"   >
                        <el-tooltip content="图片" placement="top">
                            <img style="width: 100%" v-if="materialContent.serverUrl" :src="imageUrl + materialContent.serverUrl">
                            <img v-else src="~assets/replace.png">
                        </el-tooltip>
                    </div>
                    <!-- 语音 -->
                    <div class="text" v-else-if="tempMaterial.materialType=='voice'" >
                        <audio class="audio" controls="controls" :src="mediaUrl + materialContent.serverUrl">
                            <source :src="mediaUrl + materialContent.serverUrl">
                        </audio>
                    </div>

                    <!-- 视频 -->
                    <div class="text" v-else-if="tempMaterial.materialType=='video'" >
                        <video height="192px" width="100%"  :src="mediaUrl + materialContent.serverUrl"></video>
                    </div>
                    <!-- 链接 -->
                    <div class="text" v-else-if="tempMaterial.materialType=='link'"  >
                        <img style="width: 100%" v-if="materialContent.picUrl" :src="imageUrl+materialContent.picUrl">

                        <img v-else src="~assets/replace.png">
                        <a :href="materialContent.url" target="_blank">
                            <div style="border-top: 1px solid gray">
                                <div style="float: left"> 阅读全文</div> <div style="float: right">></div>
                            </div>
                        </a>
                    </div>
                    <!-- 其他 -->
                    <div class="text"  v-else>
                        <el-tooltip content="图文" placement="top">
                            <img style="width: 100%" v-if="materialContent.serverUrl" :src="imageUrl+materialContent.serverUrl">
                            <img v-else src="~assets/replace.png">
                        </el-tooltip>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script src="./addQrCodeInfo.js">

</script>

<style scoped> 

</style>