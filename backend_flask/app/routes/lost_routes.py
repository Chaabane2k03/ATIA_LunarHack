from flask import Blueprint, request, jsonify
from app.models.lost_item import LostItem
from app import db

bp = Blueprint("lost", __name__)

@bp.route('/lost', methods=['POST'])
def report_lost_item():
    data = request.get_json()
    item = LostItem(
        title=data['title'],
        description=data.get('description'),
        user_id=data['user_id']  # normally you'd extract from token/session
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item reported lost"}), 201

@bp.route('/lost', methods=['GET'])
def get_lost_items():
    items = LostItem.query.all()
    return jsonify([{
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "date_lost": item.date_lost.isoformat()
    } for item in items])
