<template>
    <div class="selectBox">
        <div class="spans">
            <span>标识：</span>
        </div>
        <div class="inputs">
            <el-radio-group v-model="pageParam.master">
                <el-radio :label="true">主机厂</el-radio>
                <el-radio :label="false">经销商</el-radio>
            </el-radio-group>
        </div>
        <div class="spans">
            <span>名称：</span>
        </div>
        <div class="inputs">
            <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="粉丝组名支持模糊查询"></el-input>
        </div>
        <!--<div class="spans">-->
            <!--<span>状态：</span>-->
        <!--</div>-->
        <!--<div class="inputs">-->
            <!--<el-select class="filter-item" v-model="pageParam.state" placeholder="全部">-->
                <!--<el-option label="启用" value="ON"></el-option>-->
                <!--<el-option label="停用" value="OFF"></el-option>-->
            <!--</el-select>-->
        <!--</div>-->
        <!--<div class="spans">-->
            <!--标签-->
        <!--</div>-->
        <!--<div class="inputs">-->
            <!--<div>-->
                <!--<el-button type="default" title="选择标签" class="edit" size="mini" @click="showLabelTree()">-->
                    <!--<svg class="icon icon-edit" aria-hidden="true">-->
                        <!--<use xlink:href="#icon-add1"></use>-->
                    <!--</svg>-->
                <!--</el-button>-->
            <!--</div>-->
            <!--<div align = "left">-->
                <!--<el-tag-->
                        <!--v-for="tag in tags"-->
                        <!--:key="tag.name"-->
                        <!--:closable="true"-->
                        <!--type="primary"-->
                        <!--:close-transition="false"-->
                        <!--@close="handleClose(tag)"-->
                <!--&gt;-->
                    <!--{{tag.name}}-->
                <!--</el-tag>-->
            <!--</div>-->
        <!--</div>-->

        <div slot="footer" class="dialog-footer" style="text-align: right; padding: 2px;">
            <el-button class="btn btn-reset reset" @click="reset" type="default">
                重置
            </el-button>
            <el-button class="btn btn-edit search" @click="search" type="default">
                筛选
            </el-button>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
            <el-table-column
                    prop="name"
                    label="粉丝组名称"
                    min-width="150"
                    class="name"
            >
            </el-table-column>
            <el-table-column
            prop="fansInGroupNum"
            label="包含粉丝数"
            min-width="50"
            class="name"
                    >
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="state"-->
                    <!--label="状态"-->
                    <!--width="100"-->
            <!--&gt;-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="isMaster"-->
                    <!--label="标识"-->
                    <!--min-width="80"-->
                    <!--class="name"-->
                    <!--:formatter="formatterIsMaster">-->
                <!--&gt;-->
            <!--</el-table-column>-->
            <el-table-column prop="type" fixed="right" label="操作" align="center" width="80px">
                <template scope="scope">
                    <el-button type="default" title="选中" class="icon-btn el-icon-check"  @click="confirm(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.Modify'">
                    </el-button>
                </template>
            </el-table-column>



        </el-table>
        <!--翻页-->
        <pagination :total="totalPage" center="true" v-on:pageChange="handleCurrentChange"></pagination>

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

<script src="./fansGroupSelectBox.js">

</script>


<style scoped src="./fansGroupSelectBox.scss">
</style>