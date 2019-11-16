
Date.prototype.Format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};

$(document).ready(function(){
    var div_height = window.screen.height;
    div_height = div_height-700;
    div_height = div_height+'px';
    document.getElementById("order_message_div").style.height = div_height;
});

$(document).ready(function(){
    var c_info = "";
    var today = new Date();
    var today_year = today.getFullYear();
    var today_mouth = today.getMonth()+1;
    var today_date = today.getDate();

    if (Math.floor(today_mouth/10) < 1) {
        today_mouth = '0'+ today_mouth;
    }
    if (Math.floor(today_date/10) < 1) {
        today_date = '0'+ today_date;
    }
    document.getElementById("alter_birthday").value = today_year+'-'+today_mouth+'-'+today_date;


    var local_url = window.location.href;
    var sign_in_account = local_url.split("/")[3];

    var url = 'http://127.0.0.1:5200/personalinfo';
    var data = {
        "sign_in_account": sign_in_account
    };
    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        success: function(data) {
            c_info = data;

            document.getElementById("alter_form").setAttribute('action','http://127.0.0.1:5200/' + data["customer_id"] + '/alter_info');
            if (data["account_type"] === true) {
                document.getElementById("nav_share_room_btn").setAttribute('class','');
                document.getElementById("new_property_btn").setAttribute('href','/'+ data["customer_id"] +'/property_post');
            }

            var img_src = 'http://127.0.0.1:5200/file/' + data["customer_id"];
            var img_innerhtml = '<img name="c_photo" alt="140x140" src="'+img_src+'" onerror="this.src=\'../static/Unknown.png\'" class="img-circle" height="160" width="160" style="border: solid;border-width: 1px"/>';
            document.getElementById("big_c_photo").innerHTML = img_innerhtml;
            var alter_img_innerhtml = '<img id="alter_c_photo" name="c_photo" alt="140x140" src="'+img_src+'" onerror="this.src=\'../static/Unknown.png\'" class="img-circle" height="160" width="160" style="border: solid;border-width: 1px"/>';
            document.getElementById("alter_big_c_photo").innerHTML = alter_img_innerhtml;
            document.getElementById("first_name").innerHTML = data["first_name"];
            document.getElementById("family_name").innerHTML = data["last_name"];
            document.getElementById("gender").innerHTML = data["gender"];
            document.getElementById("birthday").innerHTML = data["birthday"];
            document.getElementById("phone_num").innerHTML = data["contact_number"];
            document.getElementById("e_mail").innerHTML = data["email"];
            document.getElementById("address").innerHTML = data["address"];
            document.getElementById("property_host").setAttribute('href','/'+ data["customer_id"] +'/property_post');

            if (data["account_type"] === true) {
                document.getElementById("nav_share_room_btn").className = "";
            } else {
                document.getElementById("nav_share_room_btn").className = "disabled"
            }

            if (data["new_message"].length !== 0) {
                document.getElementById("message_box_icon").src = "../static/icon/message_alert.svg";
            }

            if (data["account_type"] === true) {
                if (data["host_order"].length === 0) {
                    document.getElementById("lease_not_host").style.display = "none";
                    document.getElementById("lease_host_empty").style.display = "";
                } else {
                    document.getElementById("lease_not_host").style.display = "none";
                    document.getElementById("lease_host_empty").style.display = "none";
                }
                document.getElementById("property_not_host").style.display = "none";
                document.getElementById("property_host").style.display = "";

            }

            var travel_history = data["trip_order"];
            var tbody = document.getElementById('travel_history_tbody');

            for (var i = 0; i < travel_history.length; i++) {
                var trow = travel_history_getDataRow(travel_history[i]);
                tbody.appendChild(trow);
            }
            function travel_history_getDataRow(h) {
                var comment_btn_id = h["customer_id"] + "-" + h["host_id"] + "-" + h["order_id"];
                var row = document.createElement('tr');
                var order_id_Cell = document.createElement('td');
                order_id_Cell.innerHTML = h["order_id"];
                row.appendChild(order_id_Cell);

                var property_id_Cell = document.createElement('td');
                property_id_Cell.innerHTML = h["property_id"];
                row.appendChild(property_id_Cell);

                var host_id_Cell = document.createElement('td');
                host_id_Cell.innerHTML = h["host_id"];
                row.appendChild(host_id_Cell);

                var payment_time_Cell = document.createElement('td');
                payment_time_Cell.innerHTML = h["payment_time"];
                row.appendChild(payment_time_Cell);

                var checkin_time_Cell = document.createElement('td');
                checkin_time_Cell.innerHTML = h["checkin_time"];
                row.appendChild(checkin_time_Cell);

                var checkout_time_Cell = document.createElement('td');
                checkout_time_Cell.innerHTML = h["checkout_time"];
                row.appendChild(checkout_time_Cell);

                var price_Cell = document.createElement('td');
                price_Cell.innerHTML = h["price"];
                row.appendChild(price_Cell);

                var option_Cell = document.createElement('td');
                row.appendChild(option_Cell);

                var comment_btn = document.createElement('a');
                comment_btn.setAttribute('role','button');
                comment_btn.setAttribute('id', comment_btn_id);

                comment_btn.setAttribute('class','btn btn-info btn-xs');

                if (h["commented"] === true) {
                    comment_btn.setAttribute('disabled','disabled');
                } else {
                    comment_btn.setAttribute('href','#modal-container-555324');
                }

                comment_btn.setAttribute('data-toggle','modal');
                comment_btn.innerHTML = "Comment";
                option_Cell.appendChild(comment_btn);

                comment_btn.onclick = function () {
                    document.getElementById("rating_ModalLabel").innerHTML = "Order No. " + h["order_id"];
                    window.localStorage.setItem("comment_pid", h["property_id"]);
                    window.localStorage.setItem("comment_oid", h["order_id"]);
                };

                var btnDel = document.createElement('button');
                btnDel.setAttribute('type','button');
                btnDel.setAttribute('class', 'btn btn-danger btn-xs');
                btnDel.setAttribute('style', 'margin-left: 5%');
                btnDel.innerHTML = "Delete";
                option_Cell.appendChild(btnDel);

                btnDel.onclick = function () {
                    var url = "http://127.0.0.1:5200/order_delete";
                    var data = {
                        "order_id": h["order_id"],
                        "request_type": "0"
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

                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };

                return row;
            }

            var lease_history = data["host_order"];
            var lease_history_tbody = document.getElementById('lease_history_tbody');

            for (var i = 0; i < lease_history.length; i++) {
                var lease_history_trow = lease_history_getDataRow(lease_history[i]);
                lease_history_tbody.appendChild(lease_history_trow);
            }
            function lease_history_getDataRow(h) {
                var row = document.createElement('tr');
                var order_id_Cell = document.createElement('td');
                order_id_Cell.innerHTML = h["order_id"];
                row.appendChild(order_id_Cell);

                var property_id_Cell = document.createElement('td');
                property_id_Cell.innerHTML = h["property_id"];
                row.appendChild(property_id_Cell);

                var customer_id_Cell = document.createElement('td');
                customer_id_Cell.innerHTML = h["customer_id"];
                row.appendChild(customer_id_Cell);

                var payment_time_Cell = document.createElement('td');
                payment_time_Cell.innerHTML = h["payment_time"];
                row.appendChild(payment_time_Cell);

                var checkin_time_Cell = document.createElement('td');
                checkin_time_Cell.innerHTML = h["checkin_time"];
                row.appendChild(checkin_time_Cell);

                var checkout_time_Cell = document.createElement('td');
                checkout_time_Cell.innerHTML = h["checkout_time"];
                row.appendChild(checkout_time_Cell);

                var price_Cell = document.createElement('td');
                price_Cell.innerHTML = h["price"];
                row.appendChild(price_Cell);

                var option_Cell = document.createElement('td');

                var btnCancel = document.createElement('button');
                btnCancel.setAttribute('type','button');
                btnCancel.setAttribute('class','btn btn-info btn-xs');
                btnCancel.innerHTML = "Cancel";
                option_Cell.appendChild(btnCancel);
                btnCancel.onclick = function () {
                    var url = "http://127.0.0.1:5200/order_delete";
                    var data = {
                        "order_id": h["order_id"],
                        "request_type": "2"
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

                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };
                var btnDel = document.createElement('button');
                btnDel.setAttribute('type','button');
                btnDel.setAttribute('class','btn btn-danger btn-xs');
                btnDel.innerHTML = "Delete";
                row.appendChild(option_Cell);
                option_Cell.appendChild(btnDel);
                btnDel.onclick = function () {
                    var url = "http://127.0.0.1:5200/order_delete";
                    var data = {
                        "order_id": h["order_id"],
                        "request_type": "1"
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

                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };
                return row;
            }

            var property = data["properties"];
            var property_tbody = document.getElementById('property_tbody');

            for (var i = 0; i < property.length; i++) {
                var property_trow = property_getDataRow(property[i]);
                property_tbody.appendChild(property_trow);
            }
            function property_getDataRow(h) {
                var row = document.createElement('tr');

                var property_id_Cell = document.createElement('td');
                property_id_Cell.innerHTML = h["property_id"];
                row.appendChild(property_id_Cell);

                var address_Cell = document.createElement('td');
                address_Cell.innerHTML = h["address"];
                row.appendChild(address_Cell);

                var type_Cell = document.createElement('td');
                type_Cell.innerHTML = h["type"];
                row.appendChild(type_Cell);

                var location_Cell = document.createElement('td');
                location_Cell.innerHTML = h["location"];
                row.appendChild(location_Cell);

                var suburb_Cell = document.createElement('td');
                suburb_Cell.innerHTML = h["suburb"];
                row.appendChild(suburb_Cell);

                var price_Cell = document.createElement('td');
                price_Cell.innerHTML = h["price"];
                row.appendChild(price_Cell);

                var description_Cell = document.createElement('td');
                description_Cell.innerHTML = h["about_the_place"];
                row.appendChild(description_Cell);

                var option_Cell = document.createElement('td');
                var btnDel = document.createElement('button');
                btnDel.setAttribute('type','button');
                btnDel.setAttribute('class','btn btn-info btn-xs');
                btnDel.innerHTML = "Delete";
                row.appendChild(option_Cell);
                option_Cell.appendChild(btnDel);

                btnDel.onclick = function () {
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };

                var btnAlter = document.createElement('button');
                btnAlter.setAttribute('type','button');
                btnAlter.setAttribute('class','btn btn-info btn-xs');
                btnAlter.innerHTML = "Alter";
                option_Cell.appendChild(btnAlter);
                return row;
            }

            var message_box = data["message_box"];
            var message_box_processed = new Array();
            var message_box_processed_not_new = new Array();
            var message_new = data["new_message"];
            var message_box_processed_all  = new Array();

            for (var i = 0; i < message_box.length; i++) {
                var name_list = message_box[i]["mid"].split("---");
                if (name_list[0] === data["customer_id"]) {
                    var name = name_list[1];
                } else {
                    var name = name_list[0];
                }
                if (message_box_processed_all.indexOf(name) === -1 && message_new.indexOf(name) === -1) {
                    message_box_processed_all.push(name);
                }
            }

            for (var i = 0; i < message_new.length; i++) {
                var str = message_new[i] + "---" + data["customer_id"];
                for (var j = message_box.length-1; j >= 0; j--) {
                    if (message_box[j]["mid"] === str) {
                        message_box_processed.push(message_box[j]);
                        break;
                    }
                }
            }

            for (var i = 0; i < message_box_processed_all.length; i++) {
                var str = message_box_processed_all[i] + "---" + data["customer_id"];
                for (var j = message_box.length-1; j >= 0; j--) {
                    if (message_box[j]["mid"] === str) {
                        message_box_processed_not_new.push(message_box[j]);
                        break;
                    }
                }
            }

            var message_box_tbody = document.getElementById('message_box_tbody');
            for (var i = 0; i < message_box_processed.length; i++) {
                var message_box_trow = message_box_getDataRow(message_box_processed[i]);
                message_box_tbody.appendChild(message_box_trow);
            }

            function message_box_getDataRow(h) {
                var row = document.createElement('tr');
                row.setAttribute('style','font-weight: bold');

                var messager_id_Cell = document.createElement('td');
                messager_id_Cell.innerHTML = h["mid"].split("---")[0];
                row.appendChild(messager_id_Cell);

                var time_Cell = document.createElement('td');
                time_Cell.innerHTML = h["time"];
                row.appendChild(time_Cell);

                var content_Cell = document.createElement('td');
                content_Cell.innerHTML = h["text"];
                row.appendChild(content_Cell);

                var reply_btn = document.createElement('a');
                var option_Cell = document.createElement('td');
                var str = h["mid"].split("---")[0] + "---reply_button";
                reply_btn.setAttribute('role','button');
                reply_btn.setAttribute('id', str);
                reply_btn.setAttribute('href','#modal-container-673915');
                reply_btn.setAttribute('class','btn btn-info btn-xs');
                reply_btn.setAttribute('data-toggle','modal');
                reply_btn.innerHTML = "Reply";
                option_Cell.appendChild(reply_btn);
                reply_btn.onclick = function () {
                    this.parentNode.parentNode.setAttribute('style','font-weight: normal');
                    var new_message_read_url = "http://127.0.0.1:5200/new_message_read";
                    var data = {
                        "delete_new": h["mid"].split("---")[0]
                    };
                    $.ajax({
                        type: 'POST',
                        url: new_message_read_url,
                        data: data,
                        success: function(data) {
                            console.log(data);
                        },
                        error: function (xhr, type) {
                            console.log(xhr,type);
                        }
                    });

                    document.getElementById("myModalLabel").innerHTML = h["mid"].split("---")[0];
                    var chat_content_ul = document.getElementById("chat_content_ul");
                    chat_content_ul.innerHTML = "";
                    var check = h["mid"];
                    var check_reverse = h["mid"].split("---")[1] + "---" + h["mid"].split("---")[0];
                    for (var i = 0; i < message_box.length; i++) {
                        if (message_box[i]["mid"] === check_reverse) {
                            var message_right_cell = document.createElement('li');
                            message_right_cell.setAttribute('class','message right');
                            var message_right_img = document.createElement('img');
                            message_right_img.setAttribute('class','logo');
                            message_right_img.setAttribute('src','../static/Unknown.png');
                            var message_right_text = document.createElement('p');
                            message_right_text.innerHTML = message_box[i]["text"];
                            message_right_cell.appendChild(message_right_img);
                            message_right_cell.appendChild(message_right_text);
                            chat_content_ul.appendChild(message_right_cell);
                        } else if (message_box[i]["mid"] === check) {
                            var message_left_cell = document.createElement('li');
                            message_left_cell.setAttribute('class','message left');
                            var message_left_img = document.createElement('img');
                            message_left_img.setAttribute('class','logo');
                            message_left_img.setAttribute('src','../static/icon/robot.svg');
                            var message_left_text = document.createElement('p');
                            message_left_text.innerHTML = message_box[i]["text"];
                            message_left_cell.appendChild(message_left_img);
                            message_left_cell.appendChild(message_left_text);
                            chat_content_ul.appendChild(message_left_cell);
                        }

                    }
                };

                var btnDel = document.createElement('button');
                btnDel.setAttribute('type', 'button');
                btnDel.setAttribute('class', 'btn btn-danger btn-xs');
                btnDel.setAttribute('style', 'margin-left: 5%');
                btnDel.innerHTML = "Delete";
                row.appendChild(option_Cell);
                option_Cell.appendChild(btnDel);

                btnDel.onclick = function () {
                    var url = "http://127.0.0.1:5200/message_del";
                    var check_reverse = h["mid"].split("---")[1] + "---" + h["mid"].split("---")[0];
                    var data = {
                        "AB": check_reverse
                    };
                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: data,
                        success: function(data) {
                            console.log(data);
                        },
                        error: function (xhr, type) {
                            console.log(xhr,type);
                        }
                    });
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };
                return row;
            }

            for (var i = 0; i < message_box_processed_not_new.length; i++) {
                var message_box_trow = message_box_not_new_getDataRow(message_box_processed_not_new[i]);
                message_box_tbody.appendChild(message_box_trow);
            }

            function message_box_not_new_getDataRow(h) {
                var row = document.createElement('tr');

                var messager_id_Cell = document.createElement('td');
                messager_id_Cell.innerHTML = h["mid"].split("---")[0];
                row.appendChild(messager_id_Cell);

                var time_Cell = document.createElement('td');
                time_Cell.innerHTML = h["time"];
                row.appendChild(time_Cell);

                var content_Cell = document.createElement('td');
                content_Cell.innerHTML = h["text"];
                row.appendChild(content_Cell);

                var reply_btn = document.createElement('a');
                var option_Cell = document.createElement('td');
                var str = h["mid"].split("---")[0] + "---reply_button";
                reply_btn.setAttribute('role','button');
                reply_btn.setAttribute('id', str);
                reply_btn.setAttribute('href','#modal-container-673915');
                reply_btn.setAttribute('class','btn btn-info btn-xs');
                reply_btn.setAttribute('data-toggle','modal');
                reply_btn.setAttribute('style', 'margin-right: 5%');
                reply_btn.innerHTML = "Reply";
                option_Cell.appendChild(reply_btn);
                reply_btn.onclick = function () {
                    document.getElementById("myModalLabel").innerHTML = h["mid"].split("---")[0];
                    var chat_content_ul = document.getElementById("chat_content_ul");
                    chat_content_ul.innerHTML = "";
                    var check = h["mid"];
                    var check_reverse = h["mid"].split("---")[1] + "---" + h["mid"].split("---")[0];
                    for (var i = 0; i < message_box.length; i++) {
                        if (message_box[i]["mid"] === check_reverse) {
                            var message_right_cell = document.createElement('li');
                            message_right_cell.setAttribute('class','message right');
                            var message_right_img = document.createElement('img');
                            message_right_img.setAttribute('class','logo');
                            message_right_img.setAttribute('src','http://127.0.0.1:5200/file/'+document.getElementById("customer_name").innerHTML);
                            message_right_img.setAttribute('onerror','../static/Unknown.png');
                            var message_right_text = document.createElement('p');
                            message_right_text.innerHTML = message_box[i]["text"];
                            message_right_cell.appendChild(message_right_img);
                            message_right_cell.appendChild(message_right_text);
                            chat_content_ul.appendChild(message_right_cell);
                        } else if (message_box[i]["mid"] === check) {
                            var message_left_cell = document.createElement('li');
                            message_left_cell.setAttribute('class','message left');
                            var message_left_img = document.createElement('img');
                            message_left_img.setAttribute('class','logo');
                            message_left_img.setAttribute('src','http://127.0.0.1:5200/file/'+h["mid"].split("---")[0]);
                            message_left_img.setAttribute('onerror','../static/Unknown.png');
                            var message_left_text = document.createElement('p');
                            message_left_text.innerHTML = message_box[i]["text"];
                            message_left_cell.appendChild(message_left_img);
                            message_left_cell.appendChild(message_left_text);
                            chat_content_ul.appendChild(message_left_cell);
                        }

                    }
                    setTimeout(test_function, 400);
                    function test_function() {
                        var test = document.getElementById("chat_scroll_div");
                        test.scrollTop = test.scrollHeight;
                    }
                };

                var btnDel = document.createElement('button');
                btnDel.setAttribute('type', 'button');
                btnDel.setAttribute('class', 'btn btn-danger btn-xs');
                btnDel.innerHTML = "Delete";
                row.appendChild(option_Cell);
                option_Cell.appendChild(btnDel);

                btnDel.onclick = function () {
                    var url = "http://127.0.0.1:5200/message_del";
                    var check_reverse = h["mid"].split("---")[1] + "---" + h["mid"].split("---")[0];
                    var data = {
                        "AB": check_reverse
                    };
                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: data,
                        success: function(data) {
                            console.log(data);
                        },
                        error: function (xhr, type) {
                            console.log(xhr,type);
                        }
                    });
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                };
                return row;
            }

        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    });

    $("#sign_out_btn").click(function(){
        //$("#nav_sign_up_ul").delay(100).fadeIn();
        url = 'http://127.0.0.1:5200/signout';
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

    $("#comment_commit").click(function () {
        var rating = document.getElementsByName("rating");
        for (var i=0;i<rating.length;i++) {
            if (rating[i].checked) {
                console.log(5-i);
                break;
            }
        }
        var rating_num = 5-i;
        var comment_text = document.getElementById("comment_text").value;
        var comment_pid = window.localStorage.getItem("comment_pid");
        var comment_oid = window.localStorage.getItem("comment_oid");
        var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        var url = "http://127.0.0.1:5200/new_comment";
        var data = {
            "comment_pid": comment_pid,
            "comment_text": comment_text,
            "rating_num":rating_num,
            "comment_oid":comment_oid,
            "time":time
        };
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(data) {
                if (data === "ok") {
                    document.getElementById("comment_cancel").click();
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });
    
    function fill_default_info() {
        document.getElementById("alter_first_name").value = document.getElementById("first_name").innerHTML;
        document.getElementById("alter_family_name").value = document.getElementById("family_name").innerHTML;
        if (document.getElementById("gender").innerHTML === "female") {
            document.getElementById("alter_gender")[1].selected=true;
        } else {
            document.getElementById("alter_gender")[0].selected=true;
        }
        if (document.getElementById("birthday").innerHTML === "") {
            document.getElementById("alter_birthday").value = today_year+'-'+today_mouth+'-'+today_date;
        } else {
            document.getElementById("alter_birthday").value = document.getElementById("birthday").innerHTML;
        }
        document.getElementById("alter_phone_num").value = document.getElementById("phone_num").innerHTML;
        document.getElementById("alter_e_mail").value = document.getElementById("e_mail").innerHTML;
        document.getElementById("alter_address").value = document.getElementById("address").innerHTML;
    }

    $("#nav_alter_info_btn").click(function(){
        fill_default_info();
        $("#info_div").fadeOut();
        $("#alter_info_div").delay(400).fadeIn();
    });

    $("#alter_cancel").click(function(){
        $("#alter_info_div").fadeOut();
        $("#info_div").delay(400).fadeIn();
        setTimeout(function () {
            fill_default_info();
        }, 200);
    });
    
    $("#alter_confirm").click(function(){
        var alter_first_name = document.getElementById("alter_first_name").value;
        var alter_family_name = document.getElementById("alter_family_name").value;
        var alter_gender = document.getElementById("alter_gender").value;
        var alter_birthday = document.getElementById("alter_birthday").value;
        var alter_phone_num = document.getElementById("alter_phone_num").value;
        var alter_e_mail = document.getElementById("alter_e_mail").value;
        var alter_address = document.getElementById("alter_address").value;

        $("#alter_info_div").fadeOut();
        $("#info_div").delay(400).fadeIn();
    });

    $("#property_not_host").click(function () {
        var url = "http://127.0.0.1:5200/become_host";
        $.ajax({
            type: 'POST',
            url: url,
            data: c_info,
            success: function(data) {
                if (data === "ok") {
                    alert("Successful!");
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });

    $("#lease_not_host").click(function () {
        var url = "http://127.0.0.1:5200/become_host";
        $.ajax({
            type: 'POST',
            url: url,
            data: c_info,
            success: function(data) {
                if (data === "ok") {
                    alert("Successful!");
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });
});

function changepic(obj) {
    var newsrc=getObjectURL(obj.files[0]);
    document.getElementById("alter_c_photo").setAttribute('src',newsrc);
}

function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!==undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

