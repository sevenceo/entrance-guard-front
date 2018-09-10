// import {mapActions} from 'vuex'
//import {getToServer} from '../api/api'

export default {
    data() {
        return {
            endPoint: "http://192.168.1.13/dealer/endpoit",
            inputText: '',
            messages: [],
            imgHash: {},
            current: null,
            count: 0

        }
    },
    stompClient: {
        monitorIntervalTime: 10000,
        stompReconnect: true,
        timeout(orgCmd) {
        }
    },
    methods: {
        launchFullScreen() {
            let element = this.$refs.wrap;
            if (element.requestFullscreencreen) {
                element.requestFullScreen()
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen()
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen()
            } else if (element.msRequestFullScreen) {
                element.msRequestFullScreen()
            }
            this.sort(this.current);
        },
        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            }
        },
        turn(message, event) {
            let elem = event.currentTarget;
            console.log(message);
            console.log(elem);
            console.log(event);

            let photo = this.$refs["photo_" + message.id];
            var cls = photo.className;

            if (!/photo_center/.test(cls)) {
                return this.sort(message.id);
            }

            let nav = this.$refs["nav_" + message.id];
            if (/photo_front/.test(cls)) {
                cls = cls.replace(/photo_front/, 'photo_back');
                nav.className += ' i_back ';
            } else {
                cls = cls.replace(/photo_back/, 'photo_front');
                nav.className = nav.className.replace(/\s*i_back\s*/, ' ');
            }
            return elem.className = cls;
        },
        sort(n) {
            if (!!!this.$refs.wrap) {
                return;
            }
            let _photo = this.$refs.wrap.querySelectorAll('.photo');
            let photos = [];
            let photosMap = {};
            for (i = 0; i < _photo.length; i++) {

                if (_photo[i].id == n) {
                    _photo[i].className = _photo[i].className.replace(/\s*photo_center\s*/, ' ');
                    _photo[i].className = _photo[i].className.replace(/\s*photo_front\s*/, ' ');
                    _photo[i].className = _photo[i].className.replace(/\s*photo_back\s*/, ' ');
                    _photo[i].className += ' photo_front';
                    _photo[i].style.left = '';
                    _photo[i].style.top = '';
                    _photo[i].name = _photo[i].style["z-index"];
                    _photo[i].style["z-index"] = "10000";
                    _photo[i].style['transform'] = 'rotate(360deg) scale(1.5)';
                    _photo[i].style['-webkit-transform'] = 'rotate(360deg) scale(1.5)';
                }
                if (_photo[i].name)
                    _photo[i].style["z-index"] = _photo[i].name;
                photos.push(_photo[i]);
                photosMap[_photo[i].id] = _photo[i];
            }

            var photo_center = photosMap[n];//this.$refs.wrap.querySelector('#photo_' + n);

            if (photo_center)
                photo_center.className += ' photo_center';

            //photo_center = photos.splice(n, 1)[0];

            let photos_left = photos.splice(0, Math.ceil(photos.length / 2));
            let photos_right = photos;

            let ranges = this.range();
            for (var i = 0; i < photos_left.length; i++) {
                if (photos_left[i].id == n) {
                    continue;
                }

                photos_left[i].style.left = this.random(ranges.left.x) + "px";
                photos_left[i].style.top = this.random(ranges.left.y) + "px";
                photos_left[i].style['transform'] = 'rotate(' + this.random([-150, 150]) + 'deg) scale(1)';
                photos_left[i].style['-webkit-transform'] = 'rotate(' + this.random([-150, 150]) + 'deg) scale(1)';
            }
            for (var i = 0; i < photos_right.length; i++) {
                if (photos_right[i].id == n) {
                    continue;
                }
                photos_right[i].style.left = this.random(ranges.right.x) + "px";
                photos_right[i].style.top = this.random(ranges.right.y) + "px";
                photos_right[i].style['transform'] = 'rotate(' + this.random([-150, 150]) + 'deg) scale(1)';
                photos_right[i].style['-webkit-transform'] = 'rotate(' + this.random([-150, 150]) + 'deg) scale(1)';
            }
            let navs = this.$refs.wrap.querySelectorAll('.i');
            for (var i = 0; i < navs.length; i++) {
                navs[i].className = navs[i].className.replace(/\s*i_current\s*/, ' ');
                navs[i].className = navs[i].className.replace(/\s*i_back\s*/, ' ');
            }
            this.$refs.wrap.querySelector('#nav_' + n).className += ' i_current ';
        },
        range() {
            let range = {left: {x: [], y: []}, right: {x: [], y: []}};
            //let wrap = this.$refs.
            let wrapper = this.$refs.wrap.querySelector("#wrap");
            let photos = this.$refs.wrap.querySelectorAll(".photo");

            if ($(".photo")[0] && $("#wrap")) {
                let wrap = {
                    w: $("#wrap")[0].clientWidth,
                    h: $("#wrap")[0].clientHeight
                }
                let photo = {
                    w: $(".photo")[0].clientWidth,
                    h: $(".photo")[0].clientHeight
                }
                range.wrap = wrap;
                range.photo = photo;

                range.left.x = [0, wrap.w / 2 - photo.w / 2];
                range.left.y = [0, wrap.h - photo.w / 2];
                range.right.x = [wrap.w / 2 + photo.w / 2, wrap.w];
                range.right.y = [0, wrap.h - photo.w / 2];
            }
            return range;
        },
        random(range) {
            let max = Math.max(range[0], range[1]);
            let min = Math.min(range[0], range[1]);
            let diff = max - min;
            let number = Math.floor(Math.random() * diff + min);
            return number;
        },
        onConnected(frame) {
            this.$stompClient.subscribe('/topic/feature/hit-result', this.receiveFeature, this.onFailed)
        },
        onFailed(frame) {
            //alert('Failed: ' + JSON.stringify(frame));
        },
        connectSrv() {
            let headers = {
                //"login": 'guest',
                //"passcode": 'guest',
                // additional header
            };
            this.connetWM(this.endPoint, headers, this.onConnected, this.onFailed);
        },
        receiveFeature(frame) {
            let data = JSON.parse(frame.body);
            let faceInfo = JSON.parse(data.responseMessage)

            if (faceInfo.id) {
                if (!this.imgHash[faceInfo.id]) {
                    if (this.messages.length >= 5) {
                        //保持每屏5个人
                        let i = this.messages.shift();
                        delete this.imgHash[i.id];

                        this.messages = this.messages.slice(1);
                    }
                    faceInfo.img = "data:image/jpeg;base64," + faceInfo.img
                    this.messages.push(faceInfo);
                    this.imgHash[faceInfo.id] = faceInfo.id;
                    //this.sort(faceInfo.id);
                }
                this.current = faceInfo.id;
                this.count++; //count 需在页面使用， 用于触发调用生命周期的 update 事件，在update事件中重新排列照片墙
            }
        },
        disconnect() {
            this.disconnetWM();
        }
    },
    mounted() {
        this.connectSrv();
    },
    beforeDestroy() {
        this.$stompClient.disconnect()
    },
    updated() {
        this.sort(this.current);
        console.group('updated 更新完成状态===============》');
    }
}
