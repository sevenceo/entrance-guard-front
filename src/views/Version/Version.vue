<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'ReleaseVersion.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'ReleaseVersion.BatchDelete'"
                       style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'ReleaseVersion.Search'">
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
                <el-table-column prop="versionNum" label="版本号">
                </el-table-column>
                <el-table-column prop="applicationModule" label="应用模块">
                </el-table-column>
                <el-table-column prop="functionDescription" label="版本功能说明">
                </el-table-column>
                <el-table-column prop="incrementalVersionPath" label="增量版本路径">
                </el-table-column>
                <el-table-column prop="fullVersionPath" label="全量版本路径">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)" v-authority="'ReleaseVersion.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)" v-authority="'ReleaseVersion.Delete'"
                                   size="small">
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
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">

                        <el-form-item label="版本号" prop="versionNum">
                            <el-input v-model="temp.versionNum"
                                      placeholder="请输入版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="应用模块" prop="applicationModule">
                            <el-input v-model="temp.applicationModule"
                                      placeholder="请输入应用模块"></el-input>
                        </el-form-item>
                        <el-form-item label="版本功能说明" prop="functionDescription">
                            <el-input v-model="temp.functionDescription"
                                      placeholder="请输入版本功能说明"></el-input>
                        </el-form-item>
                      <!--  <el-form-item label="上级类型" prop="parentId">
                            <el-select v-model="temp.parentId" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>-->
                        <el-form-item label="增量版本路径" prop="incrementalVersionPath" >
                            <el-input v-model="temp.incrementalVersionPath"
                                      placeholder="请输入增量版本路径"></el-input>
                        </el-form-item>
                        <el-form-item label="全量版本路径" prop="fullVersionPath">
                            <el-input v-model="temp.fullVersionPath"
                                      placeholder="请输入全量版本路径"></el-input>
                        </el-form-item>
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
                    <el-form-item label="版本号" prop="name">
                        <el-input v-model="pageParam.versionNum"
                                  placeholder="请输入版本号"></el-input>
                    </el-form-item>
                    <el-form-item label="应用模块" prop="name">
                        <el-input v-model="pageParam.applicationModule"
                                  placeholder="请输入应用模块"></el-input>
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
<script src="./Version.js"></script>
