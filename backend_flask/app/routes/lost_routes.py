from flask import Blueprint, request, jsonify
from app.models.lost_item import LostItem
from app import db
import os
from flask import request
from app.models.lost_item import LostItem
from sentence_transformers import SentenceTransformer, util
import shutil
from werkzeug.utils import secure_filename
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
from app.models.user import User
from datetime import datetime


bp = Blueprint("lost", __name__)

# Load model and processor once
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", use_fast=True)
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Directory to save images
UPLOAD_FOLDER = './static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to save the local file to the static/uploads folder
def save_local_image(image_path):
    # Check if the file exists
    if not os.path.exists(image_path):
        return None
    
    # Get the filename from the path
    filename = secure_filename(os.path.basename(image_path))
    destination_path = os.path.join(UPLOAD_FOLDER, filename)
    
    # Copy the image to the static/uploads folder
    shutil.copy(image_path, destination_path)
    
    # Return the URL to access the image locally
    image_url_local = f"/static/uploads/{filename}"
    return image_url_local

# Function to generate description from the image
def generate_description_from_image(image_path):
    # Open the image
    image = Image.open(image_path).convert('RGB')
    
    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")
    
    # Generate description using the BLIP model
    with torch.no_grad():
        out = blip_model.generate(**inputs)
    
    # Decode the generated output into a human-readable description
    description = processor.decode(out[0], skip_special_tokens=True)
    return description

@bp.route('/report_lost', methods=['POST'])
def report_lost_item():
    if 'image' not in request.files:
        return jsonify({"error": "No image file sent"}), 400

    file = request.files['image']
    filename = file.filename
    local_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(local_path)  # Save image locally

    # Now `local_path` is the full path on the backend
    description = generate_description_from_image(local_path)

    date_str = request.form.get('date_found')
    try:
        date_found = datetime.strptime(date_str, "%Y-%m-%d") if date_str else None
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    item = LostItem(
        description=description,
        image_url=local_path,  # or just filename if storing relative path
        finder_id=request.form.get('id'),
        date_found=date_found
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Item reported",
        "description": description,
        "image_url": local_path,
        "date_found": item.date_found.strftime("%Y-%m-%d %H:%M:%S") if item.date_found else None
    }), 201


model = SentenceTransformer('all-MiniLM-L6-v2')
@bp.route('/get_lost', methods=['POST'])
def match_lost_item():
    user_description = request.json.get('description')
    all_items = LostItem.query.all()

    if not all_items:
        return jsonify([])

    descriptions = [item.description for item in all_items]
    
    similarities = util.cos_sim(model.encode(user_description), model.encode(descriptions))[0]
    top_k = min(1, len(descriptions))
    top_indices = similarities.argsort(descending=True)[:top_k]

    top_items = []
    for index in top_indices:
        item = all_items[index]
        reporter = User.query.get(item.finder_id)  # Get reporter info
        reporter_email = reporter.email if reporter else None

        top_items.append({
            "id": item.id,
            "description": item.description,
            "image_url": item.image_url,
            "date_found": item.date_found.isoformat(),
            "reporter_email": reporter_email
        })

    return jsonify(top_items)



