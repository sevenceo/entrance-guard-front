<template>
  <el-select class="mt-10" v-model="value" placeholder="请选择">
    <slot name="sel-options"></slot>    
  </el-select>
</template>

<script>
  export default {
    props:['value']
  }
</script>