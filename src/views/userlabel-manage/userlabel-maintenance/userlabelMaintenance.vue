<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <div class="container">
            <div class="userlabel-content">
                <el-row class="h100" :gutter="1">
                    <el-col class="h100" :span="8">
                        <div  class="formBox">
                                <div class="div-margin">
                                    <el-button size="small" type="primary" @click='addTopTreeNode()' v-authority="'UserLabel.Maintenance'">添加节点</el-button>
                                </div>
                                <el-input class="gl-input"
                                  placeholder="输入关键字进行过滤"
                                  v-model="filterText">
                                </el-input>
                                <el-tree
                                  class="filter-tree userlabel-tree"
                                  :data="labelData"
                                  :props="defaultProps"
                                  @node-click="handleNodeClick"
                                  default-expand-all
                                  highlight-current
                                  node-key="id"
                                  :filter-node-method="filterNode"
                                  :render-content="renderContent"
                                  :expand-on-click-node="false"
                                  :current-node-key="'34293f4c-6020-4c0b-be13-ad3b13cf0971'"
                                  ref="tree">
                                </el-tree>
                        </div>
                    </el-col>
                    <el-col class="h100" :span="16" >
                        <div class="formBox">
                            <el-form class="small-space" :model="temp" :rules = "rules" ref="temp" label-position="top"   style='width: 650px; margin-left:50px;'>
                                <el-row :gutter="40">
                                   <el-col :span="10">
                                       <el-form-item class="formText" label="标签名称" prop="name">
                                           <el-input v-model="temp.name" placeholder="名称"></el-input>
                                       </el-form-item>
                                   </el-col>
                                   <el-col :span="10">
                                       <el-form-item label="状态">
                                            <el-select class="filter-item" v-model="temp.state">
                                                <el-option v-for="item in  tagStateOptions" :key="item.key" :label="item.label"
                                                           :value="item.key">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                   </el-col>
                                </el-row>
                                <el-row :gutter="40">
                                   <el-col :span="10">
                                        <el-form-item label="分类">
                                            <el-select class="filter-item" v-model="temp.type">
                                                <el-option v-for="item in  tagTypeOptions" :key="item.key" :label="item.label"
                                                           :value="item.label">
                                                </el-option>
                                            </el-select>
                                         </el-form-item>
                                   </el-col>
                                   <el-col :span="10">
                                        <el-form-item label="类型">
                                                <el-select class="filter-item" v-model="temp.category" @change="tagTypeChange">
                                                    <el-option v-for="item in  categoryOptions" :key="item.key" :label="item.label"
                                                               :value="item.key">
                                                    </el-option>
                                                </el-select>
                                             </el-form-item>
                                            </el-form-item>
                                       </el-col>
                                </el-row>
                                <el-row :gutter="40">
                                   <el-col :span="10">
                                        <el-form-item label="有效期起"  prop="validateStart">
                                              <el-date-picker
                                                    v-model="temp.validateStart"
                                                    type="date"
                                                    placeholder="选择有效开始日期"
                                                    >
                                              </el-date-picker>
                                        </el-form-item>
                                   </el-col>
                                   <el-col :span="10">
                                        <el-form-item label="有效期止"   prop="validateEnd">
                                              <el-date-picker
                                                    v-model="temp.validateEnd"
                                                    type="date"
                                                    placeholder="选择有效结束日期"
                                                    >
                                              </el-date-picker>
                                        </el-form-item>
                                   </el-col>
                                </el-row>
                                <div v-show="formVisible">
                                    <el-row :gutter="40">
                                       <el-col :span="10">
                                            <el-form-item label="运算周期">
                                                <el-select class="filter-item" v-model="temp.runCycle">
                                                    <el-option v-for="item in  runCycleOptions" :key="item.key" :label="item.label"
                                                               :value="item.key">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                       </el-col>
                                       <el-col :span="10">
                                       </el-col>
                                    </el-row>
                                    <el-row :gutter="1">
                                       <el-col :span="20">
                                            <el-form-item label="运算内容">
                                                 <el-input
                                                   type="textarea"
                                                   :rows="4"
                                                   placeholder="请输入内容"
                                                   v-model="temp.sqlStr">
                                                 </el-input>
                                             </el-form-item>
                                       </el-col>
                                    </el-row>
                                    <el-row :gutter="1">
                                       <el-col :span="20">
                                            <el-form-item label="运算说明">
                                                 <el-input
                                                   type="textarea"
                                                   :rows="4"
                                                   placeholder="请输入内容"
                                                   v-model="temp.comment">
                                                 </el-input>
                                             </el-form-item>
                                       </el-col>
                                    </el-row>
                                    <el-row :gutter="1">
                                       <el-col :span="16">
                                            <el-form-item label="">
                                                 <el-upload
                                                   class="upload-demo"
                                                   :action="upLoadApi"
                                                   :on-success="handleSuccess"
                                                   :on-error="handleError"
                                                   :file-list="fileList"
                                                   :on-preview="handlePreview"
                                                   :on-remove="handleRemove"
                                                   :before-upload = "beforeUpload"
                                                   :limit="1"
                                                   >
                                                    <el-button size="small" type="primary" :loading="uploadFileFlag">
                                                    <svg class="icon icon-add1" aria-hidden="true">
                                                        <use xlink:href="#icon-baocun"></use>
                                                    </svg>
                                                    上传附件
                                                    </el-button>
                                                   <span slot="tip" class="el-upload__tip">（附件的作用为：用于说明该标签产生的前因后果）</span>
                                                 </el-upload>
                                             </el-form-item>
                                       </el-col>
                                    </el-row>
                                </div>
                            </el-form>
                            <div align="center" class="div-top">
                                <el-button type="primary" @click="save('temp')" class="update" >确 定</el-button>
                                <el-button class="cancel" @click='goBackUserLabel()'>返回</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                
            </div>
        </div>
    </div>
</template>
<script src="./userlabelMaintenance.js"></script>
<style scoped src="./userlabelMaintenance.scss"></style>