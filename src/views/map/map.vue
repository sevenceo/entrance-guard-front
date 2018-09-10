<template>
    <div class="map">
        <div class="map_left">
            <div class="left_top">
                <div><span>项目</span><input type="text" placeholder="请输入项目名称"></div>
                <div><span>角色</span><input type="text" placeholder="请输入角色"></div>
                <div><span>姓名</span><input type="text" placeholder="请输入姓名"></div>
                <div class="btn"><span class="btn_a">清除</span><span class="btn_b">搜索</span></div>
            </div>
            <div class="left_center">
                <div><span>姓名：</span><span>张三</span></div>
                <div><span>项目：</span><span>上海市浦东区</span></div>
                <div><span>角色：</span><span>游客</span></div>
            </div>
            <div class="left_main">
                <div class="main_a">
                    <div class="main_top"><span class="main_num">1</span><span>16:00:45-17:40:12</span></div>
                    <div>
                        <div class="main_center"><img src="./image/start.png" alt=""><span class="dd">米奇大街</span>&nbsp;&nbsp;&nbsp;经度<span class="jd">121.668068</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd">31.148021</span></div>
                        <div class="main_bottom"><img src="./image/end.png" alt=""><span class="dd2">宝藏湾</span>&nbsp;&nbsp;&nbsp;经度<span class="jd2">121.669622</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd2">31.151305</span></div>
                    </div>
                </div>
                <div class="main_a">
                    <div class="main_top"><span class="main_num">2</span><span>17:40:12-18:40:12</span></div>
                    <div>
                        <div class="main_center"><img src="./image/start.png" alt=""><span class="dd">宝藏湾</span>&nbsp;&nbsp;&nbsp;经度<span class="jd">121.669622</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd">31.151305</span></div>
                        <div class="main_bottom"><img src="./image/end.png" alt=""><span class="dd2">爱丽丝梦游仙境迷宫</span>&nbsp;&nbsp;&nbsp;经度<span class="jd2">121.665948</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd2">31.15071</span></div>
                    </div>
                </div>
                <div class="main_a">
                    <div class="main_top"><span class="main_num">3</span><span>18:40:12-19:40:12</span></div>
                    <div>
                        <div class="main_center"><img src="./image/start.png" alt=""><span class="dd">爱丽丝梦游仙境迷宫</span>&nbsp;&nbsp;&nbsp;经度<span class="jd">121.665948</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd">31.15071</span></div>
                        <div class="main_bottom"><img src="./image/end.png" alt=""><span class="dd2">巴斯光年营救</span>&nbsp;&nbsp;&nbsp;经度<span class="jd2">121.664178</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd2">31.147279</span></div>
                    </div>
                </div>
                <div class="main_a">
                    <div class="main_top"><span class="main_num">4</span><span>19:40:12-20:40:12</span></div>
                    <div>
                        <div class="main_center"><img src="./image/start.png" alt=""><span class="dd">巴斯光年营救</span>&nbsp;&nbsp;&nbsp;经度<span class="jd">121.664178</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd">31.147279</span></div>
                        <div class="main_bottom"><img src="./image/end.png" alt=""><span class="dd2">星愿湖码头</span>&nbsp;&nbsp;&nbsp;经度<span class="jd2">121.672299</span>&nbsp;&nbsp;&nbsp;纬度<span class="wd2">31.143316</span></div>
                    </div>
                </div>

            </div>
            <div class="left_foot">
                <div class="foot_bz"><span>备注：</span><span>当前摄像头位置</span></div>
                <div class="foot_num"><span>总定位次数：</span><span>3</span></div>
            </div>
        </div>
        <div class="map_right">
            <div style="width: 100%;height:100%" id="map">
                <div style="width:100%;height:100%;float:left;" id="dituContent"></div>
            </div>
        </div>
    </div>

</template>
<style>
    .map{
        width: 100%;
        height: 100%;
        box-sizing:border-box;
    }
    .map_left{
        padding: 10px;
        width: 20%;
        height: 100%;
        float: left;
        background: #FFF;
        box-sizing:border-box;
    }
    .map_right{
        height: 100%;
        width: 80%;
        padding-bottom: 0;
        float: right;
        box-sizing: border-box;
    }
    .left_top{
        border-bottom: 2px solid #CCC;
    }
    .left_top div {
        height: 30px;
        line-height: 30px;
    }
    .left_top div  span{
        margin-right: 10px;
        width: 100px;
    }
    .left_top div input{
        width: 70%;
        height: 20px;
    }
    .left_top .btn{
        width: 100%;
        height: 40px;
        text-align: center;
    }
    .left_top .btn span{
        padding: 0 30px;
        width: 100px;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        color: white;
        font-size: 14px;
    }
    .left_top .btn .btn_a{
        background: green;
    }
    .left_top .btn .btn_b{
        background: blue;
    }
    .left_center{
        padding: 10px 0;
    }
    .left_center div{
        height: 40px;
        line-height: 40px;
    }
    .left_center div span{
        margin-right: 20px;
        color: skyblue;
    }
    .left_main{
        height: 60%;
        overflow-y: scroll;
    }
    .left_main::-webkit-scrollbar {
        display: none;
    }
    .main_a{
        height: 200px;
    }
    .main_a div{
        height: 50px;
    }
    .main_top{
        background: skyblue;
        height: 50px;
        width: 100%;
        color: white;
        padding-left: 50px;
        line-height: 50px;
    }
    .main_num{
        display: block;
        float: left;
        height: 30px;
        width: 30px;
        background: blue;
        border-radius: 15px;
        text-align: center;
        line-height: 30px;
        margin-left: -30px;
        margin-right: 30px;
        margin-top: 10px;
    }

    .main_center{
        margin: 10px 0;
    }
    .main_center img{
        width: 30px;
        height: 40px;
        display: block;
        float: left;
        margin-right: 20px;
    }
    .main_bottom{
        margin: 10px 0;
    }
    .main_bottom img{
        width: 30px;
        height: 40px;
        display: block;
        float: left;
        margin-right: 20px;
    }
    .left_foot{
        padding: 20px 30px;
    }
    .left_foot div{
        height: 30px;
        line-height: 30px;
    }
    .left_foot div span{
        margin-right: 20px;
        color: blue;
    }

    *{
        margin: 0;
        padding: 0;
    }
</style>

<script type="text/javascript">
    var height = $(window).height();
    $('.map_left').height(height);
    $('.map_right').height(height);

    export default {
        methods: {
            //创建地图函数：
            createMap() {
                var data1a = [121.668068, 121.669622, 121.665948, 121.664178, 121.672299]
                var data1b = [31.148021, 31.151305, 31.150712, 31.147279, 31.143316]

                var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
                var point = new BMap.Point(121.669604, 31.147009);//定义一个中心点坐标
                map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
                map.centerAndZoom(point, 16);//设定地图的中心点和坐标并将地图显示在地图容器中
                window.map = map;//将map变量存储在全局
                var iconImg = createIcon();
                var iconImg1 = createIcon1();
                var iconImg2 = createIcon2();
                var iconImg3 = createIcon3();
                var pt = new BMap.Point(121.669604, 31.147009)
                var pt1 = new BMap.Point(data1a[0], data1b[0])
                var pt2 = new BMap.Point(data1a[1], data1b[1])
                var pt3 = new BMap.Point(data1a[2], data1b[2])
                var pt4 = new BMap.Point(data1a[3], data1b[3])
                var pt5 = new BMap.Point(data1a[4], data1b[4])
                var arr = [pt1, pt2, pt3, pt4, pt5]
                for (var i in arr) {
                    var point = new BMap.Point(arr[i].lng, arr[i].lat);
                    var marker = new BMap.Marker(point, {icon: iconImg});  // 创建标记
                    map.addOverlay(marker);
                    createTag(marker, arr[i]);
                }
                var polyline1 = new BMap.Polyline([
                    pt1,
                    pt2,
                ], {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
                var polyline2 = new BMap.Polyline([
                    pt2,
                    pt3,
                ], {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
                var polyline3 = new BMap.Polyline([
                    pt3,
                    pt4,
                ], {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
                var polyline4 = new BMap.Polyline([
                    pt4,
                    pt5,
                ], {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
                map.addOverlay(polyline1);
                map.addOverlay(polyline2);
                map.addOverlay(polyline3);
                map.addOverlay(polyline4);
                map.setDefaultCursor("crosshair");
                //点击地点切换路线状态
                var lis = $('.main_a');
                $('.main_a').each(function (index) {
                    $(this).on('click', function () {
                        map.clearOverlays()
                        var polyline = new BMap.Polyline([
                            pt1,
                            pt2,
                            pt3,
                            pt4,
                            pt5,
                        ], {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
                        map.addOverlay(polyline);
                        var polyline = "polyline" + index
                        var polyline = new BMap.Polyline([
                            arr[index],
                            arr[index + 1]], {strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5});
                        map.addOverlay(polyline);
                        console.log(map.getOverlays())
                        var markerb = "marker" + index
                        var indexa = index + 1
                        var markera = "marker" + indexa

                        for (var i in arr) {
                            var point = new BMap.Point(arr[i].lng, arr[i].lat);

                            var marker = new BMap.Marker(point, {icon: iconImg});  // 创建标记
                            map.addOverlay(marker);
                            createTag(marker, arr[i]);
                        }
                        var markerb = new BMap.Marker(arr[index], {icon: iconImg1});
                        map.addOverlay(markerb);
                        var markera = new BMap.Marker(arr[index + 1], {icon: iconImg3});
                        map.addOverlay(markera);
                        createTag(markera, arr[index + 1]);
                        createTag(markerb, arr[index]);
                    })
                })
            },

            //地图控件添加函数：
            addMapControl() {
                //向地图中添加缩放控件
                var ctrl_nav = new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    type: BMAP_NAVIGATION_CONTROL_LARGE
                });
                map.addControl(ctrl_nav);
                //向地图中添加比例尺控件
                var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
                map.addControl(ctrl_sca);
            },
            //地图事件设置函数：
            setMapEvent() {
                map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
                map.enableScrollWheelZoom();//启用地图滚轮放大缩小
                map.disableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
                map.enableKeyboard();//启用键盘上下左右键移动地图
            }
        },
        mounted() {
            this.createMap();//创建地图
            this.setMapEvent();//设置地图事件
            this.addMapControl();//向地图添加控件
        }
    }

    function createTag(marker, m) {
        //标注
        var text = "<p>姓名：张三</p><p>角色： 游客</p><p>项目：上海东方体育中心</p><p>时间：16:00:45-17:40:12</p>";

        //给标记添加点击事件以及显示窗口信息
        var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + text + "</p>");
        marker.addEventListener("click", function () {
            this.openInfoWindow(infoWindow);
        });
    }

    //创建一个Icon
    function createIcon(json) {
        var icon = new BMap.Icon("./image/start1.png", new BMap.Size(45, 45), {
            imageOffset: new BMap.Size(0, 0),
            infoWindowOffset: new BMap.Size(21, 1),
            offset: new BMap.Size(6, 45)
        })
        return icon;
    }

    function createIcon1(json) {
        var icon = new BMap.Icon("./image/start2.png", new BMap.Size(45, 45), {
            imageOffset: new BMap.Size(0, 0),
            infoWindowOffset: new BMap.Size(21, 1),
            offset: new BMap.Size(6, 45)
        })
        return icon;
    }

    function createIcon2(json) {
        var icon = new BMap.Icon("./image/end1.png", new BMap.Size(45, 45), {
            imageOffset: new BMap.Size(0, 0),
            infoWindowOffset: new BMap.Size(21, 1),
            offset: new BMap.Size(6, 45)
        })
        return icon;
    }

    function createIcon3(json) {
        var icon = new BMap.Icon("./image/end2.png", new BMap.Size(45, 45), {
            imageOffset: new BMap.Size(0, 0),
            infoWindowOffset: new BMap.Size(21, 1),
            offset: new BMap.Size(6, 45)
        })
        return icon;
    }

</script>