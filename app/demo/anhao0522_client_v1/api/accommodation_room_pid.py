# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class AccommodationRoomPid(Resource):

    def get(self, pid):

        return {'WiFi': True, 'Air-condition': True, 'cooking': True, 'pet': True}, 200, None