//注意bootsstrap-validator基于jq实行
$(function(){
    console.log(23);
    
    //表单校验的功能：引入表单（bootstrap-validator）
    $("#form").bootstrapValidator({
       
        // 每次校验过后，显示对错
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          //校验每一个字段
          //3. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    username: {
      validators: {
        //不能为空
        notEmpty: {
          message: '用户名不能为空'
        },
        //长度校验
        stringLength: {
          min: 3,
          max: 8,
          message: '用户名长度必须在3到8之间'
        },
        callback: {
          message:"用户名错误"
        }
      }
    },
    password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 10,
            message: '密码长度必须在6到10之间'
          },
          callback:{
            message:"密码错误"
          }
        }
      }
  }
    })

    //实现功能2(表单验证成功的时候，才会触发)：判断输入的拥有户名与密码是否正确，如果是正确的就发送请求，不是就t
    // 提供错误信息
    $("#form").on('success.form.bv', function (e) {
      e.preventDefault();
      //使用ajax提交逻辑,判断用户输入的是否正确
      $.ajax({
        type:"post",
        data: $('#form').serialize(),
        dataType: 'json',
        url:'/employee/employeeLogin',
        success:function(res){
            if(res.error == 1000) {
              $("#form").data('bootstrapValidator').updateStatus("username", "INVALID", "callback")
            }
            if(res.error == 1001) {
              $("#form").data('bootstrapValidator').updateStatus("password", "INVALID", "callback")
            }
            if(res.success) {
              location.href = "index.html";
            }
            
        }
      })

  });

  //功能三：取消按钮的时候，所有内容清空
  $("[type='reset']").on("click",function(){
    $("#form").data('bootstrapValidator').resetForm(true);
  })
})