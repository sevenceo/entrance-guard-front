<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container">
            
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'CarSeriesMaintenance.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="exportAll()" v-authority="'CarSeriesMaintenance.export'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch"  v-authority="'CarSeriesMaintenance'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
            <el-button class="btn btn-delete" type="danger"  @click="onDel" v-authority="'CarSeriesMaintenance.Remove'">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                删除
            </el-button>
        </div>
        <!--内容区-->

        <dataTable ref='carTable' :tableData = "formData"  @dialogFormVisible = 'edit'  @deleteRow="deleteRow"  v-on:selectionChange="handleSelectionChange"/>

        <!--编辑区-->

        <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetForm" >
            <div class="dialogFormBox">
                <el-form class="small-space" :model="temp" ref="temp" :rules="rules"  label-position="left" label-width="95px" style='width: 400px; margin-left:50px;'>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="temp.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label=" 英文名称" prop="enName">
                         <el-input v-model="temp.enName" placeholder="请输入英文名称"></el-input>
                     </el-form-item>
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="temp.code" placeholder="请输入编码"></el-input>
                    </el-form-item>
                    <el-form-item label=" 状态" prop="status">
                        <el-select class="filter-item" v-model="temp.status" placeholder="请选择状态">
                            <el-option v-for="item in  statusOption" :key="item.key" :label="item.label"
                                       :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" 品牌" prop="brandId">
                        <el-select class="filter-item" v-model="temp.brandId" placeholder="请选择车型所属品牌">
                            <el-option v-for="item in  brands" :key="item.id" :label="item.name"
                                       :value="item.id" :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel" class="cancel">取 消</el-button>
                <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm" @click="create('temp')">确 定</el-button>
                <el-button v-else type="primary" @click="update('temp')" class="update">确 定</el-button>
            </div>
        </el-dialog>

        <!--筛选区-->

        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="pageParam">
                <el-form-item label="名称">
                    <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="英文名称">
                    <el-input v-model="pageParam.enName" style="ime-mode:disabled" placeholder="请输入英文名称"></el-input>
                </el-form-item>
                <el-form-item label="编号">
                    <el-input v-model="pageParam.code" style="ime-mode:disabled" placeholder="编号"></el-input>
                 </el-form-item>
                <el-form-item label="状态">
                    <el-select class="filter-item" v-model="pageParam.status" placeholder="请选择状态" size='large'>
                        <el-option v-for="item in  statusOption" :key="item.key" :label="item.label"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select class="filter-item" v-model="pageParam.brandId" placeholder="请选择车型所属品牌"  size='large'>
                        <el-option v-for="item in  brands" :key="item.id" :label="item.name"
                                   :value="item.id">
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


<script src="./carseries.js"></script>
<style scoped src="./carseries.scss"></style>