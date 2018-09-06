<template>
  <div>
   
 <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter">
      <div class="ball" v-show="ballFlag" ref="ball"></div>
    </transition>
    <div class="container">
      <div class='show' v-show='!nickName'>
      <mt-button type="primary" size="large" class="login" @click="loginModalFlag=true">登陆</mt-button>
      <mt-button type="danger" size="large" @click="RegisterModalFlag=true">注册</mt-button>
    </div>
    <div class='show1' v-if='nickName'>
      <div class='user'>
        <span>欢迎您：{{this.$store.state.nickName}}</span>
       <mt-button type="primary" size="small" class="login" @click="logOut">登出</mt-button>
       </div>
        <div class="cart">
        <div class="item-list-wrap">
          <div class="cart-item">
            <ul class="cart-item-list">
              <li v-for="(item,index) in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
                      
                      <span class="mui-icon mui-icon-checkmarkempty"></span>
                      
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="item.productImage" :key="item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>

                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice|currency('$')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        
                        <a class="input-add" @click="editCart('add',item,index)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total"><span class="item-price-total2">{{(item.productNum*item.salePrice)|currency('$')}}</span>
                   
                     <mt-button type="primary" size="small" class="login" @click="delCartConfirm(item)">删除</mt-button>
                  </div>
                 
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="delCartConfirm(item)">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
    
      </div>
      
       <div class="mui-card">
        <div class="mui-card-content">
          <div class="mui-card-content-inner jiesuan">
            <div class="left">
              <p>总计（不含运费）</p>
              <p>已勾选商品 <span class="red">{{checkedCount}}</span> 件， 总价 <span class="red">{{ totalPrice |currency('$')}}</span></p>
            </div>
             <mt-button type="danger">去结算</mt-button>
          </div>
        </div>
      </div>
    </div>
       <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':RegisterModalFlag}">

         <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
                <mt-field label="密码" placeholder="请输入密码" type="password" v-model="userPwd"></mt-field>
              <mt-button type="primary" size="large" class="login" @click="register">注册</mt-button>
          
        </div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
         <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
                <mt-field label="密码" placeholder="请输入密码" type="password" v-model="userPwd"></mt-field>
              <mt-button type="primary" size="large" class="login" @click="login">登陆</mt-button>
          
        </div>
        <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
        <div class="md-overlay" v-if="RegisterModalFlag" @click="RegisterModalFlag=false"></div>
    </div>
    
    <Modal :mdShow="modalConfirm" @close="closeModal">
      <p slot="message">
        <span class="mui-icon mui-icon-checkmarkempty"></span>
          <span>你确认要删除此条数据吗?</span>
      </p>
      <div slot="btnGroup">
        <mt-button size="normal" type="primary"  @click="delCart" class='modalcar'>确认</mt-button>
           <mt-button size="normal" type="default" @click="modalConfirm = false">关闭</mt-button>
        
      </div>
    </Modal>
  </div>
</template>
<style>
.modalcar{
  margin-right:15px;
}
   .user{
      display:flex;
      justify-content: space-between;
      align-items: center;
   }
   .login{
    margin:10px 0px;
   }
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
  .item-name{
    font-size: 13px;
    line-height: 13px;
  }
    .ball {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    z-index: 99;
    top: 210px;
    left: 105px;
  }
</style>
<script>
    import { Toast } from 'mint-ui'
    import './../assets/css/login.css'
    import { mapState } from 'vuex'
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import {currency} from './../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
              userName:'',
              userPwd:'',
              ballFlag: false,
              loginModalFlag:false,
              RegisterModalFlag:false,
                cartList:[],
                delItem:{},
                modalConfirm:false
            }
        },
        mounted(){
            this.init();
            this.checkLogin();

        },
        filters:{
          currency:currency
        },
        computed:{
          ...mapState(['nickName','cartCount']),
          checkAllFlag(){
            return this.checkedCount == this.cartList.length;
          },
          checkedCount(){
            var i = 0;
             if(this.cartList.length > 0) {
            this.cartList.forEach((item) => {
            if(item.checked == '1') i++
            })
          }
            return i;
          },
          totalPrice(){
            var money = 0;
            if(this.cartList.length > 0) {
            this.cartList.forEach((item)=>{
              if(item.checked=='1'){
                money += parseFloat(item.salePrice)*parseInt(item.productNum);
              }
            })
            }
            return money;
          }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
            init(){
              axios.get("/users/cartList").then((response)=>{
                  let res = response.data;
                  this.cartList = res.result;
              });
            },
            closeModal(){
              this.modalConfirm = false;
            },
            delCartConfirm(item){
                this.delItem = item;
                this.modalConfirm = true;
            },
            delCart(){
              axios.post("/users/cartDel",{
                productId:this.delItem.productId
              }).then((response)=>{
                  let res = response.data;
                  if(res.status == '0'){
                    this.modalConfirm = false;
                    var delCount = this.delItem.productNum;
                    this.$store.commit("updateCartCount",-delCount);
                    this.init();
                  }
              });
            },

          beforeEnter(el) {
      el.style.transform = "translate(0, 0)";
    },
    enter(el, done) {
      el.offsetWidth;

      // 小球动画优化思路：
      // 1. 先分析导致 动画 不准确的 本质原因： 我们把 小球 最终 位移到的 位置，已经局限在了某一分辨率下的 滚动条未滚动的情况下；
      // 2. 只要分辨率和 测试的时候不一样，或者 滚动条有一定的滚动距离之后， 问题就出现了；
      // 3. 因此，我们经过分析，得到结论： 不能把 位置的 横纵坐标 直接写死了，而是应该 根据不同情况，动态计算这个坐标值；
      // 4. 经过分析，得出解题思路： 先得到 徽标的 横纵 坐标，再得到 小球的 横纵坐标，然后 让 y 值 求差， x 值也求 差，得到 的结果，就是横纵坐标要位移的距离
      // 5. 如何 获取 徽标和小球的 位置？？？   domObject.getBoundingClientRect()

      // 获取小球的 在页面中的位置
      const ballPosition = this.$refs.ball.getBoundingClientRect();
      // 获取 徽标 在页面中的位置
      const badgePosition = document
        .getElementById("badge")
        .getBoundingClientRect();

      const xDist = badgePosition.left - ballPosition.left;
      const yDist = badgePosition.top - ballPosition.top;

      el.style.transform = `translate(${xDist}px, ${yDist}px)`;
      el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
      done();
    },
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
            editCart(flag,item,index){
                if(flag=='add'){
                  var top = (210 + 169*index); 
                  this.$refs.ball.style.top = top+'px';
                  this.ballFlag = !this.ballFlag;
                  item.productNum++;
                  this.$store.commit("updateCartCount",1);
                }else if(flag=='minu'){
                  if(item.productNum<=1){
                    return;
                  }
                  item.productNum--;
                  this.$store.commit("updateCartCount",-1);
                }else{
                  item.checked = item.checked=="1"?'0':'1';

                }

                axios.post("/users/cartEdit",{
                  productId:item.productId,
                  productNum:item.productNum,
                  checked:item.checked
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                      // this.$store.commit("updateCartCount",flag=="add"?1:-1);
                    }
                })
            },
            toggleCheckAll(){
                var flag = !this.checkAllFlag;
                this.cartList.forEach((item)=>{
                  item.checked = flag?'1':'0';
                })
                axios.post("/users/editCheckAll",{
                  checkAll:flag
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=='0'){
                        console.log("update suc");
                    }
                })
            },
            checkOut(){
                if(this.checkedCount>0){
                    this.$router.push({
                        path:"/address"
                    });
                }
            },
            checkLogin(){
                axios.get("/users/checkLogin").then((response)=>{
                    var res = response.data;
                    var path = this.$route.pathname;
                    if(res.status=="0"){
                      this.nickName = res.result;
                      this.$store.commit("updateUserInfo",res.result);
                      this.loginModalFlag = false;
                    }else{
                      if(this.$route.path!="/cart"){
                        this.$router.push("/cart");
                      }
                    }
                });
            },
            login(){
                if(!this.userName || !this.userPwd){
                  
                  Toast('密码或用户名错误');
                  return;
                }
                axios.post("/users/login",{
                  userName:this.userName,
                  userPwd:this.userPwd
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                      
                      this.loginModalFlag = false;
                      this.$store.commit("updateUserInfo",res.result.userName);
                      this.getCartCount();
                      // this.getCartCount();
                      this.init();
                    }else{
                      Toast('密码或用户名错误');
                    }
                });
            },
            register(){
                if(this.userName=='' || this.userPwd==''){
                  
                  Toast('密码或用户名错误');
                  return;
                }
                axios.post("/users/register",{
                  userName:this.userName,
                  userPwd:this.userPwd
                }).then((response)=>{
                  if(response.data.err_code == 1)
                  {
                    Toast('用户已存在');
                  }else{
                    let res = response.data;
                    if(res.status=="0"){
                      Toast('注册成功，请登录');
                      this.RegisterModalFlag= false;
                      this.$store.commit("updateUserInfo",res.result.userName);
                      // this.getCartCount();
                    }else{
                      Toast('密码或用户名错误');
                    }
                  }
                });
            },
            logOut(){
                axios.post("/users/logout").then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                        this.cartList ='';
                        this.$store.state.cartCount=0;
                        this.$store.commit("updateUserInfo",res.result.userName);
                    }

                })

            },
            getCartCount(){
              axios.get("users/getCartCount").then(res=>{
                var res = res.data;
                this.$store.commit("updateCartCount",res.result);
              });
            }
        }
    }
</script>
