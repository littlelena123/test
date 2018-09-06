var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('test');
});

router.post("/login", function (req,res,next) {
  var param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){
              res.cookie("userId",doc._id,{
                  path:'/',
                  maxAge:1000*60*60
              });
              res.cookie("userName",doc.userName,{
                path:'/',
                maxAge:1000*60*60
              });
              //req.session.user = doc;
              res.json({
                  status:'0',
                  msg:'',
                  result:{
                      userName:doc.userName
                  }
              });
          }
      }
  });
});


router.post("/register", function (req,res,next) {
  var param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }
   User.findOne({userName:req.body.userName,
  }, function (err, data) {
    if (err) {
       return res.json({
        err_code: 1,
        message: err.message
      })
    }
    // console.log(data)
    if (data) {
      // 邮箱或者昵称已存在
      return res.json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
    }
    new User(param).save(function (err, doc) {
      if (err) {
        
      }
      // Express 提供了一个响应方法：json
      // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.json({
                  status:'0',
                  msg:'',
                  result:{
                      userName:doc.userName
                  }
              });
      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  });
});


//登出接口
router.post("/logout", function (req,res,next) {
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:''
  })
});

router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userName){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userName){
    // console.log("userId:"+req.cookies.userId);
    var userName = req.cookies.userName;
    User.findOne({"userName":userName}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});
//查询当前用户的购物车数据
router.get("/cartList", function (req,res,next) {
  var userName = req.cookies.userName;
  User.findOne({userName:userName}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
          if(doc){
            res.json({
              status:'0',
              msg:'',
              result:doc.cartList
            });
          }
      }
  });
});

//购物车删除
router.post("/cartDel", function (req,res,next) {
  var userName = req.cookies.userName,productId = req.body.productId;
  User.update({
    userName:userName
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//修改商品数量
router.post("/cartEdit", function (req,res,next) {
  var userName = req.cookies.userName,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({"userName":userName,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  })
});
// router.post("/editCheckAll", function (req,res,next) {
//   var userId = req.cookies.userId,
//       checkAll = req.body.checkAll?'1':'0';
//   User.findOne({userId:userId}, function (err,user) {
//     if(err){
//       res.json({
//         status:'1',
//         msg:err.message,
//         result:''
//       });
//     }else{
//       if(user){
//         user.cartList.forEach((item)=>{
//           item.checked = checkAll;
//         })
//         user.save(function (err1,doc) {
//             if(err1){
//               res.json({
//                 status:'1',
//                 msg:err1,message,
//                 result:''
//               });
//             }else{
//               res.json({
//                 status:'0',
//                 msg:'',
//                 result:'suc'
//               });
//             }
//         })
//       }
//     }
//   });
// });

module.exports = router;
