<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'flightManage.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'flightManage.Delete'"
                       style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="searchFormVisible=true">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div style="margin-top:35px;">
            <el-table :data="tableData"  border stripe style="width: 100%;" class="blue-table" ref="table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="班次编码" prop="scheduleCode">
                </el-table-column>
                <el-table-column label="班次名称" prop="scheduleName">
                </el-table-column>
                <el-table-column label="考勤组名称" prop="attenDanceName">
                </el-table-column>
                <el-table-column label="班次时间" prop="workingStartTime" :formatter="function(row){return row.workingStartTime+'-'+row.workingEndTime}">
                </el-table-column>
                <el-table-column label="打卡规则" prop="checkRuleType" :formatter="function(row){return row.checkRuleType==1?'上下班打卡':'上班打卡'}">
                </el-table-column>
                <el-table-column label="有效期开始日期" prop="startTime" :formatter="formatterStart" >
                </el-table-column>
                <el-table-column label="有效期结束日期" prop="endTime" :formatter="formatterEnd">
                </el-table-column>
                <el-table-column  label="操作" >
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" v-authority="'flightManage.Modify'"
                                   @click="onEdit(scope.row)" size="small" >
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" v-authority="'flightManage.Delete'"
                                   @click="onDelete(scope.row)" size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <el-dialog :visible.sync="addFlight" :title="title"  @close="resetForm" style="hight:100%">
                <div>
                    <el-form  label-position="left" label-width="100px"
                             style='width: 530px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="班次名称" prop="scheduleName">
                            <el-input v-model="temp.scheduleName"
                                      placeholder="请输入班次名称"></el-input>
                        </el-form-item>
                        <el-form-item label="班次编码" prop="scheduleCode">
                            <el-input v-model="temp.scheduleCode"
                                      placeholder="请输入班次编码"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="班次类型" prop="isDefault" >-->
                            <!--<el-radio v-model="temp.isDefault" label="1">默认班次</el-radio>-->
                            <!--<el-radio v-model="temp.isDefault" label="0">非默认班次</el-radio>-->
                        <!--</el-form-item>-->
                        <div v-if="temp.isDefault==0">
                            <el-form-item label="请选择组织"  >
                                <!--<el-input @focus="showOrganization"  placeholder="请选择组织" v-model="organizationName"/>-->
                                <!--<div id="organization" style="display:none">-->
                                    <!--<el-button  @click="closeOrganization" size="small">关闭</el-button>-->
                                    <!--<el-tree :data="organizations" :props="defaultProps" @node-click="handleNodeClick"/>-->
                                <!--</div>-->
                                <el-select v-model="organizationId"  placeholder="请选择资源" @change="getGoupByOrgan(organizationId)">
                                    <el-option
                                            v-for="item in firstLvl"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="请选择考勤组">
                                <el-select v-model="temp.attendenceId" placeholder="请选择">
                                    <el-option v-for="item in attenDanceGroups" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                                </el-select>

                            </el-form-item>
                            <!--<el-form-item label="请选择考勤组">-->
                                <!--<el-cascader-->
                                        <!--:options="firstLvl"-->
                                        <!--@active-item-change="handleItemChange"-->
                                        <!--:props="props">-->
                                <!--</el-cascader>-->
                            <!--</el-form-item>-->
                        </div>
                        <el-form-item label="是否优先于法定假日" prop="higherThanHoliday">
                            <el-radio v-model="temp.higherThanHoliday" label="1">是</el-radio>
                            <el-radio v-model="temp.higherThanHoliday" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="班次时间" prop="flag1">
                            <el-col :span="11">
                                <el-form-item prop="workingStartTime">
                                    <el-time-select placeholder="上班时间" v-model="temp.workingStartTime" :picker-options="{
                                    start: '00:00',step: '00:10',end: '23:59'}">
                                    </el-time-select>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-form-item prop="workingEndTime">
                                    <el-time-select placeholder="下班时间" v-model="temp.workingEndTime"
                                                    :picker-options="{
                                    start: '00:00',step: '00:10',end: '23:59',minTime: temp.workingStartTime}">
                                    </el-time-select>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <!--<el-form-item label="打卡间断点" prop="gapTime">-->
                                <!--<el-time-select placeholder="间断时间" v-model="temp.gapTime" :picker-options="{-->
                                    <!--start: '08:30',step: '00:15',end: '18:30'}">-->
                                <!--</el-time-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="最早上班时间" prop="checkTime">
                            <el-time-select placeholder="最早上班时间" v-model="temp.checkTime"
                                            :picker-options="{start: '00:00',step: '00:10',end: '23:59', maxTime:temp.workingStartTime}">
                            </el-time-select>
                        </el-form-item>
                        <!--<el-form-item label="打卡规则" prop="checkRuleType">-->
                            <!--<el-radio v-model="temp.checkRuleType" label="1">上下班打卡</el-radio>-->
                            <!--<el-radio v-model="temp.checkRuleType" label="0">上班打卡</el-radio>-->
                        <!--</el-form-item>-->
                        <el-form-item label="工作日设置" prop="workList">
                            <el-checkbox-group v-model="temp.workList">
                                <el-checkbox-button label="周一"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周二"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周三"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周四"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周五"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周六"  name="workList"></el-checkbox-button>
                                &nbsp; &nbsp;
                                <el-checkbox-button label="周日"  name="workList"></el-checkbox-button>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="有效期" prop="effectiveDate">
                            <el-date-picker
                                    v-model="temp.effectiveDate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin-left:300px;margin-top:10px;">
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm," @click="create">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update" @click="update">
                        确 定
                    </el-button>
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                </div>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="Param">
                    <el-form-item label="班次编码" prop="scheduleCode">
                        <el-input v-model="Param.scheduleCode"
                                  placeholder="班次编码"></el-input>
                    </el-form-item>
                    <el-form-item label="班次名称" prop="scheduleName">
                        <el-input v-model="Param.scheduleName"
                                  placeholder="班次名称"></el-input>
                    </el-form-item>
                    <el-form-item label="请选择组织"  >
                        <!--<el-input @focus="showOrganization"  placeholder="请选择组织" v-model="searchOrganizationName"/>-->
                        <!--<div id="organization" style="display:none">-->
                            <!--<el-button  @click="closeOrganization" size="small">关闭</el-button>-->
                            <!--<el-tree :data="organizations" :props="defaultProps" @node-click="handleNodeClickSearch"/>-->
                        <!--</div>-->
                        <el-select v-model="Param.resourceId"  placeholder="请选择资源" @change="getGoupByOrgan(Param.resourceId)">
                            <el-option
                                    v-for="item in firstLvl"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择考勤组">
                        <el-select v-model="Param.attendenceId" placeholder="请选择">
                            <el-option v-for="item in attenDanceGroups" :key="item.id" :label="item.name" :value="item.id" @click="check">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="打卡规则">
                        <el-select v-model="Param.checkRuleType" placeholder="请选择">
                            <el-option
                                    v-for="item in ruletype"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="有效期">
                        <el-date-picker
                                v-model="Param.effectiveDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
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
        </div>
    </div>
</template>

<script src="./flightManage.js">
</script>

<style lang="scss">

</style>