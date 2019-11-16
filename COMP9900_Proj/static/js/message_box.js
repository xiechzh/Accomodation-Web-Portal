
Date.prototype.Format = function(fmt)
{
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
    $("#chat_input").keydown(function(e) {
        if (e.keyCode === 13) {
            var input_content = document.getElementById("chat_input").value;

            var send_to = document.getElementById("myModalLabel").innerHTML;
            var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var url = "http://127.0.0.1:5200/new_message";
            console.log(send_to);
            console.log(time);
            console.log(input_content);

            var data = {
                "send_to": send_to,
                "message": input_content,
                "message_time":time
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

            var ul_html = document.getElementById("chat_content_ul").innerHTML;
            ul_html = ul_html + '<li class="message right"><img class="logo" src="../static/Unknown.png" alt=""><p>'+ input_content +'</p></li>';
            document.getElementById("chat_content_ul").innerHTML = ul_html;
            document.getElementById("chat_input").value = "";
            var test = document.getElementById("chat_scroll_div");
            test.scrollTop = test.scrollHeight;
        }
    });

    $(".reply").click(function () {
        var this_id = $(this).attr("id");
        document.getElementById("myModalLabel").innerHTML = this_id.split("---")[0];
    });
});