
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <!--<el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'DeviceEarlyWarning.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'DeviceEarlyWarning.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'DeviceEarlyWarning.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'DeviceEarlyWarning.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>


        <div>
            <!--表格-->
            <el-table :data="tableData" border  :row-style="rowClass"  style="width: 100%" class="blue-table">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="resourceName" label="小区名称">
                    </el-table-column>
                    <el-table-column prop="sceneName" label="场景名称">
                    </el-table-column>
                    <el-table-column prop="cpu" label="CPU">
                        <template scope="scope">
                            <span>{{scope.row.cpu}}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ram" label="内存">
                        <template scope="scope">
                            <span>{{scope.row.ram}}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="hardDisk" label="硬盘">
                        <template scope="scope">
                            <span>{{scope.row.hardDisk}}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastReportTime" label="最新上报时间" :formatter="formatterTime">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <router-link :to="'deviceEarlyWarningDetai/'+ scope.row.sceneId+'/'+ scope.row.tenantId+'/'+ scope.row.code">
                            <el-button type="default" title="查看设备信息" class="check" size="small">
                                查看设备信息
                            </el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="小区名称" prop="resourceName">
                                <el-input v-model="pageParam.resourceName"
                                          placeholder="请输入小区名称"></el-input>
                        </el-form-item>
                        <el-form-item label="场景名称" prop="sceneName">
                                <el-input v-model="pageParam.sceneName"
                                          placeholder="请输入场景名称"></el-input>
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
        </div>
    </div>
</template>
<script src="./DeviceEarlyWarning.js"></script>
