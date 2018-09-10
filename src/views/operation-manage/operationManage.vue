<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AUTH_OPERATOR_CREATE'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'AUTH_OPERATOR_QUERY'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column prop="moduleName" label="所属菜单">
                </el-table-column>
                <el-table-column prop="code" label="操作编码">
                </el-table-column>
                <el-table-column prop="name" label="操作名称">
                </el-table-column>
                <el-table-column prop="url" label="访问路径">
                </el-table-column>
                <el-table-column prop="method" label="访问方式">
                </el-table-column>
                <el-table-column prop="description" label="操作描述">
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)" v-authority="'AUTH_OPERATOR_EDIT'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)" v-authority="'AUTH_OPERATOR_DELETE'"
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
                        <el-form-item label="操作名称" prop="name">
                            <el-input v-model="temp.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="访问路径" prop="url">
                            <el-input v-model="temp.url" placeholder="请输入访问路径"></el-input>
                        </el-form-item>
                        <el-form-item label="访问方式" prop="method">
                            <el-select v-model="temp.method">
                                <el-option value="GET"></el-option>
                                <el-option value="POST"></el-option>
                                <el-option value="PUT"></el-option>
                                <el-option value="DELETE"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属模块" prop="moduleId">
                            <el-cascader
                                    v-model="moduleId1"
                                    placeholder="请选择所属模块"
                                    :options="treeData"
                                    filterable
                                    change-on-select
                                    :show-all-levels="false"
                            ></el-cascader>
                            <!--<el-tree show-checkbox ref="tree" :data="treeData" :props="props"-->
                                     <!--default-expand-all></el-tree>-->
                            <!--<hs-droptree :data="treeData" :props="props"></hs-droptree>-->
                            <!--<el-autocomplete-->
                                    <!--class="inline-input"-->
                                    <!--v-model="temp.moduleId"-->
                                    <!--:fetch-suggestions="getModules"-->
                                    <!--placeholder="请选择所属模块"-->
                                    <!--@select="handleSelect"-->
                            <!--&gt;-->
                                <!--<template id="module" slot-scope="item in tree">-->

                                <!--</template>-->
                            <!--</el-autocomplete>-->
                            <!--<el-input v-model="temp.moduleId" placeholder="请选择所属模块" @select="getModules"></el-input>-->
                        </el-form-item>
                        <el-form-item label="操作编码" prop="code">
                            <el-input v-model="temp.code" ></el-input>
                        </el-form-item>
                        <el-form-item label="操作描述" prop="description">
                            <el-input type="textarea" :rows="2" v-model="temp.description" placeholder="请输入描述"></el-input>
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
                    <el-form-item label="所属模块">
                        <el-input v-model="pageParam.moduleName" style="ime-mode:disabled"
                                  placeholder="所属模块"></el-input>
                    </el-form-item>
                    <el-form-item label="操作编码">
                        <el-input v-model="pageParam.code" placeholder="操作编码"></el-input>
                    </el-form-item>
                    <el-form-item label="操作名称">
                        <el-input v-model="pageParam.name" placeholder="操作名称"></el-input>
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

<script src="./operationManage.js"></script>
<!--<script src="../../jstree/jstree.js"></script>-->
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
