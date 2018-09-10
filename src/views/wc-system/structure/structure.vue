<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>

        <div class="account-filter-container" v-authority="'SystemConfig.Company.Remove'">
            <el-button class="btn btn-delete" type="danger" @click="handleDelete">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                删除
            </el-button>
        </div>
        <tree
                :data="structrueData"
                :current-node-key="curNodeKey"
                :default-expanded-keys="defExpKeys"
                :auto-expand-parent=true
                :expand-on-click-node=false
                lazy
                node-key="id"
                ref="tree"
                :load="loadNode"
                highlight-current
                @node-click="handleNodeClick"
                @current-change="handleCurChange"
                :render-content="renderContent"
                style="margin-bottom: 20px"
        >
        </tree>

        <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="handleClose" >
            <template>
                <el-tabs v-model="activeName">
                  <el-tab-pane label="组织信息" name="basic">
                        <!--<editor :temp = "temp" :activeTypeOptions="activeTypeOptions" :pickerOptions0="pickerOptions0" ></editor>-->
                        <div class="dialogFormBox">
                            <el-form class="small-space" :model="temp" ref="temp" :rules="rules"  label-position="left" label-width="105px" style='width: 400px; margin-left:50px;'>
                                <el-form-item label="父级机构" >
                                    <el-input v-model="temp.father" :disabled="true" placeholder="父级机构"></el-input>
                                </el-form-item>
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="temp.name" placeholder="名称"></el-input>
                                </el-form-item>
                                <el-form-item label="联系地址" prop="address">
                                    <el-input v-model="temp.address" placeholder="联系地址"></el-input>
                                </el-form-item>
                                <el-form-item label="联系人" prop="linkMan">
                                    <el-input v-model="temp.linkMan" placeholder="联系人"></el-input>
                                </el-form-item>
                                <el-form-item label="电话" prop="tel">
                                    <el-input v-model="temp.tel" placeholder="电话"></el-input>
                                </el-form-item>
                                <el-form-item label="摘要" prop="bewrite">
                                    <el-input v-model="temp.bewrite" placeholder="请输入摘要"></el-input>
                                </el-form-item>
                                <el-form-item label="是否启用">
                                    <el-switch
                                            v-model="temp.enable"
                                            on-text=""
                                            off-text="">
                                    </el-switch>
                                </el-form-item>
                            </el-form>
                        </div>
                  </el-tab-pane>
                  <el-tab-pane label="扩展信息" name="extend">
                        <div class="dialogFormBox">
                            <el-form class="small-space" :model="extendTemp" ref="extendTemp"  :rules = 'extendTemprules'  label-position="left" label-width="105px" style='width: 400px; margin-left:50px;'>
                                <el-form-item label="组织类型"   prop="orgType">
                                    <el-select class="filter-item" v-model="extendTemp.orgType" placeholder="请选择">
                                        <el-option v-for="item in  orgTypeOptions" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="经销商CODE" prop="dealerCoder">
                                    <el-input v-model="extendTemp.dealerCoder" placeholder="经销商CODE"></el-input>
                                </el-form-item>
                                <el-form-item label="DOL" prop="dol">
                                    <el-input v-model="extendTemp.dol" placeholder="DOL"></el-input>
                                </el-form-item>
                                <el-form-item label="SAP" prop="sap">
                                    <el-input v-model="extendTemp.sap" placeholder="SAP"></el-input>
                                </el-form-item>
                                <el-form-item label="网开认定品牌" prop="netIndentifyBrand">
                                    <el-input v-model="extendTemp.netIndentifyBrand" placeholder="网开认定品牌"></el-input>
                                </el-form-item>
                                <el-form-item label="经销店性质" prop="agencyType">
                                    <el-input v-model="extendTemp.agencyType" placeholder="经销店性质"></el-input>
                                </el-form-item>
                                <el-form-item label="经销商简称" prop="agencyShortname">
                                    <el-input v-model="extendTemp.agencyShortname" placeholder="经销商简称"></el-input>
                                </el-form-item>
                                <el-form-item label="品牌"  prop="brands">
                                      <el-select v-model="selectedbrands" multiple placeholder="请选择">
                                        <el-option
                                          v-for="item in brands"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.id">
                                        </el-option>
                                      </el-select>
                                </el-form-item>
                                <el-form-item label="省" prop="provinceName">
                                   <el-select class="filter-item" v-model="selectedProvince"  @change="getCity">
                                       <el-option
                                               v-for="item in provinces"
                                               :label="item.name"
                                               :value="item.id"
                                               :key="item.id"
                                       >
                                       </el-option>
                                   </el-select>
                                </el-form-item>
                                <el-form-item label="市" prop="cityName" >
                                   <el-select class="filter-item" v-model="selectedCity" @change="getAreas" >
                                       <el-option
                                               v-for="item in citys"
                                               :label="item.name"
                                               :value="item.id"
                                               :key="item.id"
                                       >
                                       </el-option>
                                   </el-select>
                                </el-form-item>
                                <el-form-item label="区" prop="areasName">
                                   <el-select class="filter-item" v-model="selectedArea" @change="getAreasName" >
                                       <el-option
                                               v-for="item in areas"
                                               :label="item.name"
                                               :value="item.id"
                                               :key="item.id"
                                       >
                                       </el-option>
                                   </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                  </el-tab-pane>
                </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('temp')" class="cancel">取 消</el-button>
                <el-button v-if="dialogStatus === 'create' " type="primary" @click="create" >确 定</el-button>
                <el-button v-else  type="primary" @click="update" >确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="迁移确认" :visible.sync="deleteFormVisible">
            <h3 style="text-align: center">确认执行删除操作？</h3>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteFormVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" @click="confirmDelete()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script src="./structure.js">

</script>

<style scoped src="./structure.scss">

</style>