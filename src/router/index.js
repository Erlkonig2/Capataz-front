import { createWebHistory, createRouter } from "vue-router";

import LoginView from "@/views/Login.vue";
import RegisterView from "@/views/Register.vue";
import HomeView from "@/views/Home.vue";
import EditUser from "@/views/EditUser.vue";
import LotesIndexView from "@/views/LotesIndex.vue";
import CropsIndexView from "@/views/CropsIndex.vue";
import EmployeesIndexView from "@/views/EmployeesIndex.vue";
import ToolsIndexView from "@/views/ToolsIndex.vue";
import TasksIndexView from "@/views/TasksIndex.vue";
import BorrowsIndexView from "@/views/BorrowsIndex.vue";
import TaskAssignmentIndexView from "@/views/TaskAssignmentIndex.vue";

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
      path: "/",
      name: "dashboard",
      component: HomeView,
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
    },
    {
      path: "/lotes",
      name: "LotesIndexView",
      component: LotesIndexView,
    },
    {
      path: '/cultivos',
      name: 'CropsIndexView',
      component: CropsIndexView,
    },
    {
      path: '/empleados',
      name: 'EmployeesView',
      component: EmployeesIndexView,
    },
    {
      path: '/herramientas',
      name: 'ToolsView',
      component: ToolsIndexView,
    },
    {
      path: '/labores',
      name: 'TasksView',
      component: TasksIndexView,
    },
    {
      path: '/prestamos',
      name: 'BorrowsView',
      component: BorrowsIndexView,
    },
    {
      path: '/tareas',
      name: 'TasksAssignmentsView',
      component: TaskAssignmentIndexView,
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;