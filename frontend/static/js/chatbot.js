$(document).ready(function(){

    $("#chat_bot_btn").click(function () {
        setTimeout(test_function, 200);
        function test_function() {
            var test = document.getElementById("scroll_div");
            test.scrollTop = test.scrollHeight;
        }

    });

    $("#chat_bot_input").keydown(function(e) {
        if (e.keyCode === 13) {
            var input_content = document.getElementById("chat_bot_input").value;
            var url = "http://127.0.0.1:5200/chatbot_msg";
            var data = {
                "message": input_content
            };

            var ul_html = document.getElementById("chatbot_body_ul").innerHTML;
            var img_src = 'http://127.0.0.1:5200/file/' + document.getElementById("customer_name").innerHTML;
            var c_photo = '<img id="c_photo" src="'+img_src+'" ' +
                'onerror="this.src=\'../static/Unknown.png\'" class="logo"/>';
            ul_html = ul_html + '<li class="message right" >' + c_photo + '<p>'+ input_content +'</p></li>';

            document.getElementById("chatbot_body_ul").innerHTML = ul_html;
            document.getElementById("chat_bot_input").value = "";
            var test = document.getElementById("scroll_div");
            test.scrollTop = test.scrollHeight;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(data) {
                    var ul_html = document.getElementById("chatbot_body_ul").innerHTML;
                    ul_html = ul_html + '<li class="message left"><img class="logo" src="../static/icon/robot.svg" alt=""><p>'+ data[0] +'</p><a href="'+ data[1] +'">'+ data[1] +'</a></li>';
                    document.getElementById("chatbot_body_ul").innerHTML = ul_html;
                    document.getElementById("chat_bot_input").value = "";
                    var test = document.getElementById("scroll_div");
                    test.scrollTop = test.scrollHeight;
                },
                error: function (xhr, type) {
                    console.log(xhr,type);
                }
            });
        }
    });
});

