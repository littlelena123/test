<template>
    <div>
      <!-- <nav-header></nav-header> -->
      <!-- <nav-bread>
        <span>Goods</span>
      </nav-bread> -->
     <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop"><mt-button size="large"><span class="mui-icon mui-icon-list"></span>分类</mt-button></a>
  
      <div class="accessory-result-page accessory-page">
        <div class="container">
      
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>分类:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(0)" v-bind:class="{'cur':cat==0}">全部</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(10)" v-bind:class="{'cur':cat==10}">女装</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(11)" v-bind:class="{'cur':cat==11}">内衣</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(12)" v-bind:class="{'cur':cat==12}">男装</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(2)" v-bind:class="{'cur':cat==2}">母婴</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(3)" v-bind:class="{'cur':cat==3}">美妆</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(4)" v-bind:class="{'cur':cat==4}">居家</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(5)" v-bind:class="{'cur':cat==5}">鞋包配饰</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(6)" v-bind:class="{'cur':cat==6}">美食</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(7)" v-bind:class="{'cur':cat==7}">文体</a></dd>
                <dd><a href="javascript:void(0)" @click="setPriceFilter(8)" v-bind:class="{'cur':cat==8}">家电数码</a></dd>
              </dl>
            </div>
          <!-- </div> -->

            <!-- search result accessories list -->





            <div class="goods-list">
    <div class="goods-item" v-for="item in goodsList" >
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
          <!-- <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link> -->
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