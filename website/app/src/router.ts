import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import About from './views/About.vue';
import Generate from './views/Generate.vue';
import Network from './views/Network.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/generate',
      name: 'generate',
      component: Generate,
    },
    {
      path: '/network',
      name: 'network',
      component: Network,
    },
  ],
});
