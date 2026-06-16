from flask import Blueprint, request, jsonify
from services.land_service import create_land, update_land
from db import conn

land_bp = Blueprint("land", __name__)


# 🔹 Register Land
@land_bp.route("/register-land", methods=["POST"])
def register_land():
    data = request.form
    files = request.files
    response, status = create_land(data, files)
    return jsonify(response), status


# 🔹 User lands
@land_bp.route("/my-lands/<int:user_id>", methods=["GET"])
def get_my_lands(user_id):
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM lands 
        WHERE user_id = %s 
        ORDER BY id DESC
    """, (user_id,))
    return jsonify({"lands": cursor.fetchall()})


# 🔹 Pending lands (admin)
@land_bp.route("/pending-lands", methods=["GET"])
def get_pending_lands():
    cursor = conn.cursor()
    cursor.execute("""
        SELECT lands.*, users.name 
        FROM lands
        JOIN users ON lands.user_id = users.id
        WHERE lands.status = 'pending'
        ORDER BY lands.id DESC
    """)
    return jsonify({"lands": cursor.fetchall()})


# 🔹 Approve
@land_bp.route("/approve-land/<int:land_id>", methods=["PUT"])
def approve_land(land_id):
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE lands 
        SET status = 'approved'
        WHERE id = %s
    """, (land_id,))
    conn.commit()
    return jsonify({"message": "Approved ✅"})


# 🔹 Reject
@land_bp.route("/reject-land/<int:land_id>", methods=["PUT"])
def reject_land(land_id):
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE lands 
        SET status = 'rejected'
        WHERE id = %s
    """, (land_id,))
    conn.commit()
    return jsonify({"message": "Rejected ❌"})


# 🔥 LIST FOR SALE
@land_bp.route("/list-for-sale/<int:land_id>", methods=["PUT"])
def list_for_sale(land_id):
    data = request.get_json()
    price = data.get("price")

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE lands
        SET price = %s,
            is_listed = TRUE
        WHERE id = %s
    """, (price, land_id))

    conn.commit()

    return jsonify({"message": "Listed for sale 🚀"})


# 🔥 MARKETPLACE DATA
@land_bp.route("/market-lands", methods=["GET"])
def market_lands():
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lands.*, users.name
        FROM lands
        JOIN users ON lands.user_id = users.id
        WHERE lands.status = 'approved'
        AND lands.is_listed = TRUE
        ORDER BY lands.id DESC
    """)

    return jsonify({"lands": cursor.fetchall()})


# 🔹 Approved lands (admin)
@land_bp.route("/approved-lands", methods=["GET"])
def get_approved_lands():
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lands.*, users.name
        FROM lands
        JOIN users ON lands.user_id = users.id
        WHERE lands.status = 'approved'
        ORDER BY lands.id DESC
    """)

    return jsonify({"lands": cursor.fetchall()})


# 🔥 BUY LAND
@land_bp.route("/buy-land/<int:land_id>", methods=["PUT"])
def buy_land(land_id):
    data = request.get_json()
    buyer_id = data.get("buyer_id")

    cursor = conn.cursor()

    # Get land details
    cursor.execute("""
        SELECT title, area, location, image_url, document_url
        FROM lands
        WHERE id = %s
    """, (land_id,))
    
    land = cursor.fetchone()

    if not land:
        return jsonify({"error": "Land not found"}), 404

    title, area, location, image_url, document_url = land

    # Seller → mark sold
    cursor.execute("""
        UPDATE lands
        SET status = 'sold',
            is_listed = FALSE
        WHERE id = %s
    """, (land_id,))

    # Buyer → new entry (🔥 FIX: status = owned)
    cursor.execute("""
        INSERT INTO lands (user_id, title, area, location, image_url, document_url, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'owned')
    """, (
        buyer_id,
        title,
        area,
        location,
        image_url,
        document_url
    ))

    conn.commit()

    return jsonify({"message": "Ownership transferred successfully ✅"})


# 🔥 ADMIN STATS (NEW FIX)
@land_bp.route("/admin-stats", methods=["GET"])
def admin_stats():
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM lands")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM lands WHERE status = 'pending'")
    pending = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM lands WHERE status = 'approved'")
    approved = cursor.fetchone()[0]

    return jsonify({
        "total": total,
        "pending": pending,
        "approved": approved
    })


# 🔥 USERS COUNT (NEW FIX)
@land_bp.route("/users-count", methods=["GET"])
def users_count():
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    return jsonify({"count": count})