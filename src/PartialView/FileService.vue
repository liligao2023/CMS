<template>
  <div class="nav">
    <div class="picfile file">图片文件</div>
    <div class="vefile file">视频文件</div>
  </div>
  <div class="box" v-loading="loading">
    <div class="imgbox" v-for="jsonItem in josnPicData">
      <img :src="jsonItem.RL02Main" alt="" />
      <div class="infopic">
        <div class="titlepic">{{ jsonItem.FN010 }}</div>
        <input type="checkbox" class="check" />
        <a href="javascrpit:;" class="insertRich">插入富文本</a>
        <span class="deletepic" @click="handleDeletPic(jsonItem.FN010)">删除</span>
      </div>
    </div>

    <el-upload ref="uploadRef" action="http://wh011024.mysh360.com/FileServSystemMgt/FileUpload" :auto-upload="false" :data="ReqData" class="btnupload">
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>

      <el-button type="success" @click="submitUpload"> upload to server </el-button>
    </el-upload>

    <div class="fetchbox">
      <!-- <div class="fileselect" style="display: inline-block">
        <input type="file" id="fildUpload" class="files" style="outline: none" />
        <div class="textipt" style="font-size: 15px">选择文件</div>
      </div> -->
      <input type="file" id="fildUpload" />
      <button class="uploadbtn" @click="hanleFileUpload">上传到服务器</button>
    </div>
  </div>
</template>
<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const uploadRef = ref(null);

let loading = ref(false);
const actionTitle = "文件管理";
const submitUpload = () => {
  uploadRef.value.submit();
  loading.value = true;
  setTimeout(() => {
    getPicFileList();
    loading.value = false;
  }, 2000);
};
const propsdata = defineProps({
  ReqData: Object,
});

function docFuncAccessDenied(strMsg) {
  ElMessageBox.alert(strMsg, actionTitle, {
    confirmButtonText: "OK",
    callback: (action) => {
      window.location.replace("/");
    },
  });
}

let josnPicData = ref([]);
defineExpose({
  getPicFileList,
});
function getPicFileList() {
  let reqParam = {
    CurrentDataGroup: propsdata.ReqData.CurrentDataGroup,
    StrPrimaryKey: propsdata.ReqData.StrPrimaryKey,
    FileType: "ImageFile",
  };
  proxy.$HelperAxios.post("http://wh011024.mysh360.com/FileServSystemMgt/FileList", reqParam).then((val) => {
    if (val.status === 200) {
      if (val.data.StatusCode === "SuccGoal") {
        // console.log(val);
        josnPicData.value = val.data.Payload;
        let jsonTest = JSON.stringify(josnPicData.value);
        let jsonA = jsonTest.replaceAll("https", "http").replaceAll("PlaceholderColon", ":").replaceAll("PlaceholderComma", ",").replaceAll("PlaceholderQuote", '"');
        josnPicData.value = JSON.parse(jsonA);
        // console.log(josnPicData);
      } else {
        alert("接口异常");
      }
    } else {
      alert("网络请求错误");
    }
  });
}

//fetch
const hanleFileUpload = () => {
  loading.value = true;
  const accessToken = window.localStorage.getItem("AccessToken");
  if (accessToken === null) {
    docFuncAccessDenied("Current user account is not online.");
  } else {
    const fileUploadInner = document.querySelector("#fildUpload");
    const formData = new FormData();
    formData.append("file", fileUploadInner.files[0]);
    formData.append("CurrentDataGroup", propsdata.ReqData.CurrentDataGroup);
    formData.append("StrPrimaryKey", propsdata.ReqData.StrPrimaryKey);
    formData.append("FileType", propsdata.ReqData.FileType);
    formData.append("AccessToken", propsdata.ReqData.AccessToken);
    fetch("http://wh011024.mysh360.com/FileServSystemMgt/FileUpload", {
      method: "POST",
      body: formData,
    })
      .then((respResult) => {
        if (respResult.ok) {
          return respResult.text();
        } else {
          return "FailWebReq";
        }
      })
      .then((strRespResult) => {
        if (strRespResult !== "FailWebReq") {
          let jsonRespResult = JSON.parse(strRespResult);
          if (jsonRespResult.StatusCode === "SuccLocal") {
            ElMessage({
              message: "文件上传完毕",
              type: "info",
            });
            setTimeout(() => {
              getPicFileList();
              loading.value = false;
            }, 2000);
          } else {
            ElMessage({
              message: "文件上传失败",
              type: "error",
            });
          }
        } else {
          alert("网络错误");
        }
      });
  }
};

//delete
const handleDeletPic = (FN01N8) => {
  ElMessageBox.confirm(`This action will permanently delete the file ${FN01N8},Continue?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      let reqParams = {
        AccessToken: propsdata.ReqData.AccessToken,
        CurrentDataGroup: propsdata.ReqData.CurrentDataGroup,
        FileName: FN01N8,
        FileType: propsdata.ReqData.FileType,
        StrPrimaryKey: propsdata.ReqData.StrPrimaryKey,
      };
      proxy.$HelperAxios.post("http://wh011024.mysh360.com/FileServSystemMgt/DelFileSingle", reqParams).then((val) => {
        // console.log(val);
        if (val.data.StatusCode === "SuccGoal") {
          ElMessage({
            message: `The file: ${val.data.Payload.FN010} has been deleted`,
            type: "info",
          });
          getPicFileList();
        } else {
          ElMessage({
            message: `Failed to delete the filr: ${val.data.Payload.FN010}`,
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete cancled",
      });
    });
};
</script>
<style scoped>
.nav {
  display: flex;
  height: 50px;
  align-items: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.nav .file {
  padding: 15px 15px;
}
.picfile {
  border-bottom: 2px solid rgb(176, 99, 4);
}
.btnupload {
  margin-left: 15px;
}
.imgbox {
  width: 400px;
  height: 350px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
}
.imgbox > img {
  display: block;
  width: 350px;
  height: 260px;
  border: 1px solid #ccc;
  margin: 0 auto;
  margin-top: 10px;
}
.infopic {
  margin-left: 25px;
}
.titlepic {
  margin: 10px 0;
}
.check {
  margin-right: 210px;
}
.insertRich {
  margin-right: 10px;
}
a,
span {
  color: rgb(125, 116, 116);
  cursor: pointer;
}
.box {
  /* height: 100%; */
  /* overflow-y: auto; */
  margin-bottom: 50px;
}
.fetchbox {
  border-bottom: 1px solid #ccc;
  margin-top: 20px;
  padding: 30px 15px;
  display: flex;
}
.fetchbox > .uploadbtn {
  padding: 10px 10px;
  background-color: skyblue;
  border: none;
  border-radius: 3px;
  color: white;
}
.fileselect {
  margin-right: 30px;
  height: 39px;
  width: 100px;
  overflow: hidden;
  color: #cccccc;
  font-size: 18px;
  position: relative;
  text-align: center;
  border-radius: 3px;
}

.files {
  width: 100px;
  padding-left: 0px;
  height: 44px;
  cursor: pointer;
  outline: none;
  border: none;
  display: block;
  opacity: 0;
  position: absolute;
  padding-top: 41px;
  top: 0;
  left: 0;
}

.textipt {
  background: palevioletred;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  height: 54px;
  line-height: 38px;
  min-width: 100px;
  overflow: hidden;
}
</style>
