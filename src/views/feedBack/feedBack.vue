
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table" >
                    <el-table-column prop="facePhoto" label="特征照片">
                        <template scope="scope">
                            <img :src="scope.row.facePhoto" style="width: 40px; height: 40px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别" :formatter="formatSex">
                    </el-table-column>
                    <el-table-column prop="age" label="年龄">
                    </el-table-column>
                    <el-table-column prop="mobilePhone" label="手机号"width="120">
                    </el-table-column>
                    <el-table-column prop="feedbackWords" label="反馈内容">
                    </el-table-column>
                    <el-table-column label="状态">
                        <template scope="scope">
                            <span v-if="scope.row.replyTime != null">已回复</span>
                            <span v-else style="color: red;">未回复</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="commitTime" label="提出时间"  width="150" :formatter="formatterTime">
                    </el-table-column>
                    <el-table-column prop="replyTime" label="回应时间"  width="150" :formatter="formatterTime">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="查看" class="icon-btn edit" @click="onLook(scope.row)" v-authority="'FeedBack.Look'"
                                   size="small">
                            查看并回复
                        </el-button>
                        <!--<el-button type="default" title="答复" class="icon-btn delete" @click="onReply(scope.row)" v-authority="'FeedBack.Reply'"
                                   size="small" :disabled="scope.row.replyTime != null" >
                            答复
                        </el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog查看区-->
            <el-dialog class="dialogForm" title="查看详情" :visible.sync="dialogFormVisible" @close="close">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;' :model="temp">
                            <el-form-item label="姓名：" prop="realName">
                                {{temp.realName}}
                            </el-form-item>
                            <el-form-item label="反馈内容：" v-if="temp.feedbackWords != null">
                                {{temp.feedbackWords}}
                            </el-form-item>
                            <el-form-item label="语音："  v-if="temp.feedbackVoice != null">
                                <audio class="audio" controls="controls" :src="temp.feedbackVoice">
                                    <source :src="temp.feedbackVoice" type="audio/mpeg">
                                </audio>
                            </el-form-item>
                            <el-form-item label="照片："  v-if="temp.feedbackImage != null">
                                <img :src="temp.feedbackImage" style="width: 100px; height: 100px;" class="avatar">
                            </el-form-item>
                    </el-form>
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;' :model="temp" ref="replyDialogForm" :rules="rules">
                      <!--  <el-form-item label="管理员:">
                            {{temp.adminName}}
                        </el-form-item>-->
                        <div v-if="temp.replyTime == null">
                            <el-form-item label="答复:" prop="replyContent">
                                <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4}" v-model="temp.replyContent"></el-input>
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="答复:" prop="replyContent">
                                {{temp.replyContent}}
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer" v-if="temp.replyTime == null">
                    <el-button @click="close" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm"
                               @keyup.enter="createReply('replyDialogForm')"
                               @click="createReply('replyDialogForm')">
                        提交
                    </el-button>
                </div>
            </el-dialog>
            <!--dialog回复区-->
            <!--<el-dialog class="dialogForm" title="意见答复" :visible.sync="dialogReplyFormVisible" @close="close">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;' :model="temp" ref="replyDialogForm" :rules="rules">
                            <el-form-item label="管理员:">
                                {{temp.adminName}}
                            </el-form-item>
                            <el-form-item label="答复:" prop="replyContent">
                                <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4}" v-model="temp.replyContent"></el-input>
                            </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeReply" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm"
                               @keyup.enter="createReply('replyDialogForm')"
                               @click="createReply('replyDialogForm')">
                        提交
                    </el-button>
                </div>
            </el-dialog>-->

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="姓名" prop="realName">
                            <el-input v-model="pageParam.realName"
                                      placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="意见文字" prop="feedbackWords">
                                <el-input v-model="pageParam.feedbackWords"
                                          placeholder="请输入意见文字"></el-input>
                        </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" @click="reset" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="search" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./feedBack.js"></script>
