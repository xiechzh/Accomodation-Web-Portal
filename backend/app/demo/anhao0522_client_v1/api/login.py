# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *


class Login(Resource):

    def get(self):
        query = g.args
        user = customers_collection.find_one({"customer_id": query["username"]})
        if user is None:
            return {'reply': 'NU'}, 400, None
        if query["username"] == user["customer_id"] and query["password"] == user["password"]:

            token = generate_token(query["username"])

            return {'reply': token}, 200, None
        else:
            return {'reply': 'NM'}, 400, None
