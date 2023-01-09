import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
// 用一个变量定义路由.
const jsonArrayRoute = [
  {
    // IAM 登录跳转, 不判断用户在线状态.
    path: "/LayoutViewUserAccount",
    component: () => import("@/LayoutView/UserAccount.vue"),
    meta: {
      StrRouteTitle: "",
      StrRouteTip: "",
    },
    children: [{ path: "VerfyUserWebCmd", component: () => import("@/views/ShareAccountClient/VerfyUser/MainViewWebCmd.vue") }],
  },
  {
    // 猫老爷前台, 不判断用户在线.
    path: "/",
    component: () => import("@/LayoutView/ValAddedBiz.vue"),
    children: [
      { path: "", component: () => import("@/views/ValAddedBiz/DataAggreg/MainView.vue") },
      { path: "ValAddedBiz/PagingListPict", component: () => import("@/views/ValAddedBiz/PagingListPict/MainViewPict.vue") },
    ]
  },
  {
    // 后台管理系统 (CMS), 必须判断用户在线.
    path: "/LayoutViewSystemMgt",
    component: () => import("@/LayoutView/SystemMgt.vue"),
    // 在路由配置的 meta 中, 可以自定义的字段.
    meta: {
      AuthPolicy: "NeedLogin"
    },
    children: [
      {
        path: "MainViewHome",
        component: () => import("@/views/SystemMgt/DataAggreg/MainViewHome.vue")
      },
      {
        path: "PagingListUniv",
        component: () => import("@/views/SystemMgt/PagingList/MainViewUniv.vue"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "DataListTree",
        component: () => import("@/views/SystemMgt/DataList/MainViewTree.vue"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "DetailedDataTextarea",
        component: () => import("@/views/SystemMgt/DetailedData/MainViewTextarea.vue"),
        meta: {
          keepAlive: false,
        },
      }
    ],
  },
];
// 创建路由实例.
const router = createRouter({
  history: routerHistory,
  routes: jsonArrayRoute,
});
// 输出路由实例和菜单数组 (全局变量).
export { router };
