<template>
  <form action="" class="editorInner" v-show="!boolFileServ">
    <section>
      <span class="tag">Mark Title</span>
      <input type="text" v-model="jsonArrayRepEdit.TitleMark" class="ipt" placeholder="Mark_Title" />
    </section>
    <section>
      <span class="tag">Formal Title</span>
      <input type="text" v-model="jsonArrayRepEdit.TitleFormal" class="ipt" placeholder="Formal_Title" />
    </section>
    <section>
      <span class="tag">Short Title</span>
      <input type="text" v-model="jsonArrayRepEdit.TitleShort" class="ipt" placeholder="Short_Title" />
    </section>
    <section class="moretext">
      <span class="tag">导读</span>
      <textarea name="" id="" cols="130" rows="6" v-model="jsonArrayRepEdit.Intro" class="textareabox" placeholder="文章摘要..."></textarea>
    </section>

    <section>
      <div style="border: 1px solid #ccc; width: 1000px">
        <Toolbar style="border-bottom: 1px solid #ccc; width: 1000px" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 300px; width: 1000px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
      </div>
    </section>

    <section>
      <span class="tag">Take Effect</span>
      <el-select v-model="jsonArrayRepEdit.NumTE030" class="m-2" placeholder="Select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </section>

    <section>
      <span class="tag">Keyword</span>
      <input type="text" v-model="jsonArrayRepEdit.Keyword" class="ipt" placeholder="_Keyword" />
    </section>

    <section>
      <span class="tag">Source</span>
      <input type="text" v-model="jsonArrayRepEdit.StrSource" class="ipt" placeholder="_Source" />
    </section>
  </form>

  <div class="submitbox">
    <div class="left">
      <span @click="turnBackMain">返回</span>
    </div>
    <div class="right">
      <span @click="resetPaging">重置</span>
      <span @click="isShowFileServ">文件管理</span>
      <span @click="submitChange">提交</span>
    </div>
  </div>

  <div v-show="boolFileServ">
    <PartialViewFileServ :ReqData="sendtoChild" ref="getPicFile"></PartialViewFileServ>
  </div>
</template>

<script setup>
import { ref, onActivated, watch, onMounted, onBeforeMount, shallowRef, getCurrentInstance, onBeforeUnmount } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import PartialViewFileServ from "@/PartialView/FileService.vue";

const { proxy } = getCurrentInstance();

let NumStrData = JSON.parse(window.sessionStorage.getItem("jsonCurrentData"));

let jsonArrayRepEdit = ref({});
let jsonArrayRepSave = {};

let PrimaryKey = ref("");
PrimaryKey.value = proxy.$route.query.PrimaryKey;
let AccessToken = window.localStorage.getItem("AccessToken");
//控制是否显示文件管理组件
let boolFileServ = ref(false);

let sendtoChild = {
  CurrentDataGroup: NumStrData,
  StrPrimaryKey: PrimaryKey.value,
  FileType: "ImageFile",
  AccessToken: AccessToken,
};

const getPicFile = ref(null);

const options = [
  {
    value: 1,
    label: "生效",
  },
  {
    value: 0,
    label: "失效",
  },
];

getDetailInfo(PrimaryKey.value);

function getDetailInfo(idIn) {
  let reqParam = {
    CurrentDataGroup: NumStrData,
    StrPrimaryKey: idIn,
  };
  proxy.$HelperAxios.post("http://wh011040.mysh360.com/DataAccessWithGroup/DetailedDataRow", reqParam).then((val) => {
    if (val.status === 200) {
      if (val.data.StatusCode === "SuccGoal") {
        jsonArrayRepSave = val.data.Payload;
        jsonArrayRepEdit.value = JSON.parse(JSON.stringify(jsonArrayRepSave));
        // console.log(jsonArrayRepSave.value);
      } else {
        alert("接口异常");
      }
    } else {
      alert("网络请求错误");
    }
  });
}

function resetPaging() {
  ElMessageBox.confirm(`Are you sure to reset the specified article?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "Reset Successed.",
      });
      jsonArrayRepEdit.value = JSON.parse(JSON.stringify(jsonArrayRepSave));
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Reset Cancled.",
      });
    });
  // console.log(jsonArrayRepEdit);
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
let valueHtml = ref("<p>hello</p>");
valueHtml.value = jsonArrayRepEdit.value.Richtext;

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

let mode = "default"; // 或 'simple'

function turnBackMain() {
  //返回主界面
  proxy.$router.push({ path: "/LayoutViewSystemMgt/PagingListUniv" });
}

//提交修改
let reqParam = ref({});
function submitChange() {
  Object.assign(reqParam, jsonArrayRepEdit.value, { CurrentDataGroup: NumStrData });
  ElMessageBox.confirm(`Are you sure to submit the specified article?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      proxy.$HelperCore.cssFuncMask(true, 20, null);
      proxy.$HelperAxios.post("http://wh011040.mysh360.com/DataAccessWithGroup/UpdateDataRow", reqParam).then((val) => {
        if (val.status === 200) {
          // console.log(val);
          if (val.data.StatusCode === "SuccGoal") {
            ElMessage({
              type: val.data.MsgType,
              message: "The data has been modify.",
            });
            // console.log(val);
          } else {
            alert("接口异常");
          }
        } else {
          alert("网络请求错误");
        }
      });

      proxy.$router.push({ path: "/LayoutViewSystemMgt/PagingListUniv" });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Submit Cancled.",
      });
    });
}

function isShowFileServ() {
  if (boolFileServ.value === false) {
    boolFileServ.value = true;
  } else {
    boolFileServ.value = false;
  }

  getPicFile.value.getPicFileList();
}
</script>
<style scoped>
.editorInner {
  margin: 20px 20px 50px;
  /* margin-bottom: 50px; */
}
section {
  margin-bottom: 10px;
}
.tag {
  margin-right: 10px;
  color: rgb(142, 141, 141);
}
.ipt {
  width: 1000px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: none;
  padding-left: 10px;
  /* color: rgb(28, 0, 141); */
}
.moretext {
  display: flex;
}
.textareabox {
  border: 1px solid #ccc;
  outline: none;
  /* padding-left: 10px; */
  padding: 5px 10px;
  /* resize: none; */
}
.select {
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 0 5px;
}
.submitbox {
  width: 85%;
  height: 50px;
  background-color: #f1fdf9;
  position: fixed;
  bottom: 0;
  left: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(141, 139, 139);
}
.left {
  margin-left: 10px;
}
.left > span {
  cursor: pointer;
}
.right {
  margin-right: 15px;
}
.right > span {
  padding: 0 15px;
  cursor: pointer;
}
</style>
