<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'LdServer.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'LdServer.BatchDelete'"
                       style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')"
                       v-authority="'LdServer.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')"
                       v-authority="'LdServer.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'LdServer.Search'">
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
                <el-table-column prop="ip" label="IP">
                </el-table-column>
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="code" label="编号">
                </el-table-column>
               <!-- <el-table-column prop="mqttIp" label="MQTT地址">
                </el-table-column>
                <el-table-column prop="mqttPort" label="MQTT端口">
                </el-table-column>
                <el-table-column prop="clientId" label="clientId">
                </el-table-column>
                <el-table-column prop="topic" label="topic">
                </el-table-column>
                <el-table-column prop="upgradeTopic" label="升级topic">
                </el-table-column>
                <el-table-column prop="userName" label="登录名">
                </el-table-column>
                <el-table-column prop="password" label="密码">
                </el-table-column>-->
                <el-table-column prop="currentVersionNum" label="当前版本号">
                </el-table-column>
                <el-table-column prop="factoryVersionNum" label="出厂版本号">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        <span>{{ status[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="enabledFlag" label="是否启用">
                    <template scope="scope">
                        <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                    </template>
                </el-table-column>


                <el-table-column prop="type" label="操作" align="center" width="500">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit"
                                   @click="onEdit(scope.row)" size="small" v-authority="'LdServer.Edit'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete"
                                   @click="onDelete(scope.row)" size="small" v-authority="'LdServer.Delete'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="查看组织" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="DetailHumanResourceRef(scope.row)" size="small" v-authority="'LdServer.Organization'">
                            查看组织
                        </el-button>
                        <el-button type="default" title="关联组织" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="addHumanResourceRef(scope.row)" size="small" v-authority="'LdServer.Organization'">
                            关联组织
                        </el-button>
                        <el-button type="default" title="人员数据下发" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="send(scope.row)" size="small" v-authority="'LdServer.Resource'">
                            人员数据下发
                        </el-button>
                        <el-button type="default" title="手动升级" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0 || scope.row.status === 1)"
                                   @click="manualUpgrade(scope.row)" size="small" v-authority="'LdServer.ManualUpgrade'">
                            手动升级
                        </el-button>
                        <el-button type="default" title="设备数据下发" class="icon-btn edit" :disabled="(scope.row.enabledFlag === 0)"
                                   @click="sendDevice(scope.row)" size="small" v-authority="'LdServer.Device'">
                            设备数据下发
                        </el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="type" label="操作" width="130">
                     <template scope="scope">
                         <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                    v-authority="'LdServer.Edit'"
                                    size="small">
                             <svg class="icon" aria-hidden="true">
                                 <use xlink:href="#icon-edit1"></use>
                             </svg>
                         </el-button>
                         <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                    v-authority="'LdServer.Delete'"
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
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox" style="max-height: 478px;">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="IP" prop="ip">
                            <el-input v-model="temp.ip"
                                      placeholder="请输入IP"></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="temp.name"
                                      placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="temp.code"
                                      placeholder="请输入编码"></el-input>
                        </el-form-item>
                        <el-form-item label="MQTT地址" prop="mqttIp">
                            <el-input v-model="temp.mqttIp" :maxlength="15"
                                      placeholder="请输入MQTT地址"></el-input>
                        </el-form-item>
                        <el-form-item label="MQTT端口" prop="mqttPort">
                            <el-input v-model="temp.mqttPort" :maxlength="5"
                                      placeholder="请输入MQTT端口"></el-input>
                        </el-form-item>
                        <el-form-item label="clientId" prop="clientId">
                            <el-input v-model="temp.clientId"
                                      placeholder="请输入客户端唯一标识"></el-input>
                        </el-form-item>
                        <el-form-item label="topic" prop="topic">
                            <el-input v-model="temp.topic"
                                      placeholder="请输入订阅主题"></el-input>
                        </el-form-item>
                        <el-form-item label="升级Topic" prop="upgradeTopic">
                            <el-input v-model="temp.upgradeTopic"
                                      placeholder="请输入升级Topic"></el-input>
                        </el-form-item>
                        <el-form-item label="登录名" prop="userName">
                            <el-input v-model="temp.userName"
                                      placeholder="请输入登录名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="temp.password"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="当前版本号" prop="gender">
                            <el-select v-model="temp.currentVersion" placeholder="请选择当前版本号">
                                <el-option
                                        v-for="item in versionList"
                                        :key="item.id"
                                        :label="item.versionNum"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出厂版本号" prop="gender">
                            <el-select v-model="temp.factoryVersion" placeholder="请选择出厂版本号">
                                <el-option
                                        v-for="item in versionList"
                                        :key="item.id"
                                        :label="item.versionNum"
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
                    <el-form-item label="IP" prop="ip">
                        <el-input v-model="pageParam.ip"
                                  placeholder="请输入IP"></el-input>
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

            <!--dialog查看版本管理-->
            <el-dialog class="dialogForm" title="版本列表" :visible.sync="dialogResourceVersionDetail" @close="closeDetailForm()">
                <el-table :data="resourceVersionDetail" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="versionNum" label="版本号">
                    </el-table-column>
                    <el-table-column prop="applicationModule" label="应用模块">
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center" width="200">
                        <template scope="scope">
                            <el-button type="default" title="增量" class="icon-btn delete" style="color: #00a0e9"
                                       @click="incrementalSend(scope.row)" size="small">
                                增量
                            </el-button>
                            <el-button type="default" title="全量" class="icon-btn delete" style="color: #00a0e9"
                                       @click="fullSend(scope.row)" size="small">
                                全量
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination ref="pages" :total="versionRowTotal" v-on:pageChange="versionHandleCurrentChange"></pagination>

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

<script src="./LdServer.js">
    
</script>

<style scoped>

</style>