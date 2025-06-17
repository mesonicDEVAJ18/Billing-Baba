from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vyapar.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# ---------------------- MODELS ----------------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    status = db.Column(db.String(50))
    total_purchases = db.Column(db.Float, default=0.0)
    invoice_count = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    stock = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer = db.Column(db.String(100))
    amount = db.Column(db.Float)
    status = db.Column(db.String(50))
    date = db.Column(db.String(100))
    due_date = db.Column(db.String(100))
    items = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer = db.Column(db.String(100))
    product = db.Column(db.String(100))
    amount = db.Column(db.Float)
    date = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# ---------------------- AUTH ----------------------

@app.route('/api/signup/', methods=['POST'])
def signup():
    data = request.json
    if data['password'] != data['password2']:
        return jsonify({'detail': 'Passwords do not match'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'detail': 'Email already registered'}), 400
    hashed_password = generate_password_hash(data['password'])
    user = User(email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}})

@app.route('/api/login/', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'detail': 'Invalid credentials'}), 401
    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}})

@app.route('/api/me/', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'id': user.id, 'email': user.email})

# ---------------------- DASHBOARD ----------------------

@app.route('/api/summary/', methods=['GET'])
@jwt_required()
def summary():
    user_id = get_jwt_identity()
    total_sales = db.session.query(db.func.sum(Sale.amount)).filter_by(user_id=user_id).scalar() or 0
    total_customers = Customer.query.filter_by(user_id=user_id).count()
    total_invoices = Invoice.query.filter_by(user_id=user_id).count()
    total_products = Product.query.filter_by(user_id=user_id).count()
    return jsonify({
        'total_sales': str(total_sales),
        'total_customers': total_customers,
        'total_invoices': total_invoices,
        'total_products': total_products,
        'last_updated': datetime.utcnow().isoformat()
    })

@app.route('/api/invoices/recent/', methods=['GET'])
@jwt_required()
def recent_invoices():
    user_id = get_jwt_identity()
    invoices = Invoice.query.filter_by(user_id=user_id).order_by(Invoice.id.desc()).limit(5).all()
    return jsonify([
        {"id": inv.id, "customer": inv.customer, "amount": str(inv.amount), "status": inv.status, "date": inv.date}
        for inv in invoices
    ])

# ---------------------- CUSTOMERS ----------------------

@app.route('/api/customers/', methods=['GET', 'POST'])
@jwt_required()
def customers():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.json
        customer = Customer(**data, user_id=user_id)
        db.session.add(customer)
        db.session.commit()
        return jsonify({'detail': 'Customer added'})
    customers = Customer.query.filter_by(user_id=user_id).all()
    return jsonify([c.__dict__ for c in customers])

@app.route('/api/customers/<int:id>/', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def customer_detail(id):
    user_id = get_jwt_identity()
    customer = Customer.query.filter_by(id=id, user_id=user_id).first_or_404()
    if request.method == 'GET':
        return jsonify(customer.__dict__)
    elif request.method == 'PUT':
        for key, value in request.json.items():
            setattr(customer, key, value)
        db.session.commit()
        return jsonify({'detail': 'Customer updated'})
    else:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'detail': 'Customer deleted'})

# ---------------------- INVOICES ----------------------

@app.route('/api/invoices/', methods=['GET', 'POST'])
@jwt_required()
def invoices():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.json
        invoice = Invoice(**data, user_id=user_id)
        db.session.add(invoice)
        db.session.commit()
        return jsonify({'detail': 'Invoice added'})
    invoices = Invoice.query.filter_by(user_id=user_id).all()
    return jsonify([inv.__dict__ for inv in invoices])

@app.route('/api/invoices/<int:id>/', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def invoice_detail(id):
    user_id = get_jwt_identity()
    invoice = Invoice.query.filter_by(id=id, user_id=user_id).first_or_404()
    if request.method == 'GET':
        return jsonify(invoice.__dict__)
    elif request.method == 'PUT':
        for key, value in request.json.items():
            setattr(invoice, key, value)
        db.session.commit()
        return jsonify({'detail': 'Invoice updated'})
    else:
        db.session.delete(invoice)
        db.session.commit()
        return jsonify({'detail': 'Invoice deleted'})

# ---------------------- PRODUCTS ----------------------

@app.route('/api/products/', methods=['GET', 'POST'])
@jwt_required()
def products():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.json
        product = Product(**data, user_id=user_id)
        db.session.add(product)
        db.session.commit()
        return jsonify({'detail': 'Product added'})
    products = Product.query.filter_by(user_id=user_id).all()
    return jsonify([p.__dict__ for p in products])

@app.route('/api/products/<int:id>/', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product_detail(id):
    user_id = get_jwt_identity()
    product = Product.query.filter_by(id=id, user_id=user_id).first_or_404()
    if request.method == 'GET':
        return jsonify(product.__dict__)
    elif request.method == 'PUT':
        for key, value in request.json.items():
            setattr(product, key, value)
        db.session.commit()
        return jsonify({'detail': 'Product updated'})
    else:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'detail': 'Product deleted'})

# ---------------------- SALES ----------------------

@app.route('/api/sales/', methods=['GET'])
@jwt_required()
def sales():
    user_id = get_jwt_identity()
    sales = Sale.query.filter_by(user_id=user_id).all()
    return jsonify([s.__dict__ for s in sales])

@app.route('/api/sales/top-products/', methods=['GET'])
@jwt_required()
def top_products():
    user_id = get_jwt_identity()
    results = db.session.query(Sale.product, db.func.count(Sale.id).label('sold'), db.func.sum(Sale.amount).label('revenue')).filter_by(user_id=user_id).group_by(Sale.product).order_by(db.func.sum(Sale.amount).desc()).limit(5).all()
    return jsonify([{"name": r[0], "sold": r[1], "revenue": r[2]} for r in results])

# ---------------------- RUN ----------------------

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)