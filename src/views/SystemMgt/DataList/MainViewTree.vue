<template>
  <div>页面编号：{{ NumJsonData }}</div>
</template>
<script setup>
import { ref } from "vue";

let NumStrData = window.sessionStorage.getItem("jsonCurrentData");
let NumJsonData = ref(JSON.parse(NumStrData));
// console.log(NumStrData);
</script>
<style scoped>
div {
  margin: 20px;
  background-color: rgb(86, 193, 157);
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  font-size: 20px;
  color: white;
}
</style>
