<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container" :model="searchVal">
            <el-input  v-model="searchVal.inputRes" style="width: 150px;" @change="onSearch"></el-input>
            <el-select  class="filter-item" v-model="searchVal.activityType" @change="onSearch"
                       style="width: 120px;position: relative;top: 4px;">
                <el-option v-for="item in  actTypeOptions" :key="item.key" :label="item.display_name"
                           :value="item.display_name">
                </el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
            <el-button type="primary" icon="plus" @click="onAdd" v-authority="'ROLE_ADMIN'">新增</el-button>
            <el-button type="primary" icon="edit" @click="onEdit" v-authority="'ROLE_ADMIN'">编辑</el-button>
            <el-button type="danger" icon="delete" @click="onDel" v-authority="'ROLE_ADMIN'">删除</el-button>
        </div>
        <!--展示区-->
        <dataTable :tableData ="formData" v-on:selectionChange="handleSelectionChange" />
        <!--分页-->
        <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>
        <!--编辑区-->

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <!--<editor :temp = "temp" :activeTypeOptions="activeTypeOptions" :pickerOptions0="pickerOptions0" ></editor>-->
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item label="名称">
                    <el-input v-model="temp.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
                        <el-option v-for="item in  activeTypeOptions" :key="item.key" :label="item.display_name"
                                   :value="item.display_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="temp.beginDate"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.description">
                    </el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script src="./packageTable.js"></script>
<style scoped src="./packageTable.scss"></style>
