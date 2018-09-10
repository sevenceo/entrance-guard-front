<template>
    <el-row>
        <el-col :span="24">
            <breadcrumb></breadcrumb>
            <div style="margin-left:60%;margin-top:2%;">
                <span style="background-color:red;font-size:20px;margin-left:10%;">法定节假日</span>
                <span style="background-color:green;font-size:20px;margin-left:10%;">法定上班</span>
            </div>
        </el-col>
        <el-col :span="50">
            <span  style="width: 60%;margin-left:30%; font-size:20px;">
                <el-button @click="subYear">上一年</el-button>
                <el-button @click="subMonth">上一月</el-button>
                {{currentYear}}年{{currentMonth}}月
                <el-button @click="addMonth">下一月</el-button>
                <el-button @click="addYear">下一年</el-button>
            </span>
            <el-table :data="tableData"  border stripe style="width: 60%;margin-left:16%;" class="blue-table" ref="table" @cell-click="editDate">
                <el-table-column label="一">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.monday==null?null:scope.row.monday.date }}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.monday!=null&&scope.row.monday.state=='1'&&scope.row.monday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.monday!=null&&scope.row.monday.state=='2'&&scope.row.monday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.monday!=null&&scope.row.monday.state=='1'&&scope.row.monday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.monday!=null&&scope.row.monday.state=='2'&&scope.row.monday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="二" >
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.tuesday==null?null:scope.row.tuesday.date}}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.tuesday!=null&&scope.row.tuesday.state=='1'&&scope.row.tuesday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.tuesday!=null&&scope.row.tuesday.state=='2'&&scope.row.tuesday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.tuesday!=null&&scope.row.tuesday.state=='1'&&scope.row.tuesday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.tuesday!=null&&scope.row.tuesday.state=='2'&&scope.row.tuesday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="三">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.wednesday==null?null:scope.row.wednesday.date }}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.wednesday!=null&&scope.row.wednesday.state=='1'&&scope.row.wednesday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.wednesday!=null&&scope.row.wednesday.state=='2'&&scope.row.wednesday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.wednesday!=null&&scope.row.wednesday.state=='1'&&scope.row.wednesday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.wednesday!=null&&scope.row.wednesday.state=='2'&&scope.row.wednesday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="四">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.thursday==null?null:scope.row.thursday.date}}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.thursday!=null&&scope.row.thursday.state=='1'&&scope.row.thursday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.thursday!=null&&scope.row.thursday.state=='2'&&scope.row.thursday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.thursday!=null&&scope.row.thursday.state=='3'&&scope.row.thursday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.thursday!=null&&scope.row.thursday.state=='4'&&scope.row.thursday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="五">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.friday==null?null:scope.row.friday.date}}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.friday!=null&&scope.row.friday.state=='1'&&scope.row.thursday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.friday!=null&&scope.row.friday.state=='2'&&scope.row.friday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.friday!=null&&scope.row.friday.state=='1'&&scope.row.friday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.friday!=null&&scope.row.friday.state=='2'&&scope.row.friday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="六">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.saturday==null?null:scope.row.saturday.date }}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.saturday!=null&&scope.row.saturday.state=='1'&&scope.row.saturday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.saturday!=null&&scope.row.saturday.state=='2'&&scope.row.saturday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.saturday!=null&&scope.row.saturday.state=='1'&&scope.row.saturday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.saturday!=null&&scope.row.saturday.state=='2'&&scope.row.saturday.type=='resource'">班</span>
                    </template>
                </el-table-column>
                <el-table-column label="日">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.sunday==null?null:scope.row.sunday.date}}</span>
                        <span style="margin-left: 10px;color:red;" v-if="scope.row.sunday!=null&&scope.row.sunday.state=='1'&&scope.row.sunday.type=='gengle'">休</span>
                        <span style="margin-left: 10px;color:green;" v-if="scope.row.sunday!=null&&scope.row.sunday.state=='2'&&scope.row.sunday.type=='gengle'">班</span>
                        <span style="margin-left: 10px;color:yellow;" v-if="scope.row.sunday!=null&&scope.row.sunday.state=='1'&&scope.row.sunday.type=='resource'">休</span>
                        <span style="margin-left: 10px;color:blue;" v-if="scope.row.sunday!=null&&scope.row.sunday.state=='2'&&scope.row.sunday.type=='resource'">班</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!--设置上下班，假期的弹框-->
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%">
            <div class="dialogFormBox">
                <el-form class="small-space" label-position="left" label-width="100px"
                         style='width: 400px; margin-left:50px;'
                         :model="temp"
                         ref="form"
                         :rules="rules">
                    <el-form-item label="新增类型" prop="holidayName">
                        <el-select v-model="temp.workOrRest" placeholder="请选择">
                            <el-option key="1" label="节假日" value="1">
                            </el-option>
                            <el-option key="2" label="上班" value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始日期" prop="startAndEnd">
                        <el-date-picker
                                v-model="temp.start"
                                type="date"
                                :disabled="true"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期">
                        <el-date-picker
                                v-model="temp.end"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" class="cancel">取 消</el-button>
                <el-button type="primary" class="confirm," @click="create" >
                    确 定
                </el-button>
            </div>
        </el-dialog>

    </el-row>
</template>

<script src="./adminSchudule.js"/>
