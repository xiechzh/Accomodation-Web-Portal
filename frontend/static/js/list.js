var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAANyBQ6ikIoa53iMdahFL99Bjt0oBmWpc&libraries=places";
document.head.appendChild(script);

$(document).ready(function(){
    var div_height = window.screen.height;
    div_height = div_height-200;
    div_height = div_height+'px';
    document.getElementById("property_list_scroll_div").style.height = div_height;
});

$(document).ready(function(){
    function property_click(img_link, property_info) {
        img_link.onclick = function () {
            window.localStorage.setItem('property_id', property_info['property_id']);
            window.location.href = 'ViewPage.html';
        };
    }

    function fill_property_list(property_list_sort) {
        for (var i = 0; i < property_list_sort.length; i++) {
            var media_well = document.createElement("div");
            media_well.setAttribute('class','media well');
            media_well.setAttribute('style','height: 190px');
            media_well.setAttribute('name',property_list_sort[i]);
            var img_link =  document.createElement("a");
            img_link.setAttribute('href','/'+ property_list_sort[i]['property_id'] +'/room');
            img_link.setAttribute('class','pull-left');
            media_well.appendChild(img_link);
            property_click(img_link, property_list_sort[i]);

            var img = document.createElement("img");
            var img_url = 'http://127.0.0.1:5200/file/' + property_list_sort[i]["p_photo"][0];
            img.setAttribute('src',img_url);
            img.setAttribute('height','150');
            img.setAttribute('width','200');
            img.setAttribute('class','media-object');
            img_link.appendChild(img);
            var media_body = document.createElement("div");
            media_body.setAttribute('class','media-body');
            media_body.setAttribute('style','height: 100px');
            media_well.appendChild(media_body);
            var media_heading = document.createElement("h4");
            media_heading.setAttribute('class','media-heading');
            media_heading.innerHTML = property_list_sort[i]["title"];
            media_body.appendChild(media_heading);
            var description_div = document.createElement("div");
            description_div.setAttribute('style','overflow: auto; height: 50px');
            var description = document.createElement("p");
            description.innerHTML = property_list_sort[i]["about_the_place"];
            description_div.appendChild(description);
            var bed_bathroom = document.createElement("p");
            media_well.appendChild(bed_bathroom);
            var bed_num = document.createElement("font");
            bed_num.innerHTML = "&ensp;" + property_list_sort[i]["bed_room"] + "&ensp;";
            var bed_icon = document.createElement("img");
            bed_icon.setAttribute('src','../static/icon/ios-bed.svg');
            bed_icon.setAttribute('width','20px');
            var bath_num = document.createElement("font");
            bath_num.innerHTML = "&ensp;" + property_list_sort[i]["bath_room"] + "&ensp;";
            var bath_icon = document.createElement("img");
            bath_icon.setAttribute('src','../static/icon/Shower-.svg');
            bath_icon.setAttribute('width','17px');
            bed_bathroom.appendChild(bed_num);
            bed_bathroom.appendChild(bed_icon);
            bed_bathroom.appendChild(bath_num);
            bed_bathroom.appendChild(bath_icon);
            document.getElementById("property_list_div").appendChild(media_well);
            var location = document.createElement("p");
            location.innerHTML = "<font style='text-transform: capitalize' size='1'>" + property_list_sort[i]["location"] + "</font>" +
                " · " + "<font style='text-transform: capitalize' size='1'>" + property_list_sort[i]["suburb"] + "</font>";
            media_well.appendChild(location);
            var price_div = document.createElement("div");
            media_well.appendChild(price_div);
            price_div.setAttribute('style','text-align: right');
            price_div.innerHTML = "<p style='margin-top: -13%'><font size='4'>$&ensp;"+ property_list_sort[i]["price"] +"/night</font></p>" +
                "<p><img src='../static/icon/rating_star.svg' style='width: 20px;margin-top: -3px'><font size='3'>&ensp;"+ property_list_sort[i]["rating"] +" / 5</font></p>";
        }
    }

    var local_url = window.location.href;
    var type_str = local_url.split('/')[3];
    var property_list = new Array();

    if (type_str === "normal_search") {
        var destination = local_url.split('=')[1].split('&')[0];
        var people_num = local_url.split('=')[2].split('&')[0];
        var arrive_date = local_url.split('=')[3].split('&')[0];
        var departure_date_str = local_url.split('=')[4].split('#')[0];


        if (destination === "") {
            destination = "Sydney";
        }
        if (arrive_date === "" || departure_date_str === "") {
            if (window.localStorage.getItem("arrive_date") !== null && window.localStorage.getItem("departure_date_str") !== null) {
                arrive_date = window.localStorage.getItem("arrive_date");
                departure_date_str = window.localStorage.getItem("departure_date_str");
            } else {
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
                arrive_date = today_year + '-' + today_mouth + '-' + today_date;
                departure_date_str = dep_year + '-' + dep_mouth + '-' + dep_date;
            }
        }

        window.localStorage.setItem('destination',destination);
        window.localStorage.setItem('people_num',people_num);
        window.localStorage.setItem('arrive_date',arrive_date);
        window.localStorage.setItem('departure_date_str',departure_date_str);

        document.getElementById("start_date").value = arrive_date;
        document.getElementById("end_date").value = departure_date_str;
        destination = destination.toLowerCase();

        var url = 'http://127.0.0.1:5000/anhao0522/client/v1/accommodation/all?location='+destination+
                '&checkin='+arrive_date+
                '&checkout='+departure_date_str;

        if (people_num === "") {
            url = url + '&searchtype=0';
        } else {
            url = url + '&numberofpeople='+people_num+'&searchtype=0';
        }

        var data = {};

        $.ajax({
            type: 'GET',
            url: url,
            data: data,
            success: function(data) {
                if (data.length === 0) {
                    alert("No Result!");
                } else {
                    property_list = data;
                    var property_list_sort = data;
                    document.getElementById("property_list_div").innerHTML = "";
                    fill_property_list(property_list_sort);
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        }).done(function () {
            var location_list = new Array();
            var locations_ls_on_map = new Array();
            for (var i = 0; i < property_list.length; i++) {
                locations_ls_on_map.push([property_list[i]["title"],property_list[i]["latitude"],property_list[i]["longitude"],i+1]);
                location_list.push([property_list[i]["longitude"]+"/"+property_list[i]["latitude"]]);
            }
            var location_str = location_list.join(":");
            var get_center_url = "http://127.0.0.1:5200/location_center";
            var data = {"location_list":location_str};
            $.ajax({
                type: 'POST',
                url: get_center_url,
                data: data,
                success: function(data) {
                    var center = data["result"];
                    var locations = locations_ls_on_map;

                    var map = new google.maps.Map(document.getElementById('map'), {
                          zoom: 12,
                          center: new google.maps.LatLng(center[0], center[1]),
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    var infowindow = new google.maps.InfoWindow();

                    var marker, i;

                    var image = {
                        url: "../static/icon/address-b.svg",
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    for (i = 0; i < locations.length; i++) {
                      marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        label: locations[i][3].toString(),
                            map: map
                          //icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                    }
                },
                error: function (xhr, type) {
                    console.log(xhr,type);
                }
            });
        });


    } else if (type_str === "event_search") {
        document.getElementById("normal_search_list_date").style.display = "none";
        var event_destination = local_url.split('=')[1].split('&')[0];
        var event = local_url.split('=')[2].split('#')[0];

        if (event_destination === "") {
            event_destination = "Sydney";
        }

        event_destination = event_destination.toLowerCase();

        var es_url = 'http://127.0.0.1:5000/anhao0522/client/v1/accommodation/all?location='+event_destination;
        if (event === "") {
            es_url = es_url + '&searchtype=1';
        } else {
            es_url = es_url + '&keyword='+event+'&searchtype=1';
        }
        es_url = es_url.replace(/\s+/g,'%20');

        var es_data = {};

        $.ajax({
            type: 'GET',
            url: es_url,
            data: es_data,
            //dataType: 'json',
            success: function(data) {
                if (data.length === 0) {
                    alert("No Result!");
                } else {
                    property_list = data;
                    var property_list_sort = data;
                    document.getElementById("property_list_div").innerHTML = "";
                    fill_property_list(property_list_sort);
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        }).done(function () {
            var location_list = new Array();
            var locations_ls_on_map = new Array();
            for (var i = 0; i < property_list.length; i++) {
                locations_ls_on_map.push([property_list[i]["title"],property_list[i]["latitude"],property_list[i]["longitude"],i+1]);
                location_list.push([property_list[i]["longitude"]+"/"+property_list[i]["latitude"]]);
            }
            var location_str = location_list.join(":");

            var get_center_url = "http://127.0.0.1:5200/location_center";
            var data = {"location_list":location_str};
            $.ajax({
                type: 'POST',
                url: get_center_url,
                data: data,
                success: function(data) {
                    var center = data["result"];
                    var locations = locations_ls_on_map;

                    var map = new google.maps.Map(document.getElementById('map'), {
                      zoom: 12,
                      center: new google.maps.LatLng(center[0], center[1]),
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    var infowindow = new google.maps.InfoWindow();
                    var marker, i;
                    var image = {
                        url: "../static/icon/address-b.svg",
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    for (i = 0; i < locations.length; i++) {
                      marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        label: locations[i][3].toString(),
                            map: map,
                          //icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                    }
                },
                error: function (xhr, type) {
                    console.log(xhr,type);
                }
            });
        });
    }

    $("#distance_rank").click(function () {
        var icon_src = document.getElementById("distance_rank_icon").src;
        var icon_check = icon_src.split('/').pop();
        if (icon_check === "line.svg") {
            document.getElementById("distance_rank_icon").src = "../static/icon/down-right.svg";
            document.getElementById("price_rank_icon").src = "../static/icon/line.svg";
            document.getElementById("star_rank_icon").src = "../static/icon/line.svg";
        } else if (icon_check === "down-right.svg") {
            document.getElementById("distance_rank_icon").src = "../static/icon/up-right.svg";
        } else if (icon_check === "up-right.svg") {
            document.getElementById("distance_rank_icon").src = "../static/icon/down-right.svg";
        }
    });

    $("#price_rank").click(function () {
        var icon_src = document.getElementById("price_rank_icon").src;
        var icon_check = icon_src.split('/').pop();
        if (icon_check === "line.svg") {
            document.getElementById("price_rank_icon").src = "../static/icon/down-right.svg";
            document.getElementById("distance_rank_icon").src = "../static/icon/line.svg";
            document.getElementById("star_rank_icon").src = "../static/icon/line.svg";
            var property_list_sort = property_list.sort(compare("price"));
        } else if (icon_check === "down-right.svg") {
            document.getElementById("price_rank_icon").src = "../static/icon/up-right.svg";
            var property_list_sort = property_list.sort(compare_reverse("price"));
        } else if (icon_check === "up-right.svg") {
            document.getElementById("price_rank_icon").src = "../static/icon/down-right.svg";
            var property_list_sort = property_list.sort(compare("price"));
        }
        document.getElementById("property_list_div").innerHTML = "";
        fill_property_list(property_list_sort);
    });

    $("#star_rank").click(function () {
        var icon_src = document.getElementById("star_rank_icon").src;
        var icon_check = icon_src.split('/').pop();
        if (icon_check === "line.svg") {
            document.getElementById("star_rank_icon").src = "../static/icon/down-right.svg";
            document.getElementById("distance_rank_icon").src = "../static/icon/line.svg";
            document.getElementById("price_rank_icon").src = "../static/icon/line.svg";
            var sortObj = property_list.sort(compare("rating"));
        } else if (icon_check === "down-right.svg") {
            document.getElementById("star_rank_icon").src = "../static/icon/up-right.svg";
            var sortObj = property_list.sort(compare_reverse("rating"));
        } else if (icon_check === "up-right.svg") {
            document.getElementById("star_rank_icon").src = "../static/icon/down-right.svg";
            var sortObj = property_list.sort(compare("rating"));
        }
        document.getElementById("property_list_div").innerHTML = "";
        fill_property_list(sortObj);
    });

    $("#list_search").click(function () {
        var start_date = document.getElementById("start_date").value;
        var end_date = document.getElementById("end_date").value;
        var destination = window.localStorage.getItem("destination");
        var people_num = window.localStorage.getItem("people_num");
        window.location.href = "http://127.0.0.1:5200/normal_search/all?destination="+destination+"&people_num="+people_num+"&start_date="+start_date+"&end_date="+end_date;
    });

    function compare(property){
         return function(obj1,obj2){
             var value1 = obj1[property];
             var value2 = obj2[property];
             return value1 - value2;     // 升序
         }
    }

    function compare_reverse(property){
         return function(obj1,obj2){
             var value1 = obj1[property];
             var value2 = obj2[property];
             return value2 - value1;     // 升序
         }
    }
});

