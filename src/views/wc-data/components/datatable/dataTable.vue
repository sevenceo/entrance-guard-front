<template>
    <el-table
            :data="tableData"
            class="data-table"
            border
            stripe
            style="width: 100%">
        <el-table-column
                prop="name"
                label="名称"
                min-width="150"
                class="name"
                >
        </el-table-column>
        <el-table-column
                prop="instanceType"
                label="实例类型"
                min-width="100">
        </el-table-column>
        <el-table-column
                prop="databaseType"
                label="数据库类型"
                min-width="130">
        </el-table-column>
        <el-table-column
                prop="host"
                label="主机名"
                min-width="200"
        >
        </el-table-column>
        <el-table-column
                prop="port"
                label="端口号"
                width="100"
        >
        </el-table-column>
        <el-table-column
                prop="bewrite"
                label="摘要信息"
        >
        </el-table-column>
        <el-table-column
                prop="isFree"
                label="是否空闲"
                align="center"
        >
        </el-table-column>
        <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="120"
        >
            <template scope="scope">
                <el-button type="default" title="编辑" class="edit" @click="onEdit(scope.row)" size="small"  v-authority="'SystemConfig.DataCenter.Modify'" >
                    <svg class="icon icon-edit" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                </el-button>
                <router-link :to="{name: '数据详情', params: { id: scope.row.id }}">
                    <el-button type="default" class="check" title="查看"  size="small">
                        <svg class="icon icon-check" aria-hidden="true">
                            <use xlink:href="#icon-check"></use>
                        </svg>
                    </el-button>
                </router-link>
                <el-button type="default" v-authority="'SystemConfig.DataCenter.Remove'" title="删除" class="delete" @click="onDelete(scope.row,scope.$index)" size="small">
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