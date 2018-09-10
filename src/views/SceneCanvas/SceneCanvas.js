/**************************************************************************/
/*                                                                        */
/* Copyright (c) 2017 HyperSmart Company                                  */
/* 深圳市超智慧信息科技有限公司版权所有                                     */
/*                                                                        */
/* PROPRIETARY RIGHTS of HyperSmart Company are involved in the           */
/* subject matter of this material. All manufacturing, reproduction, use, */
/* and sales rights pertaining to this subject matter are governed by the */
/* license agreement. The recipient of this software implicitly accepts   */
/* the terms of the license.                                              */
/* 本软件文档资料是深圳市超智慧信息科技有限公司的资产，任何人士阅读和        */
/* 使用本资料必须获得相应的书面授权，承担保密责任和接受相应的法律约束。      */
/*                                                                        */
/**************************************************************************/

import {canvasDraw} from '../../utils/canvas'

import {GetScenesBySensingId, UpdateScenes, UpdateBackgroundImage} from "../Scene/api/sceneApi";

import EXIF from '../../utils/exif.js';
import {Message} from 'element-ui'

export default {
    created() {

    },
    data() {
        return {
            canvasD: {},
            sceneFormVisible: false,
            sceneTemp: tempSceneInit(),
            sceneVisible: false,
            last_scenes: {}, // 页面初始化数据---所有场景
            current_scenes: {}, // 正在操作的所有场景
            current_secene_id: 0, // 正在操作的场景id
            sensing_device_id: 0,
            canvasSize: new initCanvasSize(1920, 1080, 1, 1, 1920, 1080, 1, 1),
            sizeFormVisible: false,
            sceneSizeTemp: new tempSizeInit(1920, 1080),
            dialogImg: false,
            imageUrl: '',
            upLoadData: {
                id: '',
                baseStr: ''
            },
            rules: {
                sceneName:
                    [
                        {required: true, message: '请输入场景名称', trigger: 'blur'},
                        {max: 15, message: '场景名称不得超过15个字符'}],
                baseStr:
                    [
                        {required: true, message: '请输入背景地址', trigger: 'blur'},
                        {max: 1000, message: '背景地址不得超过1000个字符'}]
            }
        }
    },
    components: {
        //etc...
    },
    mounted() {
        this.initScenes();
    },
    methods: {
        // 获取当前正在操作的所有数据
        getScene() {
            console.log(this.canvasD.getScenes());
        },
        resetForm() {
            this.$refs['form'].resetFields();
            this.sceneTemp = tempSceneInit();
        },
        setCanvasSize() {
            // 设置桌布大小
            this.sceneSizeTemp = new tempSizeInit(this.canvasSize.realWidth, this.canvasSize.realHeight);
            this.sizeFormVisible = true;
        },
        /**
         * 场景分布，初始化--绘制
         * @param row
         */
        initScenes() {
            let This = this;
            This.sensing_device_id = this.$route.query.sensingId;
            var myCanvas = this.$refs['myCanvas'];
            let initData = {};

            // 根据感应设备id，获取多个场景
            GetScenesBySensingId(This.sensing_device_id).then((response) => {
                console.log(response);
                if (response.data != null && response.data.data != null) {

                    let data = response.data.data;
                    if (data.sensingBackgroudImage) {
                        $('#bg-image').attr("src", data.sensingBackgroudImage);
                    }

                    if (data.scenes && data.scenes.length > 0) {
                        // 设置画布尺寸
                        let result = data.scenes;
                        if (myCanvas) {
                            This.canvasSize = resize(myCanvas, result[0].realWidth, result[0].realHeight, 1, 1);
                        }
                        for (var i = 0; i < result.length; i++) {

                            if(result[i].points){
                                if (result[i].widthRatio == This.canvasSize.widthRatio) {// 判斷是否為相同尺寸
                                    result[i].point = JSON.parse(result[i].points);
                                } else {
                                    result[i].point = calculatePoint(JSON.parse(result[i].points), result[i].widthRatio, result[i].heightRatio);
                                }

                                if (result[i].heightRatio == This.canvasSize.heightRatio) {// 判斷是否為相同尺寸
                                    result[i].circle = JSON.parse(result[i].circles);
                                } else {
                                    result[i].circle = calculateCircle(JSON.parse(result[i].circles), result[i].widthRatio, result[i].heightRatio);
                                }

                                result[i].sceneRemark = result[i].remark;
                                result[i].stopState = true;
                                This.last_scenes[result[i].id] = result[i];
                                initData[result[i].id] = result[i];
                            }
                        }
                    } else {
                        // 设置画布尺寸
                        if (myCanvas) {
                            This.canvasSize = resize(myCanvas, 1920, 1080, 1, 1);
                        }
                    }
                } else {
                    // 没有获取到有效数据，初始化画布
                    if (myCanvas) {
                        // myCanvas.width = $(myCanvas).parent().width();
                        // myCanvas.height = $(myCanvas).parent().height();
                        This.canvasSize = resize(myCanvas, 1920, 1080, 1, 1);
                    }
                }

                This.sceneSizeTemp = new tempSizeInit(This.canvasSize.realWidth, This.canvasSize.realHeight);

                myCanvas.width = This.canvasSize.width;
                myCanvas.height = This.canvasSize.height;

                $(".top-title").children().eq(0).text(This.canvasSize.realWidth);
                $(".left-title").children().eq(0).text(This.canvasSize.realHeight);

                $('#bg-image').css({"height": This.canvasSize.height,"width": This.canvasSize.width});

                // 初始化
                This.canvasD = canvasDraw(myCanvas, This.dbclickCallbak, initData);
            });
        },
        // 取消弹出窗
        handleSceneCancel() {
            this.sceneFormVisible = false;
            this.dialogImg = false;
            this.sceneTemp = tempSceneInit()
            this.$refs['form'].resetFields()
        },
        //  提交数据---更新当前场景设置
        saveSceneCanvas() {
            var canvasData = this.canvasD.getScenes();
            let submit_scenes = [];
            let myCanvas = this.$refs['myCanvas'];
            for (let i = 0; i < canvasData.length; i++) {
                if (canvasData[i].point && canvasData[i].point.length < 3) {
                    continue;
                }
                let sc = new SceneCanvas(
                    this.sensing_device_id,
                    canvasData[i].id,
                    canvasData[i].sceneName,
                    canvasData[i].sceneRemark,
                    JSON.stringify(canvasData[i].point),
                    JSON.stringify(canvasData[i].circle),
                    myCanvas.height,
                    myCanvas.width,
                    this.canvasSize.widthRatio,
                    this.canvasSize.heightRatio,
                    this.canvasSize.realWidth,
                    this.canvasSize.realHeight
                );
                if (sc.sceneName && sc.sceneName != '') {
                    submit_scenes.push(sc);
                } else {
                    Message({
                        message: '存在未设置名称场景',
                        type: 'error',
                        duration: 3 * 1000,
                        showClose: true,
                        customClass: 'msg-error',
                        iconClass: 'sc'
                    })
                    return false;
                }
            }

            let This = this;
            UpdateScenes(submit_scenes)
                .then((response) => {
                    console.log(response);
                    This.last_scenes = {};
                    This.current_scenes = {};
                    if (response.data != null && response.data.data != null && response.data.data.length > 0) {
                        let result = response.data.data;
                        for (var i = 0; i < result.length; i++) {
                            // 重新设置存储对象
                            This.last_scenes[result[i].realId] = result[i];
                            This.current_scenes[result[i].realId] = result[i];

                            // 更新数据id
                            for (let i = 0; i < canvasData.length; i++) {
                                if (canvasData[i].point && canvasData[i].point.length < 3) {
                                    continue;
                                }
                                if (canvasData[i].id === result[i].id) {
                                    canvasData[i].point = JSON.parse(result[i].points);
                                    canvasData[i].circle = JSON.parse(result[i].circles);
                                    canvasData[i].id = result[i].realId;
                                }
                            }
                        }
                    }
                });
        },
        // 重置场景
        resetCanvas() {
            // 重新绘制 last_scenes;
            this.initScenes();
        },
        // 更新名称--备注
        updateScene(formName) {
            let This = this;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;

                    let scenes = This.current_scenes;
                    let scene = scenes[This.current_secene_id];
                    if (scene.point.length < 2) {
                        return
                    }
                    scene.sceneName = This.sceneTemp.sceneName;
                    scene.sceneRemark = This.sceneTemp.sceneRemark;
                    scene.stopState = (This.sceneTemp.sceneResize === "false" || !This.sceneTemp.sceneResize) ? false : true;

                    //  暂存
                    console.log(This.getScene());
                    console.log(This.canvasD.getScenes());
                    console.log(This.current_scenes);
                    This.sceneFormVisible = false;
                } else {
                    return false;
                }
            });
        },
        // 双击
        dbclickCallbak(e, scenes) {
            let This = this;
            This.current_secene_id = 0;
            let canvas = e.target;
            let clickX = e.pageX - ($(canvas).offset().left - $(window).scrollLeft());
            let clickY = e.pageY - ($(canvas).offset().top - $(window).scrollTop());

            for (let p in scenes) {
                let area = scenes[p];
                if (!area.point) {
                    return;
                }
                if (area.point.length < 2) {
                    continue;
                }
                let c_point = new Point(clickX, clickY);
                if (PointInPoly(c_point, area.point)) {
                    // 取得id
                    This.current_secene_id = area.id;
                    This.sceneTemp.id = area.id;
                    if (area.sceneName) {
                        This.sceneTemp.sceneName = area.sceneName;
                    }
                    if (area.sceneRemark) {
                        This.sceneTemp.sceneRemark = area.sceneRemark;
                    }
                    This.sceneTemp.sceneResize = area.stopState;
                    delete scenes[p];
                    scenes[area.id] = area;

                    break;
                }
            }

            console.log("场景id===" + This.current_secene_id)
            if (This.current_secene_id != 0) {
                This.current_scenes = scenes;
                This.sceneFormVisible = true;
            }
        },
        backToSensingDevice() {
            this.$router.push({path: '/guard/sensingDevice'});
        },
        initCanvas(context, points, circles) {
            for (var i = 0; i < circles.length; i++) {
                var circle = circles[i];
                // 绘制圆圈
                context.globalAlpha = 0.85;
                context.beginPath();
                context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                context.fillStyle = circle.color;
                context.strokeStyle = "black";
                context.fill();
                context.stroke();
            }
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (var i = 0; i < points.length; i++) {
                context.lineTo(points[i].x, points[i].y);
            }
            context.lineTo(points[0].x, points[0].y);
            // context.fillStyle="#831f68";
            context.fillStyle = "rgb(2,100,30)";
            context.fill();
            context.strokeStyle = "#9d4dca";
            context.stroke();
        },
        handleSizeCancel() {
            this.sizeFormVisible = false;
            // this.sceneTemp = tempSceneInit()
            this.$refs['form'].resetFields()
        },
        // 重新设置尺寸，确定
        updateSize() {

            let This = this;
            let myCanvas = this.$refs['myCanvas'];
            // This.canvasSize = resize(myCanvas, This.sceneSizeTemp.width, This.sceneSizeTemp.height, This.canvasSize.realWidth, This.canvasSize.realHeight, This.canvasSize.widthRatio, This.canvasSize.heightRatio);
            This.canvasSize = resize(myCanvas, This.sceneSizeTemp.width, This.sceneSizeTemp.height, This.canvasSize.widthRatio, This.canvasSize.heightRatio);
            myCanvas.width = This.canvasSize.width;
            myCanvas.height = This.canvasSize.height;

            // 清空画布
            let context = myCanvas.getContext('2d')
            context.clearRect(0, 0, myCanvas.width, myCanvas.height);

            let initData = {};
            // 根据设置尺寸，更显现有坐标点坐标
            for (let x in This.last_scenes) {
                let inner_Obj = This.last_scenes[x];
                inner_Obj.point = calculatePoint(inner_Obj.point, This.canvasSize.widthRatio, This.canvasSize.heightRatio, This.canvasSize.lastWidthRatio, This.canvasSize.lastHeightRatio);
                inner_Obj.circle = calculateCircle(inner_Obj.circle, This.canvasSize.widthRatio, This.canvasSize.heightRatio, This.canvasSize.lastWidthRatio, This.canvasSize.lastHeightRatio);
                initData[inner_Obj.id] = inner_Obj;
            }

            $(".top-title").children().eq(0).text(This.canvasSize.realWidth);
            $(".left-title").children().eq(0).text(This.canvasSize.realHeight);

            $('#bg-image').attr("src", this.upLoadData.baseStr);
            $('#bg-image').css({"height": This.canvasSize.height,"width": This.canvasSize.width});
            // 初始化
            This.canvasD = canvasDraw(myCanvas, This.dbclickCallbak, initData);
            This.sizeFormVisible = false;
        },

        beforeAvatarUpload(file) {
            return false;
        },
        /**
         * 图片变更
         * @param file
         * @param fileList
         */
        changeFeature(file, fileList) {

            let self = this;
            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = document.getElementById('bg-image');
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: self.canvasSize.realWidth,      //图片最大宽度
                            height: self.canvasSize.realHeight,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        let baseStr = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.imageUrl = baseStr;


                        // 设置图片src
                        self.upLoadData.baseStr = baseStr;
                        self.upLoadData.id = self.sensing_device_id;
                        // 手动上传
                        UpdateBackgroundImage(self.upLoadData, callBack, self);
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        onAddImg() {
            this.dialogImg = true;
            // this.imageUrl = '';
        },
        onCloseImg() {
            this.dialogImg = false;
            // this.imageUrl = false;
        },

        // 提交修改----背景图片路径
        updateBack(){

            this.$refs['back_form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;

                    // 设置图片src
                    this.upLoadData.id = this.sensing_device_id;
                    // 手动上传
                    UpdateBackgroundImage(this.upLoadData, callBack, this);
                } else {
                    return false;
                }
            });

        }

    }
}

function tempSceneInit() {
    return {
        id: '',
        sceneName: '',
        sceneRemark: '',
        points: '',
        circles: '',
        canvas_height: 0,
        canvas_width: 0,
        sceneResize: false,
        backImgUrl:''
    }
}

let callBack = function (result, self) {
    if (result && result.status === 200 && result.data && result.data == 'success') {
        Message({
            message: '修改成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        });

        self.updateSize();
        setTimeout(function () {
            self.dialogImg = false;
        }, 3000);
    } else {
        Message({
            message: '修改失败',
            type: 'error',
            duration: 3 * 1000,
            showClose: true,
            customClass: 'msg-error',
            iconClass: 'sc'
        })
    }
}

let tempSizeInit = function (width, height) {
    this.width = width;
    this.height = height;
};

let initCanvasSize = function (width, height, width_ratio, height_ratio, realWidth, realHeight, last_width_ratio, last_height_ratio) {
    this.width = width;
    this.height = height;
    this.widthRatio = width_ratio;
    this.heightRatio = height_ratio;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.lastWidthRatio = last_width_ratio;
    this.lastHeightRatio = last_height_ratio;
};

let SceneCanvas = function (sensing_device_id, id, sceneName, sceneRemark, points, circles, canvasHeight, canvasWidth, width_ratio, height_ratio, realWidth, realHeight) {
    this.sensingDeviceId = sensing_device_id;
    this.id = id;
    this.sceneName = sceneName;
    this.sceneRemark = sceneRemark;
    this.points = points;
    this.circles = circles;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.widthRatio = width_ratio;
    this.heightRatio = height_ratio;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
};

/**
 * 计算点是否在某一多边形内
 * @param pt
 * @param poly
 * @returns {boolean}
 * @constructor
 */
let PointInPoly = function (pt, poly) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((parseFloat(poly[i].y) <= pt.y && pt.y < parseFloat(poly[j].y)) || (parseFloat(poly[j].y) <= pt.y && pt.y < parseFloat(poly[i].y)))
        && (pt.x < (parseFloat(poly[j].x) - parseFloat(poly[i].x)) * (pt.y - parseFloat(poly[i].y)) / (parseFloat(poly[j].y) - parseFloat(poly[i].y)) + parseFloat(poly[i].x))
        && (c = !c);
    return c;
};

//  每一个点的对象
let Point = function (x, y) {
    this.x = x;
    this.y = y;
};

//  圆圈对象
let Circle = function (x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.color = "blue";
    //  拖拽点的标记
    this.isSelected = false;
};

let resize = function (myCanvas, width, height, last_width_ratio, last_height_ratio) {

    let width_ratio = 1, height_ratio = 1;  // 缩放比例
    let maxWidth = $(myCanvas).parent().width(), maxHeight = $(myCanvas).parent().height();

    console.log("maxWidth==" + maxWidth);
    console.log("maxHeight==" + maxHeight);

    let afterWidth = width, afterHeight = height;
    // 检查图片是否超宽
    if (width > maxWidth) {
        width_ratio = (maxWidth / width).toFixed(5);   // 计算缩放比例
        afterWidth = maxWidth;
        afterHeight = (height * width_ratio).toFixed(2);
    }

    // 检查图片是否超高
    if (afterHeight > maxHeight) {
        height_ratio = (maxHeight / afterHeight).toFixed(5); // 计算缩放比例
        afterHeight = maxHeight;
        afterWidth = (afterWidth * height_ratio).toFixed(2);
    }

    //调整后高宽
    console.log("after width===" + afterWidth);
    console.log("after height===" + afterHeight);

    return new initCanvasSize(afterWidth, afterHeight, width_ratio, height_ratio, width, height, last_width_ratio, last_height_ratio);
};

/**
 * 计算点坐标
 * @param point
 * @param widthRatio
 * @param heightRatio
 * @returns {*}
 */
let calculatePoint = function (points, widthRatio, heightRatio, lastWidthRatio, lastHeightRatio) {
    if (typeof(lastWidthRatio) == "undefined") {
        for (var i = 0; i < points.length; i++) {
            let point = points[i];
            point.x = parseFloat(point.x);
            point.y = parseFloat(point.y);
        }
    } else {
        for (var i = 0; i < points.length; i++) {
            let point = points[i];
            point.x = (point.x / lastHeightRatio * heightRatio).toFixed(2);
            point.y = (point.y / lastWidthRatio * widthRatio).toFixed(2);
        }
    }
    return points;
};

/**
 * 计算圆圈坐标
 * @param circle
 * @param widthRatio
 * @param heightRatio
 * @returns {*}
 */
let calculateCircle = function (circles, widthRatio, heightRatio, lastWidthRatio, lastHeightRatio) {
    if (typeof(lastWidthRatio) == "undefined") {
        for (var i = 0; i < circles.length; i++) {
            let circle = circles[i];

            circle.x = parseFloat(circle.x);
            circle.y = parseFloat(circle.y);
        }
    } else {
        for (var i = 0; i < circles.length; i++) {
            let circle = circles[i];

            circle.x = (circle.x / lastHeightRatio * heightRatio).toFixed(2);
            circle.y = (circle.y / lastWidthRatio * widthRatio).toFixed(2);
        }
    }

    return circles;
};
