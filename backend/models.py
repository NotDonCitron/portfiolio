from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'Admin', 'Bar-Chef', 'Employee'
    status = db.Column(db.String(20), default='Active')  # 'Active', 'On Leave', 'Inactive'
    contact = db.Column(db.String(100))
    skills = db.Column(db.String(200)) # Comma separated skills

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'status': self.status,
            'contact': self.contact,
            'skills': self.skills
        }

class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    title = db.Column(db.String(100)) # e.g. "Morning Shift"
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100)) # e.g. "Main Bar", "Terrace"

    staff = db.relationship('Staff', backref=db.backref('shifts', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'staff_id': self.staff_id,
            'staff_name': self.staff.name if self.staff else 'Unknown',
            'title': self.title,
            'start': self.start_time.isoformat(),
            'end': self.end_time.isoformat(),
            'location': self.location
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    assigned_to = db.Column(db.Integer, db.ForeignKey('staff.id')) # Optional, maybe assigned to a manager
    status = db.Column(db.String(20), default='Pending') # 'Pending', 'In Progress', 'Done'
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    assignee = db.relationship('Staff', backref=db.backref('tasks', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'assigned_to': self.assignee.name if self.assignee else 'Unassigned',
            'status': self.status,
            'due_date': self.due_date.isoformat() if self.due_date else None
        }

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50)) # 'Spirits', 'Mixers', 'Consumables'
    quantity = db.Column(db.Float, default=0.0)
    unit = db.Column(db.String(20)) # 'L', 'Bottles', 'Kg'
    min_threshold = db.Column(db.Float)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'quantity': self.quantity,
            'unit': self.unit,
            'status': 'Low Stock' if self.min_threshold and self.quantity < self.min_threshold else 'OK'
        }

class TrainingModule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    required_role = db.Column(db.String(50)) # 'Bar-Chef', 'Employee'
    duration_hours = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'role': self.required_role,
            'duration': self.duration_hours
        }
