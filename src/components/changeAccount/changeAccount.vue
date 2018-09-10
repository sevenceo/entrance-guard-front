<template>
    <div class="heightAuto">
        <!--内容区-->
            <el-row :gutter="20" class="heightAuto">
                <el-col :span="8" class="heightAuto" v-if="$store.state.weChatAccount.isParent">
                    <div class="treeChange">
                        <h5>☆ 所属组织机构：</h5>
                        <tree
                        :data="structrueData"
                        :current-node-key="curNodeKey"
                        :default-expanded-keys="defExpKeys"
                        :auto-expand-parent=true
                        :expand-on-click-node=false
                        lazy
                        accordion
                        node-key="id"
                        ref="tree"
                        :load="loadNode"
                        highlight-current
                        @node-click="handleNodeClick"
                        :render-content="renderContent">
                        </tree>
                    </div>
                </el-col>
                <el-col :span="(!$store.state.weChatAccount.isParent)?24:16">
                    <div class="treeForAccont">
                        <h5>☆ 可使用公众号:</h5><a v-if="isLogin" class="resetLogin" @click="getBackLogin()" href="javascript:;">返回登录</a>
                        <el-table
                        :data="formData"
                        border
                        style="width: 100%;">
                            <el-table-column
                              prop="headImgUrl"
                              label="公众号头像"
                              width="120px">
                                <template scope="scope">
                                    <img :src="scope.row.headImgUrl" onerror="this.onerror=null;this.src='static/img/replace.png'" class="head-img">
                                    <!--<span>{{scope.row.headImgUrl}}</span>-->
                                </template>
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="公众号名称"
                              width="">
                            </el-table-column>
                            <el-table-column
                              label="操作"
                              width="80px">
                              <template scope="scope">
                                <el-button type="text" size="small" @click="setAccount(scope.$index,scope.row)">
                                    选择
                                </el-button>
                              </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    
                </el-col>
            </el-row>
            <!--分页-->
            <!-- <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination> -->
    </div>
</template>

<script src="./changeAccount.js"></script>
<style scoped src="./changeAccount.scss"></style>
