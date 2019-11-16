# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import pymongo as pymongo
from flask import request, g

from . import Resource
from .. import schemas
from ..Model import *
from ..MongoDB import *

client = pymongo.MongoClient('mongodb://comp9900:z12345@ds161529.mlab.com:61529/comp9900_2019')
db = client["comp9900_2019"]
customers_collection = db.customers_collection

class Messagebox(Resource):

    def get(self):
        print(g.args)
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired","wrong"]:
            return None, 401, None
        AB=g.args["AB"]
        p=AB.split("---")

        if username in p:
            user = customers_collection.find_one({"customer_id": username})
            return user, 200, None
        else:
            return None,400,None

    def post(self):
        print(g.json)
        body=g.json
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        #sender,receiver=body["mid"].split("---")

        talker=body["mid"].split("---")
        if len(talker) == 2:
            sender, receiver = talker[0], talker[1]
            if username != sender:
                return None, 401, None
            user1 = customers_collection.find_one({"customer_id": sender})
            user2 = customers_collection.find_one({"customer_id": receiver})
            if user2 is None:
                return None, 400, None
            user1_box = user1["message_box"]
            user1_box.append(body)
            customers_collection.update_one({"customer_id": sender}, {"$set": {"message_box": user1_box}})
            user2_box = user2["message_box"]
            user2_new = user2["new_message"]
            if sender not in user2_new:
                user2_new.insert(0,sender)
            else:
                user2_new.remove(sender)
                user2_new.insert(0, sender)
            user2_box.append(body)
            customers_collection.update_one({"customer_id": receiver}, {"$set": {"new_message": user2_new}})
            customers_collection.update_one({"customer_id": receiver}, {"$set": {"message_box": user2_box}})
        else:
            user=talker[0]
            if user !=username:
                return None,401,None
            user1 = customers_collection.find_one({"customer_id": user})
            new_message=user1["new_message"]
            if body["text"] in new_message:
                new_message.remove(body["text"])
            customers_collection.update_one({"customer_id": user}, {"$set": {"new_message": new_message}})


        return None, 200, None

    def delete(self):
        print(g.args)
        AB = g.args["AB"]
        sender, receiver = AB.split("---")
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        user1 = customers_collection.find_one({"customer_id": sender})
        user2 = customers_collection.find_one({"customer_id": receiver})
        if user2 is None:
            return None,400,None
        message_box=user1["message_box"]
        message_new=user1["new_message"]
        Filter=[AB]
        Filter.append(f"{receiver}---{sender}")
        print(Filter)
        new_box=[]
        for x in message_box:
            if x["mid"] not in Filter:
                new_box.append(x)
        print(new_box)
        customers_collection.update_one({"customer_id": username},{"$set": {"message_box": new_box}})
        if receiver in message_new:
            message_new.remove(receiver)
        customers_collection.update_one({"customer_id": username}, {"$set": {"new_message": message_new}})
        return None, 200, None

