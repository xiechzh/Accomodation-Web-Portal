# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *
import requests
from random import choice
import datetime

g_list=["Hi, what can I do for you?","Hello, I'm chatbot. How are you? ","Hello, welcome to Go World!"]
def ask_wit(q):
    rsp = requests.get(f"https://api.wit.ai/message?q={q}",
                       headers={"Authorization": "Bearer 236TB6JOODCHMRBZ4HMXIDUVUFZ3BPCN"})
    return rsp.json()


def first_entity_value(entities, entity):
    if entity not in entities:
        return None
    val = entities[entity][0]['value']
    if not val:
        return None
    return val

def extract_datetime(entities):
    if "datetime" not in entities:
        today = datetime.date.today()
        end_date = today + datetime.timedelta(days=1)
        return today.isoformat(), end_date.isoformat()
    if entities["datetime"][0]["type"]=="interval":
        datetime1 = entities["datetime"][0]["from"]["value"].split("T")[0]
        datetime2 = entities["datetime"][0]["to"]["value"].split("T")[0]
        date_list = datetime1.split("-")
        t1=datetime.date(int(date_list[0]),int(date_list[1]),int(date_list[2]))
        date_list = datetime2.split("-")
        t2= datetime.date(int(date_list[0]),int(date_list[1]),int(date_list[2]))-datetime.timedelta(days=1)
    else:
        datetime1 = entities["datetime"][0]['value'].split("T")[0]
        date_list = datetime1.split("-")
        t1 = datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
        t2 = t1 + datetime.timedelta(days=1)
    return t1.isoformat(),t2.isoformat()


def handle_message(response,username):
    entities = response['entities']
    intent = first_entity_value(entities, 'intent')
    greetings = first_entity_value(entities, 'greetings')
    start_date,end_date=extract_datetime(entities)
    destination = first_entity_value(entities, 'location')
    people_num = first_entity_value(entities, 'number')
    options=dict()
    print(intent, greetings, start_date, end_date, destination, people_num)
    if destination is not None:
        options["destination"]=destination.lower()
    else:
        options["destination"]=''
    if start_date is not None:
        options["start_date"] = start_date
        options["end_date"] = end_date
    else:
        today=datetime.date.today()
        end_date = today + datetime.timedelta(days=1)
        options["start_date"]=today.isoformat()
        options["end_date"] = end_date.isoformat()
    if people_num is not None:
        options["people_num"] = people_num
    else:
        options["people_num"]=''
    url=""
    print(intent,greetings, start_date, end_date,destination,people_num)
    if greetings and intent is None:
        rpl = choice(g_list)
        print(1)
    elif intent == 'reserveRoom':
        rpl="You can click this link to see searching results."
        url="http://127.0.0.1:5200/normal_search/all?"
        query=''
        query+=f'destination={options["destination"]}&'
        query+=f'people_num={options["people_num"]}&'
        query+=f'start_date={options["start_date"]}&'
        query += f'end_date={options["end_date"]}'
        url+=query
        print(2)
    elif intent == 'signUp':
        rpl="You can find \"Sign Up\" button on the right-top corner! Welcome to use our service."
        url=""
    elif intent in ["hostAccount","personalAccount"]:
        if username in ["wrong", "expired"]:
            rpl = "You have not logged in, \"Sign In\" button on the right-top corner of the web page!"
            url = ""
        else:
            user=customers_collection.find({"customer_id":username})
            rpl="You can click the link below to see your Account details."
            url=f"http://127.0.0.1:5200/{username}/personinfo"
    elif intent in ["tripOrder","leaseOrder"]:
        if username in ["wrong", "expired"]:
            rpl = "You have not logged in, Please find\"Sign In\" button on the right-top corner of the web page!"
            url = ""
        else:
            user=customers_collection.find_one({"customer_id":username})
            rpl="Here is the link that can redirect you to see your Order details."
            url = f"http://127.0.0.1:5200/{username}/personinfo"
    elif intent =="cancelOrder":
        if username in ["wrong", "expired"]:
            rpl = "You have not logged in, \"Sign In\" button on the right-top corner of the web page!"
            url = ""
        else:
            rpl="Please click this link, it will show your order details. You can cancel order there if you are a host.Or you can contact host."
            url = f"http://127.0.0.1:5200/{username}/personinfo"
    elif intent == "queryContact":
        if people_num:
            order=order_collection.find_one({"order_id":int(people_num)})
            if username in ["wrong","expired"]:
                rpl="You have not logged in, You can find \"Sign In\" button on the right-top corner."
                url=""
            elif order is None:
                rpl="You do not have this order, please check the order number again."
                url=""
            else:
                if order["host_id"] == username:
                    tenant=customers_collection.find_one({"customer_id":order["customer_id"]})
                    pn=tenant["contact_number"]
                    email=tenant["email"]
                    rpl=f"Hello host,<br>Here is the contact details of your tenant for order number {people_num}:<br> Number: {pn}<br> Email: {email}"
                    url=""
                elif order["customer_id"] == username:
                    host=customers_collection.find_one({"customer_id":order["host_id"]})
                    pn = host["contact_number"]
                    email = host["email"]
                    rpl = f"Hello tenant,<br>Here is the contact details of your host for order number {people_num}:<br> Number: {pn}<br> Email: {email}"
                    url=""
                else:
                    "It seems you don't have this order, so i can't give you the contact details."
        else:
            rpl="it seems you want to contact host, please ask me with your order number so that I can give you the correct contact details."
    else:
        rpl = "Sorry, I don't understand it since I am learning, could you ask it in another way?"
    reply=[rpl,url]
    return reply

class Chatbot(Resource):

    def post(self):
        print(g.args)
        query = g.args
        token = request.headers.get("auth_token")
        print(token)
        username = validate_token(token)
        if query["q"] ==" "or query["q"] =="":
            return [choice(g_list), ""], 200, None
        rsp = ask_wit(query["q"])
        print(rsp)
        reply = handle_message(rsp,username)
        return reply, 200, None
