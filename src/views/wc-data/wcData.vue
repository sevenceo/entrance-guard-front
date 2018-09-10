<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'SystemConfig.DataCenter.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <!--内容区-->

        <dataTable :tableData = "formData" @dialogFormVisible = 'edit'  @deleteRow="deleteRow" />

        <!--编辑区-->

        <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetForm" >
            <!--<editor :temp = "temp" :activeTypeOptions="activeTypeOptions" :pickerOptions0="pickerOptions0" ></editor>-->
            <div class="dialogFormBox">
                <el-form class="small-space" :model="temp" ref="temp" :rules="rules"  label-position="left" label-width="95px" style='width: 400px; margin-left:50px;'>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="temp.name" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item label="实例类型" prop="instanceType">
                        <el-select class="filter-item" v-model="temp.instanceType" placeholder="请选择实例类型">
                            <el-option v-for="item in  activeTypeOptions" :key="item.key" :label="item.objectType"
                                       :value="item.objectType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据库类型" prop="databaseType">
                        <el-select class="filter-item" v-model="temp.databaseType" placeholder="请选择数据库类型">
                            <el-option v-for="item in  dataTypeOption" :key="item.key" :label="item.dataType"
                                       :value="item.dataType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否空闲" prop="free">
                        <el-switch
                                v-model="temp.free"
                                on-text="是"
                                off-text="否">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="主机号" prop="host">
                        <el-input v-model="temp.host" placeholder="请输入主机号"></el-input>
                    </el-form-item>
                    <el-form-item label="端口号" prop="port">
                        <el-input v-model="temp.port" placeholder="请输入端口号"></el-input>
                    </el-form-item>
                    <el-form-item label="登录名" prop="user">
                        <el-input v-model="temp.user" placeholder="请输入登录名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="temp.pwd" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="摘要" prop="bewrite">
                        <el-input v-model="temp.bewrite" placeholder="请输入摘要"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel" class="cancel">取 消</el-button>
                <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm" @click="create('temp')">确 定</el-button>
                <el-button v-else type="primary" @click="update('temp')" class="update">确 定</el-button>
                <el-button type="danger" @click="testConnection">测试链接</el-button>
            </div>
        </el-dialog>

        <!--筛选区-->

        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="pageParam">
                <el-form-item label="名称或者主机名">
                    <el-input v-model="pageParam.keyword" style="ime-mode:disabled" placeholder="请输入公众号名称"></el-input>
                </el-form-item>
                <el-form-item label="实例类型">
                    <el-select class="filter-item" v-model="pageParam.instanceType" placeholder="请选择实例类型">
                        <el-option v-for="item in  activeTypeOptions" :key="item.objectType" :label="item.objectType"
                                   :value="item.objectType">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据库类型">
                    <el-select class="filter-item" v-model="pageParam.databaseType" placeholder="请选择数据库类型">
                        <el-option v-for="item in  dataTypeOption" :key="item.key" :label="item.dataType"
                                   :value="item.dataType">
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

        <!--分页-->
        <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>
    </div>
</template>


<script src="./wcData.js"></script>
<style scoped src="./wcData.scss"></style>