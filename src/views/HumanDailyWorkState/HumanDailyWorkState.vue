
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>

        <div>
            <!--<el-col :span="24">-->
                    <!--左侧树结构-->
                    <!--<el-col :span="6">-->
                        <!--&lt;!&ndash;<el-input v-model="leftTreeFilterText"&ndash;&gt;-->
                        <!--&lt;!&ndash;@change="leftTreeSearch" placeholder="请输入搜索内容"></el-input>&ndash;&gt;-->
                        <!--<el-tree ref="treeLeft" :data="organizations" :props="props"-->
                                 <!--:default-expand-all="false"-->
                                 <!--:filter-node-method="filterNode"-->
                                 <!--@node-click="nodeClick"></el-tree>-->
                    <!--</el-col>-->
                    <!--<el-col :span="18">-->
            <!--表格-->

                  <div class="bp-header">
                    <span style="font-size:30px;line-height:50px;margin-left: 80px;">{{year}}年{{month}}月排班情况
                                      </span>
                                      <div class="icon-tips-warp">
                                                <div class="icon-tips">
                                                      <div class="tip-item"><img src="/static/img/1.png"><span>上班</span></div>
                                                      <div class="tip-item"><img src="/static/img/12.png"><span>休息日</span></div>
                                                       <div class="tip-item"><img src="/static/img/11.png"><span>出差</span></div>
                                                       <div class="tip-item"><img src="/static/img/7.png"><span>调休</span></div>
                                                        <div class="tip-item"><img src="/static/img/8.png"><span>事假</span></div>
                                                         <div class="tip-item"><img src="/static/img/6.png"><span>年假</span></div>
                                                         <div class="tip-item"><img src="/static/img/9.png"><span>产假</span></div>
                                                         <div class="tip-item"><img src="/static/img/10.png"><span>陪产假</span></div>
                                                         <div class="tip-item"><img src="/static/img/5.png"><span>婚假</span></div>
                                                         <div class="tip-item"><img src="/static/img/13.png"><span>病假</span></div>
                                                         <div class="tip-item"><img src="/static/img/14.png"><span>丧假</span></div>
                                                 </div>
                                      </div>
                  </div>



            <el-table :data="tableData"   :span-method="cellMerge"  :cell-class-name="getCellClass"   @cell-click="tableDbEdit"  border stripe style=" width: 100%" class="blue-table"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="humanName" label="人员" height="30px" width="80px">
                </el-table-column>
                 <el-table-column prop="attendanceGroupName" height="30px"  width="135px" label="考勤组">
                                </el-table-column>
                <el-table-column prop="am" label="时间"  height="30px" width="50px">
                </el-table-column>

                <el-table-column   height="30px" width="30px"
                    v-for="(item, index)  in days"
                    :key="index"
                    :prop="item.value" :label="item.name" >

                    <el-table-column   height="30px"  width="30px"
                            :prop="item.value"
                            :label="item.week">
                            <!--width="120">-->
                        <template scope="scope">
                            <!--{{scope.row[scope.column.property]}}-->
                        <img title="正常" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='1'" src="/static/img/1.png">
                        <img title="婚假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='5'" src="/static/img/5.png">
                        <img  title="年假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='6'" src="/static/img/6.png">
                        <img title="调休"  style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='7'" src="/static/img/7.png">
                         <img   title="事假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='8'" src="/static/img/8.png">
                        <img  title="产假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='9'" src="/static/img/9.png">
                        <img title="陪产假"  style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='10'" src="/static/img/10.png">
                        <img title="出差"  style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='11'" src="/static/img/11.png">
                        <img title="休息日"  style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='12'" src="/static/img/12.png">
                        <img  title="病假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='13'" src="/static/img/13.png">
                         <img title="丧假" style="height: 16px;width: 16px" v-if="scope.row[scope.column.property]=='14'" src="/static/img/14.png">
                        </template>
                   </el-table-column>

                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--</el-col>-->
            <!--</el-col>-->

            <el-dialog :visible.sync="addDailyWorkState" :title="title"  @close="resetForm" style="hight:100%">
                <div>
                    <el-form  label-position="left" label-width="100px"
                              style='width: 530px; margin-left:50px;'
                              :model="temp"
                              ref="form"
                              :rules="rules">
                        <el-form-item label="人员名称" prop="humanName">
                            <el-input v-model="temp.humanName"  :disabled="true"
                                      placeholder="请输入人员名称"></el-input>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="startDate">
                            <el-date-picker
                                    v-model="temp.startDate"
                                    type="date"
                                    :disabled="true"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <el-select v-model="temp.startAmOrPm" placeholder="请选择"  :disabled="true">
                                <el-option key="1" label="上午" value="上午">
                                </el-option>
                                <el-option key="2" label="下午" value="下午">
                                </el-option>
                            </el-select>
                            <!--<el-date-picker-->
                                    <!--v-model="value1"-->
                                    <!--type="date"-->
                                    <!--placeholder="选择日期">-->
                            <!--</el-date-picker>-->
                            <!--<el-select v-model="temp.amOrPm" placeholder="请选择">-->
                                <!--<el-option key="1" label="上午" value="1">-->
                                <!--</el-option>-->
                                <!--<el-option key="2" label="下午" value="2">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endDate">
                            <el-date-picker
                                    v-model="temp.endDate"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <el-select v-model="temp.endAmOrPm" placeholder="请选择" >
                                <el-option key="1" label="上午" value="上午">
                                </el-option>
                                <el-option key="2" label="下午" value="下午">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="工作状态" prop="workState">
                            <el-select v-model="temp.workState"  placeholder="请选择">
                                <el-option key="1" label="正常" value="1">
                                </el-option>
                                <el-option key="12" label="休息日" value="12">
                                </el-option>
                                <el-option key="11" label="出差" value="11">
                                </el-option>
                                <el-option key="7" label="调休" value="7">
                                </el-option>
                                <el-option key="8" label="事假" value="8">
                                </el-option>
                                <el-option key="5" label="婚假" value="5">
                                </el-option>
                                <el-option key="6" label="年假" value="6">
                                </el-option>
                                <el-option key="9" label="产假" value="9">
                                </el-option>
                                <el-option key="10" label="陪产假" value="10">
                                </el-option>
                                 <el-option key="13" label="病假" value="13">
                                 </el-option>
                                 <el-option key="14" label="丧假" value="14">
                                 </el-option>
                            </el-select>
                        </el-form-item>

                    </el-form>
                </div>
                <div style="margin-left:300px;margin-top:10px;">
                    <el-button  type="primary" class="update" @click="update">
                        确 定
                    </el-button>
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                </div>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="考勤月份" prop="month" class="demonstration">
                                 <el-date-picker
                                      v-model="pageParam.month"
                                      type="month"
                                      value-format="yyyy-MM"
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

    .bp-header{
        display: flex;
            align-items: center;
          justify-content: space-between;
        padding-right: 50px;
    }

.icon-tips-warp{
    display: inline-block;
}
    .icon-tips{
    display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .tip-item{
    margin-left: 10px;
     display: flex;
     flex-direction: column;
     align-items: center;
    }
       .tip-item img{
       height: 14px; width: 14px;
           margin-bottom: 2px;
        }

   .tip-item span{
   font-size: 12px
    }
</style>

<script src="./HumanDailyWorkState.js"></script>
