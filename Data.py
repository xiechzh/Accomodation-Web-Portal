###   9900 accommodation web protal, written by chengzhu xie, 20190627

import requests
import xlrd
import json
import codecs
import time
from collections import OrderedDict
import dicttoxml
from xml.dom.minidom import parseString

def FILE_to_json(filename):                                    # read data from file and transfer to json

    #json_data = json.dumps(convert_dict, indent=4, separators=(',', ':'))
    #json_file = countryName + ".json"
    with codecs.open(filename, 'r') as ff:
        context = ff.read()
    #    ff.write(json_data)
    json_data = json.loads(context)
    json_dic = OrderedDict()
    for key in json_data.keys():
        value = json.dumps(json_data[key], indent=4, separators=(',', ':'))
        json_dic[key] = value

    return json_dic

#----------------------------transfar data to mlab---------------------------
from mongoengine import connect, StringField, IntField, Document, EmbeddedDocument, ListField, EmbeddedDocumentField, FileField
import codecs

connect(host='mongodb://customer:comp9900@ds161529.mlab.com:61529/comp9900_2019')     # 连接mlab

#    ---------For Customer Data--------
class Customer(Document):
    host_id = StringField(required=True)
    json_data = StringField(required=True)

    def __init__(self,host_id,json_data, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.host_id = host_id
        self.json_data = json_data

def GET_1_customer_data():
    data_dict = OrderedDict()
    for line in Customer.objects():
    #    print('GET_1_customer_data', line.host_id)
        data_dict[line.host_id] = line.json_data
    #data_dict = Customer.objects()

    return data_dict

def GET_2_customer_json_data(host_id):
    json_data = Customer.objects(host_id=host_id)[0].json_data
    return json_data


#    ---------For Property Data---------
class Property(Document):
    property_id = StringField(required=True)
    json_data = StringField(required=True)

    def __init__(self,property_id,json_data, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.property_id = property_id
        self.json_data = json_data


def GET_4_property_data():
    data_dict = OrderedDict()
    for line in Property.objects():
    #    print('GET_1_customer_data', line.host_id)
        data_dict[line.host_id] = line.json_data
    #data_dict = Customer.objects()

    return data_dict

def GET_5_property_json_data(host_id):
    json_data = Property.objects(host_id=host_id)[0].json_data
    return json_data

#    ---------For Order Data---------
class Order(Document):
    order_id = StringField(required=True)
    json_data = StringField(required=True)

    def __init__(self,order_id,json_data, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.order_id = order_id
        self.json_data = json_data


def GET_6_order_data():
    data_dict = OrderedDict()
    for line in Order.objects():
    #    print('GET_1_customer_data', line.host_id)
        data_dict[line.host_id] = line.json_data
    #data_dict = Customer.objects()

    return data_dict

def GET_7_order_json_data(host_id):
    json_data = Order.objects(host_id=host_id)[0].json_data
    return json_data



# -------------------------------函数调用，API-----------------------------------
# -------------------------------函数调用，API-----------------------------------
# -------------------------------函数调用，API-----------------------------------

#     得到 all customer data
def all_customer_data():
    data = GET_1_customer_data()
    #json_data = json.dumps(data, indent=4, separators=(',', ':'))
    #data = json.loads(data)
    return data

#     得到 one customer data
def GET_one_customer_data(host_id):
    data = GET_2_customer_json_data(host_id)         ### get data from mlab
    data_dict = json.loads(data)
    return data_dict


#     得到 one property data
def GET_5_property_json_data(property_id):
    data = get_property_json_data(property_id)         ### get data from mlab
    data_dict = json.loads(data)
    return data_dict

#     得到 one order data
def GET_7_order_json_data(order_id):
    data = get_order_json_data(order_id)         ### get data from mlab
    data_dict = json.loads(data)
    return data_dict

# -----------------------------函数调用，API 上传数据-------------------------------

def DATA_3_TO_MLAB(host_id,json_data):             ###  json_data 是 host_id 对应要上传的json数据
    file = Customer(host_id,json_data)
    file.save()

def DATA_TO_MLAB_PROPERTY(property_id,json_data):
    #host_id = json_data["host_id"]
    file = Property(property_id,json_data)
    file.save()

def DATA_TO_MLAB_ORDER(order_id,json_data):
    #host_id = json_data["host_id"]
    file = Order(order_id,json_data)
    file.save()


