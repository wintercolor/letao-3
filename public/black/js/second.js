


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
            url: "/category/queryTopCategoryPaging",
            type:"get",
            data:{
                page:pages,
                pageSize:100
            },
            dataType:"json",
            success:function(info){  
                 var newHtml = template("tmpNew",info);
                 $("#addLis").html(newHtml);
              
            }
        })
    });
   
//    给button添加点击，改变文本内容事件、
  $(".dropdown-menu").on("click","a",function(){
      //获取点击i的内容
      
      var txt = $(this).text();
      
      $(".tel").text(txt);
    //   将值赋值给隐藏域的内容
      $("#picDddr").val(txt);
      //给隐藏域设置id
      var id = $(this).data("id");
      $('[name="categoryId"]').val(id);
    //给隐藏域手动触发input事件，就是改变撞他i
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');    
  });

  //点击图片按钮，获取图片信息，上传图片并且展示在img中
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
    //   console.log(data);
    var picAddr = data.result.picAddr;
      //将url传递给img图片，在前端显示出来
      $("#dataImg").attr("src",picAddr);
      //手动赋给隐藏域
      $('[name="brandLogo"]').val(picAddr);
      //手动会更新隐藏域的状态      
      $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");

    }
});

   // 表单校验
   $('#form').bootstrapValidator({
    // 配置 excluded 排除项, 对隐藏域完成校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 配置校验字段列表
    fields: {
      // 选择一级分类
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      // 输入二级分类名称
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
    //   二级分类图片
    brandLogo: {
        validators: {
          notEmpty: {
            message: '请选择图片'
          }
        }
      }
    }
  });

  //实现功能：注册表单事件校验完成，要阻止默认事件，通过ajax提交
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
      $.ajax({
          url:"/category/addSecondCategory",
          type: 'post',
          data: $('#form').serialize(),
          dataType: 'json',
          success:function(res){   
         if(res.success) {
            $("#newModal").modal("show");
            pages = 1;
            render();
            $("#form").data("bootstrapValidator").resetForm(true);
            // 手动设置button 与img 不是表单元素，
            $(".tel").text("请选择一级分类");
            $(".dataImg").attr("src","../image/none.png");
         }
          
            
          }
      })
  });
  

})