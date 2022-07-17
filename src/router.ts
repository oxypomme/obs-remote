import { createRouter, createWebHashHistory } from "vue-router";
import ConnectionForm from "./pages/ConnectionForm.vue";
import OBSDashboard from "./pages/OBSDashboard.vue";

const routes = [
  { path: "/", component: ConnectionForm },
  { path: "/dashboard", component: OBSDashboard },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
