from flask import Blueprint, request, jsonify
from services.auth_services import (
    create_user,
    login_user,
    get_user_profile,
    update_user_profile
)
from utils.jwt_handler import generate_token

auth_bp = Blueprint("auth", __name__)


# 🔹 SIGNUP
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    response, status = create_user(
        data.get("name"),
        data.get("email"),
        data.get("password"),
        data.get("phone"),
        data.get("country")
    )

    return jsonify(response), status


# 🔹 LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # 🔥 ADMIN LOGIN
    if email == "gandhar@gmail.com" and password == "admin123":
        return jsonify({
            "message": "Admin login successful",
            "role": "admin",
            "token": "admin-token"
        }), 200

    # 👤 USER LOGIN
    user = login_user(email, password)

    if user:
        token = generate_token(user)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "role": "user",
            "user_id": user[0]  # 🔥 IMPORTANT
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


# 🔥 NEW: GET PROFILE
@auth_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    response, status = get_user_profile(user_id)
    return jsonify(response), status


# 🔥 NEW: UPDATE PROFILE
@auth_bp.route("/update-profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json()

    response, status = update_user_profile(user_id, data)
    return jsonify(response), status

@auth_bp.route("/users-count", methods=["GET"])
def users_count():
    from db import conn
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    return jsonify({"count": count})