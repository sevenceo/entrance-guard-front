<template>
    <div class="organization-tree">

        <div @click="onShow" class="organization-name" :title="organizationName"> {{organizationName}} </div>

        <!--<el-form-item label="公众号账号" v-show="false">-->
        <!--<el-input v-model="tempOrg" placeholder="请输入公众号账号"></el-input>-->
        <!--</el-form-item>-->


        <el-dialog class="dialogForm" title="选择机构" :visible.sync="dialogTreeVisible" :modal="true" ref="dialog">
            <tree
                    :data="structrueData"
                    :current-node-key="curNodeKey"
                    :default-expanded-keys="defExpKeys"
                    :auto-expand-parent=true
                    :expand-on-click-node=false
                    lazy
                    accordion
                    node-key="id"
                    ref="tree"
                    :load="loadSelectNode"
                    highlight-current
                    @node-click="handleNodeClick"
                    :render-content="renderContent"
            >
            </tree>
        </el-dialog>
    </div>
</template>

<script src="./organizationTree.js">

</script>

<style scoped>
    .organization-tree {
        height: 36px;
    }

    .organization-name {
        float: left;
        display: inline-block;
        line-height: 1;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: #1f2d3d;
        margin: 0;
        padding: 10px 15px;
        border-radius: 4px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .dialogForm .el-tree {
        height: 500px;
        overflow: auto;
    }


</style>