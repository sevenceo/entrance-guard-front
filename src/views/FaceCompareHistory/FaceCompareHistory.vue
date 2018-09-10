
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
           <!-- <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'FaceCompareHistory.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'FaceCompareHistory.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'FaceCompareHistory.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'FaceCompareHistory.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'FaceCompareHistory.Search'">
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
                    <!--<el-table-column prop="compareJson" label="人脸比对">
                    </el-table-column>-->
                   <!-- <el-table-column prop="sensingDeviceId" label="摄像机id">
                    </el-table-column>-->
                    <el-table-column prop="sensingDeviceIp" label="摄像机IP">
                    </el-table-column>
                <!--    <el-table-column prop="sceneId" label="场景id">
                    </el-table-column>-->
                    <el-table-column prop="sceneName" label="场景名称">
                    </el-table-column>
                   <!-- <el-table-column prop="aiServerId" label="AI服务器id">
                    </el-table-column>-->
                    <el-table-column prop="aiServerIp" label="盒子服务器ip">
                    </el-table-column>
                    <el-table-column prop="ldServerNumber" label="终端服务器编号">
                    </el-table-column>
                    <el-table-column prop="creationDate" label="创建时间">
                    </el-table-column>
                 <!--   <el-table-column prop="tenantId" label="租户id">
                    </el-table-column>-->

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                       <!-- <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'FaceCompareHistory.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'FaceCompareHistory.Delete'"
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
                        </el-button>-->
                        <el-button type="default" title="详情" class="icon-btn edit"
                                   @click="detail(scope.row)" size="small" v-authority="'FaceCompareHistory.Detail'">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
 <!--           <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                            <el-form-item label="人脸比对" prop="compareJson">
                            </el-form-item>
                            <el-form-item label="摄像机id" prop="sensingDeviceId">
                                    <el-select v-model="temp.sensing_device_id" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="摄像机IP" prop="sensingDeviceIp">
                                    <el-input v-model="temp.sensing_device_ip"
                                              placeholder="请输入摄像机IP"></el-input>
                            </el-form-item>
                            <el-form-item label="场景id" prop="sceneId">
                                    <el-select v-model="temp.scene_id" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="场景名称" prop="sceneName">
                                    <el-input v-model="temp.scene_name"
                                              placeholder="请输入场景名称"></el-input>
                            </el-form-item>
                            <el-form-item label="AI服务器id" prop="aiServerId">
                                    <el-select v-model="temp.ai_server_id" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="盒子服务器ip" prop="aiServerIp">
                                    <el-input v-model="temp.ai_server_ip"
                                              placeholder="请输入盒子服务器ip"></el-input>
                            </el-form-item>
                            <el-form-item label="终端服务器编号" prop="ldServerNumber">
                                    <el-input v-model="temp.ld_server_number"
                                              placeholder="请输入终端服务器编号"></el-input>
                            </el-form-item>
                            <el-form-item label="租户id" prop="tenantId">
                                    <el-input v-model="temp.tenant_id"
                                              placeholder="请输入租户id"></el-input>
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
                       <!-- <el-form-item label="人脸比对" prop="compareJson">
                        </el-form-item>
                        <el-form-item label="摄像机id" prop="sensingDeviceId">
                                <el-select v-model="temp.sensing_device_id" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="摄像机IP" prop="sensingDeviceIp">
                                <el-input v-model="temp.sensing_device_ip"
                                          placeholder="请输入摄像机IP"></el-input>
                        </el-form-item>
                        <el-form-item label="场景id" prop="sceneId">
                                <el-select v-model="temp.scene_id" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>-->
                        <el-form-item label="选择社区" prop="resourceName">
                            <el-input v-model="resourceName" placeholder="选择社区" :readonly="true" @focus="showParentTree"></el-input>
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
                    <el-form-item label="选择场景" prop="sceneId">
                        <el-select v-model="pageParam.sceneId" placeholder="选择场景">
                            <el-option
                                    v-for="item in sceneList"
                                    :key="item.id"
                                    :label="item.sceneName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                       <!-- <el-form-item label="场景名称" prop="sceneName">
                                <el-input v-model="pageParam.sceneName"
                                          placeholder="请输入场景名称"></el-input>
                        </el-form-item>-->
                        <!--<el-form-item label="AI服务器id" prop="aiServerId">
                                <el-select v-model="temp.ai_server_id" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="盒子服务器ip" prop="aiServerIp">
                                <el-input v-model="temp.ai_server_ip"
                                          placeholder="请输入盒子服务器ip"></el-input>
                        </el-form-item>
                        <el-form-item label="终端服务器编号" prop="ldServerNumber">
                                <el-input v-model="temp.ld_server_number"
                                          placeholder="请输入终端服务器编号"></el-input>
                        </el-form-item>
                        <el-form-item label="租户id" prop="tenantId">
                                <el-input v-model="temp.tenant_id"
                                          placeholder="请输入租户id"></el-input>
                        </el-form-item>-->
                    <el-form-item label="开始时间">
                        <el-date-picker
                                v-model="value1"
                                type="datetime"
                                placeholder="开始日期"
                                @change="setBeginDate"
                                :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                v-model="value2"
                                type="datetime"
                                placeholder="结束日期"
                                @change="setEndDate"
                                :picker-options="pickerOptions1">
                        </el-date-picker>
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
         <!--   <el-dialog class="dialogForm" title="错误信息" :visible.sync="formVisible" @close="closeForm()">
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
            </el-dialog>-->


            <el-dialog class="dialogForm" title="详情" :visible.sync="compareFaceJson" @close="closeCompareFaceJson()">
                <el-form :model="jsonData" label-width="20%">
                    <el-form-item label="底库人员照片地址">
                        <el-input v-model="jsonData.img_f" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="场景图">
                        <el-input v-model="jsonData.img_v" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="时间">
                        <el-input v-model="jsonData.time" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="匹配分数">
                        <el-input v-model="jsonData.score" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="通道名称">
                        <el-input v-model="jsonData.label" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="比中底库姓名">
                        <el-input v-model="jsonData.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="报警类型">
                        <el-input  :disabled="true" v-if="jsonData.type == 1" value="报警"></el-input>
                        <el-input  :disabled="true" v-if="jsonData.type == 2" value="警告"></el-input>
                        <el-input  :disabled="true" v-if="jsonData.type == 3" value="欢迎"></el-input>
                        <el-input  :disabled="true" v-if="jsonData.type == 4" value="其他"></el-input>
                    </el-form-item>
                    <el-form-item label="通道id">
                        <el-input v-model="jsonData.channel_id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="是否比中">
                        <el-input v-if="jsonData.hit_flag" :disabled="true" value="是"></el-input>
                        <el-input v-if="!jsonData.hit_flag " :disabled="true" value="否"></el-input>
                    </el-form-item>
                    <el-form-item label="分库id">
                        <el-input v-model="jsonData.sublib_id" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./FaceCompareHistory.js"></script>
