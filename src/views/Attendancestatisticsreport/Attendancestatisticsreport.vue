
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
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table" :cell-style="cellStyle" >
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                    <el-table-column prop="humanName" label="用户姓名">
                    </el-table-column>
                    <el-table-column prop="mobile" label="手机号">
                    </el-table-column>
                    <el-table-column prop="attendanceGroupName" label="考勤组">
                    </el-table-column>

                      <el-table-column prop="month" label="考勤月份">
                                </el-table-column>
                    <el-table-column prop="scheduleName" label="班次">
                    </el-table-column>
                <!--<el-table-column prop="isAbnormal" label="是否异常">-->
                <!--</el-table-column>-->
                    <el-table-column
                               v-for="(item, index)  in months"
                               :key="index"
                               :prop="item.value" :label="item.name" >
                     </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="用户姓名" prop="humanName">
                                <el-input v-model="pageParam.humanName"
                                          placeholder="请输入用户姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="pageParam.mobile"
                                          placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="考勤组" prop="attendancegroupname">-->
                                <!--<el-input v-model="pageParam.attendancegroupname"-->
                                          <!--placeholder="请输入考勤组"></el-input>-->
                        <!--</el-form-item>-->
                    <el-form-item label="考勤组" prop="attendanceGroudId">
                        <el-select v-model="pageParam.attendanceGroudId" placeholder="请选择">
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
                                <!--<el-option v-for="item in options" :label="item.label" :key="item.id" :value="item.id">-->
                                <!--</el-option>-->

                                <el-option key=0 label="正常" value=0>
                                </el-option>
                                <el-option key=1 label="异常" value=1>
                                </el-option>
                            </el-select>


                        </el-form-item>

                        <el-form-item label="考勤月份" prop="month" class="demonstration">
                               <el-date-picker
                                    v-model="pageParam.month"
                                    type="month"
                                    value-format="yyyy-M"
                                    placeholder="选择月">
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
<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
<script src="./Attendancestatisticsreport.js"></script>
