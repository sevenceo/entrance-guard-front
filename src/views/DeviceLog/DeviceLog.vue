
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                      >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="resourceName" label="小区名称">
                </el-table-column>
               <!-- <el-table-column prop="sceneName" label="场景名称">
                </el-table-column>-->
                <el-table-column prop="subject" label="日志主题">
                </el-table-column>
                <el-table-column prop="level" label="日志级别">
                </el-table-column>
                <el-table-column prop="detail" label="日志详情">
                </el-table-column>
                <el-table-column prop="creationDate" label="上报时间">
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
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
             <!--       <el-form-item label="选择场景" prop="sceneId">
                        <el-select v-model="pageParam.sceneId" placeholder="选择场景">
                            <el-option
                                    v-for="item in sceneList"
                                    :key="item.id"
                                    :label="item.sceneName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>-->

                    <el-form-item label="开始时间">
                        <el-date-picker
                                v-model="value1"
                                type="datetime"
                                placeholder="开始时间"
                                @change="setBeginDate"
                                :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                v-model="value2"
                                type="datetime"
                                placeholder="结束时间"
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
        </div>
    </div>
</template>
<script src="./DeviceLog.js"></script>
