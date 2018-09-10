
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <!--<el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'UpgradeRecord.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'UpgradeRecord.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'UpgradeRecord.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'UpgradeRecord.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'UpgradeRecord.Search'">
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

                   <!-- <el-table-column prop="idServerId" label="终端服务id">
                    </el-table-column>-->
                <el-table-column prop="ldServerNumber" label="终端应用编号">
                </el-table-column>
                <el-table-column prop="beforeVersion" label="升级前版本">
                </el-table-column>
                <el-table-column prop="afterVersion" label="升级后版本">
                </el-table-column>
                    <!--<el-table-column prop="remark" label="升级记录，备注信息">
                    </el-table-column>-->
                <el-table-column prop="enabledFlag" label="升级类型">
                    <template scope="scope">
                        <span>{{ upgradeTypeFlags[scope.row.upgradeType]}}</span>
                    </template>
                </el-table-column>
                   <!-- <el-table-column prop="tenantId" label="租户id">
                    </el-table-column>-->
                <el-table-column prop="enabledFlag" label="升级结果">
                    <template scope="scope">
                        <span>{{ upgradeStatusFlags[scope.row.upgradeStatus]}}</span>
                    </template>
                </el-table-column>

<!--                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'UpgradeRecord.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'UpgradeRecord.Delete'"
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
                </el-table-column>-->
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <!--<el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                            <el-form-item label="终端服务id" prop="idServerId">
                                    <el-select v-model="temp.id_server_id" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="升级前版本" prop="beforeVersion">
                                    <el-select v-model="temp.before_version" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="升级后版本" prop="afterVersion">
                                    <el-select v-model="temp.after_version" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="升级记录，备注信息" prop="remark">
                                    <el-input v-model="temp.remark"
                                              placeholder="请输入升级记录，备注信息"></el-input>
                            </el-form-item>
                            <el-form-item label="升级类型" prop="upgradeType">
                                    <el-radio-group v-model="temp.upgrade_type">
                                        <el-radio :label="3">备选项</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                            <el-form-item label="租户id" prop="tenantId">
                                    <el-input v-model="temp.tenant_id"
                                              placeholder="请输入租户id"></el-input>
                            </el-form-item>
                            <el-form-item label="0失败，1成功" prop="upgradeStatus">
                                    <el-radio-group v-model="temp.upgrade_status">
                                        <el-radio :label="3">备选项</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                            <el-form-item label="终端服务器编号" prop="ldServerNumber">
                                    <el-input v-model="temp.ld_server_number"
                                              placeholder="请输入终端服务器编号"></el-input>
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
            </el-dialog>-->


            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="应用终端编号" prop="ldServerNumber">
                            <el-input v-model="pageParam.ldServerNumber"
                                      placeholder="应用终端编号"></el-input>
                        </el-form-item>
                        <el-form-item label="升级前版本" prop="beforeVersion">
                                <el-select v-model="pageParam.beforeVersion" placeholder="请选择">
                                    <el-option
                                            v-for="item in versionList"
                                            :key="item.id"
                                            :label="item.versionNum"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="升级后版本" prop="afterVersion">
                                <el-select v-model="pageParam.afterVersion" placeholder="请选择">
                                    <el-option
                                            v-for="item in versionList"
                                            :key="item.id"
                                            :label="item.versionNum"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    <!--    <el-form-item label="升级记录，备注信息" prop="remark">
                                <el-input v-model="temp.remark"
                                          placeholder="请输入升级记录，备注信息"></el-input>
                        </el-form-item>-->
                        <el-form-item label="升级类型" prop="upgradeType">
                            <el-select v-model="pageParam.upgradeType" placeholder="请选择">
                                <el-option
                                        v-for="item in upgradeTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="升级结果" prop="upgradeStatus">
                            <el-select v-model="pageParam.upgradeStatus" placeholder="请选择">
                                <el-option
                                        v-for="item in upradeStatuses"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
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
   <!--         <el-dialog class="dialogForm" title="错误信息" :visible.sync="formVisible" @close="closeForm()">
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
            </el-dialog>-->

        </div>
    </div>
</template>
<script src="./UpgradeRecord.js"></script>
