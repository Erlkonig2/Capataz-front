import { createWebHistory, createRouter } from "vue-router";
// import Home from "@/components/HelloWorld.vue";
import LoginView from "@/views/Login.vue";
import RegisterView from "@/views/Register.vue";

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
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;