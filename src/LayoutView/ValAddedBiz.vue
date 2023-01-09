<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="headernav">
          <ul class="headernavlist">
            <li v-for="(item, index) in headernavArray" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="nav">
          <img src="/Pict/ValAddedBiz/Logo.jpeg" />

          <ul class="nuvlist">
            <li v-for="(item, index) in navArray" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="banner"></div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <el-footer>
        <div class="footer"></div>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy, data } = getCurrentInstance();

const headernavArray = ref(["加盟合作", "企业新闻", "投诉建议", "免费报价"]);
const navArray = ref(["首页", "装修服务", "品质保障", "精英团队", "装修案例", "实景案例库", "了解猫老爷"]);

//把用户角色存储在session Storage
proxy.$HelperAxios.get(" http://wh011040.mysh360.com/AttrUserAccount/QueryUserGroup", {}).then((val) => {
  if (val.status === 200) {
    // console.log(val);
    if (val.data.StatusCode === "SuccGoal") {
      window.sessionStorage.setItem("jsonArrayUserGroup", JSON.stringify(val.data.Payload.JsonArrayUserGroup));
    } else {
      alert("接口异常");
    }
  } else {
    alert("网络请求错误");
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el-header {
  height: 100%;
}
.headernav {
  height: 40px;
  background-color: #f0f0f0;
}
.headernavlist {
  height: 40px;
  display: flex;
  float: right;
  align-items: center;
  font-size: 14px;
  margin-right: 220px;
}
.headernavlist > li {
  color: #a3a2aa;
  margin-left: 15px;
  cursor: pointer;
}
.headernavlist > li:hover {
  color: cadetblue;
}
.nav {
  height: 80px;
  /* display: flex; */
  /* justify-content: space-between; */
  cursor: pointer;
}
.nuvlist > li:hover {
  color: cadetblue;
}
.nuvlist {
  height: 80px;
  display: flex;
  float: right;
  align-items: center;
  margin-right: 220px;
}
.nuvlist > li {
  /* color: #a3a2aa; */
  margin-left: 40px;
}
.headernav::after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.nav::after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
img {
  /* height: 80px; */
  vertical-align: -50px;
  margin-left: 210px;
}
.banner {
  height: 600px;
  background-image: url("/Pict/ValAddedBiz/Banner.jpg");
  background-size: contain;
  background-repeat: no-repeat;
}
.footer {
  height: 420px;
  background-color: #393939;
  background-image: url("/Pict/ValAddedBiz/Footer.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0 60px;
}
.main {
  background-color: black;
}
::v-deep .el-main {
  height: 100%;
}
</style>
