<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'ResourceType.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete"
                       v-authority="'ResourceType.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')"
                       v-authority="'ResourceType.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')"
                       v-authority="'ResourceType.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'ResourceType.Search'">
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
                <el-table-column prop="name" label="类型名称">
                </el-table-column>
                <el-table-column prop="code" label="资源编码">
                </el-table-column>
                <el-table-column prop="parentName" label="上级类型">
                </el-table-column>
                <el-table-column prop="displayIndex" label="显示顺序">
                </el-table-column>
                <el-table-column prop="parentId" label="层级">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="enabledFlag" label="是否启用">
                    <template scope="scope">
                        <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   size="small" v-authority="'ResourceType.Edit'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   size="small" v-authority="'ResourceType.Delete'">
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

                        <el-form-item label="类型名称" prop="name">
                            <el-input v-model="temp.name"
                                      placeholder="请输入类型名称"></el-input>
                        </el-form-item>
                        <el-form-item label="类型编码" prop="code" v-if="isCode">
                            <el-input v-model="temp.code" readonly
                                      placeholder="请输入类型编码"></el-input>
                        </el-form-item>
                        <el-form-item label="类型编码" prop="code" v-if="!isCode">
                            <el-input v-model="temp.code"
                                      placeholder="请输入类型编码"></el-input>
                        </el-form-item>
                        <el-form-item label="上级类型" prop="parentId">
                            <el-select v-model="temp.parentId" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
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
                    <el-form-item label="类型名称" prop="name">
                        <el-input v-model="pageParam.name"
                                  placeholder="请输入类型名称"></el-input>
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
<script src="./ResourceType.js"></script>
