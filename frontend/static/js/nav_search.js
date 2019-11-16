$(document).ready(function(){

    $("#nav_search_btn").click(function () {
        var today = new Date();
        console.log(today);
        var today_year = today.getFullYear();
        var today_mouth = today.getMonth()+1;
        var today_date = today.getDate();

        if (Math.floor(today_mouth/10) < 1) {
            today_mouth = '0'+ today_mouth;
        }
        if (Math.floor(today_date/10) < 1) {
            today_date = '0'+ today_date;
        }
        var today_str = today_year+'-'+today_mouth+'-'+today_date;

        var departure_date = new Date();

        departure_date.setDate(departure_date.getDate()+1);
        var dep_year = departure_date.getFullYear();
        var dep_mouth = departure_date.getMonth()+1;
        var dep_date = departure_date.getDate();

        if (Math.floor(dep_mouth/10) < 1) {
            dep_mouth = '0'+ dep_mouth;
        }
        if (Math.floor(dep_date/10) < 1) {
            dep_date = '0'+ dep_date;
        }

        var departure_date_str = dep_year+'-'+dep_mouth+'-'+dep_date;
        var nav_search_input = document.getElementById("nav_search_input").value;
        if (nav_search_input === "") {
            nav_search_input = "sydney";
        } else {
            nav_search_input = nav_search_input.toLowerCase();
        }

        window.location.href = "http://127.0.0.1:5200/normal_search/all?destination="+nav_search_input+
            "&people_num=&start_date="+today_str+"&end_date="+departure_date_str;
    });
});

