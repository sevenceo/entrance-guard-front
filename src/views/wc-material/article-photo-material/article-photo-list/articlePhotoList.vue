<template>
<div>
    <breadcrumb></breadcrumb>
    <el-table :data="tableData" border stripe class="blue-table wd100">
        <el-table-column
                prop="name"
                label="标题"
                width="200">
        </el-table-column>
        <!--<el-table-column-->
                <!--prop="description"-->
                <!--label="摘要">-->
        <!--</el-table-column>-->
        <el-table-column prop="type" label="操作" align="center" width="200">
            <template scope="scope">
                <router-link :to="'edit-role/' + scope.row.id">
                    <el-button class="icon-btn edit" type="default" size="small">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-edit1"></use>
                        </svg>
                    </el-button>
                </router-link>

                <el-button class="icon-btn delete" size="small" type="default" @click="handleDelete(scope.row.id)">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-delete1"></use>
                    </svg>
                </el-button>
            </template>
        </el-table-column>


    </el-table>

</div>
</template>

<script src="./articlePhotoList.js"></script>
<style scoped lang="sass" src="./articlePhotoList.scss"></style>