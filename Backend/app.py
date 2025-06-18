"""
Billing Baba Flask API
A comprehensive billing and inventory management system
"""

from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import uuid
import random
import string
import os
import base64
from functools import wraps
import json

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///billing_baba.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Create upload folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'logos'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'items'), exist_ok=True)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OTP(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = db.Column(db.String(15), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    gst_number = db.Column(db.String(15))
    address_street = db.Column(db.String(200))
    address_city = db.Column(db.String(100))
    address_state = db.Column(db.String(100))
    address_pincode = db.Column(db.String(10))
    address_country = db.Column(db.String(100), default='India')
    contact_phone = db.Column(db.String(15))
    contact_email = db.Column(db.String(120))
    contact_website = db.Column(db.String(200))
    logo_url = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Party(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # customer/supplier
    phone = db.Column(db.String(15))
    email = db.Column(db.String(120))
    gst_number = db.Column(db.String(15))
    billing_street = db.Column(db.String(200))
    billing_city = db.Column(db.String(100))
    billing_state = db.Column(db.String(100))
    billing_pincode = db.Column(db.String(10))
    billing_country = db.Column(db.String(100), default='India')
    shipping_street = db.Column(db.String(200))
    shipping_city = db.Column(db.String(100))
    shipping_state = db.Column(db.String(100))
    shipping_pincode = db.Column(db.String(10))
    shipping_country = db.Column(db.String(100), default='India')
    credit_limit = db.Column(db.Float, default=0.0)
    payment_terms = db.Column(db.Integer, default=0)
    balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(20), default='product')
    hsn_code = db.Column(db.String(10))
    category = db.Column(db.String(100))
    item_code = db.Column(db.String(50))
    unit = db.Column(db.String(20), default='pcs')
    sale_price = db.Column(db.Float, default=0.0)
    purchase_price = db.Column(db.Float, default=0.0)
    wholesale_price = db.Column(db.Float, default=0.0)
    tax_inclusive = db.Column(db.Boolean, default=False)
    tax_rate = db.Column(db.Float, default=0.0)
    current_stock = db.Column(db.Integer, default=0)
    minimum_stock = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    invoice_number = db.Column(db.String(50), nullable=False)
    party_id = db.Column(db.Integer, db.ForeignKey('party.id'), nullable=False)
    invoice_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date)
    subtotal = db.Column(db.Float, default=0.0)
    discount_amount = db.Column(db.Float, default=0.0)
    shipping_charges = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, default=0.0)
    paid_amount = db.Column(db.Float, default=0.0)
    balance_amount = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='pending')
    notes = db.Column(db.Text)
    terms_conditions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    party = db.relationship('Party', backref='invoices')

class InvoiceItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    rate = db.Column(db.Float, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0.0)
    tax_rate = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, nullable=False)
    
    invoice = db.relationship('Invoice', backref='items')
    item = db.relationship('Item', backref='invoice_items')

class Estimate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    estimate_number = db.Column(db.String(50), nullable=False)
    party_id = db.Column(db.Integer, db.ForeignKey('party.id'), nullable=False)
    estimate_date = db.Column(db.Date, nullable=False)
    valid_until = db.Column(db.Date)
    total_amount = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='pending')
    notes = db.Column(db.Text)
    terms_conditions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    party = db.relationship('Party', backref='estimates')

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    payment_number = db.Column(db.String(50), nullable=False)
    party_id = db.Column(db.Integer, db.ForeignKey('party.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    reference_number = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    party = db.relationship('Party', backref='payments')

class BankAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_number = db.Column(db.String(20), nullable=False)
    account_holder_name = db.Column(db.String(200), nullable=False)
    ifsc_code = db.Column(db.String(11), nullable=False)
    branch = db.Column(db.String(200))
    account_type = db.Column(db.String(20), default='current')
    current_balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(10), default='medium')
    due_date = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Helper functions
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def generate_number(prefix, model, field_name, user_id=None):
    """Generate unique number for invoices, estimates, etc."""
    if user_id:
        count = model.query.filter_by(user_id=user_id).count()
    else:
        count = model.query.count()
    return f"{prefix}-{str(count + 1).zfill(3)}"

def save_base64_image(base64_string, folder, filename):
    """Save base64 image to file"""
    if base64_string:
        try:
            # Remove data:image/png;base64, prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            image_data = base64.b64decode(base64_string)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], folder, filename)
            
            with open(filepath, 'wb') as f:
                f.write(image_data)
            
            return f"/uploads/{folder}/{filename}"
        except Exception as e:
            print(f"Error saving image: {e}")
            return None
    return None

# Authentication decorator
def auth_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

# API Routes

# Authentication APIs
@app.route('/api/auth/send-otp/', methods=['POST'])
def send_otp():
    data = request.get_json()
    
    if not data or 'phone' not in data:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Phone number is required'
            }
        }), 400
    
    phone = data['phone']
    otp_code = generate_otp()
    otp_id = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Delete existing OTPs for this phone
    OTP.query.filter_by(phone=phone).delete()
    
    # Create new OTP
    otp = OTP(
        id=otp_id,
        phone=phone,
        otp=otp_code,
        expires_at=expires_at
    )
    db.session.add(otp)
    db.session.commit()
    
    # In production, send SMS here
    print(f"OTP for {phone}: {otp_code}")
    
    return jsonify({
        'success': True,
        'message': 'OTP sent successfully',
        'otp_id': otp_id,
        'expires_in': 300
    })

@app.route('/api/auth/verify-otp/', methods=['POST'])
def verify_otp():
    data = request.get_json()
    
    required_fields = ['phone', 'otp', 'otp_id']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Phone, OTP and OTP ID are required'
            }
        }), 400
    
    otp_record = OTP.query.filter_by(
        id=data['otp_id'],
        phone=data['phone'],
        otp=data['otp']
    ).first()
    
    if not otp_record or otp_record.expires_at < datetime.utcnow():
        return jsonify({
            'success': False,
            'error': {
                'code': 'INVALID_OTP',
                'message': 'Invalid or expired OTP'
            }
        }), 400
    
    # Mark OTP as verified
    otp_record.is_verified = True
    db.session.commit()
    
    # Check if user exists
    user = User.query.filter_by(phone=data['phone']).first()
    
    if not user:
        return jsonify({
            'success': False,
            'error': {
                'code': 'USER_NOT_FOUND',
                'message': 'User not found. Please register first.'
            }
        }), 404
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'phone': user.phone,
            'name': user.name,
            'email': user.email
        },
        'tokens': {
            'access': access_token,
            'refresh': refresh_token
        }
    })

@app.route('/api/auth/login/', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'phone' not in data or 'password' not in data:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Phone and password are required'
            }
        }), 400
    
    user = User.query.filter_by(phone=data['phone']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({
            'success': False,
            'error': {
                'code': 'INVALID_CREDENTIALS',
                'message': 'Invalid phone or password'
            }
        }), 401
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'phone': user.phone,
            'name': user.name,
            'email': user.email
        },
        'tokens': {
            'access': access_token,
            'refresh': refresh_token
        }
    })

@app.route('/api/auth/register/', methods=['POST'])
def register():
    data = request.get_json()
    
    required_fields = ['phone', 'name', 'password', 'otp', 'otp_id']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'All fields are required'
            }
        }), 400
    
    # Verify OTP
    otp_record = OTP.query.filter_by(
        id=data['otp_id'],
        phone=data['phone'],
        otp=data['otp'],
        is_verified=False
    ).first()
    
    if not otp_record or otp_record.expires_at < datetime.utcnow():
        return jsonify({
            'success': False,
            'error': {
                'code': 'INVALID_OTP',
                'message': 'Invalid or expired OTP'
            }
        }), 400
    
    # Check if user already exists
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({
            'success': False,
            'error': {
                'code': 'USER_EXISTS',
                'message': 'User already exists'
            }
        }), 400
    
    # Create user
    user = User(
        phone=data['phone'],
        name=data['name'],
        email=data.get('email'),
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    
    # Mark OTP as verified
    otp_record.is_verified = True
    db.session.commit()
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'message': 'Account created successfully',
        'user': {
            'id': user.id,
            'phone': user.phone,
            'name': user.name,
            'email': user.email
        },
        'tokens': {
            'access': access_token,
            'refresh': refresh_token
        }
    })

# Company APIs
@app.route('/api/companies/', methods=['POST'])
@auth_required
def create_company():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Company name is required'
            }
        }), 400
    
    # Save logo if provided
    logo_url = None
    if data.get('logo'):
        filename = f"company_{user_id}_{datetime.utcnow().timestamp()}.jpg"
        logo_url = save_base64_image(data['logo'], 'logos', filename)
    
    # Create company
    company = Company(
        user_id=user_id,
        name=data['name'],
        gst_number=data.get('gst_number'),
        address_street=data.get('address', {}).get('street'),
        address_city=data.get('address', {}).get('city'),
        address_state=data.get('address', {}).get('state'),
        address_pincode=data.get('address', {}).get('pincode'),
        address_country=data.get('address', {}).get('country', 'India'),
        contact_phone=data.get('contact', {}).get('phone'),
        contact_email=data.get('contact', {}).get('email'),
        contact_website=data.get('contact', {}).get('website'),
        logo_url=logo_url
    )
    
    db.session.add(company)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Company created successfully',
        'company': {
            'id': company.id,
            'name': company.name,
            'gst_number': company.gst_number,
            'address': {
                'street': company.address_street,
                'city': company.address_city,
                'state': company.address_state,
                'pincode': company.address_pincode,
                'country': company.address_country
            },
            'contact': {
                'phone': company.contact_phone,
                'email': company.contact_email,
                'website': company.contact_website
            },
            'logo_url': company.logo_url,
            'created_at': company.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/companies/', methods=['GET'])
@auth_required
def get_companies():
    user_id = get_jwt_identity()
    companies = Company.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'success': True,
        'companies': [{
            'id': company.id,
            'name': company.name,
            'gst_number': company.gst_number,
            'logo_url': company.logo_url,
            'is_active': company.is_active,
            'created_at': company.created_at.isoformat() + 'Z'
        } for company in companies]
    })

# Party Management APIs
@app.route('/api/parties/', methods=['POST'])
@auth_required
def create_party():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['name', 'type']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Name and type are required'
            }
        }), 400
    
    party = Party(
        user_id=user_id,
        name=data['name'],
        type=data['type'],
        phone=data.get('phone'),
        email=data.get('email'),
        gst_number=data.get('gst_number'),
        billing_street=data.get('address', {}).get('billing', {}).get('street'),
        billing_city=data.get('address', {}).get('billing', {}).get('city'),
        billing_state=data.get('address', {}).get('billing', {}).get('state'),
        billing_pincode=data.get('address', {}).get('billing', {}).get('pincode'),
        billing_country=data.get('address', {}).get('billing', {}).get('country', 'India'),
        shipping_street=data.get('address', {}).get('shipping', {}).get('street'),
        shipping_city=data.get('address', {}).get('shipping', {}).get('city'),
        shipping_state=data.get('address', {}).get('shipping', {}).get('state'),
        shipping_pincode=data.get('address', {}).get('shipping', {}).get('pincode'),
        shipping_country=data.get('address', {}).get('shipping', {}).get('country', 'India'),
        credit_limit=data.get('credit_limit', 0.0),
        payment_terms=data.get('payment_terms', 0)
    )
    
    db.session.add(party)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Party created successfully',
        'party': {
            'id': party.id,
            'name': party.name,
            'type': party.type,
            'phone': party.phone,
            'email': party.email,
            'gst_number': party.gst_number,
            'address': {
                'billing': {
                    'street': party.billing_street,
                    'city': party.billing_city,
                    'state': party.billing_state,
                    'pincode': party.billing_pincode,
                    'country': party.billing_country
                },
                'shipping': {
                    'street': party.shipping_street,
                    'city': party.shipping_city,
                    'state': party.shipping_state,
                    'pincode': party.shipping_pincode,
                    'country': party.shipping_country
                }
            },
            'credit_limit': party.credit_limit,
            'payment_terms': party.payment_terms,
            'balance': party.balance,
            'created_at': party.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/parties/', methods=['GET'])
@auth_required
def get_parties():
    user_id = get_jwt_identity()
    party_type = request.args.get('type')
    search = request.args.get('search')
    
    query = Party.query.filter_by(user_id=user_id)
    
    if party_type:
        query = query.filter_by(type=party_type)
    
    if search:
        query = query.filter(Party.name.contains(search))
    
    parties = query.all()
    
    return jsonify({
        'success': True,
        'count': len(parties),
        'parties': [{
            'id': party.id,
            'name': party.name,
            'type': party.type,
            'phone': party.phone,
            'email': party.email,
            'balance': party.balance,
            'last_transaction_date': None  # You can implement this based on your needs
        } for party in parties]
    })

# Item Management APIs
@app.route('/api/items/', methods=['POST'])
@auth_required
def create_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Item name is required'
            }
        }), 400
    
    # Save image if provided
    image_url = None
    if data.get('image'):
        filename = f"item_{user_id}_{datetime.utcnow().timestamp()}.jpg"
        image_url = save_base64_image(data['image'], 'items', filename)
    
    item = Item(
        user_id=user_id,
        name=data['name'],
        type=data.get('type', 'product'),
        hsn_code=data.get('hsn_code'),
        category=data.get('category'),
        item_code=data.get('item_code'),
        unit=data.get('unit', 'pcs'),
        sale_price=data.get('pricing', {}).get('sale_price', 0.0),
        purchase_price=data.get('pricing', {}).get('purchase_price', 0.0),
        wholesale_price=data.get('pricing', {}).get('wholesale_price', 0.0),
        tax_inclusive=data.get('pricing', {}).get('tax_inclusive', False),
        tax_rate=data.get('tax_rate', 0.0),
        current_stock=data.get('stock', {}).get('opening_stock', 0),
        minimum_stock=data.get('stock', {}).get('minimum_stock', 0),
        description=data.get('description'),
        image_url=image_url
    )
    
    db.session.add(item)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Item created successfully',
        'item': {
            'id': item.id,
            'name': item.name,
            'type': item.type,
            'hsn_code': item.hsn_code,
            'category': item.category,
            'item_code': item.item_code,
            'unit': item.unit,
            'pricing': {
                'sale_price': item.sale_price,
                'purchase_price': item.purchase_price,
                'wholesale_price': item.wholesale_price,
                'tax_inclusive': item.tax_inclusive
            },
            'tax_rate': item.tax_rate,
            'stock': {
                'current_stock': item.current_stock,
                'minimum_stock': item.minimum_stock
            },
            'description': item.description,
            'image_url': item.image_url,
            'created_at': item.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/items/', methods=['GET'])
@auth_required
def get_items():
    user_id = get_jwt_identity()
    search = request.args.get('search')
    category = request.args.get('category')
    
    query = Item.query.filter_by(user_id=user_id)
    
    if search:
        query = query.filter(Item.name.contains(search))
    
    if category:
        query = query.filter(Item.category.contains(category))
    
    items = query.all()
    
    return jsonify({
        'success': True,
        'count': len(items),
        'items': [{
            'id': item.id,
            'name': item.name,
            'item_code': item.item_code,
            'sale_price': item.sale_price,
            'current_stock': item.current_stock,
            'unit': item.unit,
            'image_url': item.image_url
        } for item in items]
    })

# Sales APIs
@app.route('/api/sales/invoices/', methods=['POST'])
@auth_required
def create_invoice():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['party_id', 'invoice_date', 'items']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Party ID, invoice date and items are required'
            }
        }), 400
    
    # Generate invoice number
    invoice_number = generate_number('INV', Invoice, 'invoice_number', user_id)
    
    # Calculate totals
    subtotal = 0
    tax_amount = 0
    
    for item_data in data['items']:
        quantity = item_data['quantity']
        rate = item_data['rate']
        discount = item_data.get('discount', 0)
        tax_rate = item_data.get('tax_rate', 0)
        
        amount = quantity * rate
        discount_amount = (amount * discount) / 100 if discount else 0
        taxable_amount = amount - discount_amount
        item_tax = (taxable_amount * tax_rate) / 100
        
        subtotal += amount
        tax_amount += item_tax
    
    # Apply overall discount
    discount_data = data.get('discount', {})
    discount_amount = 0
    if discount_data:
        if discount_data.get('type') == 'percentage':
            discount_amount = (subtotal * discount_data.get('value', 0)) / 100
        else:
            discount_amount = discount_data.get('value', 0)
    
    shipping_charges = data.get('shipping_charges', 0)
    total_amount = subtotal - discount_amount + shipping_charges + tax_amount
    
    # Create invoice
    invoice = Invoice(
        user_id=user_id,
        invoice_number=invoice_number,
        party_id=data['party_id'],
        invoice_date=datetime.strptime(data['invoice_date'], '%Y-%m-%d').date(),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None,
        subtotal=subtotal,
        discount_amount=discount_amount,
        shipping_charges=shipping_charges,
        tax_amount=tax_amount,
        total_amount=total_amount,
        balance_amount=total_amount,
        notes=data.get('notes'),
        terms_conditions=data.get('terms_conditions')
    )
    
    db.session.add(invoice)
    db.session.flush()  # Get the invoice ID
    
    # Create invoice items
    invoice_items = []
    for item_data in data['items']:
        quantity = item_data['quantity']
        rate = item_data['rate']
        discount = item_data.get('discount', 0)
        tax_rate = item_data.get('tax_rate', 0)
        
        amount = quantity * rate
        discount_amount = (amount * discount) / 100 if discount else 0
        taxable_amount = amount - discount_amount
        item_tax = (taxable_amount * tax_rate) / 100
        total = taxable_amount + item_tax
        
        invoice_item = InvoiceItem(
            invoice_id=invoice.id,
            item_id=item_data['item_id'],
            quantity=quantity,
            rate=rate,
            amount=amount,
            discount=discount,
            tax_rate=tax_rate,
            tax_amount=item_tax,
            total=total
        )
        db.session.add(invoice_item)
        invoice_items.append(invoice_item)
    
    db.session.commit()
    
    # Get party and items data for response
    party = Party.query.get(data['party_id'])
    
    response_items = []
    for invoice_item in invoice_items:
        item = Item.query.get(invoice_item.item_id)
        response_items.append({
            'item': {
                'id': item.id,
                'name': item.name,
                'hsn_code': item.hsn_code
            },
            'quantity': invoice_item.quantity,
            'rate': invoice_item.rate,
            'amount': invoice_item.amount,
            'discount': invoice_item.discount,
            'tax_rate': invoice_item.tax_rate,
            'tax_amount': invoice_item.tax_amount,
            'total': invoice_item.total
        })
    
    return jsonify({
        'success': True,
        'message': 'Invoice created successfully',
        'invoice': {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'party': {
                'id': party.id,
                'name': party.name,
                'gst_number': party.gst_number
            },
            'invoice_date': invoice.invoice_date.strftime('%Y-%m-%d'),
            'due_date': invoice.due_date.strftime('%Y-%m-%d') if invoice.due_date else None,
            'items': response_items,
            'subtotal': invoice.subtotal,
            'discount_amount': invoice.discount_amount,
            'shipping_charges': invoice.shipping_charges,
            'tax_amount': invoice.tax_amount,
            'total_amount': invoice.total_amount,
            'paid_amount': invoice.paid_amount,
            'balance_amount': invoice.balance_amount,
            'status': invoice.status,
            'created_at': invoice.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/sales/invoices/', methods=['GET'])
@auth_required
def get_invoices():
    user_id = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    party_id = request.args.get('party_id')
    status = request.args.get('status')
    
    query = Invoice.query.filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(Invoice.invoice_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    
    if end_date:
        query = query.filter(Invoice.invoice_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    if party_id:
        query = query.filter_by(party_id=int(party_id))
    
    if status:
        query = query.filter_by(status=status)
    
    invoices = query.all()
    
    total_amount = sum(inv.total_amount for inv in invoices)
    paid_amount = sum(inv.paid_amount for inv in invoices)
    balance_amount = sum(inv.balance_amount for inv in invoices)
    
    return jsonify({
        'success': True,
        'count': len(invoices),
        'total_amount': total_amount,
        'paid_amount': paid_amount,
        'balance_amount': balance_amount,
        'invoices': [{
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'party_name': invoice.party.name,
            'invoice_date': invoice.invoice_date.strftime('%Y-%m-%d'),
            'total_amount': invoice.total_amount,
            'paid_amount': invoice.paid_amount,
            'balance_amount': invoice.balance_amount,
            'status': invoice.status
        } for invoice in invoices]
    })

# Estimate APIs
@app.route('/api/sales/estimates/', methods=['POST'])
@auth_required
def create_estimate():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['party_id', 'estimate_date', 'items']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Party ID, estimate date and items are required'
            }
        }), 400
    
    # Generate estimate number
    estimate_number = generate_number('EST', Estimate, 'estimate_number', user_id)
    
    # Calculate total
    total_amount = 0
    for item_data in data['items']:
        quantity = item_data['quantity']
        rate = item_data['rate']
        tax_rate = item_data.get('tax_rate', 0)
        
        amount = quantity * rate
        tax_amount = (amount * tax_rate) / 100
        total_amount += amount + tax_amount
    
    estimate = Estimate(
        user_id=user_id,
        estimate_number=estimate_number,
        party_id=data['party_id'],
        estimate_date=datetime.strptime(data['estimate_date'], '%Y-%m-%d').date(),
        valid_until=datetime.strptime(data['valid_until'], '%Y-%m-%d').date() if data.get('valid_until') else None,
        total_amount=total_amount,
        notes=data.get('notes'),
        terms_conditions=data.get('terms_conditions')
    )
    
    db.session.add(estimate)
    db.session.commit()
    
    party = Party.query.get(data['party_id'])
    
    return jsonify({
        'success': True,
        'message': 'Estimate created successfully',
        'estimate': {
            'id': estimate.id,
            'estimate_number': estimate.estimate_number,
            'party': {
                'id': party.id,
                'name': party.name
            },
            'estimate_date': estimate.estimate_date.strftime('%Y-%m-%d'),
            'valid_until': estimate.valid_until.strftime('%Y-%m-%d') if estimate.valid_until else None,
            'total_amount': estimate.total_amount,
            'status': estimate.status,
            'created_at': estimate.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/sales/estimates/<int:estimate_id>/convert-to-invoice/', methods=['POST'])
@auth_required
def convert_estimate_to_invoice(estimate_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    estimate = Estimate.query.filter_by(id=estimate_id, user_id=user_id).first()
    if not estimate:
        return jsonify({
            'success': False,
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Estimate not found'
            }
        }), 404
    
    # Generate invoice number
    invoice_number = generate_number('INV', Invoice, 'invoice_number', user_id)
    
    # Create invoice from estimate
    invoice = Invoice(
        user_id=user_id,
        invoice_number=invoice_number,
        party_id=estimate.party_id,
        invoice_date=datetime.strptime(data['invoice_date'], '%Y-%m-%d').date(),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None,
        total_amount=estimate.total_amount,
        balance_amount=estimate.total_amount,
        notes=estimate.notes,
        terms_conditions=estimate.terms_conditions
    )
    
    db.session.add(invoice)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Estimate converted to invoice successfully',
        'invoice': {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'estimate_id': estimate.id,
            'total_amount': invoice.total_amount,
            'created_at': invoice.created_at.isoformat() + 'Z'
        }
    })

# Payment APIs
@app.route('/api/payments/payment-in/', methods=['POST'])
@auth_required
def record_payment_in():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['party_id', 'amount', 'payment_date', 'payment_method']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Party ID, amount, payment date and payment method are required'
            }
        }), 400
    
    # Generate payment number
    payment_number = generate_number('PAY', Payment, 'payment_number', user_id)
    
    payment = Payment(
        user_id=user_id,
        payment_number=payment_number,
        party_id=data['party_id'],
        amount=data['amount'],
        payment_date=datetime.strptime(data['payment_date'], '%Y-%m-%d').date(),
        payment_method=data['payment_method'],
        reference_number=data.get('reference_number'),
        notes=data.get('notes')
    )
    
    db.session.add(payment)
    
    # Update invoice payments if provided
    invoices_paid = []
    if data.get('invoices'):
        for invoice_payment in data['invoices']:
            invoice = Invoice.query.filter_by(
                id=invoice_payment['invoice_id'],
                user_id=user_id
            ).first()
            
            if invoice:
                invoice.paid_amount += invoice_payment['amount']
                invoice.balance_amount = invoice.total_amount - invoice.paid_amount
                
                if invoice.balance_amount <= 0:
                    invoice.status = 'paid'
                elif invoice.paid_amount > 0:
                    invoice.status = 'partial'
                
                invoices_paid.append({
                    'invoice_number': invoice.invoice_number,
                    'amount_paid': invoice_payment['amount']
                })
    
    db.session.commit()
    
    party = Party.query.get(data['party_id'])
    
    return jsonify({
        'success': True,
        'message': 'Payment recorded successfully',
        'payment': {
            'id': payment.id,
            'payment_number': payment.payment_number,
            'party': {
                'id': party.id,
                'name': party.name
            },
            'amount': payment.amount,
            'payment_date': payment.payment_date.strftime('%Y-%m-%d'),
            'payment_method': payment.payment_method,
            'reference_number': payment.reference_number,
            'invoices_paid': invoices_paid,
            'created_at': payment.created_at.isoformat() + 'Z'
        }
    })

# Cash & Bank APIs
@app.route('/api/cash-bank/bank-accounts/', methods=['POST'])
@auth_required
def create_bank_account():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['bank_name', 'account_number', 'account_holder_name', 'ifsc_code']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Bank name, account number, account holder name and IFSC code are required'
            }
        }), 400
    
    bank_account = BankAccount(
        user_id=user_id,
        bank_name=data['bank_name'],
        account_number=data['account_number'],
        account_holder_name=data['account_holder_name'],
        ifsc_code=data['ifsc_code'],
        branch=data.get('branch'),
        account_type=data.get('account_type', 'current'),
        current_balance=data.get('opening_balance', 0.0)
    )
    
    db.session.add(bank_account)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Bank account created successfully',
        'bank_account': {
            'id': bank_account.id,
            'bank_name': bank_account.bank_name,
            'account_number': bank_account.account_number,
            'account_holder_name': bank_account.account_holder_name,
            'ifsc_code': bank_account.ifsc_code,
            'branch': bank_account.branch,
            'account_type': bank_account.account_type,
            'current_balance': bank_account.current_balance,
            'created_at': bank_account.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/cash-bank/cash-in-hand/', methods=['GET'])
@auth_required
def get_cash_in_hand():
    user_id = get_jwt_identity()
    
    # Calculate cash from cash payments
    cash_payments = Payment.query.filter_by(
        user_id=user_id,
        payment_method='cash'
    ).all()
    
    current_balance = sum(payment.amount for payment in cash_payments)
    
    transactions = [{
        'id': payment.id,
        'type': 'sale',
        'party_name': payment.party.name,
        'amount': payment.amount,
        'date': payment.payment_date.strftime('%Y-%m-%d'),
        'description': 'Cash sale'
    } for payment in cash_payments]
    
    return jsonify({
        'success': True,
        'cash_in_hand': {
            'current_balance': current_balance,
            'transactions': transactions
        }
    })

# Dashboard APIs
@app.route('/api/dashboard/', methods=['GET'])
@auth_required
def get_dashboard():
    user_id = get_jwt_identity()
    
    # Calculate receivables (pending invoice amounts)
    pending_invoices = Invoice.query.filter_by(user_id=user_id).filter(
        Invoice.balance_amount > 0
    ).all()
    total_receivable = sum(inv.balance_amount for inv in pending_invoices)
    
    # Calculate sales this month
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    current_month_invoices = Invoice.query.filter_by(user_id=user_id).filter(
        Invoice.invoice_date >= current_month_start.date()
    ).all()
    total_sales_this_month = sum(inv.total_amount for inv in current_month_invoices)
    
    # Recent transactions (last 10 invoices)
    recent_invoices = Invoice.query.filter_by(user_id=user_id).order_by(
        Invoice.created_at.desc()
    ).limit(10).all()
    
    recent_transactions = [{
        'id': inv.id,
        'type': 'sale',
        'party_name': inv.party.name,
        'amount': inv.total_amount,
        'date': inv.invoice_date.strftime('%Y-%m-%d')
    } for inv in recent_invoices]
    
    # Pending invoices
    pending_invoices_data = [{
        'invoice_number': inv.invoice_number,
        'party_name': inv.party.name,
        'amount': inv.balance_amount,
        'due_date': inv.due_date.strftime('%Y-%m-%d') if inv.due_date else None
    } for inv in pending_invoices[:10]]  # Limit to 10
    
    # Sales chart data (last 30 days)
    sales_chart = []
    for i in range(30):
        date = datetime.now() - timedelta(days=i)
        daily_sales = Invoice.query.filter_by(user_id=user_id).filter(
            Invoice.invoice_date == date.date()
        ).all()
        amount = sum(inv.total_amount for inv in daily_sales)
        
        sales_chart.append({
            'date': date.strftime('%Y-%m-%d'),
            'amount': amount
        })
    
    sales_chart.reverse()  # Show chronological order
    
    return jsonify({
        'success': True,
        'dashboard': {
            'summary': {
                'total_receivable': total_receivable,
                'total_payable': 0.0,  # You can implement this based on purchase invoices
                'total_sales_this_month': total_sales_this_month,
                'sales_growth': 0.0  # You can calculate this based on previous month
            },
            'sales_chart': sales_chart,
            'recent_transactions': recent_transactions,
            'pending_invoices': pending_invoices_data
        }
    })

# Reports APIs
@app.route('/api/reports/sales/', methods=['GET'])
@auth_required
def get_sales_report():
    user_id = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    party_id = request.args.get('party_id')
    
    query = Invoice.query.filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(Invoice.invoice_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    
    if end_date:
        query = query.filter(Invoice.invoice_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    if party_id:
        query = query.filter_by(party_id=int(party_id))
    
    invoices = query.all()
    
    total_sales = sum(inv.total_amount for inv in invoices)
    total_invoices = len(invoices)
    average_invoice_value = total_sales / total_invoices if total_invoices > 0 else 0
    
    # Sales by party
    party_sales = {}
    for invoice in invoices:
        party_name = invoice.party.name
        if party_name not in party_sales:
            party_sales[party_name] = {'total_amount': 0, 'invoice_count': 0}
        
        party_sales[party_name]['total_amount'] += invoice.total_amount
        party_sales[party_name]['invoice_count'] += 1
    
    sales_by_party = [
        {
            'party_name': party_name,
            'total_amount': data['total_amount'],
            'invoice_count': data['invoice_count']
        }
        for party_name, data in party_sales.items()
    ]
    
    # Sales by item (you would need to query invoice items)
    item_sales = {}
    for invoice in invoices:
        for invoice_item in invoice.items:
            item_name = invoice_item.item.name
            if item_name not in item_sales:
                item_sales[item_name] = {'quantity_sold': 0, 'total_amount': 0}
            
            item_sales[item_name]['quantity_sold'] += invoice_item.quantity
            item_sales[item_name]['total_amount'] += invoice_item.total
    
    sales_by_item = [
        {
            'item_name': item_name,
            'quantity_sold': data['quantity_sold'],
            'total_amount': data['total_amount']
        }
        for item_name, data in item_sales.items()
    ]
    
    return jsonify({
        'success': True,
        'report': {
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'summary': {
                'total_sales': total_sales,
                'total_invoices': total_invoices,
                'average_invoice_value': average_invoice_value
            },
            'sales_by_party': sales_by_party,
            'sales_by_item': sales_by_item
        }
    })

@app.route('/api/reports/party-statement/<int:party_id>/', methods=['GET'])
@auth_required
def get_party_statement(party_id):
    user_id = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    party = Party.query.filter_by(id=party_id, user_id=user_id).first()
    if not party:
        return jsonify({
            'success': False,
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Party not found'
            }
        }), 404
    
    # Get invoices
    invoice_query = Invoice.query.filter_by(user_id=user_id, party_id=party_id)
    if start_date:
        invoice_query = invoice_query.filter(Invoice.invoice_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        invoice_query = invoice_query.filter(Invoice.invoice_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    invoices = invoice_query.all()
    
    # Get payments
    payment_query = Payment.query.filter_by(user_id=user_id, party_id=party_id)
    if start_date:
        payment_query = payment_query.filter(Payment.payment_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        payment_query = payment_query.filter(Payment.payment_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    payments = payment_query.all()
    
    # Combine and sort transactions
    transactions = []
    balance = 0.0
    
    # Add invoices
    for invoice in invoices:
        balance += invoice.total_amount
        transactions.append({
            'date': invoice.invoice_date.strftime('%Y-%m-%d'),
            'type': 'invoice',
            'reference': invoice.invoice_number,
            'debit': invoice.total_amount,
            'credit': 0.0,
            'balance': balance
        })
    
    # Add payments
    for payment in payments:
        balance -= payment.amount
        transactions.append({
            'date': payment.payment_date.strftime('%Y-%m-%d'),
            'type': 'payment',
            'reference': payment.payment_number,
            'debit': 0.0,
            'credit': payment.amount,
            'balance': balance
        })
    
    # Sort by date
    transactions.sort(key=lambda x: x['date'])
    
    return jsonify({
        'success': True,
        'statement': {
            'party': {
                'id': party.id,
                'name': party.name,
                'phone': party.phone
            },
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'opening_balance': 0.0,  # You can calculate this based on transactions before start_date
            'closing_balance': party.balance,
            'transactions': transactions
        }
    })

# Todo APIs
@app.route('/api/todos/', methods=['POST'])
@auth_required
def create_todo():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Todo text is required'
            }
        }), 400
    
    todo = Todo(
        user_id=user_id,
        text=data['text'],
        priority=data.get('priority', 'medium'),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None
    )
    
    db.session.add(todo)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Todo created successfully',
        'todo': {
            'id': todo.id,
            'text': todo.text,
            'priority': todo.priority,
            'due_date': todo.due_date.strftime('%Y-%m-%d') if todo.due_date else None,
            'completed': todo.completed,
            'created_at': todo.created_at.isoformat() + 'Z'
        }
    }), 201

@app.route('/api/todos/', methods=['GET'])
@auth_required
def get_todos():
    user_id = get_jwt_identity()
    completed = request.args.get('completed')
    
    query = Todo.query.filter_by(user_id=user_id)
    
    if completed is not None:
        completed_bool = completed.lower() == 'true'
        query = query.filter_by(completed=completed_bool)
    
    todos = query.all()
    
    return jsonify({
        'success': True,
        'todos': [{
            'id': todo.id,
            'text': todo.text,
            'priority': todo.priority,
            'due_date': todo.due_date.strftime('%Y-%m-%d') if todo.due_date else None,
            'completed': todo.completed,
            'created_at': todo.created_at.isoformat() + 'Z'
        } for todo in todos]
    })

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 'BAD_REQUEST',
            'message': 'Bad request'
        }
    }), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 'UNAUTHORIZED',
            'message': 'Authentication required'
        }
    }), 401

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 'NOT_FOUND',
            'message': 'Resource not found'
        }
    }), 404

if __name__ == '__main__':
    app.run(debug=True)