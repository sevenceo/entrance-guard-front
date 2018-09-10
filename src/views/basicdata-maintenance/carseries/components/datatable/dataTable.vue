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
                prop="code"
                label="编号"
                min-width="60"
                class="name"
                >
        </el-table-column>
        <el-table-column
                prop="name"
                label="名称"
                min-width="90">
        </el-table-column>
        <el-table-column
                prop="enName"
                label="英文名"
                min-width="90">
        </el-table-column>
        <el-table-column
                prop="brandId"
                label="品牌"
                :formatter="getBrandName">
        </el-table-column>
        <el-table-column
                prop="status"
                label="状态"
                min-width="60"
        >
        </el-table-column>
        <el-table-column
                prop="updateTime"
                label="编辑时间"
                 width="150"
                 :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间"
                width="150"
                :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="80"
                fixed="right"
        >
            <template scope="scope">
                <el-button type="default" title="编辑" class="edit" @click="onEdit(scope.row)" size="small" v-authority="'CarSeriesMaintenance.Modify'">
                    <svg class="icon icon-edit" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                </el-button>
                <el-button type="default" title="删除" class="delete" @click="onDelete(scope.row,scope.$index)" size="small" v-authority="'CarSeriesMaintenance.Remove'">
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