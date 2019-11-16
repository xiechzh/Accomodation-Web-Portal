var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAANyBQ6ikIoa53iMdahFL99Bjt0oBmWpc&libraries=places";
document.head.appendChild(script);

$(document).ready(function(){
    function fill_property_list(property_list_sort) {
        for (var i = 0; i < property_list_sort.length; i++) {
            var media_well = document.createElement("div");
            media_well.setAttribute('class','media well');
            media_well.setAttribute('style','height: 190px');
            var img_link =  document.createElement("a");
            img_link.setAttribute('href','#');
            img_link.setAttribute('class','pull-left');
            media_well.appendChild(img_link);
            img_link.onclick = function () {
                window.location.href = "ViewPage.html";
            };
            var img = document.createElement("img");
            var img_url = 'http://127.0.0.1:5200/file/' + property_list_sort[i]["p_photo"][0];
            console.log(img_url);
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
            var description = document.createElement("p");
            description.innerHTML = property_list_sort[i]["about_the_place"];
            media_body.appendChild(description);
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
            //var city = property_list_sort[i]["location"];
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

    var type = window.localStorage.getItem("type");
    console.log("ok");

    var property_list = new Array();
    var test_list = new Array();
    var rank_by_star = new Array();
    var rank_by_price = new Array();

    if (type === "0") {
        var destination = window.localStorage.getItem("destination");
        var people_num = window.localStorage.getItem("people_num");
        var arrive_date = window.localStorage.getItem("arrive_date");
        var period = window.localStorage.getItem("period");
        var departure_date = new Date(arrive_date);
        console.log(departure_date);
        departure_date.setDate(departure_date.getDate()+Number(period));
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

        destination = destination.toLowerCase();
        console.log(destination);
        console.log(people_num);
        console.log(arrive_date);
        console.log(period);
        console.log(departure_date);
        console.log(departure_date_str);

        var url = 'http://127.0.0.1:5000/anhao0522/client/v1/accommodation/all?location='+destination+
                '&checkin='+arrive_date+
                '&checkout='+departure_date_str;

        if (people_num === "") {
            url = url + '&searchtype=0';
        } else {
            url = url + '&numberofpeople='+people_num+'&searchtype=0';
        }
        console.log(url);

        var data = {};

        $.ajax({
            type: 'GET',
            url: url,
            data: data,
            //dataType: 'json',
            success: function(data) {
                console.log(data);
                console.log(data["0"]["address"]);
                //document.getElementById("image_test").src = data["0"]["p_photo"][0];
                property_list = data;
                var property_list_sort = data;
                document.getElementById("property_list_div").innerHTML = "";
                fill_property_list(property_list_sort);

                //var reverse = data_copy.sort(compare_reverse("price"));
                //console.log(reverse);

            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        }).done(function () {
            console.log(property_list.length);
            var location_list = new Array();
            var locations_ls_on_map = new Array();
            for (var i = 0; i < property_list.length; i++) {
                locations_ls_on_map.push([property_list[i]["title"],property_list[i]["latitude"],property_list[i]["longitude"],i+1]);
                location_list.push([property_list[i]["longitude"]+"/"+property_list[i]["latitude"]]);
            }
            console.log(location_list);
            var location_str = location_list.join(":");
            console.log(location_str);


            var get_center_url = "http://127.0.0.1:5200/location_center";
            var data = {"location_list":location_str};
            $.ajax({
                type: 'POST',
                url: get_center_url,
                data: data,
                success: function(data) {
                    console.log(data);
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


    } else if (type === "1") {
        var event_destination = window.localStorage.getItem("event_destination");
        var event = window.localStorage.getItem("event");

        event_destination = event_destination.toLowerCase();

        var es_url = 'http://127.0.0.1:5000/anhao0522/client/v1/accommodation/all?location='+event_destination;

        if (event === "") {
            es_url = es_url + '&searchtype=1';
        } else {
            es_url = es_url + '&keyword='+event+'&searchtype=1';
        }
        es_url = es_url.replace(/\s+/g,'%20');

        console.log(es_url);

        var es_data = {};

        $.ajax({
            type: 'GET',
            url: es_url,
            data: es_data,
            //dataType: 'json',
            success: function(data) {
                console.log(data);
                //console.log(data["0"]["address"]);
                //document.getElementById("image_test").src = data["0"]["p_photo"][0];
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
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
            console.log(property_list);
            var property_list_sort = property_list.sort(compare("price"));
            console.log(property_list_sort);
        } else if (icon_check === "down-right.svg") {
            document.getElementById("price_rank_icon").src = "../static/icon/up-right.svg";
            var property_list_sort = property_list.sort(compare_reverse("price"));
            console.log(property_list_sort);
        } else if (icon_check === "up-right.svg") {
            document.getElementById("price_rank_icon").src = "../static/icon/down-right.svg";
            var property_list_sort = property_list.sort(compare("price"));
            console.log(property_list_sort);
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