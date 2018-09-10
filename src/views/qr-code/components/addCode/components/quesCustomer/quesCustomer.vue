<template>
    <div>
        <div class="child-code">
            <h3 class="title">请选择留资项:</h3>
            <el-checkbox-group
                    v-model="checkedItems"
                    >
                <el-checkbox @change="checkCheck" v-for="x in checkBoxList" :checked="x.isRequired" :label="x.fieldZhName" :key="x.fieldName" :disabled="isDisabled"></el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script src="./quesCustomer.js">

</script>

<style src="./quesCustomer.scss" scoped>

</style>