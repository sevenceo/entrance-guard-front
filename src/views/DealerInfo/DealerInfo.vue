
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'DealerInfo.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'DealerInfo.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'DealerInfo.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'DealerInfo.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'DealerInfo.Search'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>


        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                    <el-table-column prop="brandCode" label="所属品牌">
                    </el-table-column>
                    <el-table-column prop="code" label="经销商编码">
                    </el-table-column>
                    <el-table-column prop="name" label="经销商名称">
                    </el-table-column>
                    <el-table-column prop="provinceId" label="省份">
                    </el-table-column>
                    <el-table-column prop="cityId" label="城市">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                    <el-table-column prop="contractName" label="联系名称">
                    </el-table-column>
                    <el-table-column prop="contractPhone" label="联系电话">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱">
                    </el-table-column>
                    <el-table-column prop="salesTel" label="销售电话">
                    </el-table-column>
                    <el-table-column prop="aftermarketPhone" label="售后电话">
                    </el-table-column>
                    <el-table-column prop="areaCode" label="区域编码">
                    </el-table-column>
                    <el-table-column prop="mediaCode" label="垂直媒体编码">
                    </el-table-column>
                    <el-table-column prop="logoId" label="经销商logo图片ID">
                    </el-table-column>
                    <el-table-column prop="tdImageId" label="经销商店二维码图片Id">
                    </el-table-column>
                    <el-table-column prop="imageId" label="门店形象图片Id">
                    </el-table-column>
                    <el-table-column prop="warpLatitude" label="经纬度">
                    </el-table-column>
                    <el-table-column prop="enabledSite" label="是否开启经销商站点">
                    </el-table-column>
                    <el-table-column prop="siteUrl" label="网站地址">
                    </el-table-column>
                    <el-table-column prop="introduce" label="经销商简介">
                    </el-table-column>
                    <el-table-column prop="deleteFlag" label="是否删除">
                    </el-table-column>

                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   v-authority="'DealerInfo.Edit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   v-authority="'DealerInfo.Delete'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="启用" class="btn btn-add" @click="onStatus(scope.row,'0')"
                                   v-authority="'DealerInfo.Status'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            启用
                        </el-button>
                        <el-button type="default" title="停用" class="btn btn-add" @click="onStatus(scope.row,'1')"
                                   v-authority="'DealerInfo.Status'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            停用
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                            <el-form-item label="所属品牌" prop="brandCode">
                                    <el-input v-model="temp.brand_code"
                                              placeholder="请输入所属品牌"></el-input>
                            </el-form-item>
                            <el-form-item label="经销商编码" prop="code">
                                    <el-input v-model="temp.code"
                                              placeholder="请输入经销商编码"></el-input>
                            </el-form-item>
                            <el-form-item label="经销商名称" prop="name">
                                    <el-input v-model="temp.name"
                                              placeholder="请输入经销商名称"></el-input>
                            </el-form-item>
                            <el-form-item label="省份" prop="provinceId">
                                    <el-input v-model="temp.province_id"
                                              placeholder="请输入省份"></el-input>
                            </el-form-item>
                            <el-form-item label="城市" prop="cityId">
                                    <el-input v-model="temp.city_id"
                                              placeholder="请输入城市"></el-input>
                            </el-form-item>
                            <el-form-item label="地址" prop="address">
                                    <el-input v-model="temp.address"
                                              placeholder="请输入地址"></el-input>
                            </el-form-item>
                            <el-form-item label="联系名称" prop="contractName">
                                    <el-input v-model="temp.contract_name"
                                              placeholder="请输入联系名称"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="contractPhone">
                                    <el-input v-model="temp.contract_phone"
                                              placeholder="请输入联系电话"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="temp.email"
                                              placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="销售电话" prop="salesTel">
                                    <el-input v-model="temp.sales_tel"
                                              placeholder="请输入销售电话"></el-input>
                            </el-form-item>
                            <el-form-item label="售后电话" prop="aftermarketPhone">
                                    <el-input v-model="temp.aftermarket_phone"
                                              placeholder="请输入售后电话"></el-input>
                            </el-form-item>
                            <el-form-item label="区域编码" prop="areaCode">
                                    <el-input v-model="temp.area_code"
                                              placeholder="请输入区域编码"></el-input>
                            </el-form-item>
                            <el-form-item label="垂直媒体编码" prop="mediaCode">
                                    <el-input v-model="temp.media_code"
                                              placeholder="请输入垂直媒体编码"></el-input>
                            </el-form-item>
                            <el-form-item label="经销商logo图片ID" prop="logoId">
                                    <el-input v-model="temp.logo_id"
                                              placeholder="请输入经销商logo图片ID"></el-input>
                            </el-form-item>
                            <el-form-item label="经销商店二维码图片Id" prop="tdImageId">
                                    <el-input v-model="temp.td_image_id"
                                              placeholder="请输入经销商店二维码图片Id"></el-input>
                            </el-form-item>
                            <el-form-item label="门店形象图片Id" prop="imageId">
                                    <el-input v-model="temp.image_id"
                                              placeholder="请输入门店形象图片Id"></el-input>
                            </el-form-item>
                            <el-form-item label="经纬度" prop="warpLatitude">
                                    <el-input v-model="temp.warp_latitude"
                                              placeholder="请输入经纬度"></el-input>
                            </el-form-item>
                            <el-form-item label="是否开启经销商站点" prop="enabledSite">
                                    <el-radio-group v-model="temp.enabled_site">
                                        <el-radio :label="3">备选项</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                            <el-form-item label="网站地址" prop="siteUrl">
                                    <el-input v-model="temp.site_url"
                                              placeholder="请输入网站地址"></el-input>
                            </el-form-item>
                            <el-form-item label="经销商简介" prop="introduce">
                            </el-form-item>
                            <el-form-item label="是否删除" prop="deleteFlag">
                                    <el-radio-group v-model="temp.delete_flag">
                                        <el-radio :label="3">备选项</el-radio>
                                    </el-radio-group>
                            </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>


            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                        <el-form-item label="所属品牌" prop="brandCode">
                                <el-input v-model="temp.brand_code"
                                          placeholder="请输入所属品牌"></el-input>
                        </el-form-item>
                        <el-form-item label="经销商编码" prop="code">
                                <el-input v-model="temp.code"
                                          placeholder="请输入经销商编码"></el-input>
                        </el-form-item>
                        <el-form-item label="经销商名称" prop="name">
                                <el-input v-model="temp.name"
                                          placeholder="请输入经销商名称"></el-input>
                        </el-form-item>
                        <el-form-item label="省份" prop="provinceId">
                                <el-input v-model="temp.province_id"
                                          placeholder="请输入省份"></el-input>
                        </el-form-item>
                        <el-form-item label="城市" prop="cityId">
                                <el-input v-model="temp.city_id"
                                          placeholder="请输入城市"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="address">
                                <el-input v-model="temp.address"
                                          placeholder="请输入地址"></el-input>
                        </el-form-item>
                        <el-form-item label="联系名称" prop="contractName">
                                <el-input v-model="temp.contract_name"
                                          placeholder="请输入联系名称"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contractPhone">
                                <el-input v-model="temp.contract_phone"
                                          placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                                <el-input v-model="temp.email"
                                          placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="销售电话" prop="salesTel">
                                <el-input v-model="temp.sales_tel"
                                          placeholder="请输入销售电话"></el-input>
                        </el-form-item>
                        <el-form-item label="售后电话" prop="aftermarketPhone">
                                <el-input v-model="temp.aftermarket_phone"
                                          placeholder="请输入售后电话"></el-input>
                        </el-form-item>
                        <el-form-item label="区域编码" prop="areaCode">
                                <el-input v-model="temp.area_code"
                                          placeholder="请输入区域编码"></el-input>
                        </el-form-item>
                        <el-form-item label="垂直媒体编码" prop="mediaCode">
                                <el-input v-model="temp.media_code"
                                          placeholder="请输入垂直媒体编码"></el-input>
                        </el-form-item>
                        <el-form-item label="经销商logo图片ID" prop="logoId">
                                <el-input v-model="temp.logo_id"
                                          placeholder="请输入经销商logo图片ID"></el-input>
                        </el-form-item>
                        <el-form-item label="经销商店二维码图片Id" prop="tdImageId">
                                <el-input v-model="temp.td_image_id"
                                          placeholder="请输入经销商店二维码图片Id"></el-input>
                        </el-form-item>
                        <el-form-item label="门店形象图片Id" prop="imageId">
                                <el-input v-model="temp.image_id"
                                          placeholder="请输入门店形象图片Id"></el-input>
                        </el-form-item>
                        <el-form-item label="经纬度" prop="warpLatitude">
                                <el-input v-model="temp.warp_latitude"
                                          placeholder="请输入经纬度"></el-input>
                        </el-form-item>
                        <el-form-item label="是否开启经销商站点" prop="enabledSite">
                                <el-radio-group v-model="temp.enabled_site">
                                    <el-radio :label="3">备选项</el-radio>
                                </el-radio-group>
                        </el-form-item>
                        <el-form-item label="网站地址" prop="siteUrl">
                                <el-input v-model="temp.site_url"
                                          placeholder="请输入网站地址"></el-input>
                        </el-form-item>
                        <el-form-item label="经销商简介" prop="introduce">
                        </el-form-item>
                        <el-form-item label="是否删除" prop="deleteFlag">
                                <el-radio-group v-model="temp.delete_flag">
                                    <el-radio :label="3">备选项</el-radio>
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

            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="错误信息" :visible.sync="formVisible" @close="closeForm()">
                <div class="dialogFormBox">
                    <el-input
                            type="textarea"
                            :rows="errorLine"
                            placeholder="错误信息"
                            :disabled="true"
                            v-model="errorTip">
                    </el-input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeForm()" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm," @click="closeForm()">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<script src="./DealerInfo.js"></script>
