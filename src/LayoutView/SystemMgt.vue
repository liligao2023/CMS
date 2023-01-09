<template>
  <div class="nav">
    <img src="/logo.png" alt="" class="vuelogo" />
    <div class="userinfo">
      <span>用户名：{{ userName }}</span>
      <span><a href="/LayoutViewUserAccount/VerfyUserWebCmd" @click="turnBack">退出</a></span>
    </div>
  </div>
  <div class="contianer">
    <div class="left">
      <div class="header">System Admin</div>
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" v-loading="loadingFlag" />
    </div>
    <div class="right">
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="NumDataGroup"></component>
      </router-view>
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { getCurrentInstance, ref, onMounted, onBeforeMount } from "vue";
const { proxy } = getCurrentInstance();
let data = ref([]);
let loadingFlag = ref(true);

//用户角色
const username = JSON.parse(window.sessionStorage.getItem("jsonArrayUserGroup"));
// console.log(username);
let userName = username[0].NumUserGroup;

//请求数据 渲染侧边栏
const promiseReq = proxy.$HelperAxios.get(" http://wh011040.mysh360.com/DataAccessWithGroup/QueryDataGroup", { params: {} });
promiseReq.then((resultValue) => {
  if (resultValue.status === 200) {
    // console.log(resultValue);
    if (resultValue.data.StatusCode === "SuccGoal") {
      data.value = resultValue.data.Payload;
      //加载
      loadingFlag.value = false;
    } else {
      alert("接口异常");
    }
  } else {
    alert("网络请求错误");
  }
});

//存储当前页面编号
let NumDataGroup = ref(0);
const handleNodeClick = (dataIn) => {
  if (proxy.$HelperCore.boolFuncJsonExistChk(dataIn.JO01LC030, "HomeSystemMgt")) {
    if (dataIn.NV04AP040[2] === 2) {
      window.sessionStorage.setItem("jsonCurrentData", JSON.stringify(dataIn.NumDataGroup));
      const strPath = dataIn.JO01LC030.HomeSystemMgt.URL;
      NumDataGroup.value = dataIn.NumDataGroup;
      //编程式路由跳转到对应页面  加key值区分页面
      proxy.$router.push({ path: strPath });
    } else {
      ElMessage({
        message: "Authorization is required for viewing",
        type: "info",
      });
      proxy.$router.push({ path: "/LayoutViewSystemMgt" });
    }
  } else {
    proxy.$router.push({ path: "/LayoutViewSystemMgt" });
  }
};

const defaultProps = {
  children: "ListChild",
  label: "ShowText",
};

//退出登录
function turnBack() {
  window.localStorage.removeItem("AccessToken");
  window.sessionStorage.removeItem("jsonArrayUserGroup");
}
</script>
<style scoped>
.nav {
  height: 45px;
  width: 100%;
  box-shadow: 0 2px 4px 5px rgba(0, 0, 0, 0.16);
  position: absolute;
  top: 0;
}
.nav::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.vuelogo {
  margin-left: 10px;
  margin-top: 5px;
  width: 30px;
  height: 30px;
}

.contianer {
  padding-top: 45px;
  display: flex;
  height: 100%;
  box-sizing: border-box;
}
.left {
  box-sizing: border-box;
  width: 300px;
  height: 100%;
  background-color: #eaedf2;
}
.right {
  height: 100%;
  /*让其将剩余空间铺满*/
  flex: 1;
  overflow-y: auto;
}
.header {
  /* padding: 15px 150px 10px 20px; */
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 15px;
  text-align: center;
}
.el-tree-node {
  padding: 20px;
}
.allstyle {
  display: block;
  padding: 10px 0;
  color: rgb(63, 62, 62);
}
.allstyle:hover {
  color: rgb(64, 106, 242);
}
::v-deep .el-tree-node__content {
  padding: 15px;
  background-color: #eaedf2;
}
::v-deep .el-tree-node__label {
  font-size: 18px;
}
.userinfo {
  height: 45px;
  float: right;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.userinfo span:nth-child(1) {
  margin-right: 25px;
}
</style>
