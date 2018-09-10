
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'SensingDevice.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'SensingDevice.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'SensingDevice.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'SensingDevice.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'SensingDevice.Search'">
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
                    <el-table-column prop="aiServerIP" label="AI服务器ip">
                    </el-table-column>
                    <!--<el-table-column prop="mac" label="Mac地址">-->
                    <!--</el-table-column>-->
                    <el-table-column prop="ip" label="IP">
                    </el-table-column>
                    <!--<el-table-column prop="prot" label="端口">-->
                    <!--</el-table-column>-->
                    <el-table-column prop="bitStreamAddr" label="码流地址">
                    </el-table-column>
                    <!--<el-table-column prop="bitStreamPort" label="码流端口">-->
                    <!--</el-table-column>-->
                    <el-table-column prop="enabledFlag" label="是否启用">
                        <template scope="scope">
                            <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="300">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit"
                                   @click="onEdit(scope.row)" size="small" v-authority="'SensingDevice.Edit'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete"
                                   @click="onDelete(scope.row)" size="small" v-authority="'SensingDevice.Delete'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="查看组织" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="DetailHumanResourceRef(scope.row)" size="small" v-authority="'SensingDevice.Resource'">
                            查看组织
                        </el-button>
                        <el-button type="default" title="关联组织" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="addHumanResourceRef(scope.row)" size="small" v-authority="'SensingDevice.Resource'">
                            关联组织
                        </el-button>

                        <!--<el-button type="default" title="场景分布" class="icon-btn edit" :disabled="scope.row.enabledFlag === 0"
                                   @click="sceneDistribution(scope.row)" size="small" v-authority="'SensingDevice.Scene'">
                            场景分布
                        </el-button>-->

                        <!--<el-button type="default" title="查看门禁" class="icon-btn edit"
                                   @click="onDetail(scope.row)" size="small">
                            查看门禁
                        </el-button>

                        <el-button type="default" title="关联门禁" class="icon-btn edit"
                                   @click="onCorrelation(scope.row)" size="small">
                            关联门禁
                        </el-button>-->

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
                        <el-form-item label="AI服务器ip" prop="aiServerId" rop="aiServerId">
                                <el-select v-model="temp.aiServerId" placeholder="请选择"  rop="aiServerId">
                                    <el-option
                                            v-for="item in options.rows"
                                            :key="item.id"
                                            :label="item.ip"
                                            :value="item.id" >
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <!--<el-form-item label="Mac地址" prop="mac">
                                <el-input v-model="temp.mac"
                                          placeholder="请输入Mac地址"></el-input>
                        </el-form-item>-->
                        <el-form-item label="IP" prop="ip">
                                <el-input v-model="temp.ip"
                                          placeholder="请输入IP"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="端口" prop="prot">
                            <el-input v-model="temp.prot"
                                      placeholder="请输入端口"></el-input>
                        </el-form-item>-->
                        <el-form-item label="码流地址" prop="bitStreamAddr">
                                <el-input v-model="temp.bitStreamAddr"
                                          placeholder="请输入码流地址"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="码流端口" prop="bitStreamPort">
                            <el-input v-model="temp.bitStreamPort"
                                      placeholder="请输入码流端口"></el-input>
                        </el-form-item>-->
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="temp.remark" type="textarea"
                                      :rows="2"
                                      placeholder="请输入备注"></el-input>
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
                        <el-form-item label="AI服务器ip" prop="aiServerId">
                                <el-select v-model="pageParam.aiServerId" placeholder="请选择">
                                    <el-option
                                            v-for="item in options.rows"
                                            :key="item.id"
                                            :label="item.ip"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <!--<el-form-item label="Mac地址" prop="mac">
                                <el-input v-model="pageParam.mac"
                                          placeholder="请输入Mac地址"></el-input>
                        </el-form-item>-->
                        <el-form-item label="IP" prop="ip">
                                <el-input v-model="pageParam.ip"
                                          placeholder="请输入IP"></el-input>
                        </el-form-item>
                       <!-- <el-form-item label="端口" prop="prot">
                                <el-radio-group v-model="pageParam.prot">
                                    <el-radio :label="3">备选项</el-radio>
                                </el-radio-group>
                        </el-form-item>
                        <el-form-item label="码流地址" prop="bitStreamAddr">
                                <el-input v-model="pageParam.bitStreamAddr"
                                          placeholder="请输入码流地址"></el-input>
                        </el-form-item>
                        <el-form-item label="码流端口" prop="bitStreamPort">
                                <el-radio-group v-model="pageParam.bitStreamPort">
                                    <el-radio :label="3">备选项</el-radio>
                                </el-radio-group>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                                <el-input v-model="pageParam.remark"
                                          placeholder="请输入备注"></el-input>
                        </el-form-item>-->
                    <el-form-item label="所属组织" prop="tenants">
                        <el-select v-model="pageParam.organizationId" placeholder="请选择">
                            <el-option
                                    v-for="item in items"
                                    :key="item.orgId"
                                    :label="item.orgName"
                                    :value="item.orgId">
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

            <!--dialog查看门禁-->
            <el-dialog class="dialogForm" title="查看门禁" :visible.sync="dialogDetail" @close="closeDetailForm()">
                <el-table :data="tableDataControl" border stripe style="width: 100%" class="blue-table">

                    <el-table-column prop="ctlCommond" label="开门指令">
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
            <el-dialog class="dialogForm" title="关联门禁" :visible.sync="dialogCorrelation" @close="closeDetailForm()">
                <el-table :data="tableDataEditControl" border stripe style="width: 100%" class="blue-table"@selection-change="handleSelectionChangeCorrelation">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="ctlCommond" label="开门指令">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
                <el-button class="btn btn-add" type="primary" @click="onBatchCorrelation()"style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量关联
                </el-button>
            </el-dialog>

            <!--dialog查看资源-->
            <el-dialog class="dialogForm" title="查看组织" :visible.sync="dialogResourceDetail" @close="closeDetailForm()">
                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="cropName" label="企业名称">
                    </el-table-column>
                    <el-table-column prop="orgName" label="组织名称">
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
            <el-dialog class="dialogForm" title="关联组织" :visible.sync="dialogAddData" @close="closeDetailForm()">
                <el-table :data="tableDataAdd" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChangeResource">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <!--<el-table-column prop="resourceTypeName" label="资源类型">-->
                    <!--</el-table-column>-->
                    <el-table-column prop="cropName" label="企业名称">
                    </el-table-column>
                    <el-table-column prop="orgName" label="组织名称">
                    </el-table-column>
                    <!--<el-table-column prop="parentName" label="上级资源">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="displayIndex" label="显示顺序">
                    </el-table-column>
                    <el-table-column prop="leftValue" label="左值">
                    </el-table-column>
                    <el-table-column prop="rightValue" label="右值">
                    </el-table-column>
                    <el-table-column prop="lvl" label="层级">
                    </el-table-column>-->

                </el-table>

                <el-button class="btn btn-add" type="primary" @click="onBatchAdd()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    关联
                </el-button>
            </el-dialog>

        </div>
    </div>
</template>
<script src="./SensingDevice.js"></script>
