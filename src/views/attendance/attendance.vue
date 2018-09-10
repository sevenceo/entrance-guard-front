<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AttendanceManage.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'AttendanceManage.Delete'"
                      style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="searchFormVisible=true">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div style="margin-top:35px;">
            <el-table :data="tableData"  border stripe style="width: 100%;" class="blue-table" ref="table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="考勤组名称" prop="name">
                </el-table-column>
                <el-table-column  label="所属资源" prop="resourceId" :formatter="formatter">
                </el-table-column>
                <el-table-column  label="考勤组人数" prop="count" :formatter="function(row){ return row.humanIds.length}">
                </el-table-column>
                <el-table-column  label="考勤组长" prop="managerName">
                </el-table-column>
                <el-table-column  label="操作" >
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" v-authority="'AttendanceManage.Modify'"
                                   @click="onEdit(scope.row)" size="small" >
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" v-authority="'AttendanceManage.Delete'"
                                   @click="onDelete(scope.row)" size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <addAttenDanceGroupHuMan ref="temp" @selection="selectHuman" @Manager="setManagerIdAndName"></addAttenDanceGroupHuMan>
            <!--新增考勤组-->
            <el-dialog  :title="title" :visible.sync="dialogVisible" :before-close="handleClose" >
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="所属资源" prop="organization">
                            <!--<el-button @click="showOrganization" type="primary">{{organizationName}}</el-button>-->
                            <!--<div id="organizationTree" style="display:none">-->
                                <!--<el-button  @click="closeOrganization" size="small">关闭</el-button>-->
                                <!--<el-tree :data="organizations" :props="defaultProps" @node-click="handleNodeClick"/>-->
                            <!--</div>-->
                            <el-select v-model="temp.organization"  placeholder="请选择" :disabled="humanTable.length>0">
                                <el-option
                                        v-for="item in firstLvl"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="考勤组名称" prop="name">
                            <el-input v-model="temp.name"
                                      placeholder="请输入考勤组名称"></el-input>
                        </el-form-item>
                        <el-form-item label="考勤组长" prop="managerName">
                            <el-input v-model="temp.managerName" :disabled="true" placeholder="请设置考勤组长"/>
                            <el-button type="primary" @click="setManager">设置组长</el-button>
                            <el-button type="primary" @click="deleteManager">取消组长</el-button>
                        </el-form-item>
                        <el-form-item label="考勤人员" v-if="dialogStatus != 'create'">
                           <el-button type="primary" @click="addHuman(temp.id)">添加</el-button>
                           <el-button type="primary" @click="deleteBathHuman">移除</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-left:50px;" ref="dialog">
                        <el-table :data="humanTable" border stripe  @selection-change="handleSelectionChange" v-if="dialogStatus != 'create'">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column label="人员名称" prop="realName">
                            </el-table-column>
                            <el-table-column  label="联系方式" prop="mobilePhone">
                            </el-table-column>
                            <el-table-column  label="操作" >
                                <template scope="scope">
                                    <el-button type="default" title="移除" class="icon-btn delete" @click="deleteHuman(scope.row)"
                                                size="small">移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination ref="page" :total="rowTotalHuman" v-on:pageChange="humanCurrentChange" id="pagittion"  v-if="dialogStatus != 'create'"></pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleClose" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm," @click="onsubmit">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update" @click="update">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="Param">
                    <el-form-item label="考勤组名称" prop="supplierName">
                        <el-input v-model="Param.atnDanceName"
                                  placeholder="考勤组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属资源">
                        <el-select v-model="Param.resourceId"  placeholder="请选择">
                            <el-option
                                    v-for="item in firstLvl"
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
                    <el-button class="btn btn-edit search" @click="query" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script src="./attendance.js">
</script>

<style lang="scss">

</style>