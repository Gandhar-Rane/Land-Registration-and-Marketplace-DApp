import jwt
import datetime

SECRET_KEY = "your_secret_key"  # change later

def generate_token(user):
    payload = {
        "user_id": user[0],
        "email": user[2],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def verify_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except:
        return None