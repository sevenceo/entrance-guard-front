<!--<style>
    .dialogForm .el-dialog{
        width:900px !important;
    }
</style>-->
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'GroupHuman.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete"
                       v-authority="'GroupHuman.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')"
                       v-authority="'GroupHuman.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')"
                       v-authority="'GroupHuman.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'GroupHuman.Search'">
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
                <el-table-column prop="groupName" label="组名">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="enabledFlag" label="是否启用">
                    <template scope="scope">
                        <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="500">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit"
                                   @click="onEdit(scope.row)" size="small"  v-authority="'GroupHuman.Edit'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete"
                                   @click="onDelete(scope.row)" size="small"  v-authority="'GroupHuman.Delete'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="组成员列表" class="icon-btn edit"
                                   @click="onHumanDetail(scope.row)" size="small"  v-authority="'GroupHuman.Member'">
                            组成员列表
                        </el-button>

                        <el-button type="default" title="添加组员" class="icon-btn edit"
                                   @click="addHuman(scope.row)" size="small"  v-authority="'GroupHuman.Member'">
                            添加组员
                        </el-button>
                        <el-button type="default" title="查看场景" class="icon-btn edit"
                                   @click="onSenceDetail(scope.row)" size="small"  v-authority="'GroupHuman.Scene'">
                            查看场景
                        </el-button>

                        <el-button type="default" title="关联场景" class="icon-btn edit"
                                   @click="addSence(scope.row)" size="small"  v-authority="'GroupHuman.Scene'">
                            关联场景
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
                        <el-form-item label="组名" prop="groupName">
                            <el-input v-model="temp.groupName"
                                      placeholder="请输入组名"></el-input>
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
                    <el-form-item label="组名" prop="groupName">
                        <el-input v-model="pageParam.groupName"
                                  placeholder="请输入组名"></el-input>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="tenants">
                        <el-select v-model="pageParam.organizationId" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
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


            <!--dialog查看人员-->
            <el-dialog class="dialogForm" title="查看组员" :visible.sync="dialogHumanDetail" @close="closeDetailForm()">
                <el-table :data="tableDataHuman" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="facePhoto" label="人脸照片">
                        <template scope="scope">
                            <img :src="scope.row.facePhoto" width="100" height="100"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                        <template scope="scope">
                            <span>{{genderInfo[scope.row.gender]}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="age" label="年龄">
                     </el-table-column>-->
                    <el-table-column prop="mobilePhone" label="手机号">
                    </el-table-column>
                    <!--<el-table-column prop="email" label="邮箱">
                    </el-table-column>-->
                    <!-- <el-table-column prop="remark" label="备注">
                     </el-table-column>-->
                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onHumanDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="humanRowTotal" v-on:pageChange="handleHumanCurrentChange"></pagination>

            </el-dialog>

            <!--dialog关联人员-->
            <el-dialog class="dialogForm" title="添加组员" :visible.sync="dialogAddData" @close="closeDetailForm()">
                <el-button class="btn btn-edit" type="primary" @click="onHumanSearch" v-authority="'Human.Search'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
                <el-table :data="tableDataAdd" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChangeHGR">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="facePhoto" label="人脸照片">
                        <template scope="scope">
                            <img :src="scope.row.facePhoto" width="100" height="100"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                        <template scope="scope">
                            <span>{{genderInfo[scope.row.gender]}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="age" label="年龄">
                    </el-table-column>-->
                    <el-table-column prop="mobilePhone" label="手机号">
                    </el-table-column>
                   <!-- <el-table-column prop="email" label="邮箱">
                    </el-table-column>-->
                    <!--  <el-table-column prop="remark" label="备注">
                     </el-table-column>-->
                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="humanRowTotal" v-on:pageChange="handleHumanCurrentChange"></pagination>
                <el-button class="btn btn-add" type="primary" @click="onBatchAdd()"
                           style="width: 100px;float: right;margin: 10px 0px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量关联
                </el-button>
            </el-dialog>

            <el-dialog :visible.sync="searchHumanFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">

                    <el-form-item label="姓名" prop="realName">
                        <el-input v-model="pageParam.realName"
                                  placeholder="请输入姓名"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="pageParam.mobilePhone" type="number"
                                  placeholder="请输入手机号"></el-input>
                    </el-form-item>

                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="pageParam.gender" placeholder="请选择">
                            <el-option
                                    v-for="item in genders"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                   <!-- <el-form-item label="邮箱" prop="email">
                        <el-input v-model="pageParam.email"
                                  placeholder="请输入邮箱"></el-input>
                    </el-form-item>-->

                    <el-form-item label="楼栋" prop="building">
                        <el-select v-model="pageParam.building" placeholder="请选择" @change="changeValue" >
                            <el-option
                                    v-for="item in buildings"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="单元" prop="unit">
                        <el-select v-model="pageParam.unit" placeholder="请选择"  >
                            <el-option
                                    v-for="item in units"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" @click="reset" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="humanSearch" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>

            <!--dialog查看场景-->
            <el-dialog class="dialogForm" title="查看场景" :visible.sync="dialogSceneDetail" @close="closeDetailForm()">
                <el-table :data="tableDataSence" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="sceneName" label="场景名称">
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center" width="130">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onSenceDelete(scope.row)" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>

            </el-dialog>

            <!--dialog关联场景-->
            <el-dialog class="dialogForm" title="关联场景" :visible.sync="dialogAddHumanSenctData"
                       @close="closeDetailForm()">
                <el-table :data="tableDataAddSence" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChangeGSR">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="sceneName" label="场景名称">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
                <el-button class="btn btn-add" type="primary" @click="onBatchAddSenece()"
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
<script src="./GroupHuman.js"></script>
