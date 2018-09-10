
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
                    <el-table-column prop="humanName" label="考勤人员">
                    </el-table-column>
                    <el-table-column prop="mobile" label="手机号">
                    </el-table-column>
                    <el-table-column prop="attendanceGroupName" label="考勤组">
                    </el-table-column>
                    <el-table-column prop="scheduleName" label="班次">
                    </el-table-column>
                    <el-table-column prop="checkDate" label="打卡日期">
                    </el-table-column>
                    <el-table-column prop="requreUpDate" label="上班时间">
                    </el-table-column>
                    <el-table-column prop="requreDownDate" label="下班时间">
                    </el-table-column>
                    <el-table-column prop="amCheckTime" label="上班打卡时间">
                    </el-table-column>
                    <el-table-column prop="pmCheckTime" label="下班打卡时间">
                    </el-table-column>
                    <el-table-column prop="amWorkiStateText" label="上班考勤状态" :formatter="formatterState">
                    </el-table-column>
                    <el-table-column prop="pmWorkiStateText" label="下班考勤状态" :formatter="formatterPMState">
                    </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="考勤人员" prop="humanName">
                            <el-input v-model="pageParam.humanName"
                                      placeholder="请输入考勤人员名称"></el-input>
                        </el-form-item>
                        <el-form-item label="考勤组" prop="attendanceId">
                                <el-select v-model="pageParam.attendanceGroupId" placeholder="请选择">
                                    <el-option
                                            v-for="item in attenDanceGroups"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>

                    <el-form-item label="是否异常" prop="isAbnormal">
                        <br/>
                        <el-select v-model="pageParam.isAbnormal"   placeholder="请选择">
                            <el-option key=0 label="正常" value=0>
                            </el-option>
                            <el-option key=1 label="异常" value=1>
                            </el-option>
                        </el-select>


                    </el-form-item>
                        <el-form-item label="打卡日期" prop="checkDate">

                            <el-date-picker
                                    v-model="pageParam.checkDate"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>

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
<script src="./DailyAttendance.js"></script>
