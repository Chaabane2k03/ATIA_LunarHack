from flask import Blueprint, request, jsonify
import os
from app.services.chatbot_service import ChatBotService
from app.services.localisation_service import *

# Get absolute path to data.json
current_dir = os.path.dirname(os.path.abspath(__file__))
data_file_path = os.path.normpath(os.path.join(current_dir, '..', '..', 'data.json'))

chatbot_model = ChatBotService(data_file_path)

bp = Blueprint("chat", __name__)

@bp.route('/prompt', methods=['GET', 'POST'])
def handle_prompt():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400
        response = chatbot_model.chatbot_response(message)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/guide' , methods=['POST'])
def get_guide():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400
        response = ask_bot(message)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500