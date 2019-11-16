###   9900 accommodation web protal, written by chengzhu xie, 20190627

import requests
import xlrd
import json
import codecs
import time
from collections import OrderedDict
import dicttoxml
from xml.dom.minidom import parseString


#----------------------------transfar data to mlab---------------------------
from mongoengine import connect, StringField, IntField, Document, EmbeddedDocument, ListField, EmbeddedDocumentField, FileField
import codecs

connect(host='mongodb://customer:comp9900@ds161529.mlab.com:61529/comp9900_2019')     # 连接mlab

from sys import argv
from base64 import b64encode
from base64 import b64decode
from json import dumps

ENCODING = 'utf-8'
image_name = "1_1.jp2"
with open(image_name, 'rb') as jp2_file:
    byte_content = jp2_file.read()

#print("ooooooo\n")
#print(byte_content)
base64_bytes = b64encode(byte_content)
base64_string = base64_bytes.decode(ENCODING)
#print("===",base64_string)


raw_dic = {}
raw_dic["name"] = image_name
raw_dic["image_base64_string"] = base64_string
json_data = dumps(raw_dic, indent=2)

#print(json_data)

###
###
###
class New(Document):
    host_id = StringField(required=True)
    picture = StringField(requests=True)

    def __init__(self,host_id,picture, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.host_id = host_id
        self.picture = picture

def Picture_save(host_id,picture):
    file = New(host_id,picture)
    file.save()

def GET_picture():
    data_dict = OrderedDict()
    for line in New.objects():
        data_dict["name"] = line.host_id
        data_dict["image_base64_string"] = line.picture

    return data_dict

def cc():
    aa = New.objects().picture
    return aa


save_ = Picture_save(raw_dic["name"], raw_dic["image_base64_string"])      # 上传图片
picture_data = GET_picture()                                         # 下载图片的数据


#json_dic = json_data.loads(json_data)
base64_string_2 = picture_data["image_base64_string"]
base64_bytes_2 = base64_string_2.encode(ENCODING)
byte_byte = b64decode(base64_bytes_2)

f = open("1_1_copy.jp2", 'w+')     # 创建新文件存图片
f.write("1")
f.close()
with open("1_1_copy.jp2", 'rb+') as j_file:
    j_file.write(byte_byte)


#print("OK",byte_byte)

