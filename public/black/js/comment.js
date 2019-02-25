
$(function(){
    
//    实现功能：进度条
     $(document).ajaxStart(function(){
        NProgress.start();
     });
     $(document).ajaxStop(function(){
            NProgress.done();

     });
   
    //实现功能:
    // 点击每一个li的时候，背景色发生变化
    // 二级菜单
    $(".lt_aside .child a").on("click",function(){
        $(this).next().stop().slideToggle();
    });

    //实现点击i标签左侧框隐藏，右边的框沾满全屏
    $(".lt_main .tops .bg").on("click",function(){
        $(".lt_aside").toggleClass("hides");
        $(".lt_main").toggleClass("tog");
        $(".lt_main .tops").toggleClass("hove");
    });

    //退出按钮功能实现
    $(".lt_main .tops .det").on("click",function(){
        $(".modal").modal("show");
    });
    //退出发送aja消息
    $(".modal .sure").on("click",function(){
        //1:发送ajax
        $.ajax({
            url:"/employee/employeeLogout",
            dataType:"json",
            type:"get",
            success:function(res){
                if(res.success){
                    location.href = "login.html";
                }
                
            }
        })
    });
    //点击跳转页面
   
    
})