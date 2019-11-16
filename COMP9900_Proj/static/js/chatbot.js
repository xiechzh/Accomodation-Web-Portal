$(document).ready(function(){

    $("#chat_bot_btn").click(function () {
        console.log("ok");
        setTimeout(test_function, 200);
        function test_function() {
            var test = document.getElementById("scroll_div");
            test.scrollTop = test.scrollHeight;
        }

    });

    $("#chat_bot_input").keydown(function(e) {
        if (e.keyCode === 13) {
            var input_content = document.getElementById("chat_bot_input").value;
            console.log(input_content);

            var url = "http://127.0.0.1:5200/chatbot_msg";
            var data = {
                "message": input_content
            };

            var ul_html = document.getElementById("chatbot_body_ul").innerHTML;
            ul_html = ul_html + '<li class="message right"><img class="logo" src="../static/Unknown.png" alt=""><p>'+ input_content +'</p></li>';
            document.getElementById("chatbot_body_ul").innerHTML = ul_html;
            document.getElementById("chat_bot_input").value = "";
            var test = document.getElementById("scroll_div");
            test.scrollTop = test.scrollHeight;
            console.log("test");

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(data) {
                    console.log(data);
                    var ul_html = document.getElementById("chatbot_body_ul").innerHTML;
                    ul_html = ul_html + '<li class="message left"><img class="logo" src="../static/icon/robot.svg" alt=""><p>'+ data[0] +'</p></li>';
                    document.getElementById("chatbot_body_ul").innerHTML = ul_html;
                    document.getElementById("chat_bot_input").value = "";
                    var test = document.getElementById("scroll_div");
                    test.scrollTop = test.scrollHeight;
                    console.log("test");
                },
                error: function (xhr, type) {
                    console.log(xhr,type);
                }
            });
        }
    });
});