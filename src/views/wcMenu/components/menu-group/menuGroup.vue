<template>
    <div class="menuGroup">
        <div v-for="(button, index) in menuData"
             class="menu child"
             :class="{parent: button.buttonType ==='navigation',enable: button.text}"
             @click="handleButtonClick(button,index,button.buttonType)"
        >{{button.text ? button.text : "点击设置"}}
        </div>
        <!--<div class="menu parent enable" ">{{menuGroup01.subButton.text}}</div>-->
        <el-dialog class="dialogForm"
                   :title="textMap[dialogStatus]"
                   :visible.sync="dialogFormVisible"
                   @close="resetForm"
        >
            <div class="dialogFormBox">
                <el-form class="small-space" :model="temp" label-position="right" label-width="80px" ref="temp" :rules="rules"
                         style='width: 400px; margin-left:50px;'>
                    <el-form-item label="按钮名称" prop="text">
                        <el-input v-model="temp.text" placeholder="请输入名称"></el-input>
                    </el-form-item>

                    <el-form-item label="按钮类型">
                        <el-select v-if="temp.index == '5'" class="filter-item" v-model="temp.buttonType" placeholder="请选择">
                            <el-option v-for="item in  allBtnTypeOpt" :key="item.value" :value="item.value"
                                       :label="item.label">
                            </el-option>
                        </el-select>
                        <el-select v-else class="filter-item" v-model="temp.buttonType" placeholder="请选择">
                            <el-option v-for="item in  nomalBtnOpt" :key="item.value" :value="item.value"
                                       :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-show="temp.buttonType == 'view'" label="跳转方式">
                        <el-select class="filter-item" v-model="temp.viewType" placeholder="请选择">
                            <el-option v-for="item in  jumpMode" :key="item.value" :value="item.value"
                                       :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="temp.buttonType == 'view'" label="跳转地址" prop="targetUrl">
                        <el-input v-model="temp.targetUrl" placeholder="请以http://或https://开头"></el-input>
                    </el-form-item>

                    <el-form-item v-show="temp.buttonType == 'click'" label="处理方式">
                        <el-select class="filter-item" v-model="temp.clickType" placeholder="请选择">
                            <el-option v-for="item in  eventMode" :key="item.value" :value="item.value"
                                       :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="temp.clickType == 'customevent' && temp.buttonType == 'click'" label="事件ID" prop="customEventKey">
                        <el-input v-model="temp.customEventKey" placeholder="请输入事件ID"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" :model="temp">
                <el-button @click="handleClean" v-show="temp.buttonType=='navigation'" class="cancel">清除本组数据</el-button>
                <el-button @click="handleChildrenClean" v-show="temp.buttonType !='navigation'" class="cancel">清除按钮数据</el-button>
                <el-button @click="handleClose('temp')" class="cancel">取 消</el-button>
                <!--<el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>-->
                <!--<el-button v-else type="primary" @click="update">确 定</el-button>-->
                <el-button type="primary" @click="update('temp')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script src="./menuGroup.js"></script>
<style scoped src="./menuGroup.scss"></style>