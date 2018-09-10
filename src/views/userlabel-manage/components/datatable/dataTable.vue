<template>
    <el-table
            :data="tableData"
            class="data-table"
            border
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="40"
                :selectable = "isSelectable">
        </el-table-column>
        <el-table-column
                prop="state"
                label="状态"
                min-width="100"
                class="name"
        >
        </el-table-column>
        <el-table-column
                prop="type"
                label="分类"
                min-width="100"
                class="name"
        >
        </el-table-column>
        <el-table-column
                prop="category"
                label="类型"
                min-width="100"
                class="name"
                :formatter="formatCategory"
        >
        </el-table-column>
        <el-table-column
                prop="name"
                label="名称"
                min-width="120"
                class="name"
        >
        </el-table-column>
        <el-table-column
                label="数量"
                min-width="80"
                class="name"
        >
            <template scope="scope">
                <a title="查看标签粉丝信息" class="underline" v-if="scope.row.fansNum != 0" href="javascript:void(0);" @click="showfans(scope.row.id)">
                {{scope.row.fansNum}}
                </a>
                <span v-if="scope.row.fansNum == 0">
                    {{scope.row.fansNum}}
                </span>
            </template>
        </el-table-column>
        <el-table-column
                prop="validateStart"
                label="有效开始"
                min-width="150"
                :formatter="formatter"
                >
        </el-table-column>
        <el-table-column
                prop="validateEnd"
                label="有效结束"
                min-width="150"
                :formatter="formatter"
                >
        </el-table-column>
        <el-table-column
                prop="runCycle"
                label="运算周期"
                width="100"
        >
        </el-table-column>
        <el-table-column
                prop="runTime"
                label="最近一次执行日"
                width="170"
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
                <router-link :to="{name: '标签维护', params: { id: scope.row.id }}">
                    <el-button type="default" title="编辑" class="edit" size="small" v-authority="'UserLabel.Maintenance'">
                        <svg class="icon icon-edit" aria-hidden="true">
                            <use xlink:href="#icon-edit1"></use>
                        </svg>
                    </el-button>
                </router-link>
            </template>
        </el-table-column>
    </el-table>
</template>

<script src="./dataTable.js"></script>

<style lang="scss" src="./dataTable.scss"></style>