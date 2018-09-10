<template>
    <div class="heightAuto">
        <!--内容区-->
        <el-row :gutter="20" class="heightAuto">
            <el-col class="heightAuto" v-if="$store.state.weChatAccount.isParent">
                <div class="treeChange">
                    <tree
                            :data="structrueData"
                            :current-node-key="curNodeKey"
                            :default-expanded-keys="defExpKeys"
                            :auto-expand-parent=true
                            show-checkbox
                            :expand-on-click-node=false
                            lazy
                            accordion
                            node-key="id"
                            ref="tree"
                            :load="loadNode"
                            highlight-current
                            @node-click="handleNodeClick"
                            :check-strictly=true
                            :render-content="renderContent">
                    </tree>
                </div>
                <div class="treeTitlle">
                    <el-button class="checkSubmit" @click="getCheckedNodes">确定</el-button>
                </div>
            </el-col>
        </el-row>
        <!--分页-->
        <!-- <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination> -->
    </div>
</template>

<script src="./treeCheck.js"></script>
<style scoped src="./treeCheck.scss"></style>
