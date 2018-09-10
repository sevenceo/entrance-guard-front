
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
   <!--         <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'OperateHistory.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'OperateHistory.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'OperateHistory.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'OperateHistory.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch" ><!--v-authority="'OperateHistory.Search'"-->
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
                    <!--<el-table-column prop="methodName" label="操作方法">
                    </el-table-column>-->
                    <!--<el-table-column prop="args" label="参数">
                    </el-table-column>-->
                    <el-table-column prop="description" label="操作描述">
                    </el-table-column>
                    <el-table-column prop="dataType" label="数据类型">
                        <template scope="scope">
                            <span>{{dataType[scope.row.dataType]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="consumeTime" label="方法消耗时间(ms)">
                    </el-table-column>
                    <el-table-column prop="operatorName" label="操作人">
                    </el-table-column>
                    <el-table-column prop="creationDate" label="操作时间">
                    </el-table-column>
                   <!-- <el-table-column prop="tenantId" label="">
                    </el-table-column>-->

                <!--<el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'OperateHistory.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'OperateHistory.Delete'"
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
          <!--  <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                            <el-form-item label="操作方法" prop="methodName">
                                    <el-input v-model="temp.method_name"
                                              placeholder="请输入操作方法"></el-input>
                            </el-form-item>
                            <el-form-item label="参数" prop="args">
                            </el-form-item>
                            <el-form-item label="方法消耗时间" prop="consumeTime">
                                    <el-radio-group v-model="temp.consume_time">
                                        <el-radio :label="3">备选项</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                            <el-form-item label="操作人" prop="operator">
                                    <el-input v-model="temp.operator"
                                              placeholder="请输入操作人"></el-input>
                            </el-form-item>
                            <el-form-item label="" prop="tenantId">
                                    <el-input v-model="temp.tenant_id"
                                              placeholder="请输入"></el-input>
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
                   <!-- <el-form-item label="操作方法" prop="methodName">
                        <el-input v-model="temp.methodName"
                                  placeholder="请输入操作方法"></el-input>
                    </el-form-item>
                    <el-form-item label="参数" prop="args">
                        <el-input v-model="temp.args"
                                  placeholder="请输入参数"></el-input>
                    </el-form-item>
                    <el-form-item label="方法消耗时间(ms)" prop="consumeTime">
                        <el-input v-model="temp.timeMin" type="number"
                                  placeholder="请输入时间"></el-input>至
                        <el-input v-model="temp.timeMax" type="number"
                                  placeholder="请输入时间"></el-input>
                    </el-form-item>-->
                    <el-form-item label="操作人类型" prop="operator">
                        <el-input v-model="operatorType" placeholder="操作人类型" :readonly="true" @focus="showParentTree"></el-input>
                        <template v-if="parentTree">
                            <div style="position: absolute;width: 100%;height: 200px;z-index:999;overflow:auto;background-color: white;">
                                <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px;"> </el-input>
                                <button style="cursor: pointer;" class="btn btn-default" @click="parentTree=false">关闭</button>
                                <el-tree class="communityTreeFY"
                                         ref="tenantTree"
                                         :data="treeData"
                                         :props="props"
                                         @node-click="nodeClick"
                                         :filter-node-method="filterTenantNode"
                                >
                                </el-tree>
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item label="操作人" prop="resourceTypeId">
                        <el-select v-model="pageParam.operator" placeholder="请选择">
                            <el-option
                                    v-for="item in users"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始日期">
                        <el-date-picker
                                v-model="value1"
                                type="datetime"
                                placeholder="开始日期"
                                @change="setBeginDate"
                                :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期">
                        <el-date-picker
                                v-model="value2"
                                type="datetime"
                                placeholder="结束日期"
                                @change="setEndDate"
                                :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="操作描述" prop="description">
                        <el-input v-model="pageParam.description"
                                  placeholder="请输入描述"></el-input>
                    </el-form-item>

                    <el-form-item label="数据类型" prop="dataType">
                        <el-select v-model="pageParam.dataType" placeholder="请选择">
                            <el-option
                                    v-for="item in dataTypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
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
<script src="./OperateHistory.js"></script>
