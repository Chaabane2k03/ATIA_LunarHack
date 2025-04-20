from app import db
from datetime import datetime

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date_lost = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Correct foreign key reference

    user = db.relationship('User', backref='lost_items')  # Create relationship to User

    def __repr__(self):
        return f"<LostItem {self.title}>"