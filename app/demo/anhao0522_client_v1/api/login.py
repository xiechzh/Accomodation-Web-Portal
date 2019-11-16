# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
import pymongo as pymongo
from .token import *
from .MongoDB import *

class Login(Resource):

    def get(self):
        print(g.args)
        query=g.args
        user=customers_collection.find_one({"customer_id":query["username"]})
        if user is None:
            return 'NU', 400, None
        if query["username"] == user["customer_id"] and query["password"] == user["password"]:
            print(query["username"])
            token=generate_token(query["username"])
            print(token)
            return token, 200, None
            
