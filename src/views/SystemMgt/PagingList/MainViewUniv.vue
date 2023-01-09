<template>
  <div class="container">
    <input type="text" class="Searchinput" placeholder="Search" v-model="keyVal" />
    <div class="boxtable">
      <div class="nodata" v-if="!isshow">{{ dataShow }}</div>
      <div class="showbox" v-if="isshow">
        <table class="tablelist">
          <tr class="headertr">
            <th>编号</th>
            <th>标题备注</th>
            <th>创建日期</th>
            <th>修改日期</th>
            <th>AL</th>
            <th>TE</th>
            <th>操作</th>
          </tr>
          <tr v-for="jsonItemLoop in jsonArrayMain" :key="jsonItemLoop.StrPK010">
            <td>{{ jsonItemLoop.DF03000 }}</td>
            <td>{{ jsonItemLoop.TitleMark }}</td>
            <td>{{ jsonItemLoop.StrCT050 }}</td>
            <td>{{ jsonItemLoop.StrMT050 }}</td>
            <td>{{ jsonItemLoop.NumAL040 }}</td>
            <td>{{ jsonItemLoop.NumTE030 }}</td>
            <td>
              <a href="javascript:;" class="opera" @click="turnToDetailPage(jsonItemLoop.StrPK010)">编辑</a>
              <a href="javascript:;" class="opera" @click="deleteFunc(jsonItemLoop.StrPK010)">删除</a>
            </td>
          </tr>
        </table>
        <el-pagination background layout="prev, pager, next" :total="jsonPaging.NumRowQuantity" :default-current-page="jsonPaging.PageIndex" :current-page="jsonPaging.PageIndex" :page-size="jsonPaging.PageSize" class="mt-4" @current-change="setPagingChange" />
      </div>
    </div>

    <div class="NewStory">
      <a href="javascript:;" class="newStorybtn" @click="newPaging">新建文章</a>
    </div>
  </div>
</template>
<script setup>
import { ref, onActivated, watch, onMounted, onBeforeMount, getCurrentInstance } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();

let NumStrData = JSON.parse(window.sessionStorage.getItem("jsonCurrentData"));

//分页初始值
let jsonPaging = ref({
  NumRowQuantity: 0,
  PageSize: 14,
  PageIndex: 1,
});
let jsonArrayMain = ref([]);

//搜索关键词
let keyVal = ref("");

//在搜索不到的情况下显示Nodata
let isshow = ref(true);
let dataShow = "Nodata";

//分页
function setPagingChange(numCurrPageIn) {
  jsonPaging.value.PageIndex = numCurrPageIn;
  handleReqBack();
}
//请求文章列表
function handleReqBack() {
  let reqParams = {
    CurrentDataGroup: NumStrData,
    PageIndex: jsonPaging.value.PageIndex,
    PageSize: jsonPaging.value.PageSize,
  };
  if (keyVal.value.length > 0) {
    reqParams.Keyword = keyVal.value;
  }
  // console.log(reqParams);
  const promiseReq = proxy.$HelperAxios.post("http://wh011040.mysh360.com/DataAccessWithGroup/QueryPagingList", reqParams).then((val) => {
    // console.log(val);
    if (val.status === 200) {
      if (val.data.StatusCode === "SuccGoal") {
        jsonPaging.value.NumRowQuantity = val.data.Payload.NumRowQuantity;
        jsonArrayMain.value = val.data.Payload.DataList;
        // console.log(jsonArrayMain);
      } else {
        // alert("接口异常");
        isshow.value = false;
      }
    } else {
      alert("网络请求错误");
    }
  });
  return promiseReq;
}
handleReqBack();
// console.log(jsonArrayMain);

//防抖搜索
const handleSearchDebounce = handleDebounce((valueIn) => {
  jsonPaging.value.PageIndex = 1;
  jsonPaging.value.NumRowQuantity = 0;
  handleReqBack();
}, 1000);
watch(
  keyVal,
  (newValue, oldValue) => {
    handleSearchDebounce(newValue);
    isshow.value = true;
  },
  { immediate: true, deep: true }
);

//防抖函数
function handleDebounce(funcBackIn, numDelayIn) {
  let timerInner = null;
  return (...args) => {
    if (timerInner) clearTimeout(timerInner);
    timerInner = setTimeout(() => {
      funcBackIn.apply(this, args);
    }, numDelayIn);
  };
}

//删除文章
function deleteFunc(idIn) {
  // console.log(idIn);
  let reqParam = {
    CurrentDataGroup: NumStrData,
    StrPrimaryKey: idIn,
  };

  ElMessageBox.confirm(`Are you sure to delete the specified article?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      proxy.$HelperCore.cssFuncMask(true, 20, null);
      proxy.$HelperAxios.delete("http://wh011040.mysh360.com/DataAccessWithGroup/DeleteDataRow", { params: reqParam }).then((val) => {
        // console.log(val);
        proxy.$HelperCore.cssFuncMask(true, 0, null);

        if (val.data.StatusCode === "SuccGoal") {
          // console.log(val);
          //分页归零
          ElMessage({
            type: val.data.MsgType,
            message: "The data has been deleted.",
          });

          jsonPaging.value.PageIndex = 1;
          jsonPaging.value.NumRowQuantity = 0;
          handleReqBack();
        } else {
          ElMessage({
            type: val.data.MsgType,
            message: "Data saving failure",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete Cancled.",
      });
    });
}

function turnToDetailPage(idIn) {
  proxy.$router.push({ path: "/LayoutViewSystemMgt/DetailedDataTextarea", query: { PrimaryKey: idIn } });
}

//新建文章
function newPaging() {
  let reqParam = {
    TitleMark: "new~",
    CurrentDataGroup: NumStrData,
    ActionId: "InsertData",
  };

  ElMessageBox.confirm(`Are you sure to create a new article?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      proxy.$HelperCore.cssFuncMask(true, 20, null);
      proxy.$HelperAxios.post("http://wh011040.mysh360.com/DataAccessWithGroup/CreateDataRow", reqParam).then((val) => {
        proxy.$HelperCore.cssFuncMask(true, 0, null);
        if (val.data.StatusCode === "SuccGoal") {
          // console.log(val);
          ElMessage({
            type: val.data.MsgType,
            message: "The new article has been created.",
          });
          turnToDetailPage(val.data.Payload);
        } else {
          ElMessage({
            type: val.data.MsgType,
            message: "Data saving failure",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Create Newacticle Cancled.",
      });
    });
}

onActivated(() => {
  handleReqBack();
});
onBeforeMount(() => {});
</script>
<style scoped>
.nodata {
  text-align: center;
  font-size: 24px;
  margin-top: 20px;
}
.Searchinput {
  margin: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  /* color: #ccc; */
  width: 300px;
  border-radius: 5px;
  outline: none;
}
.boxtable {
  width: 100%;
  border-top: 1px solid #ccc;
  /* margin-top: 10px; */
}
.tablelist {
  margin: 15px;
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 85%;
}
.headertr {
  height: 45px;
  background-color: rgb(137, 194, 179);
  border: 1px solid #ccc;
  color: rgb(88, 98, 105);
  font-size: 18px;
}
.tablelist td,
.tablelist th {
  border: 1px solid #ccc;
  padding: 10px 20px;
  text-align: center;
}
.opera {
  margin: 0;
  margin-left: 5px;
  color: rgb(91, 157, 135);
}
.opera:active {
  color: rgb(13, 66, 66);
}
.container {
  /* position: relative; */
  height: 100%;
}
.NewStory {
  /* margin-left: 300px; */
  width: 85%;
  height: 50px;
  background-color: #f1fdf9;
  position: fixed;
  bottom: 0;
  left: 300px;
}
.newStorybtn {
  margin-right: 40px;
  line-height: 50px;
  position: absolute;
  right: 0;
  color: rgb(141, 139, 139);
}
</style>
