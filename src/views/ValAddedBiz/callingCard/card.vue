<template>
  <div class="SlotsBox">
    <div class="Photoname">
      <span class="Phototitle">相册组件</span>
    </div>
    <div class="FlagSlot">
      <img src="/Pict/Cat.jpg" alt="" />
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.SlotsBox {
  width: 100px;
  height: 100px;
  display: inline-block;
  margin: 20px;
  border: 1px solid #ccc;
}
.Photoname {
  padding: 10px;
}
.FlagSlot {
  padding: 10px;
}
img {
  height: 50px;
  width: 50px;
}
</style>
