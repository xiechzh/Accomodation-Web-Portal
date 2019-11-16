$(document).ready(function(){
    var check_url = 'http://127.0.0.1:5200/login';
    var login_check_data = {};
    $.ajax({
        type: 'GET',
        url: check_url,
        data: login_check_data,
        //dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data === "0") {
                document.getElementById("nav_sign_in_ul").style.display = "";
                document.getElementById("nav_name").style.display = "none";
            } else {
                document.getElementById("customer_name").innerHTML = data + '<strong class="caret"></strong>';
                document.getElementById("nav_sign_in_ul").style.display = "none";
                document.getElementById("nav_name").style.display = "";
            }
        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    });

    function clear_text() {
        document.getElementById("sign_in_account").value = "";
        document.getElementById("sign_in_password").value = "";
        document.getElementById("account").value = "";
        document.getElementById("password_1").value = "";
        document.getElementById("password_2").value = "";
    }

     $("#sign_in_close").click(function () {
        cancel()
    });

    $("#sign_up_close").click(function () {
        cancel()
    });

    $("#sign_in_cancel").click(function () {
        cancel()
    });

    $("#sign_up_cancel").click(function () {
        cancel()
    });

    function cancel() {
        $("#sign_up_info_div").hide(500);
        setTimeout(clear_text(),500);
        document.getElementById("sign_in_account").className = "form-control";
        document.getElementById("sign_in_password").className = "form-control";
        $("#sign_in_info_div").hide(500);
        $("#sign_up_info_div").hide(500);
    }

    $("#sign_in_account").click(function () {
        document.getElementById("sign_in_account").className = "form-control";
    });
    $("#sign_in_password").click(function () {
        document.getElementById("sign_in_password").className = "form-control";
    });

    $("#sign_in").click(function () {
        var sign_in_account = document.getElementById("sign_in_account").value;
        var sign_in_password = document.getElementById("sign_in_password").value;

        console.log("ok");

        if (sign_in_account === "") {
            document.getElementById("sign_in_info").innerHTML = "User name can't be empty!";
            $("#sign_in_info_div").show(500);
        } else if (sign_in_password === "") {
            document.getElementById("sign_in_info").innerHTML = "Password can't be empty!";
            $("#sign_in_info_div").show(500);
        } else {
            var url = 'http://127.0.0.1:5200/login';
            window.localStorage.setItem("sign_in_account", sign_in_account);
            var data = {
                "sign_in_account": sign_in_account,
                "sign_in_password": sign_in_password
            };
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(data) {
                    console.log(data);
                    if (data === "ok") {
                        $("#nav_sign_in_ul").hide();
                        $("#nav_name").show();
                        $("#sign_in_close").click();
                        document.getElementById("customer_name").innerHTML = sign_in_account + '<strong class="caret"></strong>';
                    } else if (data === "Wrong_password") {
                        document.getElementById("sign_in_password").className = "form-control alert-danger";
                        document.getElementById("sign_in_info").innerHTML = "Wrong password!";
                        $("#sign_in_info_div").show(500);
                    } else if (data === "No_account") {
                        document.getElementById("sign_in_account").className = "form-control alert-danger";
                        document.getElementById("sign_in_password").className = "form-control alert-danger";
                        document.getElementById("sign_in_info").innerHTML = "Account not exist!";
                        $("#sign_in_info_div").show(500);
                    }
                },
                error: function (xhr, type) {
                    console.log(xhr,type);
                }
            });
        }
    });

    $("#sign_in_info_close").click(function () {
        $("#sign_in_info_div").hide(500);
    });

    $("#sign_up_info_close").click(function () {
        $("#sign_up_info_div").hide(500);
    });

    $("#sign_out").click(function () {
        $("#nav_name").hide();
        $("#nav_sign_in_ul").show();
        var url = 'http://127.0.0.1:5200/signout';
        var data = {};
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(data) {
                console.log(data);
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });

    $("#sign_up").click(function () {
        var account = document.getElementById("account").value;
        var password_1 = document.getElementById("password_1").value;
        var password_2 = document.getElementById("password_2").value;
        console.log(password_1,password_2);
        if (password_1 === password_2) {
            console.log("ok");
            if (account === "") {
                document.getElementById("sign_up_info").innerHTML = "User name can't be empty!";
                $("#sign_up_info_div").show(500);
            } else if (password_1 === "") {
                document.getElementById("sign_up_info").innerHTML = "Password can't be empty!";
                $("#sign_up_info_div").show(500);
            } else {
                var url = 'http://127.0.0.1:5200/signup';
                var data = {
                    "account": account,
                    "password_1": password_1
                };
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function(data) {
                        console.log(data);
                    },
                    error: function (xhr, type) {
                        console.log(xhr,type);
                    }
                });
                //
            }
        } else {
            document.getElementById("sign_up_info").innerHTML = "Different password you have provided!";
            $("#sign_up_info_div").show(500);
        }
    });
});