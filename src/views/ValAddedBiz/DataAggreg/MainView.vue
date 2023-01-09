<template>
  <div class="wrap">
    <div class="title">
      <span>专业的设计团队，为您打造理想的家居环境</span>
    </div>
    <div class="main">
      <div class="left">
        <el-tree :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange" />
      </div>
      <div class="right">
        <ul class="card">
          <li v-for="(item, i) in jsonArrayInfo" :key="i" class="cardli">
            <img :src="item.src" alt="" />
            <div class="info">
              <p class="uname">{{ item.uname }}</p>
              <p class="post">{{ item.post }}</p>
              <p class="skill">{{ item.skill }}</p>
              <p class="other">{{ item.other }}</p>
              <div class="goodat">擅长户型：{{ item.goodat }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type Node from "element-plus/es/components/tree/src/model/node";
let jsonArrayInfo = ref([
  {
    src: "/Pict/Cat.jpg",
    uname: "龙百万",
    post: "首席家装设计师",
    skill: "擅长前端（Vue方向）",
    other: "对豆豉回锅肉的制作有独到见解",
    goodat: "拼盘雕刻，设计家装",
  },
  {
    src: "/Pict/Cat.jpg",
    uname: "龙百万",
    post: "首席家装设计师",
    skill: "擅长前端（Vue方向）",
    other: "对豆豉回锅肉的制作有独到见解",
    goodat: "拼盘雕刻，设计家装",
  },
  {
    src: "/Pict/Cat.jpg",
    uname: "龙百万",
    post: "首席家装设计师",
    skill: "擅长前端（Vue方向）",
    other: "对豆豉回锅肉的制作有独到见解",
    goodat: "拼盘雕刻，设计家装",
  },
  {
    src: "/Pict/Cat.jpg",
    uname: "龙百万",
    post: "首席家装设计师",
    skill: "擅长前端（Vue方向）",
    other: "对豆豉回锅肉的制作有独到见解",
    goodat: "拼盘雕刻，设计家装",
  },
]);

let count = 1;

interface Tree {
  name: string;
}

const props = {
  label: "name",
  children: "zones",
};

const handleCheckChange = (data: Tree, checked: boolean, indeterminate: boolean) => {
  console.log(data, checked, indeterminate);
};

const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    return resolve([{ name: "风格" }, { name: "户型" }, { name: "设计师职级" }]);
  }
  if (node.level > 3) return resolve([]);

  let hasChild = false;
  if (node.data.name === "region1") {
    hasChild = true;
  } else if (node.data.name === "region2") {
    hasChild = false;
  } else {
    hasChild = Math.random() > 0.5;
  }

  setTimeout(() => {
    let data: Tree[] = [];
    if (hasChild) {
      data = [
        {
          name: `zone${count++}`,
        },
        {
          name: `zone${count++}`,
        },
      ];
    } else {
      data = [];
    }

    resolve(data);
  }, 500);
};
</script>
<style scoped>
.wrap {
  width: 1300px;
  margin: 0 auto;
  height: 100%;
}
.title {
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  width: 100%;
  padding-left: 85px;
  color: #57504a;
  border-bottom: 1px solid #949188;
}
.left {
  width: 200px;
  height: 520px;
  background-color: white;
  float: left;
  padding-top: 15px;
}
.el-tree {
  height: 100%;
}
.right {
  width: 1100px;
  /* height: 200px; */
  float: right;
  /* background-color: aquamarine; */
}
.main {
  margin-top: 10px;
  height: 100%;
}
img {
  width: 160px;
  height: 250px;
}
.cardli {
  width: 540px;
  height: 250px;
  display: flex;
  background-color: white;
  float: left;
  margin-right: 20px;
}
ul li:nth-child(2) {
  margin-right: 0;
  margin-bottom: 20px;
}
ul li:nth-child(4) {
  margin-right: 0;
}
.info {
  width: 100%;
  /* margin-left: 30px; */
  margin-top: 30px;
  padding: 0 35px;
}
.uname {
  font-size: 22px;
  margin-bottom: 20px;
}
p {
  /* line-height: 30px; */
  margin-bottom: 10px;
  font-size: 14px;
}
.goodat {
  width: 100%;
  margin-top: 25px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  font-size: 14px;
  color: #949188;
}
.main::after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  visibility: hidden;
}
</style>
