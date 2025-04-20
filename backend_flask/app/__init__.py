from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)  # ✅ Moved here, after app is created

    from .routes import auth_routes, lost_routes , chat_routes

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(lost_routes.bp)
    app.register_blueprint(chat_routes.bp)

    return app
