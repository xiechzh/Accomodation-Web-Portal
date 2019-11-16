# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from .token import *
from .MongoDB import *
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
        return None, None
    if entities["datetime"][0]["type"]=="interval":
        datetime1 = entities["datetime"][0]["from"]["value"].split("T")[0]
        datetime2 = entities["datetime"][0]["to"]["value"].split("T")[0]
        date_list = datetime1.split("-")
        datetime2= datetime.date(int(date_list[0]),int(date_list[1]),int(date_list[2]))-datetime.timedelta(days=1)
    else:
        datetime1 = entities["datetime"][0]['value'].split("T")[0]
        date=datetime1.split("-")
        datetime2 = datetime.date(int(date[0]),int(date[1]),int(date[2]))+datetime.timedelta(days=1)
    return datetime1,datetime2


def handle_message(response,username):
    entities = response['entities']
    intent = first_entity_value(entities, 'intent')
    greetings = first_entity_value(entities, 'greetings')
    checkin,checkout=extract_datetime(entities)
    location = first_entity_value(entities, 'location')
    number = first_entity_value(entities, 'number')
    options=dict()
    if location is not None:
        options["location"]=location.lower()
    if checkin is not None:
        options["checkin"] = checkin
        options["checkout"] = checkout
    if number is not None:
        options["number"] = number
    url=None
    print(intent,greetings,checkin,checkout,location,number)
    if greetings and intent is None:
        rpl = choice(g_list)
        print(1)
    elif intent == 'reserveRoom':
        rpl="You can click this link to see searching results."
        url="localhost:5050/accommodation/all?searchtype=direct?"
        query="&".join(f'{option}={options[option]}' for option in options)
        url+=query
        print(2)
    elif intent == 'signUp':
        rpl="You can click this link to sign up on our website! Feel free to use our service."
        url=""
    elif intent in ["hostAccount","personalAccount"]:
        if username in ["wrong", "expired"]:
            rpl = "You have not logged in, please click here to log in."
            url = ""
        else:
            user=customers_collection.find({"customer_id":username})
            rpl="You can click the link below to see your Account details."
            url=""
    elif intent in ["tripOrder","leaseOrder"]:
        if username in ["wrong", "expired"]:
            rpl = "You have not logged in, please click here to log in."
            url = ""
        else:
            user=customers_collection.find({"customer_id":username})
            rpl="Here is the link that can redirect you to see your Order details."
            url=""
    elif intent =="cancelOrder":
        rpl="Please click this link, it will show your order details. You can cancel your order there."
        url = ""
    elif intent == "changeOrder":
        rpl="Please click this link, it will show your order details. You can modify your order there."
        url = ""
    elif intent == "queryContact":
        if number:
            order=order_collection.find({"order_id":int(number)})
            if username in ["wrong","expired"]:
                rpl="You have not logged in, please click here to log in."
                url=""
            else:
                if order["host_id"] == username:
                    tenant=customers_collection.find({"customer_id":order["customer_id"]})
                    pn=tenant["contact_number"]
                    email=tenant["email"]
                    rpl=f"Hello host,\nHere is the contact of your tenant for order number {number}:\n number:{pn}\n email:{email}"
                    url=""
                elif order["customer_id"] == username:
                    host=customers_collection.find({"customer_id":order["host_id"]})
                    pn = host["contact_number"]
                    email = host["email"]
                    rpl = f"Hello tenant,\nHere is the contact of your host for order number {number}:\n number:{pn}\n email:{email}"
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
        if query["q"] ==" ":
            return [choice(g_list), "1"], 200, None
        rsp = ask_wit(query["q"])
        print(rsp)
        reply = handle_message(rsp,username)
        return reply, 200, None
