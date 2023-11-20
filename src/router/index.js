import { createWebHistory, createRouter } from "vue-router";

import LoginView from "@/views/Login.vue";
import RegisterView from "@/views/Register.vue";
import HomeView from "@/views/Home.vue";
import EditUser from "@/views/EditUser.vue";

const routes = [
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },

    {
      path: "/home",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/user/edit",
      name: "EditUser",
      component: EditUser,
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;