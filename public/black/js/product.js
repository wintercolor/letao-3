


$(function () {
    //完成的功能
    // 1：渲染页面
    // 2:分页控件
    // 3：添加商品，显示莫态框
    // 4：发送ajax，动态渲染二级分类框
    //5:添加模态框，进行商品信息入库信息
    //6:根据要求进行正则验证
    // 7：填写商品信息，添加到库存


    //渲染页面
    var pages = 1;
    var pageSizes = 3;
    var picArr = [];
    render();
    function render() {
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            data: {
                page: pages,
                pageSize: pageSizes
            },
            dataType: "json",
            success: function (res) {
                var htmlStr = template("tmp", res);
                $("tbody").html(htmlStr);
                //分页操作
                $(".paginator").bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: res.page,
                    //总页数
                    totalPages: Math.ceil(res.total / res.size),
                    //调用点击页码，跳到对应的页面
                    onPageClicked: function (a, b, c, page) {
                        pages = page;
                        render();
                    }
                })
            }
        })
    }

    //点击按钮，添加莫态框
    $("#addPro").on("click", function () {
        $("#addModia").modal("show");
        // 点击二级分类的按钮，发送ajax请求。获取数据
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (res) {
                var htmlStrs = template("newTmp", res);
                $("#newUls").html(htmlStrs);
            }
        })
    });

    //下拉菜单，给a设置点击事件
    $(".dropdown-menu").on("click", "a", function () {
        //获取文本，设置给span
        var txt = $(this).text();
        $('#dropdownText').text(txt);
        // 获取 id, 设置给隐藏域
        var id = $(this).data('id');
        $('[name="brandId"]').val(id);
    
        // 将隐藏域校验状态更新成 VALID 成功状态
        $('#formd').data('bootstrapValidator').updateStatus('brandId', 'VALID');
        console.log($('[name="brandId"]').val());

    });

    //上传图片初始化
    $("#ifloadImg").fileupload({
        dataType: "json",
        done: function (e, data) {
            var picAddr = data.result.picAddr;
            var picObj =  data.result;
            //根据图片数量，动态添加img按钮
            picArr.unshift(picObj);
            $('#imgBox').prepend('<img style="height: 100px;" src="' + picAddr + '" alt="">');
            //限制img的数量
            if (picArr.length > 3) {
                //删除最后一项
                picArr.pop();
                //删除最后一张img
                $("#imgBox img:last-of-type").remove();
                //当图片到达最大限度的时候，进行更新状态

            }
            if (picArr.length === 3) {
                $('#formd').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    });

    //表单校验
    $("#formd").bootstrapValidator({
        //图标添加
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //字段校验
        fields: {
            // 二级分类校验
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请添加分类名'
                    }
                }
            },
            // 商品名称校验
            proName: {
                validators: {
                    notEmpty: {
                        message: '商品名不能为空'
                    }
                }
            },
            // 商品描述校验
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请对商品进行描述'
                    }
                }
            },
            // 商品库存校验
            num: {
                validators: {
                    notEmpty: {
                        message: '库存不能为0'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品名不能低0开头'
                    }
                }
            },
            // 商品尺码校验
            size: {
                validators: {
                    notEmpty: {
                        message: '请请输入商品的尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40 '
                    }

                }
            },
            // 商品原价校验
            oldPric: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的原价'
                    }
                }
            },
            // 商品现价校验
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的现价'
                    }
                }
            },
            // 上传的图片路径校验
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    });
    //清除默认提交功能，并且是jax发送数据，用于添加商品
    $('#formd').on('success.form.bv', function (e) {
        e.preventDefault();
        //改变传过去的格式
        //获取表单基础数据
        var paramsStr = $('#formd').serialize(); 
        paramsStr += '&picArr=' + JSON.stringify(picArr);
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function (res) {
               if(res.success) {
                $("#addModia").modal("hide");
                pages = 1;
                render();
                $('#formd').data('bootstrapValidator').resetForm(true);
                 $("#dropdownText").text("请选择二级类名");
                 $("#imgBox img").remove();
                 picArr = [];
               }

            }
        })



    })
})