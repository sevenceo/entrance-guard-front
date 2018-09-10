<template>
    <div>
        <!--<div style="" v-for="message in messages">-->
        <!--<img :src="message.img" style="height: 150px;width:100px">-->
        <!--</div>-->
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="launchFullScreen">
                全屏
            </el-button>

        </div>
        <div class="htmleaf-container" ref="container" :id="count">
            <div class="wrap" id="wrap" ref="wrap">
                <div class="photo photo_front" v-for="message in messages" :id="message.id" :ref="'photo_'+message.id"
                     @click="turn(message,$event)">
                    <div class="photo-wrap">
                        <div class="side side-front">
                            <div class="image"><img :src="message.img"></div>
                            <div class="caption">{{message.caption}}</div>
                        </div>
                        <div class="side side-back">
                            <p class="desc">{{message.desc}}</p>
                        </div>
                    </div>
                </div>

                <div class="nav">
                    <span v-for="message in messages" :id="'nav_'+message.id" class="i" :ref="'nav_'+message.id"
                          @click="turn(message,$event)">&nbsp;</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

    /* Clearfix hack by Nicolas Gallagher: http://nicolasgallagher.com/micro-clearfix-hack/ */
    .clearfix:before,
    .clearfix:after {
        content: " ";
        display: table;
    }

    /*-webkit-full-screen div{*/

        /*!* properties *!*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /*:-moz-full-screen div{*/
        /*!* properties *!*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /*:-ms-fullscreen div{*/
        /*!* properties *!*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /*:full-screen div{ !*pre-spec *!*/
        /*!* properties *!*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /*:fullscreen div{ !* spec *!*/
        /*!* properties *!*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /*!* deeper elements *!*/
    /*:-webkit-full-screen div {*/
        /*top:0 !important;*/
        /*margin-bottom: 0 !important;*/
        /*margin-top: 0 !important;*/
    /*}*/
    /* styling the backdrop*/
    ::backdrop div{
        /* properties */
        top:0 !important;
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    ::-ms-backdrop div{
        /* properties */
        top:0 !important;
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }


    .clearfix:after {
        clear: both;
    }

    a {
        color: #2fa0ec;
        text-decoration: none;
        outline: none;
    }

    a:hover, a:focus {
        color: #74777b;
    }

    .htmleaf-container {
        /*margin: 0 auto;*/
        text-align: center;
        overflow: hidden;
        height: 100%;
        width: 100%;
        position: relative;
    }

    .htmleaf-content {
        font-size: 150%;
        padding: 1em 0;
    }

    .htmleaf-content h2 {
        margin: 0 0 2em;
        opacity: 0.1;
    }

    .htmleaf-content p {
        margin: 1em 0;
        padding: 5em 0 0 0;
        font-size: 0.65em;
    }

    .bgcolor-1 {
        background: #f0efee;
    }

    .bgcolor-2 {
        background: #f9f9f9;
    }

    .bgcolor-3 {
        background: #e8e8e8;
    }

    /*light grey*/
    .bgcolor-4 {
        background: #2f3238;
        color: #fff;
    }

    /*Dark grey*/
    .bgcolor-5 {
        background: #df6659;
        color: #521e18;
    }

    /*pink1*/
    .bgcolor-6 {
        background: #2fa8ec;
    }

    /*sky blue*/
    .bgcolor-7 {
        background: #d0d6d6;
    }

    /*White tea*/
    .bgcolor-8 {
        background: #3d4444;
        color: #fff;
    }

    /*Dark grey2*/
    .bgcolor-9 {
        background: #ef3f52;
        color: #fff;
    }

    /*pink2*/
    .bgcolor-10 {
        background: #64448f;
        color: #fff;
    }

    /*Violet*/
    .bgcolor-11 {
        background: #3755ad;
        color: #fff;
    }

    /*dark blue*/
    .bgcolor-12 {
        background: #3498DB;
        color: #fff;
    }

    /*light blue*/
    /* Header */
    .htmleaf-header {
        padding: 1em 190px 1em;
        letter-spacing: -1px;
        text-align: center;
    }

    .htmleaf-header h1 {
        font-weight: 600;
        font-size: 2em;
        line-height: 1;
        margin-bottom: 0;
        font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    }

    .htmleaf-header h1 span {
        font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
        display: block;
        font-size: 60%;
        font-weight: 400;
        padding: 0.8em 0 0.5em 0;
        color: #c3c8cd;
    }

    /*nav*/
    .htmleaf-demo a {
        color: #1d7db1;
        text-decoration: none;
    }

    .htmleaf-demo {
        width: 100%;
        padding-bottom: 1.2em;
    }

    .htmleaf-demo a {
        display: inline-block;
        margin: 0.5em;
        padding: 0.6em 1em;
        border: 3px solid #1d7db1;
        font-weight: 700;
    }

    .htmleaf-demo a:hover {
        opacity: 0.6;
    }

    .htmleaf-demo a.current {
        background: #1d7db1;
        color: #fff;
    }

    /* Top Navigation Style */
    .htmleaf-links {
        position: relative;
        display: inline-block;
        white-space: nowrap;
        font-size: 1.5em;
        text-align: center;
    }

    .htmleaf-links::after {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -1px;
        width: 2px;
        height: 100%;
        background: #dbdbdb;
        content: '';
        -webkit-transform: rotate3d(0, 0, 1, 22.5deg);
        transform: rotate3d(0, 0, 1, 22.5deg);
    }

    .htmleaf-icon {
        display: inline-block;
        margin: 0.5em;
        padding: 0em 0;
        width: 1.5em;
        text-decoration: none;
    }

    .htmleaf-icon span {
        display: none;
    }

    .htmleaf-icon:before {
        margin: 0 5px;
        text-transform: none;
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        font-family: 'icomoon';
        line-height: 1;
        speak: none;
        -webkit-font-smoothing: antialiased;
    }

    /* footer */
    .htmleaf-footer {
        width: 100%;
        padding-top: 10px;
    }

    .htmleaf-small {
        font-size: 0.8em;
    }

    .center {
        text-align: center;
    }

    /****/
    .related {
        width: 100%;
        position: absolute;
        top: 800px;
        color: #fff;
        background: #333;
        text-align: center;
        font-size: 1.25em;
        padding: 0.5em 0;
        overflow: hidden;
    }

    .related > a {
        vertical-align: top;
        width: calc(100% - 20px);
        max-width: 340px;
        display: inline-block;
        text-align: center;
        margin: 20px 10px;
        padding: 25px;
        font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    }

    .related a {
        display: inline-block;
        text-align: left;
        margin: 20px auto;
        padding: 10px 20px;
        opacity: 0.8;
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s;
        -webkit-backface-visibility: hidden;
    }

    .related a:hover,
    .related a:active {
        opacity: 1;
    }

    .related a img {
        max-width: 100%;
        opacity: 0.8;
        border-radius: 4px;
    }

    .related a:hover img,
    .related a:active img {
        opacity: 1;
    }

    .related h3 {
        font-family: "Microsoft YaHei", sans-serif;
    }

    .related a h3 {
        font-weight: 300;
        margin-top: 0.15em;
        color: #fff;
    }

    /* icomoon */
    .icon-htmleaf-home-outline:before {
        content: "\e5000";
    }

    .icon-htmleaf-arrow-forward-outline:before {
        content: "\e5001";
    }

    @media screen and (max-width: 50em) {
        .htmleaf-header {
            padding: 3em 10% 4em;
        }

        .htmleaf-header h1 {
            font-size: 2em;
        }
    }

    @media screen and (max-width: 40em) {
        .htmleaf-header h1 {
            font-size: 1.5em;
        }
    }

    @media screen and (max-width: 30em) {
        .htmleaf-header h1 {
            font-size: 1.2em;
        }
    }

    .wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        /*margin-top: -300px;*/
        background-color: #333;
        overflow: hidden;
        -webkit-perspective: 800px;
        -moz-perspective: 800px;
    }

    .photo {
        width: 260px;
        height: 320px;
        position: absolute;
        z-index: 1;
        box-shadow: 0 0 1px rgba(0, 0, 0, .01);

        -webkit-transition: all 0.6s;
        -moz-transition: all 0.6s;

        left: 50%;
        top: 50%;
        margin: -160px 0 0 -130px;
    }

    .photo .side {
        width: 100%;
        height: 100%;
        background-color: #eee;
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px;
        box-sizing: border-box;
    }

    .photo .side-front {
        /*display: none;*/
    }

    .photo .side-front .image {
        width: 100%;
        height: 270px;
        line-height: 250px;
        overflow: hidden;
    }

    .photo .side-front .image img {
        width: 100%;
    }

    .photo .side-front .caption {
        text-align: center;
        font-size: 16px;
        line-height: 30px;
    }

    .photo .side-back {

    }

    .photo .side-back .desc {
        color: #666;
        font-size: 14px;
        line-height: 1.5em;
    }

    .photo_center {
        left: 50%;
        top: 50%;
        margin: -160px 0 0 -130px;
        z-index: 999;
    }

    .photo-wrap {
        position: absolute;
        width: 100%;
        height: 100%;

        -webkit-transform-style: preserve-3d;
        -webkit-transition: all 0.6s;

        -moz-transform-style: preserve-3d;
        -moz-transition: all 0.6s;
    }

    .photo-wrap .side-front {
        -webkit-transform: rotateY(0deg);
        -moz-transform: rotateY(0deg);
    }

    .photo-wrap .side-back {
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
    }

    .photo-wrap .side {
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
    }

    .photo_front .photo-wrap {
        -webkit-transform: rotateY(0deg);
        -moz-transform: rotateY(0deg);
    }

    .photo_back .photo-wrap {
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
    }

    .wrap .nav {
        width: 80%;
        height: 30px;
        line-height: 30px;
        position: absolute;
        left: 10%;
        bottom: 20px;
        z-index: 999;
        text-align: center;
    }

    .wrap .nav .i {
        width: 30px;
        height: 30px;
        display: inline-block;
        cursor: pointer;
        background-color: #aaa;
        text-align: center;
        border-radius: 90%;

        -webkit-transform: scale(0.5);
        -webkit-transition: all 0.5s;

        -moz-transform: scale(0.5);
        -moz-transition: all 0.5s;
    }

    .wrap .nav .i_current {
        -webkit-transform: scale(0.8);
        -moz-transform: scale(0.8);
    }

    .wrap .nav .i_back {
        -webkit-transform: rotateY(-180deg) scale(0.8);
        -moz-transform: rotateY(-180deg) scale(0.8);
        background-color: #555;
    }
</style>
<script src="./PhotoWall.js"></script>
