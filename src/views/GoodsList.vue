<template>
    <div>
      <!-- <nav-header></nav-header> -->
      <!-- <nav-bread>
        <span>Goods</span>
      </nav-bread> -->
      <div class="accessory-result-page accessory-page">
        <div class="container">
<mt-swipe :auto="4000">
  <mt-swipe-item>
   <img src='../assets/images/swiper1.jpg' alt="">
 </mt-swipe-item>
  <mt-swipe-item>
    <img src="../assets/images/swiper2.jpg" alt="">
  </mt-swipe-item>
  <mt-swipe-item>
    <img src="../assets/images/swiper3.jpg" alt="">
  </mt-swipe-item>
</mt-swipe>
<mt-navbar v-model="selected">
  <mt-tab-item id="1"><a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sort==8,'cur':(sort==1)||(sort==8)}" @click="sortBy(sort==1?8:1)">人气<img  class="icon-arrow-short"src="../assets/images/arrow483.png" alt=""> </a></mt-tab-item>
  <mt-tab-item id="2"><a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sort==4,'cur':(sort==4)||(sort==7)}" @click="sortBy(sort==4?7:4)">价格<img class="icon-arrow-short"src="../assets/images/arrow483.png" alt=""></a></mt-tab-item>
  <mt-tab-item id="3"><a href="javascript:void(0)" class="price" v-bind:class="{'cur':sort==3}" @click="sortBy(3)">销量</a></mt-tab-item>
  <mt-tab-item id="4"><a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sort==2,'cur':(sort==9)||(sort==2)}" @click="sortBy(sort==2?9:2)">最新 <img class="icon-arrow-short" src="../assets/images/arrow483.png" alt=""></a></mt-tab-item>
</mt-navbar>
<!-- tab-container -->
<mt-tab-container v-model="selected">
  <mt-tab-container-item id="1">
  </mt-tab-container-item>
  <mt-tab-container-item id="2">
  
  </mt-tab-container-item>
  <mt-tab-container-item id="3">
   
  </mt-tab-container-item>
    <mt-tab-container-item id="4">
   
  </mt-tab-container-item>
</mt-tab-container>



            <div class="goods-list">
    <div class="goods-item" v-for="item in goodsList"  >
      <img v-lazy='item.goods_pic' :key='item.goods_pic'>
      <h1 class="title">{{item.goods_short_title}}</h1>
      <div class="info">
        <p class="price">
          <span class="now">{{ (item.goods_price-item.coupon_price)| currency('$')}}</span>
          <span class="old">{{ item.goods_price | currency('$')}}</span>
        </p>
        <p class="sell">
          <span class="coupon">{{ item.coupon_price}}元券</span>
          <span class="remain">剩{{  item.coupon_number }}张</span>
        </p>
      </div>
      <mt-button type="danger" size="small" @click="addCart(item)">加入购物车</mt-button>
    </div>


    <mt-button type="danger" size="large" @click="getMore">加载更多</mt-button>
  </div>


          
        </div>
      </div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <span class="mui-icon mui-icon-closeempty"></span>
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
               <router-link href="javascript:;" to="/cart"> <mt-button size="normal" class='modalcar' type="primary">去登陆</mt-button></router-link>
              <mt-button size="normal" type="default"  @click="mdShow = false">关闭</mt-button>
          </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <span class="mui-icon mui-icon-checkmarkempty"></span>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
  
           <mt-button size="normal" type="default"  @click="mdShowCart = false" class='modalcar'>继续购物</mt-button>
           <router-link href="javascript:;" to="/cart"><mt-button size="normal" type="primary">查看购物车</mt-button></router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <!--   <nav-footer></nav-footer> -->
    </div> 
</template>
<script>
    // import NavHeader from './../components/NavHeader'
    // import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import axios from 'axios'
    import qs from 'qs'
    
    export default{
        data(){
            return {
              selected:'',
                goodsList:[],
                search:'',
                sort:1,
                page:1,
                app_key:'NBJiK78O',
                v:'1.0',
                cat:0,

                sortFlag:true,
                page:1,
                pageSize:8,
                busy:true,
                loading:false,
                mdShow:false,
                mdShowCart:false,
          
                // priceFilter:[
                //   {
                //       startPrice:'0.00',
                //       endPrice:'100.00'
                //   },
                //   {
                //     startPrice:'100.00',
                //     endPrice:'500.00'
                //   },
                //   {
                //     startPrice:'500.00',
                //     endPrice:'1000.00'
                //   },
                //   {
                //     startPrice:'1000.00',
                //     endPrice:'5000.00'
                //   }
                // ],
                // priceChecked:'0',
                filterBy:false,
                overLayFlag:false
            }
        },
        created(){
            this.getGoodsList();
        },
        components:{
          // NavHeader,
          // NavFooter,
          NavBread,
          Modal
        },
        methods:{
            getGoodsList(flag){
              var params = {
                   sort:this.sort,
                   page:this.page,
                   app_key:this.app_key,
                   v:this.v,
                   cat:this.cat,
                   page:this.page
                  // v:this.v
                
                  // page:this.page,
                  // pageSize:this.pageSize,
                  // sort:this.sortFlag?1:-1,
                  // priceLevel:this.priceChecked
              };
              this.loading = true;
              axios.get("/qingsoulist",{params:params}).then((response)=>{
                var res = response.data;
                this.loading = false;
                  if(flag){
                      this.goodsList = this.goodsList.concat(res.data.list);
                      if(res.data.list.length==0){
                          this.busy = true;
                      }else{
                          this.busy = false;
                      }
                      console.log("1")
                     
                  }else{
                    console.log("2")
                    
                      this.goodsList = res.data.list;
                      this.busy = false;
                     console.log(res.data)
                     
                  }
               
              });
            },
            sortBy(sort){
                
                this.sort = sort;
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
                console.log(this.sort);
            },
            setPriceFilter(index){
              this.cat = index;
              this.page = 1;
              this.getGoodsList();
              console.log(this.cat)
            },
            getMore(){
                this.busy = true;
                setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500);
            },
            addCart(item){
                axios.post("/goods/addCart",{
                  item:item
                }).then((res)=>{
                  
                    var res = res.data;
                    if(res.status==0){
                        this.mdShowCart = true;
                        console.log("客户端保存成功")
                        this.$store.commit("updateCartCount",1);
                    }else{
                        this.mdShow = true;
                    }
                });
            },
            closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
            },
            showFilterPop(){
              this.filterBy=true;
              this.overLayFlag=true;
            },
            closePop(){
              this.filterBy=false;
              this.overLayFlag=false;
              this.mdShowCart = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
.modalcar{
  margin-right:15px;
}
.mint-swipe {
  height: 140px;
  .mint-swipe-item {
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
.mint-tab-item-label{
  a{
    img{
      width: 10px;
      height: 10px;
     }
  }
  
}


.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 7px;
  justify-content: space-between;

  .goods-item {
    width: 49%;
    border: 1px solid #ccc;
    box-shadow: 0 0 8px #ccc;
    margin: 4px 0;
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 253px;
    img {
      width: 100%;
       background: url('./../assets/loading-spinning-bubbles.svg') no-repeat center;
    }
    .title {
      font-size: 14px;
    }

    .info {
      background-color: #eee;
      p {
        margin: 0;
        padding: 5px;
      }
      .price {
        .now {
          color: red;
          font-weight: bold;
          font-size: 16px;
        }
        .old {
         text-decoration: line-through;
          font-size: 12px;
          margin-left: 10px;
        }
      }
      .sell {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        .coupon{
          width:50%;
          border:1px solid #de4e49;
          border-radius:5px;
          text-align: center;
          background-color:#de4e49;
          color:white;
        }
        .remain{
          font-size:10px;
        }
      }
    }
  }
}
</style>