
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AppUpgrade.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'AppUpgrade.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <!--<el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'AppUpgrade.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'AppUpgrade.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'AppUpgrade.Search'">
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
                    <el-table-column prop="appVersion" label="应用版本">
                    </el-table-column>
                    <el-table-column prop="appVersionDes" label="应用版本描述">
                    </el-table-column>
                    <el-table-column prop="recommendVersion" label="推荐版本">
                    </el-table-column>
                    <el-table-column prop="recommendVersionDes" label="推荐版本描述">
                    </el-table-column>
                    <el-table-column prop="upgradeTypeName" label="升级方式">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="300">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)" v-authority="'AppUpgrade.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)" v-authority="'AppUpgrade.Delete'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <!--<el-button type="default" title="启用" class="icon-btn edit" @click="onStatus(scope.row,'0')"
                                   size="small">
                            启用
                        </el-button>-->
                        <el-button type="default" title="关联终端设备" class="icon-btn edit" @click="relation(scope.row)" v-authority="'AppUpgrade.Box'"
                                   size="small">
                            关联终端设备
                        </el-button>
                        <el-button type="default" title="查看关联" class="icon-btn edit" @click="searchRelation(scope.row)" v-authority="'AppUpgrade.Box'"
                                   size="small">
                            查看关联
                        </el-button>
                        <el-button type="default" title="下发数据" class="icon-btn edit" @click="generate(scope.row)" v-authority="'AppUpgrade.DeliverData'"
                                   size="small">
                            下发数据
                        </el-button>
                        <!--<el-button type="default" title="停用" class="btn btn-add" @click="onStatus(scope.row,'1')"-->
                                   <!--size="small">-->
                            <!--<svg class="icon" aria-hidden="true">-->
                                <!--<use xlink:href="#icon-add1"></use>-->
                            <!--</svg>-->
                            <!--停用-->
                        <!--</el-button>-->
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
                            <el-form-item label="应用版本" prop="appVersionId">
                                    <el-select v-model="temp.appVersionId" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.id"
                                                :label="item.versionNum"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="应用版本描述" prop="appVersionDes">
                                    <el-input v-model="temp.appVersionDes"
                                              placeholder="请输入应用版本描述"></el-input>
                            </el-form-item>
                            <el-form-item label="推荐版本" prop="recommendVersionId">
                                    <el-select v-model="temp.recommendVersionId" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.id"
                                                :label="item.versionNum"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="推荐版本描述" prop="recommendVersionDes">
                                    <el-input v-model="temp.recommendVersionDes"
                                              placeholder="请输入推荐版本描述"></el-input>
                            </el-form-item>
                            <el-form-item label="升级方式" prop="upgradeType">
                                <el-select v-model="temp.upgradeType" placeholder="请选择">
                                    <el-option
                                            v-for="item in optionTypes"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
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
                        <el-form-item label="应用版本，对应版本id" prop="appVersionId">
                                <el-select v-model="pageParam.appVersionId" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.id"
                                            :label="item.versionNum"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="应用版本描述" prop="appVersionDes">
                                <el-input v-model="pageParam.appVersionDes"
                                          placeholder="请输入应用版本描述"></el-input>
                        </el-form-item>
                        <el-form-item label="推荐版本，对应版本id" prop="recommendVersionId">
                                <el-select v-model="pageParam.recommendVersionId" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.id"
                                            :label="item.versionNum"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="推荐版本描述" prop="recommendVersionDes">
                                <el-input v-model="pageParam.recommendVersionDes"
                                          placeholder="请输入推荐版本描述"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="租户id" prop="tenantId">
                                <el-input v-model="temp.tenant_id"
                                          placeholder="请输入租户id"></el-input>
                        </el-form-item>-->
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

            <el-dialog class="dialogForm" title="关联信息" :visible.sync="ldServerVisible" @close="closeLdOnlyForm()">
                <!--表格-->
                <el-table :data="dialogTableData" border stripe style="width: 100%" class="blue-table"
                          @selection-change="diaLogHandleSelectionChange">
                    <el-table-column v-if="dialogStatus != 'search'"  type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="currentVersionNum" label="版本号">
                    </el-table-column>

                    <el-table-column prop="type" label="操作" align="center" width="250">
                        <template scope="dialogScope">
                            <el-button type="default" title="查看组织" class="icon-btn edit"
                                       @click="DetailHumanResourceRef(dialogScope.row)" size="small" >
                                查看组织
                            </el-button>
                            <el-button v-if="dialogStatus === 'search'" type="default" title="删除" class="icon-btn delete"
                                       @click="dialogOnDelete(dialogScope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="dialogRowTotal" v-on:pageChange="dialogHandleCurrentChange"></pagination>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeLdOnlyForm()" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'relation'" type="primary" class="confirm," @click="closeLdForm()">确 定</el-button>
                </div>
            </el-dialog>

            <!--dialog查看资源-->
            <el-dialog class="dialogForm" title="查看资源" :visible.sync="dialogResourceDetail" @close="closeDetailForm()">
                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="cropName" label="企业名称">
                    </el-table-column>
                    <el-table-column prop="orgName" label="组织名称">
                    </el-table-column>
                </el-table>

            </el-dialog>
        </div>
    </div>
</template>
<script src="./AppUpgrade.js"></script>
