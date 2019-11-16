# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class AccommodationRoomPidComment(Resource):

    def get(self, pid):

        return [], 200, None

    def post(self, pid):
        print(g.json)

        return None, 201, None