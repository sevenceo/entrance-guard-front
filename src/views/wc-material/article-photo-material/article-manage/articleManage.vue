<template>
    <div class="flex grow-app-main">
        <breadcrumb></breadcrumb>
        <div class="article-editor-container flex">
            <!--<button @click="getUEContent()">获取内容</button>-->

            <div class="editList-step" id="editList-step1" v-show="!isEdit">
                <div class="flex article-container">
                    <!-- <h3 class="listTitle">图文列表</h3> -->
                    <div style="position:relative;border:solid 1px #d5d5d5;height: 600px;">
                        <img style="position: absolute; width: 300px;z-index:9;" src="~assets/WeChatUIHeader.png" alt="">
                        <div class="article-section-container">
                            <div class="articleList">
                                
                                <div class="template-child" v-for="(x,index) in temp.newsItemList"
                                     :class="{'template-child-small': index!==0}"
                                     @click="handleSectionSelected(index)">
                                    <img class="thumb-img" border="0" :class="classImg+index"
                                         :src="baseUrl + x.localThumbUrl" alt="">
                                    <p class="thumb-title" :class="classTitle + index">{{x.title}}</p>
                                    <div class="icon-container delete-icon-container">
                                        <a class="icon-wrapper delete" @click="deleteTemplateSection(index, $event)">
                                            <svg class="icon icon-edit1" style="fill:#fff;" aria-hidden="true">
                                                <use xlink:href="#icon-delete1"></use>
                                            </svg>
                                        </a>
                                        <a class="icon-wrapper down" v-if=" index != temp.newsItemList.length - 1"
                                           @click="setDown(index,$event)">
                                            <svg class="icon icon-edit1" style="fill:#fff;" aria-hidden="true">
                                                <use xlink:href="#icon-xia-copy-copy"></use>
                                            </svg>
                                        </a>
                                        <a class="icon-wrapper up" v-if=" index != 0" @click="setUp(index, $event)">
                                            <svg class="icon icon-edit1" style="fill:#fff;margin-top: 12px;"
                                                 aria-hidden="true">
                                                <use xlink:href="#icon-shang-copy"></use>
                                            </svg>
                                        </a>
                                    </div>

                                </div>

                            </div>

                        <div class="plus-icon-container" @click="addSection">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </div>
                    <img style="position: absolute;bottom:0;width: 300px;z-index:99;" src="~assets/WeChatUIFooter.png" alt="">
                    </div>
                    
                    <div class="article-form-container">
                        <div class="wxap-editing-panel">
                            <el-form label-position="right"
                                     :model="temp"
                                     :rules="rules" ref="ruleForm"
                                     label-width="90px"
                            >
                                <el-form-item label="图文名称" prop="name">
                                    <el-input v-model.trim="temp.name" placeholder="不能超过64个字符"></el-input>
                                </el-form-item>

                                <el-form-item label="文章标题"
                                              :prop="'newsItemList['+ selectedTemplateIndex + '].title'"
                                              :rules="[
                                                  {required: true, message: '标题不能为空', trigger: 'blur',},
                                                  { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                                              ]"
                                >
                                    <el-input v-model.trim="temp.newsItemList[selectedTemplateIndex].title"
                                              placeholder="不能超过64个字符"></el-input>
                                </el-form-item>
                                <el-form-item label="素材封面">
                                    <div class="avatar-uploader" @click="onSelectCover">
                                        <!--<img v-if="temp.newsItemList[selectedTemplateIndex].localThumbUrl" :src="baseUrl + temp.newsItemList[selectedTemplateIndex].localThumbUrl" style="width: 100px;height: 100px;" class="avatar">-->

                                        <el-button class="btn-add"
                                                   v-if="temp.newsItemList[selectedTemplateIndex].localThumbUrl">已选择
                                        </el-button>
                                        <el-button class="btn-add" v-else>选择图片</el-button>

                                    </div>
                                </el-form-item>
                                <el-form-item label="文章作者">
                                    <el-input v-model.trim=" temp.newsItemList[selectedTemplateIndex].author"
                                              placeholder="非必填（不超过8个字符）"></el-input>
                                </el-form-item>
                                <el-form-item label="原文链接"
                                              :prop="'newsItemList['+ selectedTemplateIndex + '].contentSourceUrl'"
                                              :rules='srcRules'>
                                    <el-input v-model.trim=" temp.newsItemList[selectedTemplateIndex].contentSourceUrl"
                                              placeholder="请以http或者https开头"></el-input>
                                </el-form-item>
                                <el-form-item label="摘要信息"
                                              :prop="'newsItemList['+ selectedTemplateIndex + '].digest'"
                                              :rules="[
                                                  {required: true, message: '摘要不能为空', trigger: 'blur',},
                                                  { min: 2, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
                                              ]"
                                >
                                    <el-input type="textarea"
                                              v-model="temp.newsItemList[selectedTemplateIndex].digest"
                                              placeholder="不超过120个字符"></el-input>
                                </el-form-item>
                                <!--<el-form-item label="正文信息"-->
                                              <!--:prop="'newsItemList['+ selectedTemplateIndex + '].content'"-->
                                              <!--:rules="[-->
                                                  <!--{required: true, message: '正文不能为空'},-->
                                              <!--]"-->
                                <!--&gt;-->
                                <el-form-item label="正文信息">
                                    <!-- 编辑后在mainDef后添加class:mainEdit -->
                                    <div class="mainDef" @click="addMaterial">
                                        <span v-if="this.temp.newsItemList[this.selectedTemplateIndex].content == ''">
                                            <svg class="icon icon-add1" aria-hidden="true">
                                                <use xlink:href="#icon-add1"></use>
                                            </svg>
                                            添加
                                        </span>
                                        <span v-else>
                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                <use xlink:href="#icon-edit1"></use>
                                            </svg>
                                            编辑
                                        </span>
                                    </div>
                                </el-form-item>
                                <!--<el-form-item label="原文地址"></el-form-item>-->
                                <!--<el-form-item label="远程封面地址"></el-form-item>-->
                                <!--<el-form-item label="本地地址"></el-form-item>-->
                            </el-form>
                        </div>
                        <div class="btnList">
                            <!-- <el-button @click="getContent" style="margin-top:20px;">获取内容</el-button> -->
                            <el-button @click="createNews" :loading="$store.state.app.onXHR">
                                <svg class="icon icon-add1" aria-hidden="true">
                                    <use xlink:href="#icon-baocun1"></use>
                                </svg>
                                保存
                            </el-button>
                            <el-button class="btn-del" @click="goBacktoMaterial">
                                <svg class="icon icon-add1" aria-hidden="true">
                                    <use xlink:href="#icon-cancel1"></use>
                                </svg>
                                返回
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="editList-step2" class="flex editList-step" v-show="isEdit">
                <!-- 图文模板区域 -->
                <div class="mode-list">
                    <div class="tpl-box shrink0">
                        <ul class="material">

							<!--文字模板-->
                            <!--<li @click="handleMaterialClick($event)" class="tpl-container">-->
                                <!--<div class="js-tpl" style="padding: 10px;">-->


                                <!--</div>-->
                            <!--</li>-->

                            <!--JSON模板-->
                            <li v-for="(tpl, index) in tpls" class="tpl-container">
                                <tpl-deal @selectTpl="handleMaterialSelect" :key="tpl.id" :tpl="tpl"></tpl-deal>
                            </li>

                            

                        </ul>
                    </div>
                    <div class="mode-group">
                        <a v-for="tag in tags.list" href="javascript:;"
                           :class="{active:tags.active === tag.tag}"
                           @click="tags.active = tag.tag"
                        >{{tag.name}}</a>
                        <!--<a href="javascript:;">标题</a>-->
                        <!--<a href="javascript:;">单图</a>-->
                        <!--<a href="javascript:;">多图</a>-->
                    </div>
                </div>

                <div class="wxap-panel-container">
                    <ul class="wxap-layer"
                        :class="{'group-empty': items.length == 0}">
                        <div class="group-sortable-box" v-for="(item, index) in items">
                            <editiong-content v-model="item.html" :index=index
                                              @focus="handleTplFocus">
                            </editiong-content>
                        </div>

                        <div class="op-dock flex" v-show="focusEle.onFocus" :style="{top:opDockTop - 120 + 'px'}">
                            <transition name="left-in">
                                <div class="op-dock-bar" v-show="focusEle.onFocus">
                                    <el-button class="op-btn" type="text" @click="handleDelete">
                                        <svg class="icon icon-add1" aria-hidden="true">
                                            <use xlink:href="#icon-shanchu"></use>
                                        </svg>
                                    </el-button>
                                    <span class="op-btn-group" v-show="bgEle.show">
                                        <el-color-picker v-model="bgEle.color" v-show="bgEle.show" title="背景颜色"></el-color-picker>
                                    </span>
                                </div>
                            </transition>
                            <transition name="left-in">
                                <div class="op-dock-bar" v-show="focusEle.onFocus && (showFullText || showImage || showVideo)"
                                     id="op-text">
                                    <el-select v-model="fontSize.value" placeholder="请选择"
                                               size="mini"
                                               class="font-select"
                                               v-show="showFullText"
                                               @change="handleFontChange"
                                    >
                                        <el-option
                                                v-for="opt in fontSize.options"
                                                :key="opt.value"
                                                :label="opt.label"
                                                :value="opt.value">
                                        </el-option>
                                    </el-select>
                                    <span class="op-btn-group" v-show="showFullText">
                                        <el-color-picker v-model="pickColor" title="字体颜色"></el-color-picker>
                                        <el-color-picker v-model="backColor" title="字背景色"></el-color-picker>
                                    </span>
                                    <span class="op-btn-group" v-show="showFullText">
                                        <el-button class="op-btn" id="bold-btn" type="text" @click="textCommd('bold')">
                                            <strong>B</strong>
                                        </el-button>
                                        <el-button class="op-btn" id="italic-btn" type="text"
                                                   @click="textCommd('italic')"
                                                   style="font-style:italic">
                                            <strong>I</strong>
                                        </el-button>
                                        <el-button class="op-btn" id="underline-btn" type="text"
                                                   @click="textCommd('underline')"
                                                   style="text-decoration: underline;">
                                            <strong>U</strong>
                                        </el-button>
                                        <el-button class="op-btn" id="strikethrough-btn" type="text"
                                                   @click="textCommd('strikethrough')"
                                                   style="text-decoration: line-through;">
                                            <strong>AB</strong>
                                        </el-button>
                                    </span>
                                    <span class="op-btn-group" v-show="showFullText">
                                        <el-button class="op-btn" id="left-btn" :class="{active:justify === 'left'}"
                                                   type="text" @click="textMutilCommd('justify','left')">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-zuoduiqi"></use>
                                            </svg>
                                        </el-button>
                                        <el-button class="op-btn" id="right-btn" :class="{active:justify === 'center'}"
                                                   type="text" @click="textMutilCommd('justify','center')">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-juzhong"></use>
                                            </svg>
                                        </el-button>
                                        <el-button class="op-btn" id="center-btn" :class="{active:justify === 'right'}"
                                                   type="text" @click="textMutilCommd('justify','right')">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-youduiqi"></use>
                                            </svg>
                                        </el-button>
                                        <el-button class="op-btn" :class="{active:justify === 'justify'}" type="text"
                                                   @click="textMutilCommd('justify','justify')">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-liangduanduiqi"></use>
                                            </svg>
                                        </el-button>
                                    </span>

                                    <el-button
                                            v-show="showImage"
                                            class="op-btn first" type="text"
                                            @click="onChangePhoto">
                                        换图
                                    </el-button>
                                    <el-dropdown v-show="showImage">
                                        <span class="el-dropdown-link">
                                            宽度
                                            <el-input size="mini" class="numInput" v-model="imageWidth"></el-input>
                                            %
                                            <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                                        </span>
                                        <div slot="dropdown"></div>
                                        <!--<el-dropdown-menu slot="dropdown">-->
                                            <!--<el-slider-->
                                                    <!--v-model="imageWidth"-->
                                                    <!--vertical-->
                                                    <!--height="200px">-->
                                            <!--</el-slider>-->
                                        <!--</el-dropdown-menu>-->
                                    </el-dropdown>
                                    <span v-show="showImage"
                                          @click="handlebordDropDown"
                                          class="op-custom-btn"
                                    >
                                        <span class="el-dropdown-link">
                                            边框
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>

                                        <div v-show="border.show" class="dock-dropdown" @click="$event.stopPropagation()">
                                            <el-form :label-position="'left'">
                                                <el-form-item label="边框样式">
                                                    <el-select v-model="border.style" placeholder="请选择"
                                                               size="mini"
                                                               class="border-select"
                                                               @change="handleBoderStyleChange"
                                                    >
                                                        <el-option
                                                                v-for="opt in border.options.style"
                                                                :key="opt.value"
                                                                :label="opt.label"
                                                                :value="opt.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="边框宽度">
                                                    <el-input size="mini" class="border-width-input" v-model="border.width"></el-input>
                                                    <span>px</span>
                                                </el-form-item>
                                                <el-form-item label="边框颜色">
                                                    <el-color-picker v-model="border.color" title="边框颜色"></el-color-picker>
                                                </el-form-item>
                                            </el-form>


                                        </div>
                                    </span>
                                    <span class="op-btn-group no-bord" v-show="showVideo">
                                        <span style="padding-left: 10px">通用代码</span>
                                        <el-input v-model="videoCode"
                                                  placeholder="请输入通用视频代码"
                                                  style="width: 10rem"
                                                  @change="handleVideoCodeChange"
                                        ></el-input>
                                    </span>

                                </div>
                            </transition>

                        </div>

                        <div class="box-lines" :style="{ top: focusBox.top + 'px', left: focusBox.left + 'px' }">
                            <span class="bar line n" :style="{ width: focusBox.width + 'px'}"></span>
                            <span class="bar line e"
                                  :style="{ left: focusBox.width + 'px', height: focusBox.height + 'px'}"></span>
                            <span class="bar line s"
                                  :style="{ top: focusBox.height + 'px', width: focusBox.width + 'px'}"></span>
                            <span class="bar line w" :style="{ height: focusBox.height + 'px'}"></span>
                        </div>
                        <!--<div id="textEditor" -->
                        <!--v-show="focusEle.cellType == 'fulltext' && focusEle.onFocus"-->
                        <!--:style="{ top: focusBox.top + 6 + 'px', left: focusBox.left + 2 + 'px', width: focusBox.width - 3 + 'px'}"-->
                        <!--&gt;-->
                        <div id="textEditor" style="min-width: 20px;min-height: 20px"
                             :style="{top:focusBox.top + 'px',left: focusBox.left + 'px',width:focusBox.width + 1 + 'px',height:focusBox.height + 'px'}"
                             v-visible="focusEle.cellType == 'fulltext' && focusEle.onFocus"
                        >
                        </div>
                    </ul>
                </div>
                <div class="save-btn-group">
                    <div class="btn-modelist">
 <!--                        <el-button class="btn-md-clear" @click="handleContextSave">
                            <svg class="icon icon-delete" aria-hidden="true">
                                <use xlink:href="#icon-baocun1"></use>
                            </svg>
                            <span>清除</span>
                        </el-button> -->
                        <el-button class="btn-md-reset" @click="handleContextSave">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-cancel1"></use>
                            </svg>
                            <span>返回</span>
                        </el-button>
                        <el-button class="btn-md-save" @click="handleContextSave">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-baocun1"></use>
                            </svg>
                            <span>保存</span>
                        </el-button>
                    </div>

                </div>


            </div>
            <el-dialog
                    title="选择图片素材"
                    :visible.sync="photoDialogShow"
                    :title="textMap[dialogStatus]">
                <el-tabs active-name="upload" type="card">
                    <el-tab-pane label="上传图片" name="upload">
                        <upload-comp v-model="selectImg.src" @success="handleUploadSuccess"></upload-comp>
                        <!--<el-upload-->
                        <!--class="upload-demo"-->
                        <!--drag-->
                        <!--action="http://10.200.8.11:8010/material/api/file/upload">-->
                        <!--<i class="el-icon-upload"></i>-->
                        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
                        <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        <!--</el-upload>-->
                    </el-tab-pane>
                    <el-tab-pane label="图库选择" name="second">
                        <select-gallery @success="handleGallerySelect"></select-gallery>
                    </el-tab-pane>
                </el-tabs>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="photoDialogShow = false">取 消</el-button>
                    <el-button type="primary" @click="handleSelectedImg">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                    title="选择图片素材"
                    :visible.sync="coverPhotoDialogShow"
            >
                <div class="dialogFormBox">
                    <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">
                        <el-col class="item" :span="8" v-for="x in imageListData" :key="x.id"
                                style="text-align:center;margin-bottom:20px;">
                            <div class="item-wrapper">
                                <div style="position: relative">
                                    <img width="100%" height="120px" :src="baseUrl + x.serverUrl" alt="">
                                </div>
                                <p class="material-title">{{x.name}}</p>
                            </div>
                            <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                        </el-col>
                    </el-row>
                    <pagination :total="totalPage" :pagesize="pageParam.size"
                                v-on:pageChange="handleCurrentChange"></pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <!--<el-button class="cancel" @click="cancel">取 消</el-button>-->
                    <el-button type="primary" class="update" @click="confirm">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script src="./articleManage.js"></script>
<style scoped src="./articleManage.scss" lang="scss"></style>
<style src="./articleManageNoScope.scss" lang="scss"></style>