<template>
    <el-table
            :data="tableData"
            class="data-table"
            border
            stripe
            style="width: 100%">
        <el-table-column
                prop="name"
                label="粉丝组名称"
                min-width="150"
                class="name"
                >
        </el-table-column>
        <el-table-column
                prop="fansInGroupNum"
                label="数量"
                min-width="60"
                class="name"
                >
        </el-table-column>
        <el-table-column
                prop="fansNum"
                label="总粉数"
                min-width="70"
                class="name"
                >
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间"
                min-width="160"
                :formatter="formatter">
        </el-table-column>
       <!-- <el-table-column
                prop="updateTime"
                label="最后编辑时间"
                min-width="160"
                :formatter="formatter">
        </el-table-column>-->
        <el-table-column
                prop="runTime"
                label="最后计算时间"
                min-width="160"
                :formatter="formatter">
        </el-table-column>
        <el-table-column
                prop="state"
                label="状态"
                width="100"
        >
        </el-table-column>
        <el-table-column
                prop="isMaster"
                label="标识"
                min-width="80"
                class="name"
                :formatter="formatterIsMaster">
                >
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="80"
        >
        <template scope="scope">
            <router-link :to="{name: '粉丝组维护', params: { id: scope.row.id,isMaster: scope.row.isMaster,auth:'Manufacturer',status:'maintenance' }}"  v-authority="'FansGroup.Manufacturer.Maintenance'" >
                <el-button type="default" title="编辑" class="edit" size="small">
                    <svg class="icon icon-edit" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                </el-button>
            </router-link>
            <router-link :to="{name: '粉丝组维护', params: {id: scope.row.id,isMaster: scope.row.isMaster,auth:'Agency',status:'maintenance' }}"  v-authority="'FansGroup.Agency.Maintenance'" >
                <el-button type="default" title="编辑" class="edit" size="small" v-if="!scope.row.isMaster"  v-show='agencyModVisible'>
                    <svg class="icon icon-edit" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                </el-button>
            </router-link>
            <router-link :to="{name: '粉丝组详情', params: { id: scope.row.id, isMaster: scope.row.isMaster}}">
                <el-button type="default" title="查看" class="check" size="small">
                    <svg class="icon icon-check" aria-hidden="true">
                        <use xlink:href="#icon-check"></use>
                    </svg>
                </el-button>
            </router-link>
        </template>
        </el-table-column>
    </el-table>
</template>

<script src="./dataTable.js"></script>

<style lang="scss" src="./dataTable.scss"></style>