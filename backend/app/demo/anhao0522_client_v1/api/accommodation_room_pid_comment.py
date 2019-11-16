# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *

def rating(comments):
    count=0
    score=0
    for x in comments:
        count+=1
        score+=x["avg_mark"]
    return round(score/count,1)


class AccommodationRoomPidComment(Resource):

    def get(self, pid):

        dd = property_collection.find_one({"property_id": int(pid)})
        comments = dd["comments"]

        return comments, 200, None

    def post(self, pid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        query=g.args
        order_id=query["order_id"]
        if username in ["expired", "wrong"]:
            return None, 401, None
        body = g.json
        order=order_collection.find_one({"order_id":order_id})
        if order["commented"]== False and username == order["customer_id"]:
            host = customers_collection.find_one({"customer_id":order["host_id"]})
            user = customers_collection.find_one({"customer_id": order["customer_id"]})
            order_list1=host["host_order"]
            idx=-1
            for i in range(len(order_list1)):
                if order_list1[i]["order_id"] ==order["order_id"]:
                    idx=i
                    break
            if idx == -1:
                return None,400,None
            order_list1[idx]["commented"]=True
            customers_collection.update_one({"customer_id": order["host_id"]}, {"$set": {"host_order": order_list1}})
            order_list2=user["trip_order"]
            idx = -1
            for i in range(len(order_list2)):
                if order_list2[i]["order_id"] ==order["order_id"]:
                    idx=i
                    break
            if idx == -1:
                return None,400,None
            order_list2[idx]["commented"]=True
            customers_collection.update_one({"customer_id": order["customer_id"]}, {"$set": {"trip_order": order_list2}})
            order_collection.update_one({"order_id": order_id},{"$set": {"commented": True}})
            pro=property_collection.find_one({"property_id":pid})
            comment_list=pro["comments"]
            comment_list.append(body)
            score=rating(comment_list)
            property_collection.update_one({"property_id": pid}, {"$set": {"comments": comment_list}})
            property_collection.update_one({"property_id": pid}, {"$set": {"rating": score}})
        elif order["commented"] == True and username == order["host_id"]:
            tmp = property_collection.find_one({"property_id": int(pid)})
            comments = tmp["comments"]
            idx = -1
            for i in range(len(comments)):
                if comments[i]["date"]==body["date"]:
                    idx=i
                    break
            if idx == -1:
                return None,400,None
            comments[idx]["reply"]=body["reply"]
            property_collection.update_one({"property_id": pid}, {"$set": {"comments": comments}})
        else:
            return None, 401, None
        return None, 201, None