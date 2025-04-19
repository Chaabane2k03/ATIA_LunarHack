#!/bin/bash

# Set project root
PROJECT_NAME="backend_flask"
mkdir -p $PROJECT_NAME/app/{models,routes,services} $PROJECT_NAME/migrations

cd $PROJECT_NAME

# Create Python files
touch run.py requirements.txt .env 

# Create __init__.py files
touch app/__init__.py \
      app/models/__init__.py app/models/user.py \
      app/routes/__init__.py app/routes/user_routes.py \
      app/services/__init__.py app/services/user_service.py \
      app/config.py

# Write run.py
cat <<EOL > run.py
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
EOL

# Write app/__init__.py
cat <<EOL > app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from .routes import user_routes
    app.register_blueprint(user_routes.bp)

    return app
EOL

# Write config.py
cat <<EOL > app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
EOL

# .env example
cat <<EOL > .env
DATABASE_URL=postgresql://username:password@localhost:5432/your_db
EOL

# Sample model
cat <<EOL > app/models/user.py
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"
EOL

# Sample route
cat <<EOL > app/routes/user_routes.py
from flask import Blueprint

bp = Blueprint("user_routes", __name__)

@bp.route("/users")
def get_users():
    return {"users": ["Alice", "Bob"]}
EOL

# Sample service
cat <<EOL > app/services/user_service.py
def get_user_data():
    return ["Alice", "Bob"]
EOL

# Add requirements
cat <<EOL > requirements.txt
flask
flask_sqlalchemy
psycopg2-binary
python-dotenv
EOL

# Done!
echo "✅ Project structure '$PROJECT_NAME' created."
