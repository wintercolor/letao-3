


$(function(){
    //实现功能：
    // 发送ajax,动态渲染页面
    var pages = 1;
    var pageSizes =5;
    render();
    function render(){
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            type:"get",
            data:{
                page:pages,
                pageSize:pageSizes
            },
            dataType:"json",
            success:function(res){
             //d动态渲染
             var htmlStr = template("tmp",res);
             $("tbody").html(htmlStr);
             //分页控件
            $(".paginator").bootstrapPaginator({
                bootstrapMajorVersion: 3,
                currentPage:res.page,
                //总页数
                totalPages: Math.ceil(res.total / res.size),
               //点击页数，跳到对应的页数，数据也随着改变
               onPageClicked: function (a, b, c, page) {
                // 更新当前页, 并且重新渲染
                pages = page;
                render();
              }
            })
             
            }
        });
    }
    //添加二级分类，跳出模态框
    $("#addClis").on("click",function(){
        $("#newModal").modal("show");
        //发送ajax请求,获取二级类名
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            type:"get",
            data:{
                page:pages,
                pageSize:pageSizes
            },
            dataType:"json",
            success:function(info){
                 var newHtml = template("tmpNew",info);
                 $("#addLis").html(newHtml);
              
            }
        })
    });
    // 表单校验
    $("#addForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            //校验用户名，对应name表单的name属性
            brandName: {
              validators: {
                //不能为空
                notEmpty: {
                  message: '用户名不能为空'
                }
              }
            },
          }
    });
//    给button添加点击，改变文本内容事件、
  $(".dropdown-menu").on("click","a",function(){
      //获取点击i的内容
      
      var txt = $(this).text();
      
      $(".tel").text(txt)
  })
      

})