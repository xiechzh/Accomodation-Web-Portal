# -*- coding: utf-8 -*-
from __future__ import absolute_import

from flask import Flask

import anhao0522_client_v1


def create_app():
    app = Flask(__name__, static_folder='static')
    app.register_blueprint(
        anhao0522_client_v1.bp,
        url_prefix='/anhao0522/client/v1')
    return app

if __name__ == '__main__':
    create_app().run("0.0.0.0", debug=True)
