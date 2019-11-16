var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAANyBQ6ikIoa53iMdahFL99Bjt0oBmWpc&libraries=places";
document.head.appendChild(script);

$(document).ready(function(){
    var local_url = window.location.href;
    var property_id = local_url.split("/")[3];
    var url = 'http://127.0.0.1:5000/anhao0522/client/v1/accommodation/room/'+property_id;
    var data = {};
    var suburb = "";
    var map_location_list = new Array();
    var check_url = 'http://127.0.0.1:5200/login';
    var login_check_data = {};
    var username = "";

    $.ajax({
        type: 'GET',
        url: check_url,
        data: login_check_data,
        success: function(data) {
            username = data;
        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    });
    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        //dataType: 'json',
        success: function(data) {
            suburb = data["address"];
            map_location_list.push([data["title"],data["latitude"],data["longitude"]]);
            document.getElementById("myModalLabel").innerHTML = data["customer_id"];
            document.getElementById("property_header").innerHTML = data["title"]+"<small style='text-transform: capitalize'> · "+data["suburb"]+"</small>";
            document.getElementById("rating").innerHTML = data["rating"];
            var images_position_list =  document.getElementById("images_position_list");
            var images_list =  document.getElementById("images_list");
            images_position_list.innerHTML = "";
            images_list.innerHTML = "";
            for (var i = 0; i < data["p_photo"].length;i++) {
                var img_url = 'http://127.0.0.1:5200/file/' + data["p_photo"][i];
                var img_position = document.createElement("li");
                img_position.setAttribute('data-target','#myCarousel');
                img_position.setAttribute('data-slide-to',i+'');
                if (i === 0) {
                    img_position.setAttribute('class','active');
                }
                images_position_list.appendChild(img_position);
                var img_div = document.createElement("div");
                if (i === 0) {
                    img_div.setAttribute('class','item active');
                } else {
                    img_div.setAttribute('class','item');
                }
                images_list.appendChild(img_div);
                var img = document.createElement("img");
                img.setAttribute('src',img_url);
                img.setAttribute('style','height: 400px');
                img_div.appendChild(img);
            }
            document.getElementById("price").innerHTML = "AU$ " + data["price"] + "/night";
            document.getElementById("size").innerHTML = data["size"];
            document.getElementById("description_div").innerHTML = data["about_the_place"];
            document.getElementById("bed").innerHTML = data["bed_room"];
            document.getElementById("bath").innerHTML = data["bath_room"];
            if (data["parking"] === 0) {
                document.getElementById("parking").innerHTML = "Street Parking";
            } else {
                document.getElementById("parking").innerHTML = data["parking"];
            }
            if (data["wifi"] === true) {
                document.getElementById("wifi").innerHTML = "Free";
            } else {
                document.getElementById("wifi").innerHTML = "No WiFi";
            }
            if (data["pet"] === true) {
                document.getElementById("pet").innerHTML = "Allowed";
            } else {
                document.getElementById("pet").innerHTML = "Not Allowed";
            }
            document.getElementById("people").innerHTML = "Maximum " + data["maxium_people"];
            if (data["cooking"] === true) {
                document.getElementById("cooking").innerHTML = "Allowed";
            } else {
                document.getElementById("cooking").innerHTML = "Not Allowed";
            }
            if (data["air-condition"] === true) {
                document.getElementById("air_cond").innerHTML = "Free";
            } else {
                document.getElementById("air_cond").innerHTML = "No Air Conditioning";
            }
            document.getElementById("address").innerHTML = data["address"];
            document.getElementById("host").innerHTML = data["customer_id"];

            var comment_wall = document.getElementById("comment_wall");
            comment_wall.innerHTML = "";
            for (var i = 0; i < data["comments"].length;i++) {
                var comment_media_well = document.createElement("div");
                comment_media_well.setAttribute('class','media well');
                comment_wall.appendChild(comment_media_well);
                var commenter_img_link = document.createElement("a");
                commenter_img_link.setAttribute('href','#');
                commenter_img_link.setAttribute('class','pull-left');
                comment_media_well.appendChild(commenter_img_link);
                var img_src = 'http://127.0.0.1:5200/file/'+data["comments"][i]["commenter"];
                var comment_image_str = '<img id="c_photo" src="'+img_src+'" onerror="this.src=\'/static/Unknown.png\'" class="media-object" height="50" width="50" />';
                commenter_img_link.innerHTML = comment_image_str;
                var comment_media_body = document.createElement("div");
                comment_media_body.setAttribute('class','media-body');
                comment_media_well.appendChild(comment_media_body);
                var comment_media_contain = document.createElement("div");
                comment_media_contain.setAttribute('style','height: 70px');
                comment_media_body.appendChild(comment_media_contain);
                var comment_media_col10 = document.createElement("div");
                comment_media_col10.setAttribute('class','col-md-10 column');
                comment_media_contain.appendChild(comment_media_col10);
                var comment_media_header = document.createElement("h4");
                comment_media_header.setAttribute('id','comment_header');
                comment_media_header.setAttribute('class','media-heading');
                comment_media_header.innerHTML = data["comments"][i]["commenter"];
                var comment_media_text = document.createElement("div");
                comment_media_text.setAttribute('id','comment_text');
                comment_media_text.innerHTML = data["comments"][i]["text"];
                comment_media_col10.appendChild(comment_media_header);
                comment_media_col10.appendChild(comment_media_text);
                var comment_media_col2 = document.createElement("div");
                comment_media_col2.setAttribute('class','col-md-2 column');
                comment_media_contain.appendChild(comment_media_col2);
                var comment_media_center = document.createElement("div");
                comment_media_center.setAttribute('style','margin-left: 30px; width: 100%;text-align: center');
                comment_media_col2.appendChild(comment_media_center);
                var comment_media_star = document.createElement("img");
                comment_media_star.setAttribute('style','width: 30px; margin: auto');
                comment_media_star.setAttribute('src','../static/icon/rating_star.svg');//
                comment_media_center.appendChild(comment_media_star);
                var comment_media_sp = document.createElement("br");
                comment_media_center.appendChild(comment_media_sp);
                var comment_media_rating = document.createElement("font");
                comment_media_rating.setAttribute('size','4');
                comment_media_rating.setAttribute('id','comment_rating');
                comment_media_rating.innerHTML = data["comments"][i]["avg_mark"];
                comment_media_center.appendChild(comment_media_rating);
                var comment_media_rating_2 = document.createElement("font");
                comment_media_rating_2.setAttribute('size','4');
                comment_media_rating_2.innerHTML="/5.0";
                comment_media_center.appendChild(comment_media_rating_2);
                var comment_media_time = document.createElement("div");
                comment_media_time.setAttribute('style','width: 100%;text-align: right');
                comment_media_body.appendChild(comment_media_time);
                var comment_time = document.createElement("font");
                comment_time.innerHTML = data["comments"][i]["date"];
                comment_media_time.appendChild(comment_time);
                comment_wall.appendChild(comment_media_well);
            }
        },
        error: function (xhr, type) {
            console.log(xhr,type);
        }
    }).done(function () {
        window.localStorage.setItem('suburb',suburb);
        var event_recommend_url = 'http://127.0.0.1:5200/event';
        var event_require = {
            "building":"restaurant",
            "suburb":suburb
        };
        $.ajax({
            type: 'POST',
            url: event_recommend_url,
            data: event_require,
            success: function(data) {
                var restaurant_recommend_list = document.getElementById("restaurant_recommend_list");
                restaurant_recommend_list.innerHTML = "";
                for (var i = 0;i < data.length;i++) {
                    map_location_list.push([data[i]["name"],data[i]["coordinates"]["latitude"],data[i]["coordinates"]["longitude"]]);
                    var media_well = document.createElement("div");
                    media_well.setAttribute('class','media well');
                    media_well.setAttribute('style','margin: 4px; padding: 4%');
                    restaurant_recommend_list.appendChild(media_well);
                    var img_link = document.createElement("a");
                    img_link.setAttribute('href',data[i]["url"]);//
                    img_link.setAttribute('class','pull-left');
                    media_well.appendChild(img_link);
                    var img = document.createElement("img");
                    if (data[i]["image_url"] === "") {
                        img.setAttribute('src','../static/housetemplete/Unknown2.jpg');//
                    } else {
                        img.setAttribute('src',data[i]["image_url"]);//
                    }
                    img.setAttribute('height','90');
                    img.setAttribute('width','90');
                    img.setAttribute('class','media-object');
                    img_link.appendChild(img);
                    var media_body = document.createElement("div");
                    media_body.setAttribute('class','media-body');
                    media_well.appendChild(media_body);
                    var media_header = document.createElement("h4");
                    media_header.innerHTML = data[i]["name"];//
                    media_body.appendChild(media_header);
                    var media_text = document.createElement("div");
                    media_text.innerHTML = "<img src='../static/icon/eglass-star_1.svg' style='height: 17px;margin-top: -5px'>&ensp;" + data[i]["rating"] + "/5.0<br><img src='../static/icon/phone-fill.svg' style='height: 17px;margin-top: -5px'>&ensp;" + data[i]["display_phone"]//
                    media_body.appendChild(media_text);

                }

                var locations = map_location_list;

                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 15.5,
                  center: new google.maps.LatLng(map_location_list[0][1], map_location_list[0][2]),
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var image = {
                    url: "../static/icon/address-b_blue.svg",
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                for (i = 0; i < locations.length; i++) {


                  if (i === 0) {
                      marker = new google.maps.Marker({
                          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        //label: locations[i][3].toString(),
                            map: map
                          //icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                  } else {
                      marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        //label: locations[i][3].toString(),
                            map: map,
                          icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                  }
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    });

    function get_building(event_require, event_recommend_url, map_location_list, recommend_list_div_name, zoom) {
        $.ajax({
            type: 'POST',
            url: event_recommend_url,
            data: event_require,
            //dataType: 'json',
            success: function(data) {
                var restaurant_recommend_list = document.getElementById(recommend_list_div_name);
                restaurant_recommend_list.innerHTML = "";
                for (var i = 0;i < data.length;i++) {
                    map_location_list.push([data[i]["name"],data[i]["coordinates"]["latitude"],data[i]["coordinates"]["longitude"]]);
                    var media_well = document.createElement("div");
                    media_well.setAttribute('class','media well');
                    media_well.setAttribute('style','margin: 4px; padding: 4%');
                    restaurant_recommend_list.appendChild(media_well);
                    var img_link = document.createElement("a");
                    img_link.setAttribute('href',data[i]["url"]);//
                    img_link.setAttribute('class','pull-left');
                    media_well.appendChild(img_link);
                    var img = document.createElement("img");
                    if (data[i]["image_url"] === "") {
                        img.setAttribute('src','../static/housetemplete/Unknown2.jpg');//
                    } else {
                        img.setAttribute('src',data[i]["image_url"]);//
                    }
                    img.setAttribute('height','90');
                    img.setAttribute('width','90');
                    img.setAttribute('class','media-object');
                    img_link.appendChild(img);
                    var media_body = document.createElement("div");
                    media_body.setAttribute('class','media-body');
                    media_well.appendChild(media_body);
                    var media_header = document.createElement("h4");
                    media_header.innerHTML = data[i]["name"];//
                    media_body.appendChild(media_header);
                    var media_text = document.createElement("div");
                    media_text.innerHTML = "<img src='../static/icon/eglass-star_1.svg' style='height: 17px;margin-top: -5px'>&ensp;" + data[i]["rating"] + "/5.0<br><img src='../static/icon/phone-fill.svg' style='height: 17px;margin-top: -5px'>&ensp;" + data[i]["display_phone"]//
                    media_body.appendChild(media_text);

                }

                var locations = map_location_list;

                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: zoom,
                  center: new google.maps.LatLng(map_location_list[0][1], map_location_list[0][2]),
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var image = {
                    url: "../static/icon/address-b_blue.svg",
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                for (i = 0; i < locations.length; i++) {


                  if (i === 0) {
                      marker = new google.maps.Marker({
                          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        //label: locations[i][3].toString(),
                            map: map
                          //icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                  } else {
                      marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        //label: locations[i][3].toString(),
                            map: map,
                          icon: image
                      });

                      google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                          infowindow.setContent(locations[i][0]);
                          infowindow.open(map, marker);
                        }
                      })(marker, i));
                  }
                }
            },
            error: function (xhr, type) {
                console.log(xhr,type);
            }
        });
    }

    $("#restaurant_recommend").click(function () {
        document.getElementById("restaurant_recommend").className="active";
        document.getElementById("shopping_recommend").className="";
        document.getElementById("gym_recommend").className="";
        document.getElementById("restaurant_recommend_list").style.display="";
        document.getElementById("shopping_recommend_list").style.display="none";
        document.getElementById("gym_recommend_list").style.display="none";
        document.getElementById("search_recommend_list").style.display="none";
        var event_recommend_url = 'http://127.0.0.1:5200/event';
        var event_require = {
            "building":"restaurant",
            "suburb":suburb
        };
        var map_location_list_copy = map_location_list.concat();
        get_building(event_require, event_recommend_url, map_location_list_copy, "restaurant_recommend_list", 15.5);
    });

    $("#shopping_recommend").click(function () {
        document.getElementById("restaurant_recommend").className="";
        document.getElementById("shopping_recommend").className="active";
        document.getElementById("gym_recommend").className="";
        document.getElementById("shopping_recommend_list").style.display="";
        document.getElementById("restaurant_recommend_list").style.display="none";
        document.getElementById("gym_recommend_list").style.display="none";
        document.getElementById("search_recommend_list").style.display="none";
        var event_recommend_url = 'http://127.0.0.1:5200/event';
        var event_require = {
            "building":"shopping",
            "suburb":suburb
        };
        var map_location_list_copy = map_location_list.concat();
        get_building(event_require, event_recommend_url, map_location_list_copy, "shopping_recommend_list", 14);
    });

    $("#gym_recommend").click(function () {
        document.getElementById("restaurant_recommend").className="";
        document.getElementById("shopping_recommend").className="";
        document.getElementById("gym_recommend").className="active";
        document.getElementById("gym_recommend_list").style.display="";
        document.getElementById("restaurant_recommend_list").style.display="none";
        document.getElementById("shopping_recommend_list").style.display="none";
        document.getElementById("search_recommend_list").style.display="none";
        var event_recommend_url = 'http://127.0.0.1:5200/event';
        var event_require = {
            "building":"gym",
            "suburb":suburb
        };
        var map_location_list_copy = map_location_list.concat();
        get_building(event_require, event_recommend_url, map_location_list_copy, "gym_recommend_list", 13);
    });

    $("#recommend_search_go").click(function () {
        var reco_search_input = document.getElementById("recommend_search_input").value;
        document.getElementById("restaurant_recommend").className="";
        document.getElementById("shopping_recommend").className="";
        document.getElementById("gym_recommend").className="";
        document.getElementById("gym_recommend_list").style.display="none";
        document.getElementById("restaurant_recommend_list").style.display="none";
        document.getElementById("shopping_recommend_list").style.display="none";
        document.getElementById("search_recommend_list").style.display="";
        var event_recommend_url = 'http://127.0.0.1:5200/event';
        var event_require = {
            "building":reco_search_input,
            "suburb":suburb
        };
        var map_location_list_copy = map_location_list.concat();
        get_building(event_require, event_recommend_url, map_location_list_copy, "search_recommend_list", 13.6);
    });

    $('#booking_btn_2').click(function () {
        if($("#nav_name").is(":hidden")){
            document.getElementById("nav_sign_in").click();
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
            document.getElementById("start_date").min = today_year + '-' + today_mouth + '-' + today_date;
            document.getElementById("start_date").value = today_year + '-' + today_mouth + '-' + today_date;
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
            document.getElementById("end_date").value = dep_year + '-' + dep_mouth + '-' + dep_date;
            document.getElementById("confirm_form").setAttribute('action','/'+document.getElementById('customer_name').innerHTML.split('<')[0]+'/booking_successful/'+property_id);
            document.getElementById('booking_btn').click();
        }
    });
});

