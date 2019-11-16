$(document).ready(function() {
    var today = new Date();
    console.log(today);
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
    document.getElementById("start_date").value = today_year + '-' + today_mouth + '-' + today_date;
    $('input[name=start_date]').change(function() {
        console.log("ccc")
        var end_time = document.getElementById("start_date").value;
        document.getElementById("end_date").min = end_time;
    });
    //console.log(end_time);
    //document.getElementById("end_date").min = end_time;
    //document.getElementById("end_date").value = end_time;
});