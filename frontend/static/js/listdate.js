$(document).ready(function() {
    var today = new Date();
    var today_year = today.getFullYear();
    var today_mouth = today.getMonth() + 1;
    var today_date = today.getDate();

    if (Math.floor(today_mouth / 10) < 1) {
        today_mouth = '0' + today_mouth;
    }
    if (Math.floor(today_date / 10) < 1) {
        today_date = '0' + today_date;
    }
    document.getElementById("start_date").min = today_year + '-' + today_mouth + '-' + today_date;

    if (window.localStorage.getItem("arrive_date") !== null) {
        document.getElementById("start_date").value = window.localStorage.getItem("arrive_date");
    } else {
        document.getElementById("start_date").value = today_year + '-' + today_mouth + '-' + today_date;
    }

    var departure_date = new Date();
    departure_date.setDate(departure_date.getDate()+1);
    var dep_year = departure_date.getFullYear();
    var dep_mouth = departure_date.getMonth()+1;
    var dep_date = departure_date.getDate();
    if (Math.floor(today_mouth / 10) < 1) {
        dep_mouth = '0' + dep_mouth;
    }
    if (Math.floor(today_date / 10) < 1) {
        dep_date = '0' + dep_date;
    }
    document.getElementById("end_date").min = dep_year + '-' + dep_mouth + '-' + dep_date;

    if (window.localStorage.getItem("departure_date_str") !== null) {
        document.getElementById("end_date").value = window.localStorage.getItem("departure_date_str");
    } else {
        document.getElementById("end_date").value = dep_year + '-' + dep_mouth + '-' + dep_date;
    }

    $('input[name=start_date]').change(function() {
        var end_time = document.getElementById("start_date").value;
        var departure_date = new Date(end_time);
        departure_date.setDate(departure_date.getDate()+1);
        var dep_year = departure_date.getFullYear();
        var dep_mouth = departure_date.getMonth()+1;
        var dep_date = departure_date.getDate();
        if (Math.floor(dep_mouth / 10) < 1) {
            dep_mouth = '0' + dep_mouth;
        }
        if (Math.floor(dep_date / 10) < 1) {
            dep_date = '0' + dep_date;
        }
        document.getElementById("end_date").min = dep_year + '-' + dep_mouth + '-' + dep_date;
        document.getElementById("end_date").value = dep_year + '-' + dep_mouth + '-' + dep_date;
    });
});

