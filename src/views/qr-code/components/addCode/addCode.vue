<template>
    <div>
        <div class="add-code">
            <!--面包屑-->
            <breadcrumb></breadcrumb>
            <div class="filter-container account-filter-container">
                <el-button class="btn btn-add" type="primary" @click="createActivity" v-if="actionType ==='新增'" :loading="$store.state.app.onXHR">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-baocun"></use>
                    </svg>
                    保存
                </el-button>

                <el-button class="btn btn-add" type="primary" @click="editActivity" v-if="actionType ==='查看'" v-authority="'Activity.Modify'" >
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                    编辑
                </el-button>


                <el-button class="btn btn-add" type="primary" @click="updateActivity" v-if="actionType !=='新增'" v-authority="'Activity.Modify'"      :disabled=" actionType ==='查看'" :loading="$store.state.app.onXHR">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-baocun"></use>
                    </svg>
                    保存
                </el-button>

            </div>

            <div class="code-main">

                <div class="navbar-container">
                    <el-menu mode="horizontal" @select="handleSelect" :default-active="activeIndex"
                             v-if="actionType === '新增'">
                        <router-link :to="{path: x.tabEnName}" v-for="(x,index) in navs" :key="x">
                            <el-menu-item :index=x.tabCode>
                                {{x.tabName}}
                            </el-menu-item>
                        </router-link>
                    </el-menu>

                    <el-menu mode="horizontal" @select="handleSelect" :default-active="activeIndex"
                             v-else-if="actionType ==='查看'">
                        <router-link :to="'../' + x.tabEnName+'/' + activityId" v-for="(x,index) in navs" :key="x">
                            <el-menu-item :index=x.tabCode>
                                {{x.tabName}}
                            </el-menu-item>
                        </router-link>
                    </el-menu>

                    <el-menu mode="horizontal" @select="handleSelect" :default-active="activeIndex" v-else>
                        <router-link :to="'../' + x.tabEnName+'/' + activityId" v-for="(x,index) in navs" :key="x"
                                     v-if="x.tabEnName !=='customer' && x.tabEnName !=='statistics' && x.tabEnName !=='quesReport' ">
                            <el-menu-item :index=x.tabCode>
                                {{x.tabName}}
                            </el-menu-item>
                        </router-link>
                    </el-menu>
                </div>

                <router-view ref="childSection"></router-view>
            </div>

        </div>
    </div>
</template>

<script src="./addCode.js">

</script>

<style scoped>

</style>