<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="fans-filter-container">
            <el-button class="btn btn-add" type="primary" @click="$router.push('new-card')" v-authority="'Card.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onRefresh" v-authority="'Card.sync'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                同步
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <!--<el-table-column prop="cardType" label="卡券类型">-->
                <!--</el-table-column>-->
                <el-table-column prop="cardTitle" label="卡券名称"  min-width="200px">
                </el-table-column>
                <el-table-column prop="dateInfo" label="卡券有效期" min-width="200px">
                </el-table-column>
                <el-table-column prop="cardState" label="全部状态" :formatter="formatter" min-width="80px">
                </el-table-column>
                <el-table-column prop="sku" label="库存" min-width="120px">
                    <template scope="scope">
                        <div :hidden="!scope.row.isChange">
                            <el-input type="number" style="width: 80px" placeholder="" v-model="scope.row.skuNum">
                            </el-input>
                            <el-button class="icon-btn el-icon-check" @click="changeNum(scope.row)" type="default"
                                       title="修改" size="small"></el-button>
                            <el-button class="icon-btn el-icon-close" @click="cancelChange(scope.row)" type="default"
                                       title="取消" size="small"></el-button>
                        </div>
                        <div :hidden="scope.row.isChange">{{scope.row.sku}}
                            <el-button class="icon-btn edit" @click="changeIcon(scope.row)" type="default" title="修改"
                                       size="small" v-authority="'Card.Modify'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" fixed="right" label="操作" align="center" width="80px">
                    <template scope="scope">
                        <router-link :to="'edit-card/' + scope.row.cardId +'/'+ scope.row.id"
                                     v-authority="'Card.Modify'">
                            <el-button class="icon-btn edit" type="default" title="修改" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                        </router-link>
                        <el-button type="default" title="删除" class="icon-btn delete"
                                   @click="handleDelete(scope.row.cardId)" size="small" v-authority="'Card.Remove'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--翻页-->
            <pagination :total="totalPage" center="true" v-on:pageChange="handleCurrentChange"></pagination>
            <!--筛选区-->


            <el-dialog :visible.sync="searchFormVisible" style="height: 600px" class="search-dialog" :show-close="false"
                       :modal="false">
                <el-form v-model="pageParam">
                    <el-form-item label="卡券名称">
                        <el-input v-model="pageParam.cardTitle" style="ime-mode:disabled"
                                  placeholder="请输入卡券名称"></el-input>
                    </el-form-item>
                    <el-form-item label="去除过期卡券">
                        <el-radio-group v-model="pageParam.exp">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" @click="reset" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="search" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>

        </div>

    </div>

</template>
<script src="./cardCoupons.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .active:before {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        position: absolute;
        background: red;
    }
</style>
