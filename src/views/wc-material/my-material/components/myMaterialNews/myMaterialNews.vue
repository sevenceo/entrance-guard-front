<template>
    <div>
        <div class="material-content">
            <div class=" account-filter-container">
                <el-button class="btn btn-add" @click="onAdd" type="primary"  v-authority="'Material.Mine.Create'">
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
            </div>
            <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                <el-col class="control-bar" :span="24">
                    <label class="select-all-wrapper">
                        <input class="checkbox" type="checkbox" v-model="checkAll" @click="selectAll"><label
                            class="select-all" v-if="!checkAll">全选</label><label class="select-all" v-else="checkALl">全不选</label>
                    </label>
                    <a @click="setUnshared">设为非共享</a>
                </el-col>
                <el-col class="item" :md="8" :lg="6" v-for="x in dataList" :key='x.id'>
                    <div class="item-wrapper">
                        <div class="item-wrapper-img">
                            <img :src="imageUrl + x.serverUrl"
                                 alt="">

                            <div class="triangle-topright" v-if="x.shared"></div>
                            <input type="checkbox" class="checkbox item-checkbox" :value="x.id" :id="x.id"
                                   v-if="x.shared" v-model="checkboxStatus">
                            <label :for="x.id"></label>
                            <!--黑色遮罩层-->
                            <!--<div class="image-cover image-cover-black"></div>-->

                        </div>
                        <p class="material-title">{{x.name}}</p>
                        <!--<p class="material-title" v-for=" tpl in x.newsItemList" v-html="tpl.content" style="overflow: hidden"></p>-->
                        <div class="icon-container">
                            <!--<a class="icon-wrapper">-->
                            <!--<svg class="icon icon-edit1" aria-hidden="true">-->
                            <!--<use xlink:href="#icon-download"></use>-->
                            <!--</svg>-->
                            <!--</a>-->
                            <a class="icon-wrapper" @click="onShare(x)" v-authority="'Material.Mine.Share'"  v-if="!x.shared">
                                <svg class="icon icon-edit1 material-share" aria-hidden="true">
                                    <use xlink:href="#icon-share"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper" @click="onEdit(x.id)" v-authority="'Material.Mine.Modify'">
                                <svg class="icon icon-edit1 material-edit" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper" @click="onPreView(x.id)" v-authority="'Material.Mine.PreView'">
                                <svg class="icon icon-edit1 material-check" aria-hidden="true">
                                    <use xlink:href="#icon-check"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper" @click="onPublish(x.id,x.account)" v-authority="'Material.Mine.Publish'" v-if="x.status == 0">
                                <svg class="icon icon-edit1 material-check" aria-hidden="true">
                                    <use xlink:href="#icon-fabu2"></use>
                                </svg>
                            </a>
                            <a class="icon-wrapper delete" @click="onDelete(x.id,x.account)" v-authority="'Material.Mine.Remove'">
                                <svg class="icon icon-edit1 material-delete" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </a>
                        </div>

                    </div>
                </el-col>

            </el-row>
            <pagination :total="totalPage"  ref="pages"  :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>


        </div>

        <!--筛选区-->

        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form ref="searchForm">
                <el-form-item label="素材名称">
                    <el-input v-model="pageParam.name" placeholder="请输入素材名称"></el-input>
                </el-form-item>
                <el-radio-group class="radio-menu" v-model="pageParam.viewMode" >
                    <el-radio-button label="MY_SHARED" size="large">仅显示我共享的</el-radio-button>
                    <br/>
                    <el-radio-button class="my-download-radio" label="MY_IMPORT" size="large">仅显示我下载的</el-radio-button>
                </el-radio-group>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" type="default" @click="resetSearchForm">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" type="default" @click="search">
                    筛选
                </el-button>
            </div>
        </el-dialog>


        <el-dialog title="图文预览"  class="dialogForm" :visible.sync="preViewVisible" @close="resetForm">
            <el-table :data="articleTableData"
                class="data-table"
                border
                stripe
                style="width: 100%">
                <el-table-column prop="title" label="标题" width="358">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button type="default" title="预览" class="check" size="small" @click="preView(scope.row.url)">
                            <svg class="icon icon-check" aria-hidden="true">
                                <use xlink:href="#icon-check"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
             </el-table>
        </el-dialog>

    </div>
</template>


<script src="./myMaterialNews.js">

</script>

<style scoped lang="scss">
    .material-title{

    }
</style>