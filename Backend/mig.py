from app import app, db  # Adjust import to match your structure
with app.app_context():
    db.create_all()