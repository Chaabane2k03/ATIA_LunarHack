from app.models.user import User

def create_user(email, password):
    hashed_pw = (password)
    user = User(email=email, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return user
