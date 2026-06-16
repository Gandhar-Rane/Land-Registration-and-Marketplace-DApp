from flask import Flask, send_from_directory
from flask_cors import CORS
import os

from routes.auth_routes import auth_bp
from routes.land_routes import land_bp
from db import conn

app = Flask(__name__)
CORS(app)

# 🔥 Upload config
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ Ensure folders exist
os.makedirs("uploads/images", exist_ok=True)
os.makedirs("uploads/docs", exist_ok=True)


# 🔥 SERVE UPLOADED FILES (VERY IMPORTANT)
@app.route('/uploads/<path:filename>')
def uploaded_files(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ✅ Test route
@app.route("/")
def home():
    return "Backend running 🚀"


# ✅ Debug route
@app.route("/debug")
def debug():
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users'
    """)
    columns = cur.fetchall()
    return {"columns": columns}


# 🔹 Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(land_bp)


if __name__ == "__main__":
    app.run(debug=True)