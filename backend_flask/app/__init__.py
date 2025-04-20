from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from .routes import auth_routes, lost_routes

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(lost_routes.bp)

    return app
