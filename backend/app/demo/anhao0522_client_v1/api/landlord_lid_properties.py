# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *


class LandlordLidProperties(Resource):

    def get(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.args
        landlord_info=customers_collection.find_one({"customer_id": str(lid)})
        if landlord_info["account_type"] == False:
            return None, 404, None
        result_ls = []
        if param["pid"]=="all":
            result_ls = landlord_info["properties"]
            if result_ls:
                return result_ls, 200, None
            else:
                return None, 404, None
        else:
            for item in landlord_info["properties"]:
                if item["property_id"] == int(param["pid"]):
                    result_ls.append(item)
            if result_ls:
                return result_ls, 200, None
            else:
                return None, 404, None


    def post(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.json
        post_dic = {}
        for key in param:
            post_dic[key]=param[key]
        landlord_info = customers_collection.find_one({"customer_id": str(lid)})
        properties = landlord_info["properties"]
        properties.append(post_dic)
        customers_collection.update_one({"customer_id": str(lid)}, {"$set": {"properties": properties}})
        property_collection.insert_one(post_dic)
        return None, 201, None

    def put(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.json
        param1 = g.args
        landlord_info = customers_collection.find_one({"customer_id": str(lid)})
        flag = 0
        properties = landlord_info["properties"]
        for item in properties:
            if param1["pid"] == item["property_id"]:
                flag = 1
                for key in param:
                    item[key] = param[key]
        if flag == 0:
            return 404, None
        customers_collection.update_one({"customer_id": str(lid)}, {"$set": {"properties": properties}})
        properties_in_prop = property_collection.find_one({"property_id":param1["pid"]})
        for key in param:
            properties_in_prop[key] = param[key]
        property_collection.update_one(properties_in_prop)
        return None, 200, None

    def delete(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.args
        landlord_info = customers_collection.find_one({"customer_id": str(lid)})
        flag = 0
        properties = landlord_info["properties"]
        for item in properties:
            if param["pid"] == item["property_id"]:
                flag = 1
                properties.remove(item)
        if flag == 0:
            return 404, None
        property_collection.delete_one({"property_id": param["pid"]})

        return None, 200, None