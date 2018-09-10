
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'OrgAttendanceConfig.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" style="width: 100px;" v-authority="'OrgAttendanceConfig.Delete'">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" >
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
                    <el-table-column prop="isNatureMonth" label="是否为默认自然月" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="startDay" label="考勤月开始" :formatter="function(row){ return row.isNatureMonth=='0'?row.startDay:'1'}">
                    </el-table-column>
                    <!--<el-table-column prop="endDay" label="考勤月结束":formatter="function(row){ return row.isNatureMonth=='1'?'31':row.endDay}" >-->
                    <!--</el-table-column>-->

                <el-table-column prop="type" label="操作" >
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" v-authority="'OrgAttendanceConfig.Modify'"
                                   @click="onEdit(scope.row)" size="small" >
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" v-authority="'OrgAttendanceConfig.Delete'"
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
            <!--dialog编辑区-->
            <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                            <!--<el-form-item label="组织" prop="organizationName">-->
                                <!--<el-button @click="showOrganization" type="primary">{{organizationName}}</el-button>-->
                                <!--<div id="organizationTree" style="display:none">-->
                                    <!--<el-button  @click="closeOrganization" size="small">关闭</el-button>-->
                                    <!--<el-tree :data="organizations" :props="defaultProps" @node-click="handleNodeClick"/>-->
                                <!--</div>-->
                            <!--</el-form-item>-->
                        <el-form-item label="所属资源">
                            <el-select v-model="temp.resourceIds"  placeholder="请选择" multiple>
                                <el-option
                                        v-for="item in firstLvl"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                            <el-form-item label="是否为默认自然月" prop="isNatureMonth">
                                    <el-radio-group v-model="temp.isNatureMonth">
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                        <el-form-item label="考勤月开始" prop="startDay" v-if="temp.isNatureMonth=='0'">
                            <el-input-number v-model="temp.startDay" controls-position="left" :min="0" :max="31"></el-input-number>
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
                    <!--<el-form-item label="组织" prop="resourceId">-->
                        <!--<el-button @click="showOrganization" type="primary">{{pageParam.organizationName}}</el-button>-->
                        <!--<div id="organizationTree" style="display:none">-->
                            <!--<el-button  @click="closeOrganization" size="small">关闭</el-button>-->
                            <!--<el-tree :data="organizations" :props="defaultProps" @node-click="selectNodeClick"/>-->
                        <!--</div>-->
                    <!--</el-form-item>-->
                    <el-form-item label="所属资源">
                        <el-select v-model="pageParam.resourceIds"  placeholder="请选择" multiple>
                            <el-option
                                    v-for="item in firstLvl"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                        <el-form-item label="是否为默认月" prop="isNatureMonth">
                                <el-radio-group v-model="pageParam.isNatureMonth">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
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
<script src="./OrgAttendanceConfig.js"></script>
