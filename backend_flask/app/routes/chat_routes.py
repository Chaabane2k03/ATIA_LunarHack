from flask import Blueprint, request, jsonify
from app.services.chatbot_service import ChatBotService

# Instantiate ChatbotModel (ensures model is loaded or trained)
chatbot_model = ChatBotService("./data.json")

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
