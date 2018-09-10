<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <div class="container">
            <div>
              <el-form label-position="right" :model="fansGroupData" ref="fansGroupData" :rules="rules" label-width="120px" >
                  <el-row :gutter="5">
                     <el-col :span="6">
                          <el-form-item  label="粉丝组名称" prop="name">
                              <el-input v-model="fansGroupData.name" style="ime-mode:disabled"></el-input>
                          </el-form-item>
                     </el-col>
                      <el-col :span="6">
                          <el-form-item  label="计算周期：" prop="runCycle">
                               <el-select class="filter-item" v-model="fansGroupData.runCycle">
                                   <el-option v-for="item in  runCycleOptions" :key="item.key" :label="item.label"
                                        :value="item.key">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                     </el-col>
                     <el-col :span="6">
                          <el-form-item label="状态：" prop="state">
                               <el-select class="filter-item" v-model="fansGroupData.state">
                                   <el-option v-for="item in  fansGroupStateOptions" :key="item.key" :label="item.label"
                                              :value="item.key">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                     </el-col>
                  </el-row>
              </el-form>
            </div>
            <div class="h100">
                <el-row class="tab-tags" :gutter="15">
                    <el-col class="h100 pt" :span="16">
                        <el-table
                            :data="chooseTags" class="h100 fixScroll"
                            style="width: 100%">
                            <el-table-column
                            prop="name"
                            align="left"
                            label="标签条件叠加">
                            </el-table-column>
                              <el-table-column align="right">
                                    <template scope="scope">
                                      <el-radio class="radio" v-model="scope.row.relation" label="and">and</el-radio>
                                      <el-radio class="radio" v-model="scope.row.relation" label="or">or</el-radio>
                                      <el-button
                                        size="small"
                                        class="tags-del"
                                        @click="handleDelChooseTags(scope.$index, scope.row)">删除</el-button>
                                    </template>
                              </el-table-column>
                        </el-table>
                        <div class="btn-tags" align="center">
                            <el-button title="添加标签" @click="showChooseTree()">
                                <svg class="icon icon-tag" aria-hidden="true">
                                    <use xlink:href="#icon-dabiaoqian"></use>
                                </svg>
                            </el-button>
                            <el-button title="清除标签" @click="clearChooseTags()">
                                <svg class="icon icon-tag" aria-hidden="true">
                                    <use xlink:href="#icon-yichubiaoqian"></use>
                                </svg>
                            </el-button>
                        </div>
                    </el-col>
                    <el-col class="h100 pt" :span="8">
                            <el-table class="h100 fixScroll" :data="excludeTags" style="width: 100%">
                                <el-table-column
                                    align="left"
                                    prop="name"
                                    label="排除标签"
                                   >
                                </el-table-column>
                                <el-table-column align="right">
                                    <template scope="scope">
                                        <el-button
                                        size="small"
                                        class="tags-del"
                                        @click="handleDelExcludeTags(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div class="btn-tags" align="center">
                                <el-button @click="showExcludeTree()">
                                    <svg class="icon icon-tag" aria-hidden="true">
                                        <use xlink:href="#icon-dabiaoqian"></use>
                                    </svg>
                                </el-button>
                                <el-button @click="clearExcludeTags()">
                                    <svg class="icon icon-tag" aria-hidden="true">
                                        <use xlink:href="#icon-yichubiaoqian"></use>
                                    </svg>
                                </el-button>
                            </div>
                    </el-col>
              </el-row>
          </div>
          <div class="tagSubmit">
              <el-row :gutter="10">
                <el-col :span="24">
                   <div align="center" class="div-top">
                        <el-button class="cancel" @click="goBackFansGroup()">
                            <svg class="icon icon-cancel" aria-hidden="true">
                                <use xlink:href="#icon-cancel1"></use>
                            </svg>
                        返回
                        </el-button>
                        <el-button type="primary" @click="save('fansGroupData')" class="update" v-show="status=='maintenance'">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-save1"></use>
                            </svg>
                            保存
                        </el-button>
                        <el-button type="primary" @click="save('fansGroupData')" class="update" v-show="status=='speed'">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-save1"></use>
                            </svg>
                            保存&计算
                        </el-button>
                    </div>
                </el-col>
             </el-row>
          </div>
        </div>
        
        <!--标签条件choose选择树-->
        <el-dialog class="dialogForm" title="选择标签" :visible.sync="chooseTreeVisible" @close="closeChooseTree" >
            <div class="dialogFormBox">
                <el-row :gutter="5">
                    <el-col :span="8">
                        <el-input
                          placeholder="输入关键字进行过滤"
                          v-model="filterChooseText"
                          icon="search"
                          size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="small" type="primary" @click='resetChooseTreeChecked()'>重选</el-button>
                    </el-col>
                   <el-col :span="14">
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="24">
                        <el-tree
                          :data="chooseTreeData"
                          show-checkbox
                          default-expand-all
                          node-key="id"
                          ref="chooseTree"
                          highlight-current
                          :props="defaultProps"
                          :default-checked-keys="chooseChecked"
                          :filter-node-method="filterNode">
                        </el-tree>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="confirm" @click="getChooseTreeCheckedNodes()" >确 定</el-button>
                <el-button @click="cancelChooseTree()" class="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--标签条件exculde选择树-->
        <el-dialog class="dialogForm" title="选择标签" :visible.sync="excludeTreeVisible" @close="closeExcludeTree" >
            <div class="dialogFormBox">
                <el-row :gutter="5">
                    <el-col :span="8">
                        <el-input
                          placeholder="输入关键字进行过滤"
                          v-model="filterExculdeText"
                          icon="search"
                          size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="small" type="primary" @click='resetExcludeTreeChecked()'>重选</el-button>
                    </el-col>
                   <el-col :span="14">
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="24">
                        <el-tree
                          :data="exculdeTreeData"
                          show-checkbox
                          default-expand-all
                          node-key="id"
                          ref="exculdeTree"
                          highlight-current
                          :props="defaultProps"
                          :default-checked-keys="exculdeChecked"
                          :filter-node-method="filterNode">
                        </el-tree>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="confirm" @click="getExcludeTreeCheckedNodes()">确 定</el-button>
                <el-button @click="cancelExcludeTree()" class="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script src="./fansgroupMaintenance.js"></script>
<style scoped src="./fansgroupMaintenance.scss"></style>