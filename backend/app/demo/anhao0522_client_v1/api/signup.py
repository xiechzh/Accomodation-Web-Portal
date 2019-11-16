# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from ..MongoDB import *

class Signup(Resource):

    def post(self):
        query = g.json
        if customers_collection.find_one({"customer_id": query["customer_id"]}):
            return None, 400, None
        new_user = {}
        for key in query:
            new_user[key] = query[key]
        customers_collection.insert_one(new_user)
        return None, 201, None