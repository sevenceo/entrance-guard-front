<template>


    <el-row>
        <el-col :span="24">
            <breadcrumb></breadcrumb>
            <div class="user-filter-container">
                <!--<el-button class="btn btn-add" type="primary" @click="onDetail()" v-authority="'Resource.Create'">-->
                <!--<svg class="icon icon-add1" aria-hidden="true">-->
                <!--<use xlink:href="#icon-add1"></use>-->
                <!--</svg>-->
                <!--查看-->
                <!--</el-button>-->
                <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Resource.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    新增
                </el-button>
                <!--<el-button class="btn btn-edit" type="primary" @click="onEdit()"-->
                <!--v-authority="'Resource.Create'">-->
                <!--<svg class="icon icon-add1" aria-hidden="true">-->
                <!--<use xlink:href="#icon-edit1"></use>-->
                <!--</svg>-->
                <!--修改-->
                <!--</el-button>-->
                <el-button class="btn btn-delete" type="danger" @click="onBatchDelete()"
                           v-authority="'Resource.BatchDelete'"
                           style="width: 100px;">
                    <svg class="icon icon-delete1" aria-hidden="true">
                        <use xlink:href="#icon-delete1"></use>
                    </svg>
                    删除
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')"
                           v-authority="'Resource.BatchStatus'" style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    启用
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')"
                           v-authority="'Resource.BatchStatus'" style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    停用
                </el-button>
                <el-button class="btn btn-edit" type="primary" @click="importTemp()"
                           style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    导入
                </el-button>
                <!--<el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'Resource.Search'">-->
                <!--<svg class="icon icon-add1" aria-hidden="true">-->
                <!--<use xlink:href="#icon-filter"></use>-->
                <!--</svg>-->
                <!--筛选-->
                <!--</el-button>-->
            </div>
        </el-col>
        <el-col :span="6">

            <div>
                <!--<el-input-->
                <!--placeholder="输入关键字进行过滤"-->
                <!--v-model="filterText">-->
                <!--</el-input>-->
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="treeSearch"
                        style="width:80%"
                >
                </el-input>
                <button class="btn btn-edit" type="primary" @click="treeSearchClick()" style="width:18%">搜索</button>
                <div style="max-height: 800px;overflow: auto">
                    <div v-if="!treeSearchFlag">
                        <el-tree
                                class="communityTreeFY"
                                :props="props1"
                                :load="loadNode1"
                                @node-click="nodeClick"
                                lazy
                                :data="rootTreeData"
                        >
                        </el-tree>
                    </div>
                    <!--<el-input-->
                    <!--placeholder="输入关键字进行过滤"-->
                    <!--v-model="filterText">-->
                    <!--</el-input>-->
                    <div id="search" v-if="treeSearchFlag">
                        <el-tree class="communityTreeFY"
                                 :data="treeData"
                                 :props="props"
                                 @node-click="nodeClick"
                                 :default-expand-all="treeSearchFlag"
                        >
                        </el-tree>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="18">
            <div>

                <div>
                    <!--表格-->
                    <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="name" label="资源名称">
                        </el-table-column>
                        <el-table-column prop="resourceTypeName" label="资源类型">
                        </el-table-column>
                        <el-table-column prop="code" label="资源编码">
                        </el-table-column>
                        <el-table-column prop="parentName" label="上级资源">
                        </el-table-column>
                        <el-table-column prop="tenantName" label="关联组织" v-if="isOrg != 1">
                        </el-table-column>
                        <el-table-column prop="enabledFlag" label="启用状态">
                            <template scope="scope">
                                <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="操作" width="300">
                            <template scope="scope">
                                <el-button type="default" title="查看" class="icon-btn edit" @click="onDetail(scope.row)"
                                           size="small">
                                    查看详情
                                </el-button>
                                <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                           v-authority="'Resource.Edit'"
                                           size="small">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-edit1"></use>
                                    </svg>
                                </el-button>
                                <el-button type="default" title="删除" class="icon-btn delete"
                                           @click="onDelete(scope.row)"
                                           v-authority="'Resource.Delete'"
                                           size="small">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-delete1"></use>
                                    </svg>
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                    <!--翻页-->
                    <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
                    <!--dialog导入-->
                    <el-dialog class="dialogForm resourceDialog" title="资源导入" :visible.sync="dialogImportVisible"
                               @close="closeImportFile()">
                        <div style="text-align: center">
                            <h3>请下载资源导入模板，正确填写资源信息并上传，即可完成导入</h3>
                            <div>
                                <el-select v-model="importType" placeholder="请选择" @change="changeImportType()"
                                >
                                    <el-option
                                            v-for="item in importTypes"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button class="btn btn-edit" type="primary" @click="download()"
                                           style="width: 100px;height:32px;font-size: 16px;">
                                    下载模板
                                </el-button>
                                <el-button type="primary" class="btn btn-add"
                                           style="width: 100px;height:32px;font-size: 16px;"
                                           @click="importFile()"
                                >
                                    导入文件
                                </el-button>
                            </div>
                        </div>
                    </el-dialog>
                    <!--文件选择-->
                    <el-dialog class="dialogForm" title="导入Excel" :visible.sync="dialogFileImport"
                               @close="closeDetailImportForm()">
                        <el-upload
                                name="file"
                                class="avatar-uploader"
                                :headers="headers"
                                :action="importExcel()"
                                :data="upLoadData"
                                :show-file-list="false"
                                :on-success="handleImportSuccess"
                                :before-upload="beforeExcelUpload"
                                multiple>
                            <img v-if="false" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <template v-if="excel_loading">
                            <div class="add_img_list">
                                <p class="map_loading">Excel文件导入中</p>
                            </div>
                        </template>
                    </el-dialog>

                    <el-dialog class="dialogForm" title="资源导入失败信息" :visible.sync="dialogImportFail"
                               @close="closeBatchImportPane()">
                        <el-table :data="dataImportFail" border stripe style="width: 100%" class="blue-table">
                            <el-table-column prop="msg" label="资源导入失败信息">
                            </el-table-column>
                        </el-table>
                    </el-dialog>


                    <el-dialog class="dialogForm-1000 resourceDialog" :title="textMap[dialogStatus]"
                               :visible.sync="dialogFormVisible"
                               @close="resetForm">
                        <div class="dialogFormBox">
                            <el-form class="small-space" label-position="left" label-width="100px"
                                     style='width: 400px; margin-left:50px;'
                                     :model="temp"
                                     ref="form"
                                     :rules="rules">
                                <el-form-item label="资源类型" prop="resourceTypeId">
                                    <el-select v-model="temp.resourceTypeId" placeholder="请选择" @change="changeValue"
                                               :disabled="(dialogStatus != 'create')">
                                        <el-option
                                                v-for="item in optionsType"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="资源名称" prop="name">
                                    <el-input v-model="temp.name"
                                              placeholder="请输入资源名称" :disabled="(dialogStatus === 'detail')"></el-input>
                                </el-form-item>
                                <el-form-item label="资源编码" prop="code" v-if="isCode">
                                    <el-input v-model="temp.code" readonly
                                              placeholder="请输入资源编码" :disabled="(dialogStatus != 'create')"></el-input>
                                </el-form-item>
                                <el-form-item label="资源编码" prop="code" v-if="!isCode">
                                    <el-input v-model="temp.code"
                                              placeholder="请输入资源编码" :disabled="(dialogStatus === 'detail')"></el-input>
                                </el-form-item>

                                <el-form-item label="上级资源" prop="parentId" v-if="temp.level > 0">
                                    <el-autocomplete
                                            custom-item="my-item-zh"
                                            v-model="temp.parentName"
                                            class="inline-input"
                                            :fetch-suggestions="querySearch"
                                            placeholder="请选择上级资源"
                                            @select="handleSelect"
                                            :disabled="(dialogStatus != 'create')"
                                            style="width:211px;"
                                    ></el-autocomplete>
                                </el-form-item>

                                <el-form-item label="关联组织" prop="orgId" v-if="temp.resourceTypeId != ''">
                                    <el-autocomplete
                                            v-model="temp.orgName"
                                            class="inline-input"
                                            :fetch-suggestions="querySearchOrg"
                                            placeholder="请选择关联组织"
                                            @select="handleSelectOrg"
                                            :disabled="(dialogStatus != 'create' || temp.level > 0)"
                                            style="width:211px;"
                                    ></el-autocomplete>
                                </el-form-item>

                                <el-form-item label="备注" prop="remark" :disabled="(dialogStatus === 'detail')">
                                    <el-input v-model="temp.remark" type="textarea"
                                              :rows="2"
                                              placeholder="请输入备注" :disabled="(dialogStatus === 'detail')"></el-input>
                                </el-form-item>
                                <div v-if="temp.level == 0">

                                    <el-form-item label="图片" prop="photo" :disabled="(dialogStatus === 'detail')">
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="action"
                                                :show-file-list="false"
                                                :on-change="changeFeature" :disabled="(dialogStatus === 'detail')">
                                            <img v-if="temp.imageUrlFlag" :src="imageUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>

                                    </el-form-item>

                                    <el-form-item label="城市">
                                        <div style="float: left;">
                                            <el-select v-model="temp.provinceId" placeholder="请选择省份"
                                                       style="width:150px;" size='large'
                                                       :disabled="(dialogStatus === 'detail')"
                                                       @change="getCityListByProvinceId(temp.provinceId, temp.city)">
                                                <el-option v-for="item in provinceList" :key="item.id"
                                                           :label="item.name"
                                                           :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div>
                                            <el-select v-model="temp.city" placeholder="请选择城市" style="width:150px;"
                                                       size='large' :disabled="(dialogStatus === 'detail')"
                                                       @change="selectCity()">
                                                <el-option v-for="item in cityList" :key="item.id" :label="item.name"
                                                           :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <!--<el-input v-model="temp.city"
                                                  placeholder="城市" :disabled="(dialogStatus === 'detail')"></el-input>-->
                                    </el-form-item>

                                    <div id="allmap" v-if="dialogStatus != 'detail'"></div>
                                    <el-form-item label="经度" prop="longitude" :disabled="(dialogStatus === 'detail')">
                                        <el-input v-model="temp.longitude"
                                                  class="longitude"
                                                  placeholder="请输入经度"
                                                  :disabled="(dialogStatus === 'detail')"></el-input>
                                    </el-form-item>
                                    <el-form-item label="纬度" prop="latitude" :disabled="(dialogStatus === 'detail')">
                                        <el-input v-model="temp.latitude"
                                                  class="latitude"
                                                  placeholder="请输入纬度"
                                                  :disabled="(dialogStatus === 'detail')"></el-input>
                                    </el-form-item>
                                    <el-form-item label="电话" prop="telephone" :disabled="(dialogStatus === 'detail')">
                                        <el-input v-model="temp.telephone"
                                                  placeholder="请输入电话"
                                                  :disabled="(dialogStatus === 'detail')"></el-input>
                                    </el-form-item>
                                    <el-form-item label="地址" prop="address" :disabled="(dialogStatus === 'detail')">
                                        <el-input v-model="temp.address"
                                                  placeholder="请输入地址"
                                                  :disabled="(dialogStatus === 'detail')"></el-input>
                                    </el-form-item>
                                </div>
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
                            <el-button v-if="dialogStatus === 'editor'" type="primary" class="update"
                                       @keyup.enter="update('form')"
                                       @click="update('form')"
                                       :loading="$store.state.app.onXHR">
                                确 定
                            </el-button>
                        </div>
                    </el-dialog>


                    <!--筛选区-->
                    <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false"
                               :modal="false">
                        <el-form v-model="pageParam" labelPosition="">

                            <el-form-item label="资源名称" prop="name">
                                <el-input v-model="pageParam.name"
                                          placeholder="请输入资源名称"></el-input>
                            </el-form-item>
                            <el-form-item label="资源编码" prop="code">
                                <el-input v-model="pageParam.code"
                                          placeholder="请输入资源编码"></el-input>
                            </el-form-item>
                            <el-form-item label="资源类型" prop="resourceTypeId">
                                <el-select v-model="pageParam.resourceTypeId" placeholder="请选择">
                                    <el-option
                                            v-for="item in optionsType"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
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

                    <!--dialog查看场景-->
                    <el-dialog class="dialogForm" title="查看场景" :visible.sync="dialogSceneDetail"
                               @close="closeDetailForm()">
                        <el-table :data="tableDataSence" border stripe style="width: 100%" class="blue-table">
                            <el-table-column prop="sceneName" label="场景名称">
                            </el-table-column>
                            <el-table-column prop="type" label="操作" align="center" width="130">
                                <template scope="scope">
                                    <el-button type="default" title="删除" class="icon-btn delete"
                                               @click="onSenceDelete(scope.row)" size="small">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-delete1"></use>
                                        </svg>
                                    </el-button>
                                </template>
                            </el-table-column>

                        </el-table>

                    </el-dialog>

                    <!--dialog关联场景-->
                    <el-dialog class="dialogForm" title="关联场景" :visible.sync="dialogAddHumanSenctData"
                               @close="closeDetailForm()">
                        <el-table :data="tableDataAddSence" border stripe style="width: 100%" class="blue-table"
                                  @selection-change="handleSelectionChangeRSR">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="sceneName" label="场景名称">
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                            </el-table-column>
                        </el-table>
                        <el-button class="btn btn-add" type="primary" @click="onBatchAddSenece()"
                                   style="width: 100px;float: right;margin: 10px 0px;">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            批量关联
                        </el-button>
                    </el-dialog>

                    <!--dialog查看资源-->
                    <el-dialog class="dialogForm" title="查看组织" :visible.sync="dialogResourceDetail"
                               @close="closeDetailForm()">
                        <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                            <el-table-column prop="cropName" label="企业名称">
                            </el-table-column>
                            <el-table-column prop="orgName" label="组织名称">
                            </el-table-column>


                            <el-table-column prop="type" label="操作" align="center" width="130">
                                <template scope="scope">
                                    <el-button type="default" title="删除" class="icon-btn delete"
                                               @click="onResourceDelete(scope.row)" size="small">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-delete1"></use>
                                        </svg>
                                    </el-button>
                                </template>
                            </el-table-column>

                        </el-table>

                    </el-dialog>

                    <!--dialog关联资源-->
                    <el-dialog class="dialogForm" title="关联组织" :visible.sync="dialogAddData" @close="closeDetailForm()">
                        <el-table :data="tableDataAdd" border stripe style="width: 100%" class="blue-table"
                                  @selection-change="handleSelectionChangeResource">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="cropName" label="企业名称">
                            </el-table-column>
                            <el-table-column prop="orgName" label="组织名称">
                            </el-table-column>
                        </el-table>

                        <el-button class="btn btn-add" type="primary" @click="addResourceOrganization()"
                                   style="width: 100px;float: right;margin: 10px 0px;">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-add1"></use>
                            </svg>
                            关联
                        </el-button>
                    </el-dialog>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<style>
    .el-autocomplete-suggestion li:hover {
        text-overflow: inherit;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .add_img_list {
        float: left;
        width: 3.893333333333333rem;
        height: 3.893333333333333rem;
        position: relative;
        padding: 0.213333rem;
        box-sizing: border-box;
    }

    .add_img_list .map_loading {
        margin-top: -120px;
        margin-left: 247px;
        width: 148px;
        text-align: center;
        color: #333;
        font-size: 1.554667rem;
        color: #0c0f09;
        border: none;
    }

    .communityTreeFY {
    }

    .communityTreeFY .is-current > .el-tree-node__content {
        background-color: #E4E8F1 !important;
    }

    .audit-header {
        padding: 20px 0px;
    }

    #allmap {
        width: 150%;
        height: 200px;
        overflow: hidden;
        margin: 20px 0;
        font-family: "微软雅黑";
    }
</style>
<script src="./Resource.js"></script>