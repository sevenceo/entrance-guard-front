<template>
    <div>
        <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit"  @tab-click="handleClick" class="mt-10">
            <el-tab-pane
                    :key="item.name"
                    v-for="(item, index) in editableTabs"
                    :label="item.title"
                    :name="item.name"
            >
            </el-tab-pane>
        </el-tabs>
        <transition>
            <keep-alive>
                <router-view name="1"></router-view>
            </keep-alive>
        </transition>



    </div>
</template>

<script src="./tabPage.js"></script>
<style scoped src="./tabPage.scss"></style>