from flask import render_template, Flask, request, jsonify, url_for, redirect
from flask_pymongo import PyMongo
import json
from Model import *
import time
from datetime import datetime

def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response
global Username
global token
global info
token = ""
Username = ""
info = ""
app = Flask(__name__, static_url_path='/static')
app.after_request(after_request)
app.config['MONGO_URI'] = 'mongodb://comp9900:z12345@ds161529.mlab.com:61529/comp9900_2019'
mongo = PyMongo(app)


@app.route('/', methods=['GET', 'POST'])
def home_page():
    return render_template("HomePage.html"), 200


@app.route('/normal_search/all', methods=['GET','POST'])
def list_all_result():
    #print(request.args["destination"])
    #print(request.args["people_num"])
    #print(request.args["arrive_date"])
    #print(request.args["period"])
    #print(request.args["start_date"])
    #print(request.args["end_date"])
    #http://127.0.0.1:5200/normal_search/all?destination=sydney&people_num=&start_time=2019-08-11&end_time=2019-08-12
    #print("")
    return render_template("List.html", test = 'test'), 200


@app.route('/event_search/all', methods=['GET','POST'])
def event_search():
    #print(request.args["event_destination"])
    #print(request.args["event"])
    #print("")
    return render_template("List.html"), 200


@app.route('/<room_id>/room', methods=['GET'])
def get_room(room_id):
    #print("")
    return render_template("ViewPage.html"), 200


@app.route('/<username>/personinfo', methods=['GET'])
def person_information(username):
    global Username
    if username != Username:
        return redirect(url_for('home_page'))
    return render_template('Personalinfo.html'), 200


@app.route('/<id>/property_post')
def picture(id):
    global Username
    global token
    if id != Username:
        return redirect(url_for('home_page'))
    return render_template('NewProperty.html', id=id)


@app.route('/<customer_id>/alter_info', methods=['POST'])
def alter_info(customer_id):
    global Username
    global token
    if customer_id != Username:
        return redirect(url_for('home_page'))
    #print(request.form)
    #print(customer_id)
    #print(request.files)
    url = "http://127.0.0.1:5000/anhao0522/client/v1/user/"
    url = url + Username
    response = requests.get(url, headers={"auth_token": token})
    data = response.json()
    tmp_dic = {}
    tmp_dic.setdefault('customer_id',Username)
    tmp_dic.setdefault('password', data['password'])
    tmp_dic.setdefault('first_name',request.form['alter_first_name'])
    tmp_dic.setdefault('last_name',request.form['alter_family_name'])
    tmp_dic.setdefault('address',request.form['alter_address'])
    tmp_dic.setdefault('email',request.form['alter_e_mail'])
    tmp_dic.setdefault('birthday',request.form['alter_birthday'])
    tmp_dic.setdefault('credit',data['credit'])
    tmp_dic.setdefault('contact_number',request.form['alter_phone_num'])
    tmp_dic.setdefault('gender',request.form['alter_gender'])
    tmp_dic.setdefault('account_type', data['account_type'])
    if 'file' in request.files:
        image = request.files['file']
        mongo.save_file(image.filename, image)
        mongo.db.test.delete_one({'id': Username})
        mongo.db.test.insert_one({'id': Username, 'photo_name': image.filename})
    tmp_dic.setdefault('c_photo',Username)
    tmp_dic.setdefault('host_order',data['host_order'])
    tmp_dic.setdefault('trip_order',data['trip_order'])
    tmp_dic.setdefault('properties',data['properties'])
    tmp_dic.setdefault('new_message',data['new_message'])
    tmp_dic.setdefault('message_box',data['message_box'])
    response_put = requests.put(url, json=tmp_dic, headers={"auth_token": token})
    #print(response_put)
    return render_template('Personalinfo.html'), 200


@app.route('/<user_id>/booking_successful/<property_id>',methods=['GET','POST'])
def booking_successful(user_id, property_id):
    global Username
    global token
    if user_id != Username:
        return redirect(url_for('home_page'))
    tmp_dic = {}
    dt = datetime.now()
    dt_in = dt.strftime('%Y-%m-%d %H:%M:%S')
    lis_db = list(mongo.db.order_collection.find())
    data = mongo.db.property_collection.find_one({"property_id": int(property_id)})
    o_id = lis_db[-1]['order_id']
    tmp_dic.setdefault('order_id',o_id+1)
    tmp_dic.setdefault('property_id',int(property_id))
    tmp_dic.setdefault('host_id',data['customer_id'])
    tmp_dic.setdefault('customer_id',user_id)
    tmp_dic.setdefault('checkin_time',request.form['start_date'])
    tmp_dic.setdefault('checkout_time',request.form['end_date'])
    tmp_dic.setdefault('price',data['price'])
    tmp_dic.setdefault('payment','Mastercard')
    tmp_dic.setdefault('payment_time',dt_in)
    tmp_dic.setdefault('commented',False)
    #print(tmp_dic)
    url = "http://127.0.0.1:5000/anhao0522/client/v1/user/{uid}/order".format(uid=user_id)
    response = requests.post(url,json=tmp_dic,headers={"auth_token": token})
    if response.status_code == 200:
        return render_template('Successful.html', order_id=o_id+1, price=data['price'],
                               arrival_content=request.form['start_date'], departure_content=request.form['end_date'],
                               payment_type='Mastercard', customer_id=data['customer_id'], a=data["latitude"], b=data["longitude"],
                               title=data["title"], address=data["address"]), 200
    elif response.status_code == 404:
        return render_template('fail.html')
    else:
        return response.status_code


@app.route('/signout', methods=['POST'])
def signout():
    global token
    global Username
    token = ''
    Username = ''
    return "ok"


@app.route('/login', methods=['GET'])
def login_check():
    global token
    global Username
    if token == '':
        return '0'
    else:
        return Username


@app.route('/login', methods=['POST'])
def login():
    global token
    global Username
    global Password
    Username = request.form["sign_in_account"]
    Password = request.form["sign_in_password"]
    url = "http://127.0.0.1:5000/anhao0522/client/v1/login?username={Username}&password={Password}".format(Username=Username,Password=Password)
    response = requests.get(url, headers={"Accept": "application/json"})
    data = response.json()
    #print(data)
    #print(Username)
    if data['reply'] == "NU":
        return "No_account"
    elif data['reply'] == "NM":
        return "Wrong_password"
    else:
        token = data['reply']
        return "ok"


@app.route('/signup',methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        Username = request.form["account"]
        Password1 = request.form["password_1"]
        dict1 = {"customer_id": Username, "password": Password1, "first_name": "", "last_name": "", "address": "",
                 "email": "",
                 "birthday": "", "credit": 0, "contact_number": "", "gender": "", "account_type": False,
                 "host_order": [], "trip_order": [],
                 "properties": [], "new_message": [], "message_box": []}
        url = "http://127.0.0.1:5000/anhao0522/client/v1/signup"
        response = requests.post(url, headers={"Accept": "application/json"}, json=dict1)
        if response.status_code == 400:
            return "400"
        else:
            return "ok"
    else:
        pass


@app.route('/event', methods=['POST'])
def get_event():
    yelp = Yelp()
    if "location" in request.form:
        location = request.form["location"]

        result = yelp.search_events(location)["events"]
        # result = yelp.search_restaurant("gym","kingsford")["businesses"]
        return jsonify(result)
    else:
        building = request.form["building"]
        suburb = request.form["suburb"]
        result = yelp.search_restaurant(building, suburb)["businesses"]
        return jsonify(result)


@app.route('/order_delete', methods=['POST'])
def order_delete():
    global Username
    global token
    order_id = request.form["order_id"]
    request_type = request.form["request_type"]
    if request_type == '0':
        url = f"http://127.0.0.1:5000/anhao0522/client/v1/user/{Username}/order"
        url +=f"?order_id={order_id}"
        response = requests.delete(url, headers={"auth_token": token})

    elif request_type == '1':
        url = f"http://127.0.0.1:5000/anhao0522/client/v1/landlord/{Username}/order"
        url += f"?order_id={order_id}&cancel_order=false"
        response = requests.delete(url, headers={"auth_token": token})

    elif request_type == '2':
        url = f"http://127.0.0.1:5000/anhao0522/client/v1/landlord/{Username}/order"
        url += f"?order_id={order_id}&cancel_order=true"
        response = requests.delete(url, headers={"auth_token": token})
    if response.status_code == 401:
        #print("401")
        return "timeout"
    elif response.status_code == 200:
        return "ok"
    else:
        return "Something wrong"


@app.route('/new_message_read', methods=['POST'])
def new_message_read():
    global Username
    global token
    delete_new = request.form["delete_new"]
    url = "http://127.0.0.1:5000/anhao0522/client/v1/messageBox"
    body = {"mid": f"{Username}", "time": "", "text": delete_new}
    response = requests.post(url, headers={"auth_token": token}, json=body)
    if response.status_code == 401:
        #print("401")
        return "timeout"
    elif response.status_code == 200:
        return "ok"
    else:
        return "Something wrong"


@app.route('/new_message', methods=['POST'])
def new_message():
    global Username
    global token
    url = "http://127.0.0.1:5000/anhao0522/client/v1/messageBox"
    send_to = request.form["send_to"]
    message = request.form["message"]
    message_time = request.form["message_time"]
    body = {"mid":f"{Username}---{send_to}","time":message_time,"text":message}
    response = requests.post(url, headers={"auth_token": token}, json=body)
    if response.status_code == 401:
        #print("401")
        return "timeout"
    elif response.status_code == 200:
        return "ok"
    else:
        return "Something wrong"


@app.route('/new_comment', methods=['POST'])
def new_comment():
    global Username
    global token
    comment_pid = request.form["comment_pid"]
    comment_text = request.form["comment_text"]
    rating_num = request.form["rating_num"]
    comment_oid = request.form["comment_oid"]
    time = request.form["time"]
    url = f"http://127.0.0.1:5000/anhao0522/client/v1/accommodation/room/{comment_pid}/comment?order_id={comment_oid}"
    body = {
              "commenter": Username,
              "avg_mark": float(rating_num),
              "cleanliness_mark": 0,
              "facility_mark": 0,
              "attitude_mark": 0,
              "text": comment_text,
              "reply": "",
              "photo": [],
              "date": time
            }
    response = requests.post(url, headers={"auth_token": token}, json=body)
    if response.status_code == 401:
        #print("401")
        return "timeout"
    elif response.status_code == 201:
        return "ok"
    else:
        return "Something wrong"


@app.route('/message_del', methods=['GET'])
def message_del():
    AB = request.args["AB"]
    #print(AB)
    url = f"http://127.0.0.1:5000/anhao0522/client/v1/messageBox?AB={AB}"
    response = requests.delete(url, headers={"auth_token": token})
    if response.status_code == 401:
        #print("401")
        return "wrong"
    elif response.status_code == 200:
        return "ok"
    else:
        return "Something wrong"


@app.route('/become_host', methods=['post'])
def become_host():
    global info
    info["account_type"] = True
    #print(info)
    url = "http://127.0.0.1:5000/anhao0522/client/v1/user/"
    url = url + Username
    response = requests.put(url, headers={"auth_token": token},json=info)

    if response.status_code == 401:
        #print("401")
        return "wrong"
    elif response.status_code == 200:
        return "ok"
    else:
        return "Something wrong"


@app.route('/personalinfo', methods=['GET'])
def personalinfo():
    global Username
    global token
    global info
    url = "http://127.0.0.1:5000/anhao0522/client/v1/user/"
    sign_in_account = request.args["sign_in_account"]
    url = url + sign_in_account
    #print(url)
    #print(sign_in_account)
    response = requests.get(url, headers={"auth_token": token})
    #print(response.json())
    info=response.json()
    return jsonify(response.json())


@app.route('/chatbot_msg', methods=['POST'])
def chatbot_msg():
    global Username
    global token
    message = request.form["message"]
    url = "http://127.0.0.1:5000/anhao0522/client/v1/chatbot?"
    url+=f"q={message}"
    response = requests.post(url, headers={"auth_token": token})
    return jsonify(response.json())


@app.route('/s/<location>/all')
def show_list(location):
    if request.method == 'POST':
        destination = location
        num_persons = request.args["numpeople"]
        arrive_date = request.args["checkin"]
        departure_date = request.args["checkout"]
        if destination != None and num_persons != None and arrive_date != None and departure_date != None:
            url = "http://127.0.0.1:5000/anhao0522/client/v1/accommodation/all?" \
              "location={location}&checkin={checkin}&checkout={checkout}&numberofpeople={num}&searchtype={type}".format()
    pass


@app.route('/<id>/post_done',methods=['GET','POST'])
def post_property(id):
    global Username
    global token
    if id != Username:
        return redirect(url_for('home_page'))
    if request.method == 'POST':
        #print(request.form)
        #print(request.values.get('Pet'))
        tmp_dic = {}
        tmp_dic.setdefault('property_type',request.values['property_type'])
        tmp_dic.setdefault('property_bedroom', request.values['property_bedroom'])
        tmp_dic.setdefault('property_bathroom', request.values['property_bathroom'])
        tmp_dic.setdefault('property_parking', request.values['property_parking'])
        tmp_dic.setdefault('property_wifi', request.values['WIFI'])
        tmp_dic.setdefault('property_air', request.values['Air_condition'])
        tmp_dic.setdefault('property_cook', request.values['Cooking'])
        tmp_dic.setdefault('property_pet', request.values['Pet'])
        property_location = request.form['property_location'].lower()
        property_suburb = request.form['property_suburb'].lower()
        property_address = request.form['property_address']
        property_size = request.form['property_size']
        property_price = request.form['property_price']
        property_max_people = request.form['property_max_people']
        property_start = request.form['start_date']
        property_end = request.form['end_date']
        property_title = request.form['property_title']
        property_description = request.form['property_description']

        for key in tmp_dic:
            if tmp_dic[key] == "YES":
                tmp_dic[key] = True
            elif tmp_dic[key] == "NO":
                tmp_dic[key] = False
            else:
                continue
        #print(tmp_dic)
    photo_id = []
    if 'upload' in request.files:
        for file in request.files.getlist("upload"):
            #print("file ", file, type(file), file.filename)
            mongo.save_file(file.filename, file)
            num_photo = str(int(time.time()))
            photo_id.append(num_photo)
            mongo.db.test.insert_one({'id': num_photo, 'photo_name': file.filename})
        #for i in range(len(request.files.getlist('upload'))):
         #   photo = request.files.getlist('upload')
          #  print(photo.filename)
            #mongo.save_file(photo.filename, photo)
            #num_photo = str(int(time.time()))
            #mongo.db.test.insert_one({'id': num_photo, 'photo_name': photo.filename})
    #id = 'Cindy'
    lis_db = list(mongo.db.property_collection.find())
    t_id = lis_db[-1]['property_id']
    #print(t_id)
    url = "https://maps.google.com/maps/api/geocode/json?key=AIzaSyAANyBQ6ikIoa53iMdahFL99Bjt0oBmWpc&address={address}&sensor=false".format(
        address=property_address)
    data = requests.request("GET", url)
    ddic_1 = data.json()['results'][0]['geometry']['location']
    lng = ddic_1['lng']
    lat = ddic_1['lat']
    ava_time = get_date_list(property_start,property_end)
    ava_time_l = []
    for i in ava_time:
        ava_time_dic = {}
        ava_time_dic.setdefault('time',i)
        ava_time_dic.setdefault('status',True)
        ava_time_l.append(ava_time_dic)
    post_data_dic = {}
    post_data_dic.setdefault('customer_id',id)
    post_data_dic.setdefault('property_id',t_id+1)
    post_data_dic.setdefault('address',property_address)
    post_data_dic.setdefault('longitude',float(lng))
    post_data_dic.setdefault('latitude',float(lat))
    post_data_dic.setdefault('price', float(property_price))
    post_data_dic.setdefault('type',tmp_dic['property_type'])
    post_data_dic.setdefault('size',float(property_size))
    post_data_dic.setdefault('wifi', tmp_dic['property_wifi'])
    post_data_dic.setdefault('air-condition',tmp_dic['property_air'])
    post_data_dic.setdefault('cooking', tmp_dic['property_cook'])
    post_data_dic.setdefault('pet',tmp_dic['property_pet'])
    post_data_dic.setdefault('bed_room',int(tmp_dic['property_bedroom']))
    post_data_dic.setdefault('bath_room',int(tmp_dic['property_bathroom']))
    post_data_dic.setdefault('parking',int(tmp_dic['property_parking']))
    post_data_dic.setdefault('location',property_location)
    post_data_dic.setdefault('suburb',property_suburb)
    post_data_dic.setdefault('maxium_people',int(property_max_people))
    post_data_dic.setdefault('about_the_place',property_description)
    post_data_dic.setdefault('title',property_title)
    post_data_dic.setdefault('rating',0.0)
    post_data_dic.setdefault('comments',[])
    post_data_dic.setdefault('p_photo',photo_id)
    post_data_dic.setdefault('discount',0.0)
    post_data_dic.setdefault('available_time',ava_time_l)
    url1 = "http://127.0.0.1:5000/anhao0522/client/v1/landlord/{customer_id}/properties".format(customer_id=id)
    #print(token)
    response = requests.post(url1,json=post_data_dic,headers={"auth_token": token})
    #print(response)
    return redirect(url_for('person_information',username=id))


@app.route('/location_center', methods=['POST'])
def get_center():
    if request.method == 'POST':
        location_str = request.form['location_list']
        #print(location_str)
        location_list = location_str.split(":")
        #print(location_list)
        location_list_2 = []
        for e in location_list:
            location_list_2.append([float(e.split("/")[0]), float(e.split("/")[1])])
        #print(location_list_2)

        reslut = center_geolocation(location_list_2)

        return jsonify({"result": reslut})


@app.route('/alter_photo')
def alter_photo():
    photo_file = request.form["file"]
    #print(photo_file)
    return "ok"


@app.route('/file/<file_id>')
def file(file_id):
    data = mongo.db.test.find_one_or_404({'id': file_id})
    filename = data['photo_name']
    return mongo.send_file(filename)


if __name__ == '__main__':
    app.run(port=5200, debug=True)
