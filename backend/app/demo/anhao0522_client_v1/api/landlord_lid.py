# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *
from ..Model import *
from bson import ObjectId

class LandlordLid(Resource):

    def get(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        landlord_info = customers_collection.find_one({"customer_id": str(lid)})
        if landlord_info["account_type"] == True:
            return landlord_info, 200, None
        else:
            return None, 404, None

    def put(self, lid):
        token = request.headers.get("auth_token")
        username = validate_token(token)
        if username in ["expired", "wrong"]:
            return None, 401, None
        param = g.json
        landlord_info = customers_collection.find_one({"customer_id": str(lid)})
        _id = landlord_info.pop("_id")
        if landlord_info["account_type"] == False:
            return None, 404, None
        for key in param:
            landlord_info[key] = param[key]
        customers_collection.update_one({"_id":ObjectId(str(_id))}, {"$set":landlord_info})

        return landlord_info, 200, None