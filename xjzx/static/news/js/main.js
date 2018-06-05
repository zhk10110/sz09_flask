$(function () {

    // 打开登录框
    $('.login_btn').click(function () {
        $('.login_form_con').show();
    })

    // 点击关闭按钮关闭登录框或者注册框
    $('.shutoff').click(function () {
        $(this).closest('form').hide();
    })

    // 隐藏错误
    $(".login_form #mobile").focus(function () {
        $("#login-mobile-err").hide();
    });
    $(".login_form #password").focus(function () {
        $("#login-password-err").hide();
    });

    $(".register_form #mobile").focus(function () {
        $("#register-mobile-err").hide();
    });
    $(".register_form #imagecode").focus(function () {
        $("#register-image-code-err").hide();
    });
    $(".register_form #smscode").focus(function () {
        $("#register-sms-code-err").hide();
    });
    $(".register_form #password").focus(function () {
        $("#register-password-err").hide();
    });


    // 点击输入框，提示文字上移
    $('.form_group').on('click focusin', function () {
        $(this).children('.input_tip').animate({
            'top': -5,
            'font-size': 12
        }, 'fast').siblings('input').focus().parent().addClass('hotline');
    })

    // 输入框失去焦点，如果输入框为空，则提示文字下移
    $('.form_group input').on('blur focusout', function () {
        $(this).parent().removeClass('hotline');
        var val = $(this).val();
        if (val == '') {
            $(this).siblings('.input_tip').animate({'top': 22, 'font-size': 14}, 'fast');
        }
    })


    // 打开注册框
    $('.register_btn').click(function () {
        $('.register_form_con').show();
    })


    // 登录框和注册框切换
    $('.to_register').click(function () {
        $('.login_form_con').hide();
        $('.register_form_con').show();
    })

    // 登录框和注册框切换
    $('.to_login').click(function () {
        $('.login_form_con').show();
        $('.register_form_con').hide();
    })

    // 根据地址栏的hash值来显示用户中心对应的菜单
    var sHash = window.location.hash;
    if (sHash != '') {
        var sId = sHash.substring(1);
        var oNow = $('.' + sId);
        var iNowIndex = oNow.index();
        $('.option_list li').eq(iNowIndex).addClass('active').siblings().removeClass('active');
        oNow.show().siblings().hide();
    }

    // 用户中心菜单切换
    var $li = $('.option_list li');
    var $frame = $('#main_frame');

    $li.click(function () {
        if ($(this).index() == 5) {
            $('#main_frame').css({'height': 900});
        }
        else {
            $('#main_frame').css({'height': 660});
        }
        $(this).addClass('active').siblings().removeClass('active');

    })

    // TODO 登录表单提交
    $(".login_form_con").submit(function (e) {
        e.preventDefault()
        var mobile = $(".login_form #mobile").val()
        var password = $(".login_form #password").val()
        var csrf_token = $('#csrf_token').val();

        if (!mobile) {
            $("#login-mobile-err").show();
            return;
        }

        if (!password) {
            $("#login-password-err").show();
            return;
        }

        // 发起登录请求
        $.post('/user/login', {
            'mobile': mobile,
            'pwd': password,
            'csrf_token': csrf_token
        }, function (data) {
            if (data.result == 1) {
                alert('账号或密码未填写');
            } else if (data.result == 2) {
                alert('提示mobile错误');
            } else if (data.result == 3) {
                $('.login_form_con').hide();
                $('.user_btns').hide();
                $('.user_login').show();
                $('.lgin_pic').attr('src', '/static/news/images/' + data.avatar);
                $('#nick_name').text(data.nick_name);
            } else if (data.result == 4) {
                alert('密码错误');
            }
        });
    })


    // TODO 注册按钮点击
    $(".register_form_con").submit(function (e) {
        // 阻止默认提交操作
        e.preventDefault();

        // 取到用户输入的内容
        var mobile = $("#register_mobile").val();
        var smscode = $("#smscode").val();
        var imageCode = $("#imagecode").val();
        var password = $("#register_password").val();
        var csrf_token = $('#csrf_token').val();

        if (!mobile) {
            $("#register-mobile-err").show();
            return;
        }
        if (!imageCode) {
            $("#image-code-err").html("请填写验证码！");
            $("#image-code-err").show();
            $(".get_code").attr("onclick", "sendSMSCode();");
            return;
        }
        if (!smscode) {
            $("#register-sms-code-err").show();
            return;
        }
        if (!password) {
            $("#register-password-err").html("请填写密码!");
            $("#register-password-err").show();
            return;
        }

        if (password.length < 6) {
            $("#register-password-err").html("密码长度不能少于6位");
            $("#register-password-err").show();
            return;
        } else if (password.length > 20) {
            $("#register-password-err").html("密码长度不能大于20位");
            $("#register-password-err").show();
            return;
        }

        // 发起注册请求
        $.post('/user/register', {
            'mobile': mobile,
            'image_yzm': imageCode,
            'sms_yzm': smscode,
            'pwd': password,
            'csrf_token': csrf_token
        }, function (data) {
            if (data.result == 1) {
                alert('参数不完整');
            } else if (data.result == 2) {
                alert('图片验证码错误');
            } else if (data.result == 3) {
                alert('短信验证码错误');
            } else if (data.result == 4) {
                alert('密码格式错误');
            } else if (data.result == 5) {
                alert('手机号存在');
            } else if (data.result == 6) {
                alert('服务器出错，注册失败');
            } else if (data.result == 7) {
                $('.to_login').click();
            }
        });

    })

    //绑定退出
    $('#logout').click(function () {
        $.post('/user/logout', {'csrf_token': $('#csrf_token').val()}, function (data) {
            if (data.result == 1) {
                $('.user_btns').show();
                $('.user_login').hide();
                // 对于index.html、detail.html退出时不需要返回首页
                // 对于user.html推出时需要返回首页
                if (location.pathname == '/user/') {
                    location.href = '/';
                }else{// 对于index、detail只是隐藏用户div，显示登陆注册div
                    $('.user_btns').show();
                    $('.user_login').hide();
                }
            }
        });
    });
})

var imageCodeId = ""

// TODO 生成一个图片验证码的编号，并设置页面中图片验证码img标签的src属性
function generateImageCode() {
    var src = $('.get_pic_code').attr('src');///user/image_yzm?1
    //防止浏览器缓存，每次请求都是一个地址，但是参数不同
    $('.get_pic_code').attr('src', src + 1);///user/image_yzm?11
}

// 发送短信验证码
function sendSMSCode() {
    // 校验参数，保证输入框有数据填写
    $(".get_code").removeAttr("onclick");
    var mobile = $("#register_mobile").val();
    if (!mobile) {
        $("#register-mobile-err").html("请填写正确的手机号！");
        $("#register-mobile-err").show();
        $(".get_code").attr("onclick", "sendSMSCode();");
        return;
    }
    var imageCode = $("#imagecode").val();
    if (!imageCode) {
        $("#image-code-err").html("请填写验证码！");
        $("#image-code-err").show();
        $(".get_code").attr("onclick", "sendSMSCode();");
        return;
    }

    // TODO 发送短信验证码
    $.get('/user/sms_yzm', {
        'mobile': mobile,
        'image_yzm': imageCode
    }, function (data) {
        if (data.result == 1) {
            alert('图片验证码错误');
        } else if (data.result == 2) {
            alert('请查看短信');
        }
    });
}

// 调用该函数模拟点击左侧按钮
function fnChangeMenu(n) {
    var $li = $('.option_list li');
    if (n >= 0) {
        $li.eq(n).addClass('active').siblings().removeClass('active');
        // 执行 a 标签的点击事件
        // $li.eq(n).find('a')[0].click()
    }
}

// 一般页面的iframe的高度是660
// 新闻发布页面iframe的高度是900
function fnSetIframeHeight(num) {
    var $frame = $('#main_frame');
    $frame.css({'height': num});
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
