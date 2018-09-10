
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
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
                    <el-table-column prop="realName" label="申请人员">
                    </el-table-column>
                    <el-table-column prop="attendanceGroudName" label="考勤组名称">
                    </el-table-column>
                    <el-table-column prop="repairTime" label="补卡时间" :formatter="fomatterTime">
                    </el-table-column>
                    <el-table-column prop="repairCause" label="缺卡原因">
                    </el-table-column>
                    <el-table-column prop="applyTime" label="申请时间" :formatter="fomatterRepair">
                    </el-table-column>
                    <el-table-column prop="state" label="审批状态" :formatter="fomatterState">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="审批历史" class="el-icon-view" @click="onEdit(scope.row)"size="small">
                        </el-button>
                        <el-button type="default" title="同意" class="el-icon-check" @click="onagree(scope.row)"size="small"
                                   v-if="scope.row.state==1" v-authority="'RepqirReissueCard.Agree'">
                        </el-button>
                        <el-button type="default" title="驳回" class="el-icon-close" @click="onRejected(scope.row)"
                                   size="small" v-if="scope.row.state==1" v-authority="'RepqirReissueCard.Reject'">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="审批历史" :visible.sync="dialogFormVisible">
                <div class="dialogFormBox">
                    <el-table :data="rowData" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="realName" label="审批人">
                        </el-table-column>
                        <el-table-column prop="approverTime" label="审批时间" :formatter="fomatterApprove">
                        </el-table-column>
                        <el-table-column  prop="auditComment" label="审批意见">
                        </el-table-column>
                        <el-table-column  prop="auditState" label="审批状态" :formatter="fomatterAuditState">
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="驳回说明" :visible.sync="rejectedFlag" :before-close="cancelRejected">
                <div class="dialogFormBox">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="AuditComment">
                    </el-input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelRejected" class="cancel">取 消</el-button>
                    <el-button @click="submitRejected" class="primary">驳回</el-button>
                </div>
            </el-dialog>


            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="申请时间" prop="repairTime">
                                <el-date-picker
                                        v-model="pageParam.applyDate"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="申请状态" prop="state">
                                <el-select v-model="pageParam.state" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
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
<script src="./repairAttendenceApply.js"></script>
