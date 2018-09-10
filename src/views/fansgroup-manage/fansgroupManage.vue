<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container">
            <el-button class="btn btn-add" type="primary" size="large" @click="goAddManufacturerFansGroup()" v-authority="'FansGroup.Manufacturer.Maintenance'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-zjc"></use>
                </svg>
                主机厂
            </el-button>
            <el-button class="btn btn-add" type="primary" size="large" @click="goAddAgencyFansGroup()" v-authority="'FansGroup.Agency.Maintenance'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-touxiang"></use>
                </svg>
                经销商
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="exportAll()" v-authority="'FansGroup.export'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch"  >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <!--内容区-->
        <dataTable :tableData = "formData"/>
        <!--筛选区-->
        <el-dialog :visible.sync="searchFormVisible"  class="search-dialog" :show-close="false" :modal="false">
            <el-form :model="param" ref="param">
                <el-form-item label="粉丝组名" >
                    <el-input v-model="param.name" style="ime-mode:disabled" placeholder="粉丝组名支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="粉丝组状态">
                     <el-select class="filter-item" v-model="param.state" placeholder="全部">
                         <el-option v-for="item in  fansGroupStateOptions" :key="item.key" :label="item.label"
                                    :value="item.key">
                         </el-option>
                     </el-select>
                 </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                      <el-date-picker
                            v-model="param.createTime"
                            type="date"
                            placeholder=""
                            >
                      </el-date-picker>
                </el-form-item>
                <el-form-item prop="createTimeEnd">
                      <el-date-picker
                            v-model="param.createTimeEnd"
                            type="date"
                            placeholder=""
                            >
                      </el-date-picker>
                </el-form-item>
                <el-form-item  label="含有标签" prop="createTimeEnd">
                    <div>
                        <el-button type="default" title="选择标签" class="edit" size="mini" @click="showLabelTree()">
                            <svg class="icon icon-edit" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                        </el-button>
                    </div>
                    <div align = "left">
                        <el-tag
                          v-for="tag in tags"
                          :key="tag.name"
                          :closable="true"
                          type="primary"
                           :close-transition="false"
                            @close="handleClose(tag)"
                        >
                        {{tag.name}}
                        </el-tag>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="reset()" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search('param')" type="default">
                    筛选
                </el-button>
            </div>
        </el-dialog>
        <!--标签选择树-->
        <el-dialog class="dialogForm" title="选择标签" :visible.sync="labelTreeVisible" @close="closeTree" >
            <div class="dialogFormBox">
                <el-row :gutter="5">
                    <el-col :span="8">
                        <el-input
                          placeholder="输入关键字进行过滤"
                          v-model="filterText"
                          icon="search"
                          size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="small" type="primary" @click='resetChecked()'>重选</el-button>
                    </el-col>
                    <el-col :span="14">
                    </el-col>
                    <el-col :span="24">
                        <el-tree
                          :data="treeData"
                          show-checkbox
                          default-expand-all
                          node-key="id"
                          ref="tree"
                          highlight-current
                          :props="defaultProps"
                          :filter-node-method="filterNode">
                        </el-tree>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="confirm" @click="getCheckedNodes()">确 定</el-button>
                <el-button @click="cancel" class="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script src="./fansgroupManage.js"></script>
<style scoped src="./fansgroupManage.scss"></style>