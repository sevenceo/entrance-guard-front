<template>
    <el-table
            :data="tableData"
            class="data-table"
            border
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%">
        <el-table-column
                type="selection"
                width="40">
        </el-table-column>
        <el-table-column
                prop="corpCode"
                label="企业编号"
                min-width="80"
                >
        </el-table-column>
        <el-table-column
                prop="corpName"
                label="名称"
                min-width="150">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="80"
                fixed="right"
        >
            <template scope="scope">
                <el-button type="default" title="编辑" class="edit" @click="" size="small" v-authority="'BrandMaintenance.Modify'">
                    <svg class="icon icon-edit" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                </el-button>
                <el-button type="default" title="删除" class="delete" @click="" size="small" v-authority="'BrandMaintenance.Remove'">
                    <svg class="icon icon-delete" aria-hidden="true">
                        <use xlink:href="#icon-delete1"></use>
                    </svg>
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script src="./dataTable.js"></script>

<style lang="scss" src="./dataTable.scss"></style>