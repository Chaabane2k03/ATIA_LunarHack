from flask import Blueprint

bp = Blueprint("user_routes", __name__)

@bp.route("/")
def index():
    return {"message": "Welcome to the User API!"}

@bp.route("/users")
def get_users():
    return {"users": ["Alice", "Bob"]}
