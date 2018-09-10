<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">

            <!--<el-button class="btn btn-add" type="primary" @click="onAddImg">-->
            <!--上传图片-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
            <!--<el-button class="btn btn-add" type="primary" @click="onBatchAudit()" v-authority="'HumanAudit.BatchAudit'"-->
            <!--style="width: 100px;">-->
            <!--<svg class="icon icon-add1" aria-hidden="true">-->
            <!--<use xlink:href="#icon-add1"></use>-->
            <!--</svg>-->
            <!--批量审核-->
            <!--</el-button>-->
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
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
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                </el-table-column>
                <el-table-column prop="idNo" label="身份证号">
                </el-table-column>
                <el-table-column prop="idPhoto" label="身份证">

                    <template scope="scope">
                        <img :src="scope.row.idPhoto" @click="picDetail(scope.row.idPhoto)" width="100" height="100"
                             style="border-radius:5% !important;"/>
                    </template>
                </el-table-column>
                <el-table-column prop="propertyPhoto" label="房产证">
                    <template scope="scope">
                        <img :src="scope.row.propertyPhoto" @click="picDetail(scope.row.propertyPhoto)" width="100"
                             height="100" style="border-radius:5% !important;" v-if="scope.row.propertyPhoto"/>
                    </template>
                </el-table-column>
                <el-table-column prop="enabledFlag" label="审核状态">
                    <template scope="scope">
                        <span>{{ auditFlags[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="resource" label="小区">
                </el-table-column>
                <el-table-column prop="building" label="楼栋">
                </el-table-column>
                <el-table-column prop="unit" label="单元">
                </el-table-column>
                <el-table-column prop="room" label="房号">
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="200">
                    <template scope="scope">
                        <el-button type="default" title="查看" class="icon-btn edit"
                                   @click="detail(scope.row)" size="small">
                            查看详情
                        </el-button>
                        <el-button v-if="scope.row.status == 0" type="default" title="审核" class="icon-btn edit"
                                   @click="audit(scope.row)" size="small">
                            审核
                        </el-button>
                        <el-button v-if="scope.row.status == 0" type="default" title="驳回" class="icon-btn edit"
                                   @click="reject(scope.row)" size="small" v-authority="'HumanAudit.Edit'">
                            驳回
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">


                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="pageParam.phone" type="number"
                                  placeholder="请输入手机号"></el-input>
                    </el-form-item>

                    <el-form-item label="审核状态" prop="gender">
                        <el-select v-model="pageParam.status" placeholder="请选择">
                            <el-option
                                    v-for="item in statusInfo"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
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

            <el-dialog class="dialogForm" title="查看详情" :visible.sync="dialogFormVisible" @close="closeDetailForm()">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                    >
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="temp.phone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="身份证照片" prop="idPhoto">
                            <img :src="temp.idPhoto" width="100" height="100" style="margin-left:3px;"
                                 @click="picDetail(temp.idPhoto)"/>
                        </el-form-item>
                        <el-form-item label="房产证照片" prop="propertyPhoto" v-if="temp.propertyPhoto">
                            <img :src="temp.propertyPhoto" width="100" height="100" style="margin-left:3px;"
                                 @click="picDetail(temp.propertyPhoto)"/>
                        </el-form-item>
                        <el-form-item label="小区" prop="resource">
                            <el-input v-model="temp.resource" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="房号" prop="resourceDetail" v-if="temp.building">
                            <el-input v-model="temp.resourceDetail" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="审核状态" prop="gender">
                            <el-select v-model="temp.status" placeholder="请选择" disabled>
                                <el-option
                                        v-for="item in statusInfo"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="驳回理由" prop="remark" v-show="temp.status === 2">
                            <el-input v-model="temp.remark"
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="关联资源" prop="remark" v-show="temp.status === 1">
                            <el-input v-model="dialogResourceName"
                                      disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="驳回" :visible.sync="rejectVisible" @close="closeReject()">
                <el-form class="small-space" label-position="left" label-width="100px"
                         style='width: 400px; margin-left:50px;'
                         :model="pageParam"
                         ref="form"
                         :rules="rules">
                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="temp.phone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="身份证照片" prop="idPhoto">
                        <img :src="temp.idPhoto" width="100" height="100" style="margin-left:3px;"
                             @click="picDetail(temp.idPhoto)"/>
                    </el-form-item>
                    <el-form-item label="房产证照片" prop="propertyPhoto" v-if="temp.propertyPhoto">
                        <img :src="temp.propertyPhoto" width="100" height="100" style="margin-left:3px;"
                             @click="picDetail(temp.propertyPhoto)"/>
                    </el-form-item>
                    <el-form-item label="小区" prop="resource">
                        <el-input v-model="temp.resource" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="房号" prop="resourceDetail" v-if="temp.building">
                        <el-input v-model="temp.resourceDetail" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="驳回理由" prop="remark">
                        <el-input v-model="pageParam.remark"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" class="update"
                               @keyup.enter="rejectSave('form')"
                               @click="rejectSave('form')">
                        驳回
                    </el-button>
                </div>
            </el-dialog>


            <el-dialog class="dialogForm" title="审核" :visible.sync="resourceVisible" @close="closeAudit()">
                <div style="max-height: 500px;overflow: auto">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                    >
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="temp.phone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="身份证照片" prop="idPhoto">
                            <img :src="temp.idPhoto" width="100" height="100" style="margin-left:3px;"
                                 @click="picDetail(temp.idPhoto)"/>
                        </el-form-item>
                        <el-form-item label="房产证照片" prop="propertyPhoto"  v-if="temp.propertyPhoto">
                            <img :src="temp.propertyPhoto" width="100" height="100" style="margin-left:3px;"
                                 @click="picDetail(temp.propertyPhoto)" v-if="temp.propertyPhoto"/>
                        </el-form-item>
                        </el-form-item>
                        <el-form-item label="小区" prop="resource">
                            <el-input v-model="temp.resource" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="房号" prop="resourceDetail" v-if="temp.building">
                            <el-input v-model="temp.resourceDetail" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="审核状态" prop="gender">
                            <el-select v-model="temp.status" placeholder="请选择" disabled>
                                <el-option
                                        v-for="item in statusInfo"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="驳回理由" prop="remark" v-show="temp.status === 2">
                            <el-input v-model="temp.remark"
                                      disabled></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="audit-header" v-if="temp.propertyPhoto">
                        <el-button type="primary" class="update"
                                   @click="addResource()">
                            新增资源
                        </el-button>
                    </div>
                    <label style="color:red" v-if="temp.propertyPhoto">业主需要关联至户级资源；企业人员需要关联至企业资源</label>
                    <div v-if="temp.propertyPhoto">
                        <!--<el-tree class="communityTreeFY"
                                 :data="treeData"
                                 :props="props"
                                 @node-click="nodeClick"
                        >
                        </el-tree>-->
                        <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="treeSearch"
                                style="width:80%"
                        >
                        </el-input>
                        <button class="btn btn-edit" type="primary" @click="treeSearchClick()" style="width:18%">搜索</button>
                        <div style="max-height: 500px;overflow: auto" >
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
                    <div slot="footer" class="dialog-footer" style="margin-top:20px;">
                        <el-button type="primary" class="update"
                                   @click="auditSave()">
                            审核通过
                        </el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="新增资源" :visible.sync="addFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="addTemp"
                             ref="form"
                             :rules="addRules">
                        <el-form-item label="资源类型" prop="resourceTypeId">
                            <el-select v-model="addTemp.resourceTypeId" placeholder="请选择" @change="changeValue">
                                <el-option
                                        v-for="item in optionsType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资源名称" prop="name">
                            <el-input v-model="addTemp.name"
                                      placeholder="请输入资源名称"></el-input>
                        </el-form-item>
                        <el-form-item label="资源编码" prop="code">
                            <el-input v-model="addTemp.code"
                                      placeholder="请输入资源编码" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="上级资源" prop="parentId">
                            <el-select v-model="addTemp.parentId" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="addTemp.remark" type="textarea"
                                      :rows="2"
                                      placeholder="请输入备注"></el-input>
                        </el-form-item>

                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <!--<el-dialog class="viewOriginalImage" title="查看照片" :visible.sync="picVisible" @close="closePic()">-->
            <!--<img id="pic" :src="imageDetail"/>-->
            <!--</el-dialog>-->
            <!--<div class="viewOriginalImage" title="原图查看" v-if="picVisible ">
                <div class="close" @click="closePic" title="关闭">X</div>
                <div class="title">查看照片</div>
                <div class="body">
                    <img id="pic" :src="imageDetail"/>
                </div>
            </div>-->
            <el-dialog title="原图查看" :visible.sync="picVisible"
                       @close="closeViewPicture()" class="dialogFormWidth800Height600">
                <div style="display:flex;align-items: center;justify-content: center;height: 500px">
                    <img id="pic" src=""/>
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

<script src="./humanAudit.js">
</script>

<style lang="scss">
    .communityTreeFY {
    }

    .communityTreeFY .is-current > .el-tree-node__content {
        background-color: #E4E8F1 !important;
    }

    .audit-header {
        padding: 20px 0px;
    }

    .viewOriginalImage {
        z-index: 5555;
        min-height: 150px;
        min-width: 400px;
        position: fixed;
        left: 250px;
        top: 30px;
        border: 1px solid #c9cbd1;
        padding: 10px;
        background-color: white;
        display: none;
    }

    .viewOriginalImage .body {
        max-height: 800px;
        max-width: 1200px;
        overflow: auto;
    }

    .viewOriginalImage .title {
        text-align: left;
        line-height: 1;
        font-size: 16px;
        font-weight: 700;
        color: #1f2d3d;
        margin-bottom: 10px;
    }

    .viewOriginalImage .close:hover {
        color: red;
    }

    .viewOriginalImage .close {
        width: 20px;
        height: 20px;
        position: absolute;
        left: calc(100% - 30px);
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
    }
</style>