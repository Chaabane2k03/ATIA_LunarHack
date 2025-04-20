from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db

bp = Blueprint("auth", __name__)

# Function to create a new user (without hashing password)
def create_user(email, password):
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

   
    # Create user without hashing password
    user = create_user(email, password)
    return jsonify({"message": "User created", 'user_id': user.id}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.password == data['password']:
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing fields'}), 400

    # Create user without hashing password
    user = create_user(email, password)
    return jsonify({'message': 'User created', 'user_id': user.id}), 201
