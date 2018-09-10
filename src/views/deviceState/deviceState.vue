<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column prop="tenantName" label="所属组织" width="200px">
                </el-table-column>
                <!--<el-table-column prop="tenantName" label="状态">
                </el-table-column>-->
                <el-table-column prop="deviceStateDetail.ip" label="盒子IP" width="150px">
                </el-table-column>
                <el-table-column prop="deviceStateDetail.version" label="当前版本">
                </el-table-column>
                <!--<el-table-column prop="deviceStateDetail.mqtt" label="MQTT" :formatter="formatMQTable">-->
                <!--</el-table-column>-->
                <el-table-column label="CPU">
                    <template scope="scope">
                        {{scope.row.deviceStateDetail.cpuStatus[0].usageRate}}%
                    </template>
                </el-table-column>
                <el-table-column label="内存" width="150px">
                    <template scope="scope">
                        {{scope.row.deviceStateDetail.memoryStatus[0].percent}}% <!--Free {{100-scope.row.deviceStateDetail.memoryStatus[0].percent}}%-->
                    </template>
                </el-table-column>
                <el-table-column label="硬盘" width="150px">
                    <template scope="scope">
                        {{scope.row.deviceStateDetail.diskStatus[0].percent}}% <!--Free {{100-scope.row.deviceStateDetail.diskStatus[0].percent}}%-->
                    </template>
                </el-table-column>
                <el-table-column prop="creationDate" label="上报时间">
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="120">
                  <!--  <template scope="scope">
                        <el-button type="default" title="查看详细" class="icon-btn edit"
                                   @click="deviceStateDetail(scope.row)" size="small" v-authority="'DeviceState.Detail'">
                            查看
                        </el-button>
                    </template>-->
                    <template scope="scope">
                        <el-button type="default" title="查看历史" class="icon-btn edit"
                                   @click="deviceStateHistory(scope.row)" size="small">
                            查看历史
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <!--&lt;!&ndash;筛选区&ndash;&gt;
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                    <el-form-item label="租户" prop="tenantName">
                        <el-input v-model="pageParam.tenantName"
                                  placeholder="请输入姓名"></el-input>
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
            </el-dialog>-->

            <!--dialog查看状态-->
            <el-dialog class="dialogForm-1000" title="查看状态" style="width: 100%" :visible.sync="dialogStateDetail" @close="closeDetailForm()">
                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="ip" label="盒子IP">
                    </el-table-column>
                    <!--<el-table-column prop="mqtt" label="MQTT" :formatter="formatMQ">
                    </el-table-column>-->
                    <el-table-column prop="version" label="当前版本">
                    </el-table-column>
                    <el-table-column label="CPU">
                        <template scope="scope">
                            {{scope.row.cpuStatus[0].usageRate}}%
                        </template>
                    </el-table-column>
                    <el-table-column label="内存" width="150px">
                        <template scope="scope">
                            {{scope.row.memoryStatus[0].percent}}%
                        </template>
                    </el-table-column>
                    <el-table-column label="硬盘" width="150px">
                        <template scope="scope">
                            {{scope.row.diskStatus[0].percent}}%
                        </template>
                    </el-table-column>
                </el-table>
                <br/>
                <br/>
                <el-table :data="tableDataDetailScene" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="sceneName" label="场景">
                    </el-table-column>
                    <el-table-column prop="aiStatus" label="AI盒子" :formatter="formatMQ">
                    </el-table-column>
                    <!--<el-table-column prop="mqtt" label="MQTT" :formatter="formatMQ">
                    </el-table-column>-->
                    <el-table-column prop="channelStatus" label="摄像头" :formatter="formatMQ">
                    </el-table-column>
                    <el-table-column prop="controlStatus" label="控制器" :formatter="formatMQ">
                    </el-table-column>
                </el-table>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
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
                    <!--<el-form-item label="选择场景" prop="sceneId">
                        <el-select v-model="pageParam.sceneId" placeholder="选择场景">
                            <el-option
                                    v-for="item in sceneList"
                                    :key="item.id"
                                    :label="item.sceneName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <!--<el-form-item label="选择ip" prop="ip">
                        <el-select v-model="pageParam.ip" placeholder="选择ip">
                            <el-option
                                    v-for="item in ipList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <!--<el-form-item label="开始时间">
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
            <el-dialog :visible.sync="showHistoryFlag" class="dialog-form" title="设备状态历史" @close="closeHistoryPane()" v-if="showHistoryFlag">
                <el-button class="btn btn-edit" type="primary" @click="searchHistory">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
                <div style="height: 10px"></div>
                <el-table :data="historyTableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="deviceStateDetail.ip" label="盒子IP" width="150px">
                    </el-table-column>
                    <el-table-column prop="deviceStateDetail.version" label="当前版本" width="100px">
                    </el-table-column>
                    <el-table-column label="CPU" width="100px">
                        <template scope="scope">
                            {{scope.row.deviceStateDetail.cpuStatus[0].usageRate}}%
                        </template>
                    </el-table-column>
                    <el-table-column label="内存" width="100px">
                        <template scope="scope">
                            {{scope.row.deviceStateDetail.memoryStatus[0].percent}}%
                        </template>
                    </el-table-column>
                    <el-table-column label="硬盘" width="100px">
                        <template scope="scope">
                            {{scope.row.deviceStateDetail.diskStatus[0].percent}}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="creationDate" label="上报时间" >
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center" width="120">
                          <template scope="scope">
                              <el-button type="default" title="查看详情" class="icon-btn edit"
                                         @click="deviceStateDetail(scope.row)" size="small" v-authority="'DeviceState.Detail'">
                                  查看详情
                              </el-button>
                          </template>
                    </el-table-column>

                </el-table>
                <!--翻页-->
                <pagination ref="historyPages" :total="historyRowTaotal" v-on:pageChange="handleHistoryPageChange" v-if="paginationShow"></pagination>
            </el-dialog>
            <el-dialog :visible.sync="searchFormVisibleHistory" class="search-dialog" :show-close="false" :modal="false">
                <el-form  labelPosition="">
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
                    <el-button class="btn btn-reset reset" @click="resetHistory" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="doSearchHistory" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./deviceState.js"></script>

<style lang="scss">
    .communityTreeFY{
    }
    .communityTreeFY .is-current > .el-tree-node__content{
        background-color: #E4E8F1 !important;
    }
    .audit-header{
        padding: 20px 0px;
    }
</style>

