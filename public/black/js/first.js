

$(function(){
    //渲染一级菜单
    var pages = 1;
    var pageSize = 3;
    render();
    function render() {
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            type:"get",
            data:{
                page:pages,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(res){
            console.log(res);
            // 渲染页面
            var htmlStr = template("tmp",res);
            $("tbody").html(htmlStr);
            
            //渲染完数据，进行分页
            $('#paginator').bootstrapPaginator({
                // 版本号
                bootstrapMajorVersion: 3,
                // 当前页
                currentPage: res.page,
                // 总页数
                totalPages: Math.ceil(res.total / res.size),
                // 给页码添加点击事件
                onPageClicked: function (a, b, c, page) {
                  // 更新当前页, 并且重新渲染
                  pages = page;
                  render();
                }
              })
            
            }
           })
    }
    //注册点击添加一级分类的信息
    $("#addNew").on("click",function(){
        $("#addModal").modal("show");
    });
    //表单校验
    $("#form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
              validators: {
                //不能为空
                notEmpty: {
                  message: '用户名不能为空'
                }
            }
        }
    }
    });
    //取消时，清空表单
    $("#noClick").on("click",function(){
        $('#form').data('bootstrapValidator').resetForm(true);
    })
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url:"/category/addTopCategory",
            type:"post",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(res){
                if(res.success) {
                    $("#addModal").modal("hide");
                    $('#form').data('bootstrapValidator').resetForm(true);
                   //展示第一页
                   pages = 1;
                   render();

                }
                
            }
        })
    });
       
})