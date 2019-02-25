$(function(){
      //判断用户是否登录页面，没有登录就拦截
      $.ajax({
        url:"/employee/checkRootLogin",
        type:"get",
        dataType:"json",
        success:function(res){
          if(res.error == 400) {
           location.href = "login.html";
          }
        }
    })

})