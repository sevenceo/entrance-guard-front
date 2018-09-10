<template>
    <div>
        <div id="codeInfo" class="child-code">
            <div class="flex">
                <div style="width: 30%" class="flex">

                    <div class="code-list">
                        <el-table :data="temp.jsonDataDetail.qrDTOS" ref="codeTable" border
                                  style="width: 210px;height: 450px;"
                                  class="blue-table" highlight-current-row @cell-click="getCurrentCell">

                            <el-table-column label="二维码列表">
                                <template scope="scope">
                                <span style="display:block;width: 100%;height: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="scope.row.qrCodeName" @click=handleRow(scope.$index)>
                                    {{ scope.row.qrCodeName }}
                                </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="code-edit-bar" v-if="isShowEdit === '02'&& activityActionType !=='查看'">
                        <ul>
                            <li>
                                <el-button type="default" class="icon-btn edit" title="新增" size="small"
                                           @click="onAddQrCode">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-add1"></use>
                                    </svg>
                                </el-button>
                            </li>
                            <li>
                                <el-button type="default" class="icon-btn edit" title="编辑" size="small"
                                           @click="onEditQrCode">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-edit1"></use>
                                    </svg>
                                </el-button>
                            </li>
                            <li>
                                <el-button type="default" class="icon-btn edit" @click="onDelete" title="删除"
                                           size="small">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-delete1"></use>
                                    </svg>
                                </el-button>
                            </li>
                        </ul>
                    </div>
                    <div class="qr-code-container" v-if="isShowEdit ==='02' || isShowEdit ==='03'">
                        <div>

                            <img :src="qrCode.qrUrl" alt="" v-if="qrCode.qrUrl !=''">

                            <img src="~assets/replace.png" alt="" v-else>
                            <p v-if=" qrCode.scene!==''">场景值：<span>{{qrCode.scene}}</span></p>
                            <p v-else>场景值：<span>等待创建</span></p>
                        </div>
                    </div>
                </div>

                <el-dialog :visible.sync="qrCodeFormVisible" class="dialogForm" :show-close="false" :modal="false"
                           @close="resetCodeForm">
                    <el-form ref="addForm" labelWidth="120px" :rules="rules">
                        <el-form-item label="活动二维码名称">
                            <el-input v-model="qrCodeName" style="ime-mode:disabled" :maxlength='32'
                                      placeholder="请输入二维码名称"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="btn btn-reset reset" type="default" @click="qrCodeFormVisible = false">
                            取消
                        </el-button>

                        <el-button class="btn btn-edit search" @click="confirmQrCode" type="default">
                            确定
                        </el-button>

                    </div>
                </el-dialog>

                <div style="width: 70%;" >
                    <router-view ref="codeChild"></router-view>
                </div>

            </div>
        </div>
    </div>
</template>

<script src="./qrCodeInfo.js">

</script>

<style scoped>

</style>