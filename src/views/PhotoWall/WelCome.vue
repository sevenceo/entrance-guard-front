<script src="WelCome.js"></script>
<template>
    <div>
        <div class="mainWarp" id="mainWarp" ref="mainWarp">
            <!--<div style="" v-for="message in messages">-->
            <!--<img :src="message.img" style="height: 150px;width:100px">-->
            <!--</div>-->
            <!--<breadcrumb></breadcrumb>-->
            <div class="user-filter-container">
                <el-button class="btn btn-add" type="primary" @click="switchFullScreenText">
                    {{switchText}}
                </el-button>
            </div>
            <div class="picbox">
                <div class="imgbox">
                    <!--<img src="../../assets/images/welcome/demopic01.png" id="showImg"/>-->
                    <!--<p class="ibname">览q`1笛科技</p>-->

                    <!--<div class="wrap" id="wrap" ref="wrap">-->
                    <!--<div class="photo photo_front" v-for="message in messages" :id="message.id"-->
                    <!--:ref="'photo_'+message.id">-->
                    <!--<div class="photo-wrap">-->
                    <!--<div class="side side-front" v-bind:class="classArray">-->
                    <!--<div class="image"><img v-bind:class="animation" v-bind:src="photoUrl"-->
                    <!--style="width:310px;height:440px"></div>-->
                    <!--<p class="ibname">{{name}}</p>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
                    <transition enter-active-class="zoomIn" leave-active-class="zoomOutUp"
                                v-on:before-enter="beforeEnter"
                                v-on:enter="enter"
                                v-on:leave="leave">
                        <div v-if="show">
                            <img class="animated" style="width:310px;height:440px" v-bind:src="showImg"/>
                            <p class="ibname">{{name}}</p>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    @import "../../assets/styles/main.css";
    /*@import "../../../node_modules/vue2-animate/dist/vue2-animate.css";*/

    .el:-webkit-full-screen {
        width: 100vw;
        height: 100vh;
        background: red;
    }

    .el:-moz-full-screen {
        width: 100vw;
        height: 100vh;
    }

    .el:-ms-fullscreen {
        width: 100vw;
        height: 100vh;
    }

    .el:fullscreen {
        width: 100vw;
        height: 100vh;
        background: red;
    }
</style>

<script src="./WelCome.js"></script>
