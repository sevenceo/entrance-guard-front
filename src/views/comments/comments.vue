
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Comments.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'Comments.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'Comments.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'Comments.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'Comments.Search'">
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
                    <el-table-column prop="feedbackId" label="意见反馈id">
                    </el-table-column>
                    <el-table-column prop="replyId" label="回复人员id">
                    </el-table-column>
                    <el-table-column prop="replyContent" label="回复内容">
                    </el-table-column>
                    <el-table-column prop="tenantId" label="租户id">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'Comments.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'Comments.Delete'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="启用" class="btn btn-add" @click="onStatus(scope.row,'0')"
                                   v-authority="'DealerInfo.Status'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            启用
                        </el-button>
                        <el-button type="default" title="停用" class="btn btn-add" @click="onStatus(scope.row,'1')"
                                   v-authority="'DealerInfo.Status'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            停用
                        </el-button>
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
                            <el-form-item label="意见反馈id" prop="feedbackId">
                                    <el-select v-model="temp.feedbackId" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="回复人员id" prop="replyId">
                                    <el-input v-model="temp.replyId"
                                              placeholder="请输入回复人员id"></el-input>
                            </el-form-item>
                            <el-form-item label="回复内容" prop="replyContent">
                                    <el-input v-model="temp.replyContent"
                                              placeholder="请输入回复内容"></el-input>
                            </el-form-item>
                            <el-form-item label="租户id" prop="tenantId">
                                    <el-input v-model="temp.tenantId"
                                              placeholder="请输入租户id"></el-input>
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


            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="意见反馈id" prop="feedbackId">
                                <el-select v-model="pageParam.feedbackId" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="回复人员id" prop="replyId">
                                <el-input v-model="pageParam.replyId"
                                          placeholder="请输入回复人员id"></el-input>
                        </el-form-item>
                        <el-form-item label="回复内容" prop="replyContent">
                                <el-input v-model="pageParam.replyContent"
                                          placeholder="请输入回复内容"></el-input>
                        </el-form-item>
                        <el-form-item label="租户id" prop="tenantId">
                                <el-input v-model="pageParam.tenantId"
                                          placeholder="请输入租户id"></el-input>
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
<script src="./comments.js"></script>
