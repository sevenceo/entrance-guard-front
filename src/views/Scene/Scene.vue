<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Scene.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'Scene.BatchDelete'"
                       style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'Scene.BatchStatus'"
                       style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'Scene.BatchStatus'"
                       style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'Scene.Search'">
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
                <el-table-column prop="tenantName" label="所属组织">
                </el-table-column>
                <el-table-column prop="sceneName" label="场景名称">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="enabledFlag" label="是否启用">
                    <template scope="scope">
                        <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="enabledFlag" label="开门预警">
                    <template scope="scope">
                        <span>{{ openedFlags[scope.row.openDoorWarningFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作" width="600">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'Scene.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'Scene.Delete'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="查看摄像头" class="icon-btn edit"
                                   @click="onDetailSensingDev(scope.row)" size="small" v-authority="'Scene.Camera'">
                            查看摄像头
                        </el-button>
                        <el-button type="default" title="关联摄像头" class="icon-btn edit"
                                   @click="onSensingDev(scope.row)" size="small" v-authority="'Scene.Camera'">
                            关联摄像头
                        </el-button>
                        <el-button type="default" title="查看资源" class="icon-btn edit"
                                   @click="DetailResource(scope.row)" size="small" v-authority="'Scene.Source'">
                            查看资源
                        </el-button>
                        <el-button type="default" title="关联资源" class="icon-btn edit"
                                   @click="addSceneResourceRef(scope.row)" size="small" v-authority="'Scene.Source'">
                            关联资源
                        </el-button>


                        <el-button type="default" title="查看门禁控制器" class="icon-btn edit"
                                   @click="onDetail(scope.row)" size="small" v-authority="'Scene.Control'">
                            查看门禁控制器
                        </el-button>

                        <el-button type="default" title="关联门禁控制器" class="icon-btn edit"
                                   @click="onCorrelation(scope.row)" size="small" v-authority="'Scene.Control'">
                            关联门禁控制器
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
                        <el-form-item label="场景名称" prop="sceneName">
                            <el-input v-model="temp.sceneName"
                                      placeholder="请输入场景名称"></el-input>
                        </el-form-item>
                        <el-form-item label="开门预警开关">
                            <el-radio v-model="temp.openDoorWarningFlag" label="1">开</el-radio>
                            <el-radio v-model="temp.openDoorWarningFlag" label="0">关</el-radio>
                        </el-form-item>
                        <el-form-item label="每周预警日" v-if="temp.openDoorWarningFlag == 1">
                            <el-select v-model="temp.openDoorWarningBeginDay"
                                       style="width: 100px;">
                                <el-option
                                        v-for="item in weekSlot"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.label">
                                </el-option>
                            </el-select>&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;
                            <el-select v-model="temp.openDoorWarningEndDay"
                                       style="width:100px;">
                                <el-option
                                        v-for="item in weekSlot"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.label">
                                </el-option>
                            </el-select>&nbsp;&nbsp;
                        </el-form-item>
                        <el-form-item label="每天预警时间" v-if="temp.openDoorWarningFlag == 1">
                            <el-select v-model="temp.openDoorWarningBeginHour"
                                       style="width: 80px;">
                                <el-option
                                        v-for="item in timeSlot"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.label">
                                </el-option>
                            </el-select>&nbsp;&nbsp;点&nbsp;&nbsp;~&nbsp;&nbsp;
                            <el-select v-model="temp.openDoorWarningEndHour"
                                       style="width: 80px;">
                                <el-option
                                        v-for="item in timeSlot"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.label">
                                </el-option>
                            </el-select>&nbsp;&nbsp;点
                        </el-form-item>
                        <el-form-item label="设备预警开关">
                            <el-radio v-model="temp.deviceWarningFlag" label="1">开</el-radio>
                            <el-radio v-model="temp.deviceWarningFlag" label="0">关</el-radio>
                        </el-form-item>
                        <el-form-item label="是否考勤打卡">
                            <el-radio v-model="temp.attendanceCard" label="1">是</el-radio>
                            <el-radio v-model="temp.attendanceCard" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="temp.remark" type="textarea"
                                      :rows="2"
                                      placeholder="请输入备注"></el-input>
                        </el-form-item>
                        <el-form-item label="关联资源" prop="selectedResourceId">
                            <div>
                                <el-tree class="communityTreeFY"
                                         ref="resourceTree"
                                         id="resourceTree"
                                         :data="treeData"
                                         :props="props"
                                         show-checkbox
                                         :default-checked-keys="ckeckedData"
                                         check-strictly
                                         node-key="id"
                                         @check-change="handleCheckChange"
                                >
                                </el-tree>
                            </div>
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
                    <el-form-item label="场景名称" prop="sceneName">
                        <el-input v-model="pageParam.sceneName"
                                  placeholder="请输入场景名称"></el-input>
                    </el-form-item>

                    <el-form-item label="状态" prop="enabledFlag">
                        <br/>
                        <el-select v-model="pageParam.enabledFlag" value-key="id" placeholder="请选择">
                            <el-option v-for="item in options" :label="item.label" :key="item.id" :value="item.id">
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

            <!--dialog查看摄像头-->
            <el-dialog class="dialogForm-1000" title="查看摄像头" :visible.sync="dialogDetail" @close="closeDetailForm()">

                <el-table :data="tableDataControl" border stripe style="width: 100%" class="blue-table">

                    <el-table-column prop="aiServerIP" label="AI服务器IP">
                    </el-table-column>
                    <!--<el-table-column prop="mac" label="Mac地址">
                    </el-table-column>-->
                    <el-table-column prop="ip" label="IP">
                    </el-table-column>
                    <<!--el-table-column prop="prot" label="端口">
                    </el-table-column>-->
                    <el-table-column prop="bitStreamAddr" label="码流地址">
                    </el-table-column>
                    <!--<el-table-column prop="bitStreamPort" label="码流端口">
                    </el-table-column>-->
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>

                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onSensingDevDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <!--dialog添加摄像头-->
            <el-dialog class="dialogForm-1000" title="关联摄像头" :visible.sync="dialogCorrelation" @close="closeDetailForm()">
                <el-table :data="tableDataSensingDev" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChangeCorrelation">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="aiServerIP" label="AI服务器IP">
                    </el-table-column>
                    <!--<el-table-column prop="mac" label="Mac地址">
                    </el-table-column>-->
                    <el-table-column prop="ip" label="IP">
                    </el-table-column>
                    <!--<el-table-column prop="prot" label="端口">
                    </el-table-column>-->
                    <el-table-column prop="bitStreamAddr" label="码流地址">
                    </el-table-column>
                    <!--<el-table-column prop="bitStreamPort" label="码流端口">
                    </el-table-column>-->
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>

                <el-button class="btn btn-add" type="primary" @click="onBatchSensingDev()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量关联
                </el-button>
            </el-dialog>

            <!--dialog查看资源-->
            <el-dialog class="dialogForm-1000" title="查看资源" :visible.sync="dialogResourceDetail" @close="closeDetailForm()">
                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="resourceTypeName" label="资源类型">
                    </el-table-column>
                    <el-table-column prop="name" label="资源名称">
                    </el-table-column>
                    <el-table-column prop="code" label="资源编码">
                    </el-table-column>
                    <el-table-column prop="parentName" label="上级资源">
                    </el-table-column>
                    <!--<el-table-column prop="displayIndex" label="显示顺序">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="leftValue" label="左值">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="rightValue" label="右值">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="lvl" label="层级">-->
                    <!--</el-table-column>-->
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>

                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onResourceDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>

            </el-dialog>

            <!--dialog关联资源-->
            <el-dialog class="dialogForm" title="关联资源" :visible.sync="dialogAddData" @close="closeDetailForm()">
                <div style="max-height: 500px;overflow: auto">
                    <el-tree class="communityTreeFY"
                             :data="treeData"
                             :props="props"
                             show-checkbox
                             :default-checked-keys="ckeckedData"
                             check-strictly
                             node-key="id"
                             @check-change="handleCheckChange"
                    >
                    </el-tree>
                </div>

                <el-button class="btn btn-add" type="primary" @click="onBatchAdd()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    关联
                </el-button>
            </el-dialog>


            <!--dialog查看门禁-->
            <el-dialog class="dialogForm-1000" title="查看门禁控制器" :visible.sync="dialogDetailDoor" @close="closeDetailForm()">
                <el-table :data="tableDataControlDoor" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="ip" label="ip">
                    </el-table-column>
                    <el-table-column prop="onCommond" label="开门指令">
                    </el-table-column>
                    <el-table-column prop="offCommond" label="开门指令">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>

                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onDetailDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>

            </el-dialog>

            <!--dialog关联门禁-->
            <el-dialog class="dialogForm-1000" title="关联门禁控制器" :visible.sync="dialogCorrelationDoor"
                       @close="closeDetailForm()">
                <el-table :data="tableDataEditControlDoor" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChangeCorrelation">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="ip" label="ip">
                    </el-table-column>
                    <el-table-column prop="onCommond" label="开门指令">
                    </el-table-column>
                    <el-table-column prop="offCommond" label="关门指令">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
                <el-button class="btn btn-add" type="primary" @click="onBatchCorrelation()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量关联
                </el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./Scene.js"></script>
<style lang="scss">
    /*.communityTreeFY{*/
    /*}*/
    /*.communityTreeFY .is-current > .el-tree-node__content{*/
    /*background-color: #E4E8F1 !important;*/
    /*}*/
    /*.audit-header{*/
    /*padding: 20px 0px;*/
    /*}*/
</style>
