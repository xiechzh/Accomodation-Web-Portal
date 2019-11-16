# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class LandlordLidProperties(Resource):

    def get(self, lid):
        print(g.args)

        return [], 200, None

    def post(self, lid):
        print(g.json)

        return None, 201, None

    def put(self, lid):
        print(g.json)
        print(g.args)

        return None, 200, None

    def delete(self, lid):
        print(g.args)

        return None, 200, None