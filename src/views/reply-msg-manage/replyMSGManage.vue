<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="fans-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AutoReply.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-table v-if="props.row.replyType=='condition'" :data="props.row.replyBody" border stripe
                                  style="width: 100%;" class="blue-table">
                            <el-table-column prop="fansGroupName" label="粉丝组">
                            </el-table-column>
                            <el-table-column label="素材类型">
                                <template scope="scope">
                                    {{ pushTypeMap[scope.row.pushType] }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="materialName" label="推送素材标题">
                            </el-table-column>
                        </el-table>
                        <el-table v-else :data="props.row.replyBody" border stripe style="width: 100%;"
                                  class="blue-table">
                            <el-table-column label="消息类型">
                                <template scope="scope">
                                    {{ pushTypeMap[scope.row.pushType] }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="materialName" label="推送素材标题">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="回复类型">
                    <template scope="scope">
                        {{ Type[scope.row.replyType] }}
                    </template>
                </el-table-column>


                <el-table-column prop="keyWord" label="关键字">
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="80px">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   size="small" v-authority="'AutoReply.Modify'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   size="small" v-authority="'AutoReply.Remove'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!--翻页-->
            <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>

            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width:90%;margin-left:5%;'
                             :rules="replyRules" ref="replyForm" :model="temp">
                        <el-form-item v-if="temp.replyType!='search'" label="关键字" prop="keyWord">
                            <el-input v-model="temp.keyWord" placeholder="请输入关键字"></el-input>
                        </el-form-item>
                        <el-form-item v-if="temp.replyType!='search'" label="回复类型" prop="replyType">
                            <el-select style="float: left;width: 100%" v-model="temp.replyType"
                                       placeholder="请选择回复类型">
                                <el-option label="直接回复" value="auto" ></el-option>
                                <el-option label="条件回复" value="condition"></el-option>
                                <el-option v-if="dialogStatus=='editor'&&temp.replyType=='search'" label="搜索关注"
                                           value="search"></el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="temp.replyType=='condition'" class="condition">
                            <el-table :data="temp.replyBody" class="condition" border stripe style="width: 100%;">
                                <el-table-column prop="fansGroupName" label="粉丝组">
                                </el-table-column>
                                <el-table-column label="消息类型">
                                    <template scope="scope">
                                        {{ pushTypeMap[scope.row.pushType] }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="materialName" label="推送素材标题">
                                </el-table-column>
                                <el-table-column prop="type" label="操作" align="center">
                                    <template scope="scope2">
                                        <el-button type="default" title="编辑" class="icon-btn edit"
                                                   @click="onEdit2(scope2.$index,scope2.row)" size="small"
                                                   v-authority="'SystemConfig.SystemUser.Modify'">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-edit1"></use>
                                            </svg>
                                        </el-button>
                                        <el-button type="default" title="删除" class="icon-btn delete"
                                                   @click="onDelete2(scope2.$index,scope2.row)" size="small"
                                                   v-authority="'SystemConfig.SystemUser.Remove'">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-delete1"></use>
                                            </svg>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button @click="onAddMaterial" style="margin-top: 5px" class="confirm  condition">新增
                            </el-button>
                        </div>
                        <div v-else class="auto">
                            <el-form-item label="是否推送" v-if="temp.replyType == 'search'">
                                <el-switch
                                        v-model="isPush"
                                        off-value="no-push"
                                        on-text="推送"
                                        off-text="不推送"
                                        :width=75
                                        @change="change"
                                >
                                </el-switch>
                            </el-form-item>

                            <!--<el-form-item label="素材类型" prop="pushType" v-if="">-->
                                <!--<el-select @change="loadMName" style="float: left;width: 100%" v-model="temp.pushType"-->
                                           <!--placeholder="请选择推送类型">-->
                                    <!--<el-option v-if="temp.replyType=='search'" label="不推送" value="no-push"></el-option>-->
                                    <!--<el-option label="文字" value="text"></el-option>-->
                                    <!--<el-option label="外链" value="link"></el-option>-->
                                    <!--<el-option label="图片" value="image"></el-option>-->
                                    <!--<el-option label="图文" value="news"></el-option>-->
                                    <!--<el-option label="视频" value="video"></el-option>-->
                                    <!--<el-option label="语音" value="voice"></el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                            <el-form-item v-if="temp.pushType!='no-push'" label="素材名称" prop="materialName">
                                <!--<el-select @change="loadMaterial" style="float: left;width: 100%"-->
                                           <!--v-model="temp.materialId"-->
                                           <!--placeholder="请选择素材名称">-->
                                    <!--<el-option v-for="item in mOptions" :key="item.id" :label="item.name"-->
                                               <!--:value="item.id">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->

                                <span>{{temp.materialName}}</span>

                            </el-form-item>



                            <el-form-item v-if="temp.pushType!='no-push'" label="素材选择">
                                <MaterialSelectBox  style="float:left;margin-right: 5px"  @selectedMaterial = 'getSelectedMaterial'></MaterialSelectBox>
                                <el-button class="material-btn"  @click="getCard">选择卡券</el-button>
                            </el-form-item>

                            <el-form-item v-if="temp.pushType!='no-push'" label="素材预览">
                                <!-- 文本 -->
                                <div class="text" v-if="temp.pushType=='text'">{{temp.content}}</div>

                                <!-- 图片 -->
                                <div class="text" v-else-if="temp.pushType=='image'">
                                    <img style="width: 100%" v-if="temp.serverUrl" :src="imageUrl+temp.serverUrl">
                                    <img v-else src="~assets/replace.png">
                                    <!--<img :src="message.media.picUrl" class="image" alt="聊天图片">-->
                                </div>
                                <!-- 语音 -->
                                <div class="text" v-else-if="temp.pushType=='voice'">
                                    <audio class="audio" controls="controls" :src="mediaUrl + temp.serverUrl">
                                        <source :src="mediaUrl + temp.serverUrl">
                                    </audio>
                                </div>

                                <!-- 视频 -->
                                <div class="text" v-else-if="temp.pushType=='video'">
                                    <video height="192px" width="100%" :src="mediaUrl + temp.serverUrl"
                                           @click="showVideo(temp.serverUrl)"></video>
                                </div>
                                <!-- 链接 -->
                                <div class="text" v-else-if="temp.pushType=='link'">
                                    <img style="width: 100%" v-if="temp.picUrl" :src="imageUrl+temp.picUrl">
                                    <img v-else src="~assets/replace.png">
                                    <a :href="temp.url" target="_blank">
                                        <div style="border-top: 1px solid gray">
                                            <div style="float: left"> 阅读全文</div>
                                            <div style="float: right">></div>
                                        </div>
                                    </a>
                                </div>

                                <!-- 卡券 -->
                                <div class="text" v-else-if="temp.pushType=='card'">
                                    <div class="cardBack">
                                        <div class="cardBorder">
                                            <div class="shopImgBorder">
                                                <img  class="shopImg" v-if="temp.picUrl"  :src="imageUrl+temp.picUrl" >
                                                <img class="shopImg"  v-else  src="~assets/replace.png">
                                            </div>
                                            <div style="margin:10px; float: left">
                                                {{temp.materialName}}
                                            </div>
                                        </div>
                                        <div class="footFont">
                                            <span>微信卡券</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 其他 -->
                                <div class="text" v-else>
                                    <img style="width: 100%" v-if="temp.serverUrl" :src="imageUrl+temp.serverUrl">
                                    <img v-else src="~assets/replace.png">
                                </div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('replyForm')"
                               @click="update('replyForm')">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <!--dialog编辑区2-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2"
                       @close="resetForm2">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :rules="replyRules" ref="addMForm" :model="tempMaterial">
                        <el-form-item label="粉丝组" prop="fansGroupId">
                            <el-select style="float: left;width: 100%" v-model="tempMaterial.fansGroupId"
                                       placeholder="请选择粉丝组">
                                <el-option class="fansSelect" v-for="item in fansGroup" :key="item.id"
                                           :label="item.name" :value="item.id" :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="推送类型" prop="pushType">-->
                            <!--<el-select @change="loadMName2" style="float: left;width: 100%"-->
                                       <!--v-model="tempMaterial.pushType"-->
                                       <!--placeholder="请选择推送类型">-->
                                <!--<el-option label="文字" value="text"></el-option>-->
                                <!--<el-option label="外链" value="link"></el-option>-->
                                <!--<el-option label="图片" value="image"></el-option>-->
                                <!--<el-option label="图文" value="news"></el-option>-->
                                <!--<el-option label="视频" value="video"></el-option>-->
                                <!--<el-option label="语音" value="voice"></el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->

                        <el-form-item label="素材选择">
                            <MaterialSelectBox style="float:left;margin-right: 5px" @selectedMaterial = 'getSelectedMaterial'>
                            </MaterialSelectBox>
                            <el-button class="material-btn"  @click="getCard">选择卡券</el-button>
                        </el-form-item>

                        <el-form-item label="素材名称" prop="materialName">
                            <span>{{tempMaterial.materialName}}</span>
                        </el-form-item>

                        <el-form-item label="素材预览">
                            <!-- 文本 -->
                            <div class="text" v-if="tempMaterial.pushType=='text'">{{tempMaterial.content}}</div>

                            <!-- 图片 -->
                            <div class="text" v-if="tempMaterial.pushType=='image'">
                                <img style="width: 100%" v-if="tempMaterial.serverUrl"
                                     :src="imageUrl+tempMaterial.serverUrl">
                                <img v-else src="~assets/replace.png">
                                <!--<img :src="message.media.picUrl" class="image" alt="聊天图片">-->
                            </div>
                            <!-- 语音 -->
                            <div class="text" v-if="tempMaterial.pushType=='voice'">
                                <audio class="audio" controls="controls" :src="mediaUrl + tempMaterial.serverUrl">
                                    <source :src="mediaUrl + tempMaterial.serverUrl">
                                </audio>
                            </div>

                            <!-- 视频 -->
                            <div class="text" v-if="tempMaterial.pushType=='video'">
                                <video height="192px" width="100%" :src="mediaUrl + tempMaterial.serverUrl"
                                       @click="showVideo(tempMaterial.serverUrl)"></video>
                            </div>
                            <!-- 链接 -->
                            <div class="text" v-if="tempMaterial.pushType=='link'">
                                <img style="width: 100%" v-if="tempMaterial.picUrl" :src="imageUrl+tempMaterial.picUrl">
                                <img v-else src="~assets/replace.png">
                                <a :href="tempMaterial.url" target="_blank">
                                    <div style="border-top: 1px solid gray">
                                        <div style="float: left"> 阅读全文</div>
                                        <div style="float: right">></div>
                                    </div>
                                </a>
                            </div>

                            <!-- 卡券 -->
                            <div class="text" v-else-if="tempMaterial.pushType=='card'">
                                <div class="cardBack">
                                    <div class="cardBorder">
                                        <div class="shopImgBorder">
                                            <img  class="shopImg" v-if="tempMaterial.picUrl"  :src="imageUrl+tempMaterial.picUrl" >
                                            <img class="shopImg"  v-else  src="~assets/replace.png">
                                        </div>
                                        <div style="margin:10px; float: left">
                                            {{tempMaterial.materialName}}
                                        </div>
                                    </div>
                                    <div class="footFont">
                                        <span>微信卡券</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 其他 -->
                            <div class="text" v-if="tempMaterial.pushType=='news'">
                                <img style="width: 100%" v-if="tempMaterial.serverUrl" :src="imageUrl+tempMaterial.serverUrl">
                                <img v-else src="~assets/replace.png">
                            </div>
                        </el-form-item>


                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel2" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm" @keyup.enter="addMaterial"
                               @click="addMaterial">
                        确 定
                    </el-button>
                </div>
            </el-dialog>
            <!--卡券编辑区-->
            <el-dialog  class="dialogForm"  :visible.sync="cardSelectBoxVisible" @close="closeCard">
                <CardSelectBox  @selectedCard = 'getSelectedCard'></CardSelectBox>
            </el-dialog>
            <!--视频播放区-->
            <el-dialog class="dialogForm" :visible.sync="videoDialogVisible" @close="stopPlay">
                <video controls="controls" style="height: 500px" width="100%" :src="videoSrc">
                    您的浏览器不支持html5播放器，请升级浏览器或者使用chrome。
                    <source :src="videoSrc" type="video/mp4">
                </video>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./replyMSGManage.js"></script>

<style scoped src="./replyMSGManage.scss">
</style>