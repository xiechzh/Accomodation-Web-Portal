# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *


class UserUid(Resource):

    def get(self, uid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        customer_info = customers_collection.find_one({"customer_id":str(uid)})
        return customer_info, 200, None

    def put(self, uid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.json
        customer_info = customers_collection.find_one({"customer_id":str(uid)})
        for key in param:
            customer_info[key] = param[key]
        customers_collection.update_one({"customer_id": uid}, {"$set": customer_info})
        customers_collection.update_one({"customer_id":str(uid)},{"$set": customer_info})
        return None, 200, None