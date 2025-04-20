from flask import Blueprint, request, jsonify
from app.services.chatbot_service import ChatbotModel

bp = Blueprint("chat", __name__)

@bp.route('/prompt', methods=['POST'])
def handle_prompt():
    data = request.get_json()
    message = data.get('message')
    if not message:
        return jsonify({"error": "No message provided"}), 400
    model = ChatbotModel()
    response = model.chatbot_response(message)
    return jsonify({"response": response}), 200

