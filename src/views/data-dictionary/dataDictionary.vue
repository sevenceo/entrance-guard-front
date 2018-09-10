<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'DICTIONARY_CREATE'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'DICTIONARY_SEARCH'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
            <!--<el-button class="btn btn-add" type="primary" @click="onUse" v-authority="'SystemConfig.Dictionary.StatusOn'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-tianjiabiaoqian"></use>
                </svg>
                启用
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBan" v-authority="'SystemConfig.Dictionary.Create.StatusOff'">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                禁用
            </el-button>-->
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <!--<el-table-column-->
                        <!--type="selection"-->
                        <!--width="40">-->
                <!--</el-table-column>-->
                <el-table-column prop="dicText" label="字典名称">
                </el-table-column>
                <el-table-column prop="parentName" label="字典项父级">
                </el-table-column>
                <el-table-column prop="dicKey" label="字典项编码">
                </el-table-column>
                <el-table-column prop="dicValue" label="字典值">
                </el-table-column>
                <el-table-column prop="description" label="字典项说明">
                </el-table-column>
                <el-table-column prop="enabledFlag" label="启用状态" :formatter="formatStatus">
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)" v-authority="'DICTIONARY_EDIT'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="改变启用状态" class="icon-btn delete" @click="onChange(scope.row)" v-authority="'DICTIONARY_STATUS'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-change"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)" v-authority="'DICTIONARY_DELETE'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange1"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="字典名称" prop="dicText">
                            <el-input v-model="temp.dicText" placeholder="请输入字典名称"></el-input>
                        </el-form-item>
                        <el-form-item label="字典项父级" prop="parentName">
                            <el-select v-model="temp.parentId">
                                <el-option v-for="item in parentData" :key="item.id" :label="item.dicText" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="字典项编码" prop="dicKey">
                            <el-input v-model="temp.dicKey" placeholder="请输入字典项编码"></el-input>
                        </el-form-item>
                        <el-form-item label="字典值" prop="dicValue">
                            <el-input v-model="temp.dicValue" placeholder="请输入字典值"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态" prop="enabledFlag">
                            <el-select v-model="temp.enabledFlag">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="字典项说明" prop="description">
                            <el-input type="textarea" :rows="2" v-model="temp.description" placeholder="字典项说明"></el-input>
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
                    <el-form-item label="字典名称">
                        <el-input v-model="pageParam.dicText" style="ime-mode:disabled"
                                  placeholder="请输入字典名称"></el-input>
                    </el-form-item>
                    <el-form-item label="字典项父级">
                        <el-select v-model="pageParam.parentName">
                            <el-option v-for="item in parentData" :key="item.id" :label="item.dicText" :value="item.dicText"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字典项编码">
                        <el-input v-model="pageParam.dicKey" placeholder="请输入字典项编码"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态" prop="enabledFlag">
                        <el-select v-model="pageParam.enabledFlag">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
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

<script src="./dataDictionary.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }

    .upload-excel {
        float: right;
        margin: 0px 15px 10px;
        padding-bottom: 0;
    }

    .ico_uuaCheck i {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: solid 1px #ccc;
        float: left;
        border-radius: 5px;
    }

    .ico_uuaCheck i.icoChecked {
        background: #408ed6;
    }

    .ico_uuaCheck input {
        float: left;
        margin-top: -20px;
    }

    input[type="checkbox"]:checked + label::before {
        border: 1px #dddddd solid;
        cursor: pointer;
        background: url("../../assets/selected.png") 50% 50% no-repeat;
    }

    .usersManageList {
        list-style-type: none;
        height: 350px;
        min-height: 300px;
        overflow-y: auto;
    }

    .ico_uuaCheck label::before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #ffffff;
        vertical-align: middle;
        -webkit-border-radius: 25%;
        margin-right: 15px;
        -webkit-box-sizing: border-box;
        border: 1px #dddddd solid;
        cursor: pointer;
    }

    .usersManageList li {
        line-height: 28px;
        overflow: hidden;
        margin-bottom: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
