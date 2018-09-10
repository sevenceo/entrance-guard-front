export function canvasDraw(canvas, dbclickCallbak, initData) {

    // 多个场景
    let scenes = {};
    let all_points = [];

    //  线段的点的集合
    let points = [];
    //  可拖动圆圈的点的集合
    let circles = [];

    /**
     * 计算点是否在某一多边形内
     * @param pt
     * @param poly
     * @returns {boolean}
     * @constructor
     */
    let PointInPoly = function (pt, poly) {
        console.log(pt.x);
        console.log(pt.y);
        /*for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;*/

        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((parseFloat(poly[i].y) <= pt.y && pt.y < parseFloat(poly[j].y)) || (parseFloat(poly[j].y) <= pt.y && pt.y < parseFloat(poly[i].y)))
            && (pt.x < (parseFloat(poly[j].x) - parseFloat(poly[i].x)) * (pt.y - parseFloat(poly[i].y)) / (parseFloat(poly[j].y) - parseFloat(poly[i].y)) + parseFloat(poly[i].x))
            && (c = !c);
        return c;



        /*var x = pt[0], y = pt[1];
        var inside = false;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            var xi = poly[i][0], yi = poly[i][1];
            var xj = poly[j][0], yj = poly[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;*/
    };

    let resetCanvas = function (context, points, circles) {
        circles[0].color = "red";
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            // 绘制圆圈
            context.globalAlpha = 0.35;
            context.beginPath();
            context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            context.fillStyle = circle.color;
            context.strokeStyle = "black";
            context.fill();
            context.stroke();
        }
        // 画线
        context.beginPath();
        context.lineWidth = 4;
        //从起始点开始绘制
        context.moveTo(points[0].x, points[0].y);
        for (var i = 0; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.fillStyle = "rgb(2,100,30)";
        context.fill();
        context.strokeStyle = "#9d4dca";
        context.stroke();
    };

    let recover_Canvas = function (context, points, circles) {
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
    };

    let Scene = function (point, circle, stopState) {
        this.id = new Date().getTime();
        this.point = point;
        this.circle = circle;
        this.stopState = stopState;
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

    let drawBackgroudImage = function (context) {
        var mImage = document.getElementById('bg-image');
        context.drawImage(mImage, 0, 0, canvas.width, canvas.height);
    };

    // 初始化场景数据
    if (initData) {
        var objKeys = Object.keys(initData);
        let context = canvas.getContext('2d');
        // drawBackgroudImage(context);
        if (objKeys.length > 0) {
            scenes = initData;
            for (let x in initData) {
                recover_Canvas(context, initData[x].point, initData[x].circle);
                for (var i = 0; i < initData[x].point.length; i++) {
                    all_points.push(initData[x].point[i]);
                }
            }
        }
    }

    /*每一次的点都看作一个对象,然后把点放在数组里保存起来
    这样circles和points就会是这种形式
    points=[{(x0,y0},{x1,y1},{x2,y2}..]
    circles=[{x0,y0,10,blue,false}...]*/

    canvas.isDragging = false;
    canvas.stop_state = false;
    canvas.index = 0;
    canvas.onmousedown = function (e) {
        var canvas = e.target;
        var context = e.target.getContext('2d')
        // var clickX = e.pageX - canvas.offsetLeft;
        // var clickY = e.pageY - canvas.offsetTop;

        var clickY = e.pageY - ($(canvas).offset().top - $(window).scrollTop());
        var clickX = e.pageX - ($(canvas).offset().left - $(window).scrollLeft());

        //使用勾股定理计算这个点与圆心之间的距离

        // if(!canvas.current_area){

        for (var p in scenes) {
            var area = scenes[p];

            var circle_start = area.circle[0];
            var distanceFromCenter = Math.sqrt(Math.pow(circle_start.x - clickX, 2)
                + Math.pow(circle_start.y - clickY, 2));
            if (distanceFromCenter <= circle_start.radius) {
                // canvas.index = 0;
                // canvas.isDragging = true;
                canvas.current_area = area;
                area.stopState = true;
                canvas.stop_state = true;

                // points = area.point;
                // circles = area.circle;
                // canvas.onmousemove(e);
                break;
            }
        }
        // }

        if (circles.length > 0) {
            var circle_start = circles[0];
            var distanceFromCenter = Math.sqrt(Math.pow(circle_start.x - clickX, 2)
                + Math.pow(circle_start.y - clickY, 2));
            if (distanceFromCenter <= circle_start.radius) {
                canvas.index = 0;
                canvas.isDragging = true;
                var area = canvas.current_area;
                if (area) {
                    area.stopState = true;
                }

                canvas.stop_state = true;
                canvas.onmousemove(e);
                return;
            }
        }
        // else{
        // 如果编辑状态，判断是否已经存在多边形，并且点属于某个多边形内，或为起点


        // }

        // 判定坐标点是否在某一多边形内
        var b_inner = false;

        for (var p in scenes) {
            var c_point = new Point(clickX, clickY);
            var area = scenes[p];
            if (PointInPoly(c_point, area.point)) {
                points = area.point;
                circles = area.circle;
                canvas.stop_state = area.stopState;
                b_inner = true;
                break;
            }
        }

        if (canvas.stop_state) {
            if (b_inner) {
                return;
            }

            if (points.length > 2) {
                //id = new Date().getTime();
                //线段的点的集合
                points = [];
                //可拖动圆圈的点的集合
                circles = [];
                canvas.stop_state = false
            } else {
                return;
            }
        }

        //判断当前点击点是否在已经绘制的圆圈上，如果是执行相关操作，并return，不进入画线的代码
        for (var i = 1; i < circles.length; i++) {
            var circle = circles[i];
            //使用勾股定理计算这个点与圆心之间的距离
            var distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2) + Math.pow(circle.y - clickY, 2));
            if (distanceFromCenter <= circle.radius) {// 如果是其他的点，则设置可以拖动
                // 清除之前选择的圆圈
                canvas.index = i;
                canvas.isDragging = true;
                //停止搜索
                return;
            }
        }

        //如果点击新的位置，则进入下面的代码，绘制点
        context.clearRect(0, 0, canvas.width, canvas.height);
        // drawBackgroudImage(context);

        //遍历数组画圆
        var circle = new Circle(clickX, clickY);
        circles.push(circle);
        var point = new Point(clickX, clickY);
        points.push(point);
        all_points.push(point);// 记录总点数

        // 多区域，全部重新绘画
        if (Object.getOwnPropertyNames(scenes).length > 0) {
            for (var p in scenes) {
                var area = scenes[p];
                if (area.point.length < 2) {
                    delete scenes[p];
                }
                resetCanvas(context, area.point, area.circle);
            }
        }
        else {
            resetCanvas(context, points, circles);
        }

        if (points.length < 2) { // 当前操作数据点，少于两个，则可以认为是新场景
            resetCanvas(context, points, circles);
            var c_area = new Scene(points, circles, canvas.stop_state);
            scenes[c_area.id] = c_area;
            canvas.current_area = c_area;
        }
    };

    canvas.onmousemove = function (e) {
        var context = e.target.getContext('2d')
        // var  = e.pageX - canvas.offsetLeft;
        // var  = e.pageY - canvas.offsetTop;
        var x1 = e.pageX - ($(canvas).offset().left - $(window).scrollLeft());
        var y1 = e.pageY - ($(canvas).offset().top - $(window).scrollTop());

        var x = 0;
        if (scenes.length > 0 && all_points.length > 3) {
            for (var p in scenes) {
                var c_point = new Point(x1, y1);
                var area = scenes[p];
                if (PointInPoly(c_point, area.point)) {
                    points = area.point;
                    circles = area.circle;
                    x = i;
                }
            }
        }

        // 判断圆圈是否开始拖拽
        if (canvas.isDragging == true) {
            // 判断拖拽对象是否存在
            // 取得鼠标位置

            context.clearRect(0, 0, canvas.width, canvas.height);
            // drawBackgroudImage(context);

            //根据上文得到的index设置index点位置随鼠标改变
            circles[canvas.index].x = x1;
            circles[canvas.index].y = y1;
            points[canvas.index].x = x1;
            points[canvas.index].y = y1;
            for (var p in scenes) {
                var area = scenes[p];
                recover_Canvas(context, area.point, area.circle);
            }
        }
    };

    canvas.onmouseup = function (e) {
        var canvas = e.target;
        canvas.isDragging = false;
    };

    canvas.onmouseout = function (e) {
        var canvas = e.target;
        canvas.isDragging = false;
    };

    canvas.ondblclick = function (e) {
        console.log("双击，设置场景信息");
        if (dbclickCallbak && dbclickCallbak.constructor === Function) {
            dbclickCallbak(e, scenes);
        }
    };


    return {
        getScenes: function () {
            let result = [];
            for (let p in scenes) {
                result.push(scenes[p]);
                // let c_point = new Point(clickX, clickY);
                // let area = scenes[p];
                // if (PointInPoly(c_point, area.point)) {
                //     points = area.point;
                //     circles = area.circle;
                //     canvas.stop_state = area.stopState;
                //     b_inner = true;
                //     break;
                // }
            }

            return result;
        }
    }

}
