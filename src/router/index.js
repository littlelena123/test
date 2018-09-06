import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import ProducetList from '@/views/ProducetList'
import Search from '@/views/Search'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'GoodsList'
                }
    },
    {
      path: '/cart',
      name: 'Cart',
      component:Cart
    },
    {
      path: '/home',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/search',
      name: 'Search',
      component:Search
    },
    {
      path: '/list',
      name: 'ProducetList',
      component:ProducetList
    },
  ],
  linkActiveClass: 'mui-active'
})
