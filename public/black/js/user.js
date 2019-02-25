

$(function () {
    //功能：发送ajax，获取数据，渲染页面
    var pages = 1;
    var size = 5;
    var deId;
    var isDel;
    render();
    function render() {
        $.ajax({
            url: "/user/queryUser",
            type: "get",
            data: {
                page: pages,
                pageSize: size
            },
            dataType: "json",
            success: function (res) {
                var htmlStr = template("tmp", res);
                $("tbody").html(htmlStr);

                //动态渲染完成，添加分页控件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total / size),
                    //    天机分页事件
                    onPageClicked: function (a, b, c, page) {
                        // page表示点击的当前页数
                        pages = page;
                        render();
                    }
                })
            }
        })
    }

    //实现功能：点击禁用或者启用按钮的时候，改变当前状态，并且作战室模态框
    $("tbody").on("click", ".btn", function () {
        $("#muMdal").modal("show");
        //改变当前的数据状态
        //获取当前点击的id
        deId = $(this).parent().data("id");
        //获取用户的禁用状态
        isDel = $(this).hasClass("btn-danger") ? 0 : 1;
    });
    //点击模态框里面的确定按钮：发送ajax请求，并且重新渲染数据
    $("#clickDtl").on("click", function () {
        $.ajax({
            url: "/user/updateUser",
            type: "post",
            data: {
                id:deId,
                isDelete: isDel
            },
            dataType:"json",
            success: function (res) {       
               if(res.success) {
                $("#muMdal").modal("hide");
                render();
               }

            }
        })
    });

})