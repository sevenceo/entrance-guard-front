<template>
    <div>
        <div>
            <template>
                <el-button type="default" title="手动打标签" class="edit" size="small" @click="showLabelTree()">
                    <svg class="icon icon-edit1"  aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                </el-button>
            </template>
        </div>
        <el-dialog class="dialogForm" title="打标签" :visible.sync="labelTreeVisible" @close="closeTree" :modal="true" ref="treeDialog">
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
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="defaultProps"
                            :default-checked-keys="chooseChecked"
                            :default-expanded-keys="defaultExpand"
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

<script src="./TagTree.js"></script>
<style scoped src="./TagTree.scss"></style>
