# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *


class UserUidOrder(Resource):

    def get(self, uid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        user_info = customers_collection.find_one({"customer_id": str(uid)})
        order_info = user_info["trip_order"]
        if order_info:
            return order_info, 200, None
        else:
            return 404, None

    def post(self, uid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        body = g.json
        if username !=uid:
            return None, 401, None
        pro = property_collection.find_one({"property_id": body["property_id"]})
        available_time = pro["available_time"]
        flag = 0
        for elem in available_time:
            if elem['time'] == body["checkin_time"] and elem['status'] == True:
                flag = 1
                continue
            if flag == 1 and elem['time'] == body["checkout_time"]:
                flag = 2
                break
            if flag == 1 and elem['status'] == True:
                continue
        if flag != 2:
            return None, 404, None
        user_info = customers_collection.find_one({"customer_id": uid})
        host_info = customers_collection.find_one({"customer_id": body["host_id"]})
        order1 = user_info["trip_order"]
        order2 = host_info["host_order"]
        credit=user_info["credit"]+body["price"]
        order1.append(body)
        order2.append(body)
        customers_collection.update_one({"customer_id": uid}, {"$set": {"trip_order": order1}})
        customers_collection.update_one({"customer_id": body["host_id"]}, {"$set": {"host_order": order2}})
        customers_collection.update_one({"customer_id": uid}, {"$set": {"credit": credit}})
        order_collection.insert_one(body)
        pro=property_collection.find_one({"property_id":body["property_id"]})
        available_time=pro["available_time"]
        flag=0
        for elem in available_time:
            if elem['time'] == body["checkin_time"] and elem['status'] == True:
                elem['status']=False
                flag = 1
                continue
            if flag == 1 and elem['time'] == body["checkout_time"]:
                flag = 2
                break
            if flag == 1 and elem['status'] == True:
                elem['status'] = False
                continue
        property_collection.update_one({"property_id": body["property_id"]}, {"$set": {"available_time": available_time}})
        return None, 200, None

    def put(self, uid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        body = g.json
        user_info = customers_collection.find_one({"customer_id": str(uid)})
        if user_info is None:
            return None, 404, None
        orders = user_info["trip_order"]
        host_info = customers_collection.find_one({"customer_id": body["host_id"]})
        orders1 = host_info["host_order"]
        flag = 0
        for item in orders:
            if body["order_id"] == item["order_id"]:
                flag = 1
                for key in body:
                    item[key] = body[key]
                break
        if flag == 0:
            return 404, None
        flag = 0
        for item in orders1:
            if body["order_id"] == item["order_id"]:
                flag = 1
                for key in body:
                    item[key] = body[key]
                break
        if flag == 0:
            return 404, None
        customers_collection.update_one({"customer_id": str(uid)}, {"$set": {"trip_order": orders}})
        customers_collection.update_one({"customer_id": body["host_id"]}, {"$set": {"trip_order": orders1}})
        order_update = order_collection.find_one({"order_id": body["order_id"]})
        for key in body:
            order_update[key] = body[key]
        order_collection.update_one({"order_id": body["order_id"]}, {"$set": {"trip_order": orders1}})
        return None, 200, None

    def delete(self, uid):
        order_id = g.args["order_id"]
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        user_info = customers_collection.find_one({"customer_id": str(uid)})
        orders = user_info["trip_order"]
        order=None
        for x in orders:
            if x["order_id"] == order_id:
                order = x
                break
        if order is not None:
            orders.remove(order)
        customers_collection.update_one({"customer_id": str(uid)}, {"$set": {"trip_order": orders}})
        return None, 200, None