# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class UserUidOrder(Resource):

    def get(self, uid):

        return [], 200, None

    def post(self, uid):
        print(g.json)

        return None, 200, None

    def put(self, uid):
        print(g.json)

        return None, 200, None

    def delete(self, uid):
        print(g.json)

        return None, 200, None