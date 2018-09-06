// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
// import VueLazyload from 'vue-lazyload'
// import infiniteScroll from  'vue-infinite-scroll'
import {currency} from './util/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import './assets/mui/css/mui.min.css'
// 导入扩展图标样式
import './assets/mui/css/icons-extra.css'

//mintui轮播图
import { Cell,Toast,Field,Search,Tabbar,Swipe, SwipeItem ,Header,Button,Lazyload ,Spinner,Navbar, TabItem,TabContainer, TabContainerItem } from 'mint-ui';

Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);

Vue.component(Search.name, Search);
Vue.component(Tabbar.name, Tabbar);


Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Spinner.name, Spinner);
Vue.use(Lazyload);
Vue.component(Button.name, Button);

Vue.component(Header.name, Header);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

// Vue.use(infiniteScroll);
Vue.use(Vuex);
// Vue.use(VueLazyload, {
//   loading: 'static/loading-svg/loading-bars.svg',
//   try: 3 // default 1
// })

Vue.filter("currency",currency);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    this.checkLogin();
    this.getCartCount();
  },
  methods:{
    checkLogin(){
      axios.get("users/checkLogin").then(res=> {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        }else{
          if(this.$route.path!="/home"){
            this.$router.push("/home");
          }
        }
      });
    },
    getCartCount(){
      axios.get("users/getCartCount").then(res=>{
        var res = res.data;
        if(res.status=="0"){
          this.$store.commit("updateCartCount",res.result);
        }
      });
    }
  },
  template: '<App/>',
  //render: h => h(App),
  components: { App }
});//.$mount('#app')
