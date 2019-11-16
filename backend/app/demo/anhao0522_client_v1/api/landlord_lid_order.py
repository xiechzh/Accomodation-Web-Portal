# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *
from datetime import datetime


class LandlordLidOrder(Resource):

    def get(self, lid):
        print(g.headers)
        print(g.args)
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        user_info = customers_collection.find_one({"customer_id": str(lid)})
        order_info = user_info["host_order"]
        if order_info:
            return order_info, 200, None
        else:
            return 404, None

    def delete(self, lid):
        print(g.args)
        query=g.args
        order_id = query["order_id"]
        cancel_order = query["cancel_order"]
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        if lid != username:
            return None, 401, None
        if cancel_order:
            order = order_collection.find_one({"order_id": order_id})
            house = property_collection.find_one({"property_id": order["property_id"]})
            available_time = house["available_time"]
            for elem in available_time:
                if elem['time'] == order["checkin_time"] and elem['status'] == False:
                    elem['status'] = True
                    flag = 1
                    continue
                if flag == 1 and elem['time'] == order["checkout_time"]:
                    flag = 2
                    break
                if flag == 1 and elem['status'] == False:
                    elem['status'] = True
                    continue
            property_collection.update_one({"property_id": order["property_id"]},{"$set": {"available_time": available_time}})
            host_info = customers_collection.find_one({"customer_id": str(lid)})
            orders1=host_info["host_order"]
            order=None
            for x in orders1:
                if x["order_id"]==order_id:
                    order=x
                    break
            if order is not None:
                orders1.remove(order)
            customers_collection.update_one({"customer_id": lid}, {"$set": {"host_order": orders1}})
            user_info = customers_collection.find_one({"customer_id": order["customer_id"]})
            #print(order["customer_id"])
            #print(order)

            orders2 = user_info["trip_order"]
            if order is not None:
                order=None
                for x in orders2:
                    if x["order_id"] == order_id:
                        order = x
                        break
            if order is not None:
                print(1)
                orders2.remove(order)
            customers_collection.update_one({"customer_id": order["customer_id"]}, {"$set": {"trip_order": orders2}})
            order_collection.delete_one({"order_id":order_id})
            time=datetime.now().isoformat()
            time=time.split("T")
            t=time[0]+" "+time[1].split(".")[0]
            body={"mid":f"{username}---{order['customer_id']}","time":t,"text":f"Your order(order NO.{order_id}) is cancelled by host. If you have any question, please contact the host. Sorry for any inconvenience."}
            message_box1=host_info["message_box"]
            message_box1.append(body)
            customers_collection.update_one({"customer_id": username}, {"$set": {"message_box": message_box1}})
            message_box2 = user_info["message_box"]
            message_box2.append(body)
            customers_collection.update_one({"customer_id": order['customer_id']}, {"$set": {"message_box": message_box2}})
            message_new = user_info["new_message"]
            if username not in message_new:
                message_new.insert(0,username)
            else:
                message_new.remove(username)
                message_new.insert(0,username)
            customers_collection.update_one({"customer_id": order['customer_id']}, {"$set": {"new_message": message_new}})
        else:
            host_info = customers_collection.find_one({"customer_id": str(lid)})
            orders1 = host_info["host_order"]
            order = None
            for x in orders1:
                if x["order_id"] == order_id:
                    order = x
                    break
            if order is not None:
                orders1.remove(order)
            customers_collection.update_one({"customer_id": lid}, {"$set": {"host_order": orders1}})
        return None, 200, None