from app import db
from datetime import datetime

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    date_found = db.Column(db.DateTime, default=datetime.utcnow)
    image_url = db.Column(db.String(255), nullable=True)
    finder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    finder = db.relationship('User', backref='found_items')  # Optional relationship

    def __repr__(self):
        return f"<LostItem {self.id} - Found by {self.finder_id}>"
