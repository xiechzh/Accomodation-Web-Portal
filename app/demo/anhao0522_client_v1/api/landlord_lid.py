# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
from .token import *

class LandlordLid(Resource):

    def get(self, lid):
        token = request.headers.get("auth_token")
        print(token)
        username= validate_token(token)
        print(username)
        if username in ["expired","wrong"]:
            return None, 401, None
        
        return {'account_type': False}, 200, None

    def put(self, lid):
        print(g.json)

        return {'account_type': False}, 200, None
