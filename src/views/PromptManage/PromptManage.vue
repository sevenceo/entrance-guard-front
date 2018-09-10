<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'PromptManage.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'PromptManage.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'PromptManage.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'PromptManage.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'PromptManage.Search'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>


        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="promptTypeName" label="提示媒介">
                </el-table-column>
                <el-table-column prop="messageModel" label="消息模板">
                </el-table-column>
                <el-table-column prop="type" label="操作" width="600">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'PromptManage.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'PromptManage.Delete'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button class="btn btn-add" type="primary" @click="humanDetail(scope.row)"
                                   v-authority="'PromptManage.HumanDetail'"
                                   style="color: black !important;width: 100px;background-color: #E4E8F1 !important;">
                            查看人员
                        </el-button>
                        <el-button class="btn btn-add" type="primary" @click="selectHuman(scope.row)"
                                   v-authority="'PromptManage.HumanAdd'"
                                   style="color: black !important;width: 100px;background-color: #E4E8F1 !important;">
                            匹配人员
                        </el-button>
                        <el-button class="btn btn-add" type="primary" @click="humanGroupDetail(scope.row)"
                                   v-authority="'PromptManage.GroupDetail'"
                                   style="color: black !important;width: 100px;background-color: #E4E8F1 !important;">
                            查看人员组
                        </el-button>
                        <el-button class="btn btn-add" type="primary" @click="selectHumanGroup(scope.row)"
                                   v-authority="'PromptManage.GroupAdd'"
                                   style="color: black !important;width: 100px;background-color: #E4E8F1 !important;">
                            匹配人员组
                        </el-button>
                        <el-button class="btn btn-add" type="primary" @click="sendData(scope.row)"
                                   v-authority="'PromptManage.SendData'"
                                   style="color: black !important;width: 100px;background-color: #E4E8F1 !important;">
                            下发数据
                        </el-button>
                        <!--<el-button type="default" title="启用" class="btn btn-add" @click="onStatus(scope.row,'0')"-->

                        <!--size="small">-->
                        <!--<svg class="icon" aria-hidden="true">-->
                        <!--<use xlink:href="#icon-add1"></use>-->
                        <!--</svg>-->
                        <!--启用-->
                        <!--</el-button>-->
                        <!--<el-button type="default" title="停用" class="btn btn-add" @click="onStatus(scope.row,'1')"-->

                        <!--size="small">-->
                        <!--<svg class="icon" aria-hidden="true">-->
                        <!--<use xlink:href="#icon-add1"></use>-->
                        <!--</svg>-->
                        <!--停用-->
                        <!--</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="提示媒介" prop="promptType">
                            <el-select v-model="temp.promptType" placeholder="请选择">
                                <el-option
                                        v-for="item in promptTypes"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="消息模板" prop="messageModel">
                            <el-input v-model="temp.messageModel"
                                      placeholder="请输入消息模板"></el-input>
                            <span style="color:red">*</span><span>变量用‘{}’定义，例如:{name},您好</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="匹配人员" :visible.sync="humanSelectVisible"
                       @close="closeHumanSelect">
                <el-table :data="humanSelect" border stripe style="width: 100%" class="blue-table"
                          @selection-change="humanSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="facePhoto" label="人脸照片">
                        <template scope="scope">
                            <img :src="scope.row.facePhoto" width="100" height="100"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <!--<el-table-column prop="age" label="年龄">
                    </el-table-column>-->
                    <el-table-column prop="mobilePhone" label="手机号">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱">
                    </el-table-column>
                    <!--  <el-table-column prop="remark" label="备注">
                     </el-table-column>-->
                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="rowHumanTotal" v-on:pageChange="handleHumanCurrentChange"></pagination>
                <el-button class="btn btn-add" type="primary" @click="matchHuman()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    匹配人员
                </el-button>
            </el-dialog>

            <!--dialog查看人员-->
            <el-dialog class="dialogForm" title="查看人员" :visible.sync="humanDetailVisible" @close="closeHumanDetail()">
                <el-table :data="humanDetailData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="facePhoto" label="人脸照片">
                        <template scope="scope">
                            <img :src="scope.row.facePhoto" width="100" height="100"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <!-- <el-table-column prop="age" label="年龄">
                     </el-table-column>-->
                    <el-table-column prop="mobilePhone" label="手机号">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱">
                    </el-table-column>
                    <!-- <el-table-column prop="remark" label="备注">
                     </el-table-column>-->
                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onHumanDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination ref="pages" :total="rowHumanDetailTotal"
                            v-on:pageChange="handleHumanDetailCurrentChange"></pagination>
            </el-dialog>

            <!--dialog查看人员组-->
            <el-dialog class="dialogForm" title="查看人员组" :visible.sync="humanGroupDetailVisible" @close="closeHumanGroupDetail()">
                <el-table :data="humanDetailGroupData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="tenantName" label="小区名">
                    </el-table-column>
                    <el-table-column prop="groupName" label="组名">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onHumanGroupDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination ref="pages" :total="rowHumanGroupDetailTotal"
                            v-on:pageChange="handleHumanGroupDetailCurrentChange"></pagination>
            </el-dialog>

            <el-dialog class="dialogForm" title="匹配人员组" :visible.sync="humanGroupSelectVisible"
                       @close="closeHumanGroupSelect">
                <el-table :data="humanGroupSelect" border stripe style="width: 100%" class="blue-table"
                          @selection-change="humanGroupSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="tenantName" label="小区名">
                    </el-table-column>
                    <el-table-column prop="groupName" label="组名">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="rowHumanGroupTotal" v-on:pageChange="handleHumanGroupCurrentChange"></pagination>
                <el-button class="btn btn-add" type="primary" @click="matchHumanGroup()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    匹配人员组
                </el-button>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                    <el-form-item label="提示媒介" prop="promptType">
                        <el-select v-model="pageParam.promptType" placeholder="请选择">
                            <el-option
                                    v-for="item in promptTypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
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

            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="错误信息" :visible.sync="formVisible" @close="closeForm()">
                <div class="dialogFormBox">
                    <el-input
                            type="textarea"
                            :rows="errorLine"
                            placeholder="错误信息"
                            :disabled="true"
                            v-model="errorTip">
                    </el-input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeForm()" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm," @click="closeForm()">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<script src="./PromptManage.js"></script>
