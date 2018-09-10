<template>
    <div>
        <div class="sharing-material shared-material">
            <breadcrumb></breadcrumb>

            <!--操作区-->
            <div class="fixed-bar">
                <ul>
                    <router-link :to="{name:'共享外链'}">
                        <li><span>外链</span></li>
                    </router-link>
                    <router-link :to="{name:'共享图片'}">
                        <li>图片</li>
                    </router-link>
                    <router-link :to="{name:'共享图文'}">
                        <li>图文</li>
                    </router-link>
                    <router-link :to="{name:'共享文字'}">
                        <li>文字</li>
                    </router-link>
                    <router-link :to="{name:'共享语音'}">
                        <li>语音</li>
                    </router-link>
                    <router-link :to="{name:'共享视频'}">
                        <li>视频</li>
                    </router-link>
                </ul>
            </div>

            <router-view></router-view>
        </div>


    </div>
</template>

<script src="./sharedMaterial.js"></script>

<style scoped lang="scss">

    .fixed-bar {
        position: absolute;
        left:20px;
        top:110px;
        ul {
            margin: 0;
            padding: 0;
        }
        li {
            float: left;
            list-style: none;
            background-color: #fff;
            color: #000;
            line-height: 22px;
            height: 40px;
            width: 90px;
            box-sizing: border-box;
            padding: 10px 30px;
            margin-right:2px;
            border:solid 1px #c8cbd0;
        }
    }

    .router-link-active li {
        background-color: #4d84ba;
        color: #fff;
        border: solid 1px #c8cbd0;
    }
    .avatar-uploader-icon {
        width: 100px;
        height: 100px;
        line-height: 100px;
    }
    .shared-material .material-wrapper{
        padding-top:0;
    }

</style>