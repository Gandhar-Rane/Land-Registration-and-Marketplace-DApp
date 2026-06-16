from db import conn, cursor


def create_user(name, email, password, phone, country):
    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password, phone, country)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (name, email, password, phone, country)
        )
        conn.commit()

        return {"message": "User registered successfully"}, 201

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 400


def login_user(email, password):
    try:
        cursor.execute(
            "SELECT * FROM public.users WHERE email=%s AND password=%s",
            (email, password)
        )

        user = cursor.fetchone()

        if user:
            return user
        return None

    except Exception:
        return None


# 🔥 NEW: GET USER PROFILE
def get_user_profile(user_id):
    try:
        cursor.execute(
            "SELECT id, name, email, phone, country FROM users WHERE id=%s",
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "phone": user[3],
            "country": user[4]
        }, 200

    except Exception as e:
        return {"error": str(e)}, 400


# 🔥 NEW: UPDATE USER PROFILE
def update_user_profile(user_id, data):
    try:
        cursor.execute("""
            UPDATE users
            SET name = %s,
                phone = %s,
                country = %s
            WHERE id = %s
        """, (
            data.get("name"),
            data.get("phone"),
            data.get("country"),
            user_id
        ))

        conn.commit()

        return {"message": "Profile updated successfully"}, 200

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 400