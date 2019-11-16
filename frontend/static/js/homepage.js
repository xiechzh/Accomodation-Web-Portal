$(document).ready(function(){
    var div_height = window.screen.height;
    div_height = div_height*0.95;
    div_height = div_height+'px';
    document.getElementById("search_div").style.height = div_height;
});

$(document).ready(function(){
    var check_url = 'http://127.0.0.1:5200/login';
    var data = {};
    $.ajax({
        type: 'GET',
        url: check_url,
        data: data,
        //dataType: 'json',
        success: function(data) {
            if (data === "0") {
                document.getElementById("nav_sign_in_ul").style.display = "";
                document.getElementById("nav_name").style.display = "none";
            } else {
                var img_src = 'http://127.0.0.1:5200/file/' + data;
                var test = '<img id="c_photo" alt="40x40" src="'+img_src+
                    '" onerror="this.src=\'../static/Unknown.png\'" class="img-circle" height="40" width="40" />';
                document.getElementById("c_photo_li").innerHTML = test;
                document.getElementById("customer_name").innerHTML = data;
                document.getElementById("nav_sign_in_ul").style.display = "none";
                document.getElementById("nav_name").style.display = "";
                //document.getElementById("nav_share_room_btn").setAttribute('class','');
                //document.getElementById("new_property_btn").setAttribute('href','/'+ data +'/property_post');
                document.getElementById("personal_center_btn").setAttribute('href','/'+ data +'/personinfo');
            }
        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    });

    var location = "Sydney";
    var event_recommend_url = 'http://127.0.0.1:5200/event';
    var event_require = {
        "location":location
    };
    var event_url_list = new Array();
    var event_image_list = new Array();
    var event_name_list = new Array();
    $.ajax({
        type: 'POST',
        url: event_recommend_url,
        data: event_require,
        //dataType: 'json',
        success: function(data) {
            for (var i = 0;i < data.length;i++) {
                event_url_list[i] = data[i]["event_site_url"];
                event_image_list[i] = data[i]["image_url"];
                event_name_list[i] = data[i]["name"];
            }
            for (var i = 0;i < 4;i++) {
                var j = i + 1;
                var event_href_name_1 = "event_href_"+ j +"_1";
                var event_href_name_2 = "event_href_"+ j +"_2";
                var event_image_name_1 = "event_image_"+ j +"_1";
                var event_image_name_2 = "event_image_"+ j +"_2";
                var event_header_name_1 = "event_header_"+ j +"_1";
                var event_header_name_2 = "event_header_"+ j +"_2";
                document.getElementById(event_href_name_1).href = event_url_list[i];
                document.getElementById(event_href_name_2).href = event_url_list[i+4];
                document.getElementById(event_image_name_1).src = event_image_list[i];
                document.getElementById(event_image_name_2).src = event_image_list[i+4];
                document.getElementById(event_header_name_1).innerHTML = event_name_list[i];
                document.getElementById(event_header_name_2).innerHTML = event_name_list[i+4];

            }
            //document.getElementById("image_test").src = data["0"]["p_photo"][0];
        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    });

    $("#destination").click(function () {
        document.getElementById("destination").className = "form-control";
    });

    $("#arrive_date").click(function () {
        document.getElementById("arrive_date").className = "form-control";
    });
    $("#period").click(function () {
        document.getElementById("period").className = "form-control";
    });

    $("#event_search_btn").click(function () {
        var event_destination = document.getElementById("event_destination").value;
        var event = document.getElementById("event").value;
        event_destination = event_destination.toLowerCase();
        if (event_destination  === "") {
            event_destination = document.getElementById("event_destination").placeholder;
        }
        window.localStorage.setItem("event_destination", event_destination);
        window.localStorage.setItem("event", event);
        window.localStorage.setItem("type", "1");
    });

    $("#normal_search_btn").click(function () {
        var destination = document.getElementById("destination").value;
        var people_num = document.getElementById("people_num").value;
        var arrive_date = document.getElementById("arrive_date").value;
        var period = document.getElementById("period").value;

        if (period === "") {
            period = document.getElementById("period").placeholder;
        }

        if (destination  === "") {
            destination = document.getElementById("destination").placeholder;
        }
        document.getElementById("destination").value = destination;
        document.getElementById("arrive_date").className = "form-control";
        document.getElementById("period").className = "form-control";
        window.localStorage.setItem("destination", destination);
        window.localStorage.setItem("people_num", people_num);
        window.localStorage.setItem("arrive_date", arrive_date);
        window.localStorage.setItem("period", period);
        window.localStorage.setItem("type", "0");
    });

    $("#in_to_up").click(function(){
        $("#sign_in_form").fadeOut();
        $("#sign_in_header").fadeOut();
        $("#sign_in").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#sign_up").delay(1000).fadeIn();
        $("#sign_up_header").delay(10).fadeIn(2000);
        $("#sign_up_form").delay(20).fadeIn(1000);
    });

    $("#up_to_in").click(function(){
        $("#sign_up_form").fadeOut();
        $("#sign_up_header").fadeOut();
        $("#sign_up").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#sign_in").delay(1000).fadeIn();
        $("#sign_in_header").delay(10).fadeIn(2000);
        $("#sign_in_form").delay(20).fadeIn(1000);
    });

    $("#nav_sign_up").click(function(){
        var check = $("#normal_search");
        if (check.is(":visible")) {
            $("#normal_search_form").fadeOut();
            $("#normal_search_header").fadeOut();
            check.fadeOut();
        }
        check = $("#sign_in");
        if (check.is(":visible")) {
            $("#sign_in_form").fadeOut();
            $("#sign_in_header").fadeOut();
            check.fadeOut();
        }
        check = $("#event_search");
        if (check.is(":visible")) {
            $("#event_search_form").fadeOut();
            $("#event_search_header").fadeOut();
            check.fadeOut();
        }
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#sign_up").delay(1000).fadeIn();
        $("#sign_up_header").delay(10).fadeIn(2000);
        $("#sign_up_form").delay(20).fadeIn(1000);
    });

    $("#nav_sign_in").click(function(){
        var check = $("#normal_search");
        if (check.is(":visible")) {
            $("#normal_search_form").fadeOut();
            $("#normal_search_header").fadeOut();
            check.fadeOut();
        }
        check = $("#sign_up");
        if (check.is(":visible")) {
            $("#sign_up_form").fadeOut();
            $("#sign_up_header").fadeOut();
            check.fadeOut();
        }
        check = $("#event_search");
        if (check.is(":visible")) {
            $("#event_search_form").fadeOut();
            $("#event_search_header").fadeOut();
            check.fadeOut();
        }
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#sign_in").delay(1000).fadeIn();
        $("#sign_in_header").delay(10).fadeIn(2000);
        $("#sign_in_form").delay(20).fadeIn(1000);
    });

    $("#sign_in_btn").click(function(){
        var sign_in_account = document.getElementById("sign_in_account").value;
        var sign_in_password = document.getElementById("sign_in_password").value;
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
                if (data === "ok") {
                    $("#nav_sign_in_ul").fadeOut(100);
                    $("#nav_name").delay(100).fadeIn();

                    $("#sign_in_form").fadeOut();
                    $("#sign_in_header").fadeOut();
                    $("#sign_in").fadeOut();
                    var div_info = $("#info");
                    div_info.animate({height: '0'},'slow');
                    div_info.animate({height: '490px'},'slow');
                    $("#normal_search").delay(1000).fadeIn();
                    $("#normal_search_header").delay(10).fadeIn(2000);
                    $("#normal_search_form").delay(20).fadeIn(1000);

                    var img_src = 'http://127.0.0.1:5200/file/' + sign_in_account;
                    var img_innerhtml = '<img id="c_photo" alt="40x40" src="'+img_src+'" onerror="this.src=\'../static/Unknown.png\'" class="img-circle" height="40" width="40" />';
                    document.getElementById("c_photo_li").innerHTML = img_innerhtml;
                    document.getElementById("customer_name").innerHTML = sign_in_account;
                    document.getElementById("personal_center_btn").setAttribute('href','/'+ sign_in_account +'/personinfo');
                } else if (data === "Wrong_password") {
                    document.getElementById("sign_in_password").className = "form-control alert-danger";
                } else if (data === "No_account") {
                    document.getElementById("sign_in_account").className = "form-control alert-danger";
                    document.getElementById("sign_in_password").className = "form-control alert-danger";
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });

    $("#sign_in_account").click(function () {
        document.getElementById("sign_in_account").className = "form-control";
    });

    $("#sign_in_password").click(function () {
        document.getElementById("sign_in_password").className = "form-control";
    });

    $("#sign_in_close").click(function(){
        $("#sign_in_form").fadeOut();
        $("#sign_in_header").fadeOut();
        $("#sign_in").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#normal_search").delay(1000).fadeIn();
        $("#normal_search_header").delay(10).fadeIn(2000);
        $("#normal_search_form").delay(20).fadeIn(1000);
    });

    $("#sign_up_btn").click(function(){
        var account = document.getElementById("account").value;
        var password_1 = document.getElementById("password_1").value;
        var password_2 = document.getElementById("password_2").value;
        if (account === "" || account.search(' ') !== -1 || account.search('-') !== -1) {
            document.getElementById("account").className = "form-control alert-danger";
        } else {
            if (password_1 !== password_2 || password_1 === '' || password_1.search(' ') !== -1) {
                document.getElementById("password_1").className = "form-control alert-danger";
                document.getElementById("password_2").className = "form-control alert-danger";
            } else {
                var url = 'http://127.0.0.1:5200/signup';
                var data = {
                    "account": account,
                    "password_1": password_1,
                    "password_2": password_2
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

                $("#nav_sign_in_ul").fadeOut(100);
                //$("#nav_sign_up_ul").fadeOut(100);
                $("#nav_name").delay(100).fadeIn();

                $("#sign_up_form").fadeOut();
                $("#sign_up_header").fadeOut();
                $("#sign_up").fadeOut();
                var div_info = $("#info");
                div_info.animate({height: '0'},'slow');
                div_info.animate({height: '490px'},'slow');
                $("#normal_search").delay(1000).fadeIn();
                $("#normal_search_header").delay(10).fadeIn(2000);
                $("#normal_search_form").delay(20).fadeIn(1000);
            }
        }
    });

    $("#account").click(function () {
        document.getElementById("account").className = "form-control";
    });

    $("#password_1").click(function () {
        document.getElementById("password_1").className = "form-control";
        document.getElementById("password_2").className = "form-control";
    });

    $("#password_2").click(function () {
        document.getElementById("password_1").className = "form-control";
        document.getElementById("password_2").className = "form-control";
    });

    $("#sign_up_close").click(function(){
        $("#sign_up_form").fadeOut();
        $("#sign_up_header").fadeOut();
        $("#sign_up").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#normal_search").delay(1000).fadeIn();
        $("#normal_search_header").delay(10).fadeIn(2000);
        $("#normal_search_form").delay(20).fadeIn(1000);
    });

    $("#sign_out_btn").click(function(){
        $("#nav_name").fadeOut(100);
        $("#nav_sign_in_ul").delay(100).fadeIn();
        //$("#nav_sign_up_ul").delay(100).fadeIn();
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

    $("#normal_to_event").click(function(){
        $("#normal_search_form").fadeOut();
        $("#normal_search_header").fadeOut();
        $("#normal_search").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#event_search").delay(1000).fadeIn();
        $("#event_search_header").delay(10).fadeIn(2000);
        $("#event_search_form").delay(20).fadeIn(1000);
    });

    $("#event_to_normal").click(function(){
        $("#event_search_form").fadeOut();
        $("#event_search_header").fadeOut();
        $("#event_search").fadeOut();
        var div_info = $("#info");
        div_info.animate({height: '0'},'slow');
        div_info.animate({height: '490px'},'slow');
        $("#normal_search").delay(1000).fadeIn();
        $("#normal_search_header").delay(10).fadeIn(2000);
        $("#normal_search_form").delay(20).fadeIn(1000);
    });

    $("#left_btn").click(function () {
        if ($("#recommend_div_1_1").is(":visible")) {
            $("#recommend_div_2_1").fadeOut(200);
            for (var i = 1;i < 5;i++) {
                var hide_div_name = '#recommend_div_'+i+'_1';
                var show_div_name = "#recommend_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        } else {
            for (var i = 1;i < 5;i++) {
                var show_div_name = "#recommend_div_"+i+"_1";
                var hide_div_name = "#recommend_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        }
    });

    $("#right_btn").click(function () {

        if ($("#recommend_div_1_1").is(":visible")) {
            $("#recommend_div_2_1").fadeOut(200);
            for (var i = 1;i < 5;i++) {
                var hide_div_name = '#recommend_div_'+i+'_1';
                var show_div_name = "#recommend_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        } else {
            for (var i = 1;i < 5;i++) {
                var show_div_name = "#recommend_div_"+i+"_1";
                var hide_div_name = "#recommend_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        }
    });

    $("#event_left_btn").click(function () {
        if ($("#event_div_1_1").is(":visible")) {
            $("#event_div_2_1").fadeOut(200);
            for (var i = 1;i < 5;i++) {
                var hide_div_name = '#event_div_'+i+'_1';
                var show_div_name = "#event_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        } else {
            for (var i = 1;i < 5;i++) {
                var show_div_name = "#event_div_"+i+"_1";
                var hide_div_name = "#event_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        }
    });

    $("#event_right_btn").click(function () {

        if ($("#event_div_1_1").is(":visible")) {
            $("#event_div_2_1").fadeOut(200);
            for (var i = 1;i < 5;i++) {
                var hide_div_name = '#event_div_'+i+'_1';
                var show_div_name = "#event_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        } else {
            for (var i = 1;i < 5;i++) {
                var show_div_name = "#event_div_"+i+"_1";
                var hide_div_name = "#event_div_"+i+"_2";
                $(hide_div_name).fadeOut(200);
                $(show_div_name).delay(200).fadeIn(200);
            }
        }
    });
});

