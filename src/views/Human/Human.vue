<template>
    <el-row>
        <el-col :span="24">
            <breadcrumb></breadcrumb>
            <div class="user-filter-container">

                <!--<el-button class="btn btn-add" type="primary" @click="onAddImg">-->
                <!--上传图片-->
                <!--</el-button>-->
                <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Human.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    新增
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="showButtons" v-authority="'Human.ImportCropOrOrg'"
                           style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    人员导入
                </el-button>
                <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'Human.BatchDelete'"
                           style="width: 100px;">
                    <svg class="icon icon-delete1" aria-hidden="true">
                        <use xlink:href="#icon-delete1"></use>
                    </svg>
                    批量删除
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')"
                           v-authority="'Human.BatchStatus'"
                           style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量启用
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')"
                           v-authority="'Human.BatchStatus'"
                           style="width: 100px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    批量停用
                </el-button>
                <!-- <el-button class="btn btn-add" type="primary" @click="onBatchAudit()" v-authority="'Human.BatchAudit'"
                            style="width: 100px;">
                     <svg class="icon icon-add1" aria-hidden="true">
                         <use xlink:href="#icon-add1"></use>
                     </svg>
                     批量审核
                 </el-button>-->
                <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'Human.Search'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>

            </div>
        </el-col>
        <el-col :span="6">
            <div style="display: flex;align-items:center;">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="treeSearch">
            </el-input><button class="btn btn-edit" type="primary" @click="treeSearchClick()">搜索</button>
            </div>
            <div style="max-height: 800px;overflow: auto">
                <!--<el-tree class="communityTreeFY"
                         :data="treeData"
                         :props="props"
                         :filter-node-method="resourceFilterNode"
                         @node-click="resourceNodeClick"
                         ref="resourceTree"
                >
                </el-tree>-->
               <!-- <button class="btn btn-edit" type="primary" @click="treeSearchClick()" style="width:18%">search</button>-->
                <div v-if="!treeSearchFlag">
                    <el-tree
                            class="communityTreeFY"
                            :props="props1"
                            :load="loadNode1"
                            @node-click="resourceNodeClick"
                            lazy
                            :data="rootTreeData"
                    >
                    </el-tree>
                </div>
                <div id="search" v-if="treeSearchFlag">
                    <el-tree class="communityTreeFY"
                             :data="treeDataAsync"
                             :props="props"
                             @node-click="resourceNodeClick"
                             :default-expand-all="treeSearchFlag"
                    >
                    </el-tree>
                </div>
            </div>
        </el-col>
        <el-col :span="18">
            <div>
                <!--表格-->
                <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <!-- <el-table-column prop="tenantName" label="所属组织">
                     </el-table-column>-->
                    <el-table-column prop="facePhoto" label="特征照片">
                        <template scope="scope">
                            <!--:alt="baseData.nickname"-->
                            <!--:key="11"-->
                            <!--<img v-preview="scope.row.facePhoto"-->
                            <!--:src="scope.row.facePhoto"-->
                            <!--preview-title-enable="true"-->
                            <!--preview-nav-enable="true">-->
                            <img :src="scope.row.facePhoto" @click="picDetail(scope.row.facePhoto)" width="100"
                                 height="100"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="姓名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                        <template scope="scope">
                            <span>{{genderInfo[scope.row.gender]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="age" label="年龄">
                    </el-table-column>
                    <el-table-column prop="mobilePhone" label="手机号">
                    </el-table-column>
                    <!--<el-table-column prop="infoSourceName" label="信息来源">
                    </el-table-column>-->
                    <!--<el-table-column prop="remark" label="备注">-->
                    <!--</el-table-column>-->
                    <!--   <el-table-column prop="enabledFlag" label="是否启用">
                           <template scope="scope">
                               <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                           </template>
                       </el-table-column>-->
                    <!--<el-table-column prop="enabledFlag" label="审核状态">
                        <template scope="scope">
                            <span>{{ auditFlags[scope.row.isApproval]}}</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="type" label="操作" align="center" width="260">
                        <template scope="scope">
                            <el-button type="default" title="查看"
                                       :disabled="scope.row.enabledFlag === 0"
                                       @click="onView(scope.row)" size="small" v-authority="'Human.Edit'">
                                <svg class="iconOut" aria-hidden="true">
                                    <use xlink:href="#icon-chakan"></use>
                                </svg>
                            </el-button>
                            <el-button type="default" title="编辑" class="icon-btn edit"
                                       :disabled="scope.row.enabledFlag === 0"
                                       @click="onEdit(scope.row)" size="small" v-authority="'Human.Edit'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onDelete(scope.row)" size="small" v-authority="'Human.Delete'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                            <!--<el-button type="default" title="驳回" class="icon-btn edit"
                                       :disabled="scope.row.isApproval === 1 || scope.row.isApproval === 2"
                                       @click="reject(scope.row)" size="small" v-authority="'Human.reject'">
                                驳回
                            </el-button>-->
                            <!--   <el-button type="default" title="上传图片" class="icon-btn edit"
                                          :disabled="scope.row.enabledFlag === 0"
                                          @click="onAddImg(scope.row)" size="small" v-authority="'Human.Upload'">
                                   上传图片
                               </el-button>-->
                            <!--<el-button type="default" title="查看人员关系" class="icon-btn edit"
                                       :disabled="scope.row.enabledFlag === 0"
                                       @click="relationship(scope.row)" size="small" v-authority="'Human.Relationship'">
                                查看人员关系
                            </el-button>-->
                            <!--<el-button type="default" title="查看资源" class="icon-btn edit"
                                       @click="DetailHumanResourceRef(scope.row)" size="small"
                                       v-authority="'Human.Resource'">
                                查看资源
                            </el-button>-->
                            <el-button type="default" title="关联资源" class="icon-btn edit"
                                       :disabled="(scope.row.enabledFlag === 0) "
                                       @click="addHumanResourceRef(scope.row)" size="small"
                                       v-authority="'Human.Resource'"><!--|| (scope.row.isApproval != 1)-->
                                关联资源
                            </el-button>

                            <!--<el-button type="default" title="查看场景" class="icon-btn edit"
                                       :disabled="(scope.row.enabledFlag === 0) || (scope.row.isApproval != 1)"
                                       @click="onSenceDetail(scope.row)" size="small" v-authority="'Human.Scene'">
                                查看场景
                            </el-button>-->

                            <el-button type="default" title="关联场景" class="icon-btn edit"
                                       :disabled="(scope.row.enabledFlag === 0)"
                                       @click="addSence(scope.row)" size="small" v-authority="'Human.Scene'">
                                关联场景
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <!--翻页-->
                <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

                <el-dialog class="dialogForm" :visible.sync="resourceVisible" @close="closeAudit()">
                    <div class="audit-header">
                        <el-button type="primary" class="update"
                                   @click="addResource()">
                            新增资源
                        </el-button>
                    </div>
                    <div style="max-height: 500px;overflow: auto">
                       <!-- <el-tree class="communityTreeFY"
                                 :data="treeData"
                                 :props="props"
                                 @node-click="nodeClick"
                        >
                        </el-tree>-->
                        <el-tree
                                class="communityTreeFY"
                                :props="props1"
                                :load="loadNode2"
                                @node-click="nodeClick"
                                lazy
                                :data="treeData">
                        </el-tree>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" class="update"
                                   @click="back()">
                            上一步
                        </el-button>
                        <el-button type="primary" class="update"
                                   @click="auditSave()">
                            确定
                        </el-button>
                    </div>
                </el-dialog>
                <el-dialog class="dialogForm" title="新增资源" :visible.sync="addFormVisible"
                           @close="resetForm">
                    <div class="dialogFormBox">
                        <el-form class="small-space" id="abc" label-position="left" label-width="100px"
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
                            <div v-if="addTemp.resourceTypeId === '1'">
                                <el-form-item label="城市" prop="city">
                                    <el-input v-model="addTemp.city"
                                              placeholder="城市"></el-input>
                                </el-form-item>
                                <el-form-item label="城市全拼" prop="fullPinYin"
                                >
                                    <el-input v-model="addTemp.fullPinYin"
                                              placeholder="城市全拼"></el-input>
                                </el-form-item>
                                <el-form-item label="社区图片" prop="photo">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="actionCommunity"
                                            :show-file-list="false"
                                            :on-change="changeCommunityFeature">
                                        <img v-if="addTemp.imageUrlFlag" :src="communityImageUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>

                                </el-form-item>
                                <el-form-item label="经度" prop="longitude">
                                    <el-input v-model="addTemp.longitude"
                                              placeholder="请输入经度"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="纬度" prop="latitude">
                                    <el-input v-model="addTemp.latitude"
                                              placeholder="请输入纬度"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="社区电话" prop="telephone">
                                    <el-input v-model="addTemp.telephone"
                                              placeholder="请输入社区电话"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="社区地址" prop="address">
                                    <el-input v-model="addTemp.address"
                                              placeholder="请输入社区地址"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="handleCancel" class="cancel">取 消</el-button>
                        <el-button type="primary" class="confirm,"
                                   @keyup.enter="createResource"
                                   @click="createResource"
                                   :loading="$store.state.app.onXHR">
                            确 定
                        </el-button>
                    </div>
                </el-dialog>


                <!--dialog编辑区-->
                <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                           @close="closeAddPane()">
                    <div class="dialogFormBox">
                        <el-form class="small-space" label-position="left" label-width="100px"
                                 style='width: 400px; margin-left:50px;'
                                 :model="temp"
                                 ref="form"
                                 :rules="rules">
                            <!--<el-form-item label="人脸照片" prop="facePhoto">-->
                            <!--<el-input v-model="temp.facePhoto"-->
                            <!--placeholder="请输入人脸照片"></el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item label="姓名" prop="realName">
                                <el-input v-model="temp.realName"
                                          placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="mobilePhone">
                                <el-input v-model="temp.mobilePhone" :maxlength="11"
                                          placeholder="请输入手机号"></el-input>
                            </el-form-item>
                            <div style="display: flex;align-items:center" v-if="dialogStatus === 'create' ">
                                <div style="color: red;height: 40px">*&nbsp;</div>
                                <div>
                                    <el-form-item label="身份" prop="identity">
                                        <el-select v-if="!isOrg" v-model="identity" placeholder="请选择"
                                                   style="margin-left: -10px">
                                            <el-option
                                                    v-for="item in identityList"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                        <el-select v-if="isOrg" v-model="identity" placeholder="请选择"
                                                   style="margin-left: -10px">
                                            <el-option-group
                                                    v-for="group in optionsArray"
                                                    :key="group.label"
                                                    :label="group.label">
                                                <el-option
                                                        v-for="item in group.options"
                                                        :key="item.value"
                                                        :label="item.name"
                                                        :value="item">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                            <el-form-item label="主成员" prop="isMember" v-if="dialogStatus === 'create' ">
                                <el-select v-model="temp.isMember" placeholder="请选择">
                                    <el-option
                                            v-for="item in isMemberList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="头像">
                                <img v-if="imageUrl" :src="imageUrl" style="width: 100px; height: 100px;" class="avatar"
                                     @click="showCropperDialog">
                                <i v-else class="el-icon-plus avatar-uploader-icon" style="cursor: pointer"
                                   @click="showCropperDialog"></i>
                                <!--<el-input v-model="temp.idNo" :maxlength="18"
                                          placeholder="请输入身份证号"></el-input>-->
                                <!-- <el-upload
                                         class="avatar-uploader"
                                         action="https://jsonplaceholder.typicode.com/posts/"
                                         :show-file-list="false"
                                         :on-success="handleAvatarSuccess"
                                         :before-upload="beforeAvatarUpload">
                                     <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                 </el-upload>-->
                                <!--<el-upload
                                        class="avatar-uploader"
                                        :action="actionWhileAdd"
                                        :data="upLoadData"
                                        :show-file-list="false"
                                        :on-success="handleUploadSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        :auto-upload="false"
                                        :on-change="changeFeature1">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>-->

                                <template v-if="img_loading">
                                    <div class="add_img_list">
                                        <p class="map_loading">图片上传中</p>
                                    </div>
                                </template>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-select v-model="temp.gender" placeholder="请选择">
                                    <el-option
                                            v-for="item in genders"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="身份证号" prop="idNo">
                                <el-input v-model="temp.idNo" :maxlength="18"
                                          placeholder="请输入身份证号"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="年龄" prop="age">
                                <el-input v-model="temp.age" :maxlength="3"
                                          placeholder="请输入年龄"></el-input>
                            </el-form-item>-->

                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="temp.email" type="email"
                                          placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="temp.remark"
                                          placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="handleCancel" class="cancel">取 消</el-button>
                        <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                                   @keyup.enter="create"
                                   @click="create"
                                   :loading="$store.state.app.onXHR">
                            下一步
                        </el-button>
                        <el-button v-else type="primary" class="update"
                                   @keyup.enter="update('form')"
                                   @click="update('form')"
                                   :loading="$store.state.app.onXHR">
                            确 定
                        </el-button>
                    </div>
                </el-dialog>

                <!--查看详情-->
                <el-dialog class="dialogForm-1000" title="查看详情" :visible.sync="viewDialogFormVisible"
                           @close="closeViewPane()">
                    <template>
                        <el-tabs v-model="activeName" @tab-click="handleTabClick">
                            <el-tab-pane label="用户信息" name="first">
                                <div class="dialogFormBox">
                                    <el-form class="small-space" label-position="left" label-width="100px"
                                             style='width: 400px; margin-left:50px;'
                                             :model="temp"
                                             ref="form"
                                             :rules="rulesEdit">
                                        <el-form-item label="姓名" prop="realName">
                                            <el-input v-model="temp.realName"
                                                      placeholder="请输入姓名" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="手机号" prop="mobilePhone">
                                            <el-input v-model="temp.mobilePhone" :maxlength="11"
                                                      placeholder="请输入手机号" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="头像">
                                            <img v-if="imageUrl" :src="imageUrl" style="width: 100px; height: 100px;"
                                                 class="avatar">
                                        </el-form-item>
                                        <el-form-item label="性别" prop="gender">
                                            <el-select v-model="temp.gender" placeholder="请选择" disabled>
                                                <el-option
                                                        v-for="item in genders"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="身份证号" prop="idNo">
                                            <el-input v-model="temp.idNo" :maxlength="18"
                                                      placeholder="请输入身份证号" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="年龄" prop="age">
                                            <el-input v-model="temp.age" :maxlength="3"
                                                      disabled></el-input>
                                        </el-form-item>

                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="temp.email" type="email"
                                                      placeholder="请输入邮箱" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="备注" prop="remark">
                                            <el-input v-model="temp.remark"
                                                      placeholder="请输入备注" disabled></el-input>
                                        </el-form-item>
                                        <!--<el-form-item label="关联资源">

                                        </el-form-item>-->
                                        <!--<el-form-item label="关联场景">

                                        </el-form-item>-->
                                    </el-form>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="关联资源" name="second">
                                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                                    <el-table-column prop="tenantName" label="所属组织">
                                    </el-table-column>
                                    <el-table-column prop="resourceTypeName" label="资源类型">
                                    </el-table-column>
                                    <el-table-column prop="name" label="资源名称">
                                    </el-table-column>
                                    <!--<el-table-column prop="code" label="资源编码">
                                    </el-table-column>-->
                                    <el-table-column prop="parentName" label="上级资源">
                                    </el-table-column>
                                    <el-table-column prop="enabledFlag" label="是否启用">
                                        <template scope="scope">
                                            <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column prop="remark" label="备注">
                                    </el-table-column>-->
                                    <el-table-column prop="identityName" label="身份">
                                    </el-table-column>
                                    <el-table-column prop="isManager" label="主成员">
                                        <template scope="scope">
                                            <span>{{ judgeManager[scope.row.isManager]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="infoSourceName" label="信息来源">
                                    </el-table-column>
                                    -->
                                </el-table>
                                <pagination ref="viewResourcePages" :total="viewResourceRowTotal"
                                            v-on:pageChange="handleViewResourceChange"
                                            v-if="resourcePaginationShow"></pagination>
                            </el-tab-pane>
                            <el-tab-pane label="关联场景" name="third">
                                <el-table :data="tableDataSence" border stripe style="width: 100%" class="blue-table">
                                    <el-table-column prop="sceneName" label="场景名称">
                                    </el-table-column>
                                    <el-table-column prop="associateRef" label="关联场景类型">
                                    </el-table-column>
                                </el-table>
                                <pagination ref="viewScenePages" :total="viewSceneRowTotal"
                                            v-on:pageChange="handleViewSceneChange"
                                            v-if="scenePaginationShow"></pagination>
                            </el-tab-pane>
                        </el-tabs>
                    </template>

                    <div slot="footer" class="dialog-footer">
                        <el-button class="update" type="primary"
                                   @keyup.enter="closeView('form')"
                                   @click="closeView('form')"
                                   :loading="$store.state.app.onXHR">
                            关闭
                        </el-button>
                    </div>
                </el-dialog>

                <!--编辑-->
                <el-dialog class="dialogForm-1000" title="编辑" :visible.sync="editDialogFormVisible"
                           @close="closeEditPane()">
                    <template>
                        <el-tabs v-model="activeNameWhileEdit" @tab-click="handleTabClickWhileEdit">
                            <el-tab-pane label="用户信息" name="first">
                                <div class="dialogFormBox">
                                    <el-form class="small-space" label-position="left" label-width="100px"
                                             style='width: 400px; margin-left:50px;'
                                             :model="temp"
                                             ref="form"
                                             :rules="rulesEdit">
                                        <el-form-item label="姓名" prop="realName">
                                            <el-input v-model="temp.realName"
                                                      placeholder="请输入姓名"></el-input>
                                        </el-form-item>
                                        <el-form-item label="手机号" prop="mobilePhone">
                                            <el-input v-model="temp.mobilePhone" :maxlength="11"
                                                      placeholder="请输入手机号" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="头像">
                                            <img v-if="imageUrl" :src="imageUrl" style="width: 100px; height: 100px;"
                                                 class="avatar"
                                                 @click="showCropperDialog">
                                            <i v-else class="el-icon-plus avatar-uploader-icon" style="cursor: pointer"
                                               @click="showCropperDialog"></i>
                                            <template v-if="img_loading">
                                                <div class="add_img_list">
                                                    <p class="map_loading">图片上传中</p>
                                                </div>
                                            </template>
                                        </el-form-item>
                                        <el-form-item label="性别" prop="gender">
                                            <el-select v-model="temp.gender" placeholder="请选择">
                                                <el-option
                                                        v-for="item in genders"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="身份证号" prop="idNo">
                                            <el-input v-model="temp.idNo" :maxlength="18"
                                                      placeholder="请输入身份证号" v-on:blur="changeInNo()"></el-input>
                                        </el-form-item>
                                        <el-form-item label="年龄" prop="age">
                                            <el-input v-model="temp.age" :maxlength="3"
                                                      disabled></el-input>
                                        </el-form-item>

                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="temp.email" type="email"
                                                      placeholder="请输入邮箱"></el-input>
                                        </el-form-item>
                                        <el-form-item label="备注" prop="remark">
                                            <el-input v-model="temp.remark"
                                                      placeholder="请输入备注"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="关联资源" name="second">
                                <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                                    <el-table-column prop="tenantName" label="所属组织">
                                    </el-table-column>
                                    <el-table-column prop="resourceTypeName" label="资源类型">
                                    </el-table-column>
                                    <el-table-column prop="name" label="资源名称">
                                    </el-table-column>
                                    <!-- <el-table-column prop="code" label="资源编码">
                                     </el-table-column-->>
                                    <el-table-column prop="parentName" label="上级资源">
                                    </el-table-column>
                                    <el-table-column prop="enabledFlag" label="是否启用">
                                        <template scope="scope">
                                            <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                                        </template>
                                    </el-table-column>
                                    <!--  <el-table-column prop="remark" label="备注">
                                      </el-table-column>-->
                                    <el-table-column prop="identityName" label="身份">
                                    </el-table-column>
                                    <el-table-column prop="isManager" label="主成员">
                                        <template scope="scope">
                                            <span>{{ judgeManager[scope.row.isManager]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="infoSourceName" label="信息来源">
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
                                <pagination ref="viewResourcePages" :total="viewResourceRowTotal"
                                            v-on:pageChange="handleViewResourceChange"
                                            v-if="resourcePaginationShowEdit"></pagination>
                            </el-tab-pane>
                            <el-tab-pane label="关联场景" name="third">
                                <el-table :data="tableDataSence" border stripe style="width: 100%" class="blue-table">
                                    <el-table-column prop="sceneName" label="场景名称">
                                    </el-table-column>
                                    <el-table-column prop="associateRef" label="关联场景类型">
                                    </el-table-column>
                                    <el-table-column prop="type" label="操作" align="center" width="80">
                                        <template scope="scope">
                                            <el-button type="default" title="删除" class="icon-btn delete"
                                                       @click="onSenceDelete(scope.row)" size="small"
                                                       :disabled="(scope.row.canDelete === 0)">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-delete1"></use>
                                                </svg>
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination ref="viewScenePages" :total="viewSceneRowTotal"
                                            v-on:pageChange="handleViewSceneChange"
                                            v-if="scenePaginationShowEdit"></pagination>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="handleCancel" class="cancel">取 消</el-button>
                        <el-button class="update" type="primary"
                                   @keyup.enter="update('form')"
                                   @click="update('form')"
                                   :loading="$store.state.app.onXHR">
                            确 定
                        </el-button>
                    </div>
                </el-dialog>


                <el-dialog title="原图查看" :visible.sync="picVisible"
                           @close="closeViewPicture()" class="dialogFormWidth800Height600">
                    <div style="display:flex;align-items: center;justify-content: center;height: 500px">
                        <img id="pic" src=""/>
                    </div>
                </el-dialog>

                <!--      <el-dialog class="dialogForm" title="选择新增人员身份" :visible.sync="dialogChooseIdentity"
                                 @close="closeDialogChooseIdentity()">
                          <div class="dialogFormBox">
                              <el-form class="small-space" label-position="left" label-width="100px"
                                       style='width: 400px; margin-left:50px;'
                                       :model="identity"
                                       ref="form"
                                       >
                                  <el-form-item label="身份" prop="identity">
                                      <el-select v-model="identity" placeholder="请选择">
                                          <el-option
                                                  v-for="item in identityList"
                                                  :key="item.value"
                                                  :label="item.name"
                                                  :value="item">
                                          </el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-form>
                          </div>
                          <div slot="footer" class="dialog-footer">
                              <el-button @click="previous" class="cancel">上一步</el-button>
                              <el-button  type="primary" class="confirm,"
                                         @keyup.enter="nextStep"
                                         @click="nextStep"
                                         :loading="$store.state.app.onXHR">
                                  下一步
                              </el-button>
                          </div>
                      </el-dialog>-->


                <!--筛选区-->
                <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                    <el-form v-model="pageParam" labelPosition="">

                        <!--<el-form-item label="选择社区" prop="tenants">
                          &lt;!&ndash;  <el-select v-model="pageParam.organizationId" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.orgId"
                                        :label="item.orgName"
                                        :value="item.orgId">
                                </el-option>
                            </el-select>&ndash;&gt;
                            <el-input v-model="resourceName" placeholder="选择社区" :readonly="true" @focus="showParentTree"></el-input>
                            <template v-if="parentTree">
                                <div style="position: absolute;width: 100%;height: 200px;z-index:999;overflow:auto;background-color: white;">
                                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px;"> </el-input>
                                    <button style="cursor: pointer;" class="btn btn-default" @click="parentTree=false">关闭</button>
                                    <el-tree class="communityTreeFY"
                                             ref="tenantTree"
                                             :data="tenantTreeDate"
                                             :props="tenantProps"
                                             @node-click="tenantNodeClick"
                                             :filter-node-method="filterTenantNode"
                                    >
                                    </el-tree>
                                </div>
                            </template>
                        </el-form-item>-->

                        <el-form-item label="姓名" prop="realName">
                            <el-input v-model="pageParam.realName"
                                      placeholder="请输入姓名"></el-input>
                        </el-form-item>

                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="pageParam.mobilePhone" type="number"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>

                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="pageParam.gender" placeholder="请选择">
                                <el-option
                                        v-for="item in genders"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <!--<el-form-item label="审核状态" prop="gender">
                            <el-select v-model="pageParam.isApproval" placeholder="请选择">
                                <el-option
                                        v-for="item in auditFlagInfo"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>-->

                        <!--  <el-form-item label="邮箱" prop="email">
                              <el-input v-model="pageParam.email"
                                        placeholder="请输入邮箱"></el-input>
                          </el-form-item>-->

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
                <!--dialog查看资源-->
                <el-dialog class="dialogForm" title="查看关系" :visible.sync="relationshipDetailVisiable"
                           @close="closeRelationshipDetailDetailForm()">
                    <el-table :data="relationshipDetail" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="humanName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="relationshipName" label="与业主关系">
                        </el-table-column>

                    </el-table>

                </el-dialog>
                <el-dialog class="dialogForm" title="查看资源" :visible.sync="dialogResourceDetail"
                           @close="closeDetailForm()">
                    <el-table :data="tableDataDetail" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="tenantName" label="所属组织">
                        </el-table-column>
                        <el-table-column prop="resourceTypeName" label="资源类型">
                        </el-table-column>
                        <el-table-column prop="name" label="资源名称">
                        </el-table-column>
                        <el-table-column prop="code" label="资源编码">
                        </el-table-column>
                        <el-table-column prop="parentName" label="上级资源">
                        </el-table-column>
                        <!--<el-table-column prop="displayIndex" label="显示顺序">
                        </el-table-column>
                        <el-table-column prop="leftValue" label="左值">
                        </el-table-column>
                        <el-table-column prop="rightValue" label="右值">
                        </el-table-column>
                        <el-table-column prop="lvl" label="层级">
                        </el-table-column>-->
                        <el-table-column prop="enabledFlag" label="是否启用">
                            <template scope="scope">
                                <span>{{ enabledFlags[scope.row.enabledFlag]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
                        <el-table-column prop="identityName" label="身份">
                        </el-table-column>
                        <el-table-column prop="isManager" label="主成员">
                            <template scope="scope">
                                <span>{{ judgeManager[scope.row.isManager]}}</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column prop="incumbencyOrNot" label="在职状态" >
                            <template scope="scope">
                                <span>{{ judgeIncumbencyOrNot[scope.row.incumbencyOrNot]}}</span>
                            </template>
                        </el-table-column>-->
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
                <el-dialog class="dialogForm" title="关联资源" :visible.sync="dialogAddData" @close="closeDetailForm()">
                    <!--<el-table :data="tableDataAdd" border stripe style="width: 100%" class="blue-table"
                              @selection-change="handleSelectionChangeResource">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="resourceTypeName" label="资源类型">
                        </el-table-column>
                        <el-table-column prop="name" label="资源名称">
                        </el-table-column>
                        <el-table-column prop="code" label="资源编码">
                        </el-table-column>
                        <el-table-column prop="parentName" label="上级资源">
                        </el-table-column>
                        &lt;!&ndash;<el-table-column prop="displayIndex" label="显示顺序">
                        </el-table-column>
                        <el-table-column prop="leftValue" label="左值">
                        </el-table-column>
                        <el-table-column prop="rightValue" label="右值">
                        </el-table-column>
                        <el-table-column prop="lvl" label="层级">
                        </el-table-column>&ndash;&gt;

                    </el-table>-->
                    <div class="dialogFormBox">
                        <el-form class="small-space" label-position="left" label-width="100px"
                                 style='width: 400px; margin-left:50px;'>
                            <div style="display: flex;align-items: center;justify-content: space-between">
                                <div style="color: red;height: 40px">*&nbsp;</div>
                                <div>
                                    <el-form-item label="身份">
                                        <el-select v-if="!isOrg" v-model="identity" placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option
                                                    v-for="item in identityList"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                        <el-select v-if="isOrg" v-model="identity" placeholder="请选择"
                                                   style="width: 90px">
                                            <el-option-group
                                                    v-for="group in optionsArray"
                                                    :key="group.label"
                                                    :label="group.label">
                                                <el-option
                                                        v-for="item in group.options"
                                                        :key="item.value"
                                                        :label="item.name"
                                                        :value="item">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div style="width: 200px"></div>
                                <el-form-item label="主成员" prop="isMember">
                                    <el-select v-model="isMemberFlag" placeholder="请选择" style="width: 75px">
                                        <el-option
                                                v-for="item in isMemberList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <div style="max-height: 500px;overflow: auto">
                       <!-- <el-tree class="communityTreeFY"
                                 ref="associate"
                                 :data="treeData1"
                                 :props="props"
                                 show-checkbox
                                 :default-checked-keys="ckeckedData"
                                 check-strictly
                                 node-key="id"
                                 @check-change="handleCheckChange">
                        </el-tree>-->
                        <el-tree
                                class="communityTreeFY"
                                ref="associate"
                                :props="props1"
                                :load="loadNode3"
                                @check-change="handleCheckChange"
                                lazy
                                :data="treeData1"
                                show-checkbox
                                :default-checked-keys="ckeckedData"
                                check-strictly
                                node-key="id"
                        >
                        </el-tree>
                    </div>

                    <!--el-button class="btn btn-add" type="primary" @click="onBatchAdd()"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        关联
                    </el-button>-->

                    <el-button class="btn btn-add" type="primary" @click="onBatchAdd()"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        批量关联
                    </el-button>
                </el-dialog>

                <!--dialog查看场景-->
                <el-dialog class="dialogForm" title="查看场景" :visible.sync="dialogSenceDetail" @close="closeDetailForm()">
                    <el-table :data="tableDataSence" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="sceneName" label="场景名称">
                        </el-table-column>
                        <el-table-column prop="associateRef" label="关联场景类型">
                        </el-table-column>
                        <el-table-column prop="type" label="操作" align="center" width="130">
                            <template scope="scope">
                                <el-button type="default" title="删除" class="icon-btn delete"
                                           @click="onSenceDelete(scope.row)" size="small"
                                           :disabled="(scope.row.canDelete === 0)">
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
                           v-if="dialogAddHumanSenctData"
                           @close="closeDetailForm()">
                    <el-table :data="tableDataAddSence" border stripe style="width: 100%" class="blue-table"
                              @selection-change="handleSelectionChangeScene">
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

                <el-dialog class="dialogForm" title="上传图片" :visible.sync="dialogImg" @close="closeDetailForm()">

                    <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :data="upLoadData"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :auto-upload="false"
                            :on-change="changeFeature">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                    <template v-if="img_loading">
                        <div class="add_img_list">
                            <p class="map_loading">图片上传中</p>
                        </div>
                    </template>
                </el-dialog>
                <!--dialog批量导入-->
                <el-dialog class="dialogForm" title="导入社区Excel" :visible.sync="dialogBatchImport"
                           @close="closeDetailForm()">
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

                <!--dialog批量导入-->
                <el-dialog class="dialogForm" title="导入企业Excel" :visible.sync="dialogBatchImportEntrepreneur"
                           @close="closeDetailForm()">
                    <el-upload
                            name="file"
                            class="avatar-uploader"
                            :headers="headers"
                            :action="importExcelEntrepreneur()"
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

                <!--dialog查看批量导入失败行数-->
                <el-dialog class="dialogForm" title="批量导入失败信息" :visible.sync="dialogImportFail"
                           @close="closeBatchImportPane()">
                    <el-table :data="dataImportFail" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="message" label="批量导入失败信息">
                        </el-table-column>
                    </el-table>
                </el-dialog>


                <el-dialog class="dialogForm" title="关联小区" :visible.sync="resourceLvl0Table"
                           @close="closeResourceLvl0Table()">
                    <el-table :data="resourcelvl0" border stripe style="width: 100%" class="blue-table"
                              @selection-change="handleSelectionChangeResourceLvl0">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <!--<el-table-column prop="resourceTypeName" label="资源类型">-->
                        <!--</el-table-column>-->
                        <el-table-column prop="name" label="资源名称">
                        </el-table-column>
                        <!--<el-table-column prop="orgName" label="组织名称">
                        </el-table-column>-->
                        <!--<el-table-column prop="parentName" label="上级资源">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column prop="displayIndex" label="显示顺序">
                        </el-table-column>
                        <el-table-column prop="leftValue" label="左值">
                        </el-table-column>
                        <el-table-column prop="rightValue" label="右值">
                        </el-table-column>
                        <el-table-column prop="lvl" label="层级">
                        </el-table-column>-->

                    </el-table>
                    <el-button type="primary" class="update"
                               @click="back()">
                        上一步
                    </el-button>
                    <el-button class="btn btn-add" type="primary" @click="onBatchAddResourceLvl0()"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        关联
                    </el-button>
                </el-dialog>

                <!--croperDialog截取图片-->
                <el-dialog class="dialogCropperForm" title="头像" :visible.sync="dialogCropperFormVisible"
                           v-if="dialogCropperFormVisible"
                           @open="initCropper()" @close="closeCropper()">
                    <div style="display:flex;" v-if="dialogCropperFormVisible">
                        <div class="info-item" style="flex:1;margin-left:-160px;margin-top:30px;">
                            <div class="line" style="margin-left: -280px;margin-top: 85px;">
                                <div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
                                    <div class="cropper">
                                        <vueCropper
                                                ref="cropper"
                                                :img="option.img"
                                                :outputSize="option.size"
                                                :outputType="option.outputType"
                                                :info="option.info"
                                                :full="option.full"
                                                :canMove="option.canMove"
                                                :canMoveBox="option.canMoveBox"
                                                :original="option.original"
                                                :autoCrop="option.autoCrop"
                                                :autoCropWidth="option.autoCropWidth"
                                                :autoCropHeight="option.autoCropHeight"
                                                :fixedBox="option.fixedBox"
                                                @realTime="realTime"
                                                @imgLoad="imgLoad"
                                        ></vueCropper>
                                    </div>
                                    <div style="margin-left:20px;">
                                        <div class="show-preview"
                                             :style="{'width': '238px', 'height':'238px',  'overflow': 'hidden', 'margin': '5px'}">
                                            <div :style="previews.div" class="preview">
                                                <img :src="previews.url" :style="previews.img"
                                                     v-if="dialogCropperFormVisible">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 1000px;padding: 10px 40px 5px 300px">
                                <label class="btn btn-orange" for="uploads"
                                       style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;background-color: #4D84BA;color:white;cursor: pointer;">选择图片</label>
                                <input type="file" id="uploads" :value="imgFile"
                                       style="position:absolute; clip:rect(0 0 0 0);"
                                       accept="image/png, image/jpeg, image/gif, image/jpg"
                                       @change="uploadImg($event, 1)"/>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;"
                                        @click="changeScale(1)">放大
                                </button>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;"
                                        @click="changeScale(-1)">缩小
                                </button>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;"
                                        @click="rotateLeft">左旋转
                                </button>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;"
                                        @click="rotateRight">右旋转
                                </button>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;"
                                        @click="down('blob')">下载
                                </button>
                                <button class="btn btn-orange"
                                        style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;background-color: #4D84BA;color:white;cursor: pointer;"
                                        @click="finish('base64')">确定
                                </button>
                            </div>
                        </div>
                    </div>
                </el-dialog>

                <el-dialog class="dialogForm" title="批量导入" :visible.sync="buttonPane"
                           @close="closeButtonPane()">
                    <div style="height: 20px;"></div>
                    请下载相应的导入模板，正确填写模板信息并上传，即可完成导入
                    <div style="height: 40px;"></div>
                    <div style="display: flex;justify-content: center">
                        <!--   <el-button class="btn btn-add" type="primary" @click="downTemplate" v-authority="'Human.Import'"
                                      style="width: 150px;">
                               &lt;!&ndash;<svg class="icon icon-add1" aria-hidden="true">
                                   <use xlink:href="#icon-add1"></use>
                               </svg>&ndash;&gt;
                               社区人员导入模板下载
                           </el-button>
                           <div style="width: 50px"></div>
                           <el-button class="btn btn-add" type="primary" @click="onBatchImport" v-authority="'Human.Import'"
                                      style="width: 150px;">
                               &lt;!&ndash;<svg class="icon icon-add1" aria-hidden="true">
                                   <use xlink:href="#icon-add1"></use>
                               </svg>&ndash;&gt;
                               批量导入社区人员
                           </el-button>-->
                        <el-dropdown @command="handleCommand1">
                            <el-button type="primary">
                                下载模板<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a" v-authority="'Human.Import'">下载社区模板</el-dropdown-item>
                                <el-dropdown-item command="b" v-authority="'Human.ImportEntrepreneur'">下载企业模板</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div style="width: 80px"></div>
                        <el-dropdown @command="handleCommand2">
                            <el-button type="primary">
                                上传导入<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="c" v-authority="'Human.Import'">导入社区人员</el-dropdown-item>
                                <el-dropdown-item command="d" v-authority="'Human.ImportEntrepreneur'">导入企业人员</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <!--  <div style="height: 15px"></div>
                      <div style="display: flex;justify-content: center">
                          <el-button class="btn btn-add" type="primary" @click="downTemplateEntrepreneur"
                                     v-authority="'Human.ImportEntrepreneur'"
                                     style="width: 150px;">
                              &lt;!&ndash;<svg class="icon icon-add1" aria-hidden="true">
                                  <use xlink:href="#icon-add1"></use>
                              </svg>&ndash;&gt;
                              企业人员导入模板下载
                          </el-button>
                          <div style="width: 50px"></div>
                          <el-button class="btn btn-add" type="primary" @click="onBatchImportEntrepreneur"
                                     v-authority="'Human.ImportEntrepreneur'"
                                     style="width: 150px;">
                              &lt;!&ndash;<svg class="icon icon-add1" aria-hidden="true">
                                  <use xlink:href="#icon-add1"></use>
                              </svg>&ndash;&gt;
                              批量导入企业人员
                          </el-button>
                      </div>-->
                    <div style="height: 50px"></div>
                </el-dialog>
            </div>
        </el-col>
    </el-row>
</template>
<script src="./Human.js"></script>
<!--<script src="./iconfont.js"></script>-->
<style>
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

</style>
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
        height: 600px;
        width: 800px;
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

    .dialogCropperForm .el-dialog {
        width: 1000px;
        height: 500px;
        margin-bottom: 0;
        top: 50% !important;
        left: 35% !important;
        margin-top: -290px;
        margin-left: -300px;
        -webkit-transform: translateX(0);
        -moz-transform: translateX(0);
        -ms-transform: translateX(0);
        transform: translateX(0);
        // height: 550px;
    }

    .info-item {
        margin-top: 15px;
    }

    /*label {*/
    /*display: inline-block;*/
    /*width: 100px;*/
    /*text-align: right;*/
    /*}*/
    .cropper-content {
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
    }

    .cropper {
        width: 600px;
        height: 400px;
        margin-top: -80px;
    }

    .show-preview {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
    }

    .preview {
        overflow: hidden;
        /*border-radius: 50%;*/
        border: 1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
    }

    .cropper-content .show-preview .preview {
        margin-left: 0;
    }

    .iconOut {
        width: 22px;
        height: 22px;
        vertical-align: -2px;
        padding-top: 17%;
        fill: #8ab4da;
        overflow: hidden;
    }
</style>

