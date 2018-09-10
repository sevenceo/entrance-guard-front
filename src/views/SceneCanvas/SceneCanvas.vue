<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="setCanvasSize">
                尺寸设置
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onAddImg">
                设置背景
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="saveSceneCanvas">
                保存设置
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="resetCanvas">
                重置
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="backToSensingDevice">
                返回
            </el-button>
        </div>

        <div style="width: 100%; height: 100%;">

            <!--<img id="bg-image" src="~assets/logo.png" style="display: none;" />-->


            <span class="top-title"><label>1920</label> px</span>
            <div class="el-table blue-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition"
                 style="width: 100%; height: 95%;">
                <img id="bg-image" src="~assets/logo.png" style="position: absolute;" />
                <canvas ref="myCanvas" id="myCanvas"></canvas>
            </div>
            <span class="left-title"><label>1080</label> px</span>

            <el-dialog class="dialogForm" title="场景设置" :visible="sceneFormVisible"
                       @close="handleSceneCancel()">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="sceneTemp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="场景名称" prop="sceneName">
                            <el-input v-model="sceneTemp.sceneName"
                                      placeholder="请输入场景名称"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="sceneRemark">
                            <el-input v-model="sceneTemp.sceneRemark" type="textarea"
                                      :rows="2"
                                      placeholder="请输入备注"></el-input>
                        </el-form-item>
                        <el-form-item label="是否锁定" prop="sceneResize">
                            <label>是<input v-model="sceneTemp.sceneResize" type="radio" value="true"/></label>
                            <label>否<input v-model="sceneTemp.sceneResize" type="radio" value="false"/></label>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleSceneCancel" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm"
                               @keyup.enter="updateScene('form')"
                               @click="updateScene('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="感应设备窗口大小设置" :visible.sync="sizeFormVisible"
                       @close="handleSizeCancel()">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="sceneSizeTemp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="宽度（px）" prop="width">
                            <el-input v-model="sceneSizeTemp.width" min="0"
                                      placeholder="请输入宽度"></el-input>
                        </el-form-item>
                        <el-form-item label="高度（px）" prop="height">
                            <el-input v-model="sceneSizeTemp.height" min="0"
                                      placeholder="请输入高度"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleSizeCancel" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm"
                               @keyup.enter="updateSize()"
                               @click="updateSize()"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <!--<el-dialog class="dialogForm" title="设置背景图片" :visible.sync="dialogImg" @close="onCloseImg()">-->
                <!--<el-upload-->
                        <!--class="avatar-uploader"-->
                        <!--action="1"-->
                        <!--:show-file-list="false"-->
                        <!--:auto-upload="false"-->
                        <!--:before-upload="beforeAvatarUpload"-->
                        <!--:on-change="changeFeature">-->
                    <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--</el-upload>-->
            <!--</el-dialog>-->


            <el-dialog class="dialogForm" title="设置背景图片" :visible.sync="dialogImg" @close="onCloseImg()">

                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="upLoadData"
                             ref="back_form"
                             :rules="rules">
                        <el-form-item label="背景地址" prop="baseStr">
                            <el-input v-model="upLoadData.baseStr" min="0"
                                      placeholder="请输入背景地址"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="onCloseImg" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm"
                               @keyup.enter="updateBack()"
                               @click="updateBack()"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<style scoped>
    #myCanvas {
        border: 1px solid greenyellow;
        background:rgba(255,255,255,0);/*关键点*/
        z-index: 100;
        position: relative;
    }

    .top-title {
        /*display:block;*/
        width: 100px;
        height: 20px;
        position: relative;
        top: 43px;
        left: 0px;
        text-align: center;
        background: #FFF;
        z-index: 10;
        padding: 0 5px;
    }

    .left-title {
        background: #FFF;
        display: block;
        height: 105px;
        width: 15px;
        position: absolute;
        left: 14px;
        top: 220px;
        text-align: center;
        vertical-align: middle;
        padding: 5px 2px;
        white-space: normal;
        word-break: break-all;
    }
</style>
<script src="./SceneCanvas.js"></script>
