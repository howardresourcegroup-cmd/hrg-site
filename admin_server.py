"""
HRG Admin Portal - Flask-based product management system
Simple, secure admin interface for managing products and collections
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import json
import os
from datetime import datetime
from functools import wraps

app = Flask(__name__, 
            template_folder='admin/templates',
            static_folder='assets')
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-change-in-production')

# Configuration
PRODUCTS_DIR = 'content/products'
UPLOAD_FOLDER = 'assets/products'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

# Simple user storage (replace with database in production)
# Password is read from environment variable for security
DEFAULT_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme123')
USERS = {
    'admin': generate_password_hash(DEFAULT_PASSWORD)
}

# CORS support for cross-origin requests from GitHub Pages
@app.after_request
def after_request(response):
    # Only allow from your domain
    allowed_origin = os.environ.get('ALLOWED_ORIGIN', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Origin', allowed_origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username in USERS and check_password_hash(USERS[username], password):
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('dashboard'))
        
        return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/admin/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/admin')
@login_required
def dashboard():
    """Main admin dashboard"""
    products = load_all_products()
    stats = {
        'total_products': len(products),
        'featured': sum(1 for p in products if p.get('featured')),
        'categories': len(set(p.get('category', 'uncategorized') for p in products))
    }
    return render_template('dashboard.html', stats=stats, products=products)

@app.route('/admin/products')
@login_required
def products_list():
    """List all products"""
    products = load_all_products()
    return render_template('products.html', products=products)

@app.route('/admin/products/new', methods=['GET', 'POST'])
@login_required
def product_new():
    """Create new product"""
    if request.method == 'POST':
        product_data = parse_product_form(request.form)
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                product_data['image'] = f'assets/products/{filename}'
        
        # Save product
        product_id = product_data.get('title', 'untitled').lower().replace(' ', '-')
        filename = f"{product_id}.json"
        save_product(filename, product_data)
        
        # Add to index
        add_to_index(filename)
        
        return redirect(url_for('products_list'))
    
    return render_template('product_edit.html', product=None, is_new=True)

@app.route('/admin/products/<product_id>/edit', methods=['GET', 'POST'])
@login_required
def product_edit(product_id):
    """Edit existing product"""
    filename = f"{product_id}.json" if not product_id.endswith('.json') else product_id
    
    if request.method == 'POST':
        product_data = parse_product_form(request.form)
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename_img = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename_img)
                file.save(filepath)
                product_data['image'] = f'assets/products/{filename_img}'
        
        save_product(filename, product_data)
        return redirect(url_for('products_list'))
    
    product = load_product(filename)
    return render_template('product_edit.html', product=product, is_new=False, product_id=product_id)

@app.route('/admin/products/<product_id>/delete', methods=['POST'])
@login_required
def product_delete(product_id):
    """Delete product"""
    filename = f"{product_id}.json" if not product_id.endswith('.json') else product_id
    filepath = os.path.join(PRODUCTS_DIR, filename)
    
    if os.path.exists(filepath):
        os.remove(filepath)
        remove_from_index(filename)
    
    return redirect(url_for('products_list'))

@app.route('/admin/api/products')
@login_required
def api_products():
    """API endpoint for products list"""
    products = load_all_products()
    return jsonify(products)

# Helper functions
def load_all_products():
    """Load all products from JSON files"""
    index_path = os.path.join(PRODUCTS_DIR, 'index.json')
    
    if not os.path.exists(index_path):
        return []
    
    with open(index_path, 'r') as f:
        index = json.load(f)
    
    products = []
    for filename in index.get('items', []):
        product = load_product(filename)
        if product:
            product['_filename'] = filename
            product['_id'] = filename.replace('.json', '')
            products.append(product)
    
    return products

def load_product(filename):
    """Load single product"""
    filepath = os.path.join(PRODUCTS_DIR, filename)
    
    if not os.path.exists(filepath):
        return None
    
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except:
        return None

def save_product(filename, data):
    """Save product to JSON file"""
    filepath = os.path.join(PRODUCTS_DIR, filename)
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def parse_product_form(form):
    """Parse product form data into JSON structure"""
    product = {
        'title': form.get('title', ''),
        'short': form.get('short', ''),
        'description': form.get('description', ''),
        'price': int(form.get('price', 0)),
        'category': form.get('category', 'gaming'),
        'featured': form.get('featured') == 'on',
        'badges': [b.strip() for b in form.get('badges', '').split(',') if b.strip()],
        'specs': {},
        'performance': {},
        'idealFor': [i.strip() for i in form.get('idealFor', '').split(',') if i.strip()],
        'features': [],
        'availability': form.get('availability', 'in-stock')
    }
    
    # Parse specs
    for key in form:
        if key.startswith('spec_'):
            spec_name = key.replace('spec_', '')
            product['specs'][spec_name] = form.get(key)
    
    # Parse performance
    product['performance'] = {
        '1080p': form.get('perf_1080p', ''),
        '1440p': form.get('perf_1440p', ''),
        '4K': form.get('perf_4k', '')
    }
    
    # Parse features (from JSON textarea if provided)
    features_json = form.get('features_json', '[]')
    try:
        product['features'] = json.loads(features_json)
    except:
        product['features'] = []
    
    # Keep existing image if no new upload
    if form.get('existing_image'):
        product['image'] = form.get('existing_image')
    
    return product

def add_to_index(filename):
    """Add product to index.json"""
    index_path = os.path.join(PRODUCTS_DIR, 'index.json')
    
    if os.path.exists(index_path):
        with open(index_path, 'r') as f:
            index = json.load(f)
    else:
        index = {'items': []}
    
    if filename not in index['items']:
        index['items'].append(filename)
    
    with open(index_path, 'w') as f:
        json.dump(index, f, indent=2)

def remove_from_index(filename):
    """Remove product from index.json"""
    index_path = os.path.join(PRODUCTS_DIR, 'index.json')
    
    if not os.path.exists(index_path):
        return
    
    with open(index_path, 'r') as f:
        index = json.load(f)
    
    if filename in index['items']:
        index['items'].remove(filename)
    
    with open(index_path, 'w') as f:
        json.dump(index, f, indent=2)

if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs(PRODUCTS_DIR, exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs('admin/templates', exist_ok=True)
    
    # Get environment
    is_production = os.environ.get('ENVIRONMENT') == 'production'
    debug_mode = not is_production
    port = int(os.environ.get('PORT', 5000))
    
    print("=" * 60)
    print("HRG ADMIN PORTAL")
    print("=" * 60)
    if is_production:
        print("🚀 Running in PRODUCTION mode")
    else:
        print("🔧 Running in DEVELOPMENT mode")
    print(f"Admin URL: http://localhost:{port}/admin/login")
    print(f"Username: admin")
    print("=" * 60)
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
