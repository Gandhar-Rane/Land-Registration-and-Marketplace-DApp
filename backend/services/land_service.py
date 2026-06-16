import os
import json
from db import conn
from werkzeug.utils import secure_filename
from web3 import Web3



w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


PRIVATE_KEY = "Your_Private_Key_Here"  
ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)


# 🔥 FIXED ABI PATH (IMPORTANT)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ABI_PATH = os.path.join(
    BASE_DIR,
    "..",
    "blockchain",
    "artifacts",
    "contracts",
    "LandRegistry.sol",
    "LandRegistry.json"
)

with open(ABI_PATH) as f:
    contract_json = json.load(f)
    ABI = contract_json["abi"]

CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)


# 🔹 CREATE LAND
def create_land(data, files):
    try:
        image = files.get("image")
        document = files.get("document")

        if not image or not document:
            return {"error": "Image and PDF required"}, 400

        if len(image.read()) > 1 * 1024 * 1024:
            return {"error": "Image too large"}, 400
        image.seek(0)

        if len(document.read()) > 1 * 1024 * 1024:
            return {"error": "PDF too large"}, 400
        document.seek(0)

        image_filename = secure_filename(image.filename)
        doc_filename = secure_filename(document.filename)

        image_path = f"uploads/images/{image_filename}"
        doc_path = f"uploads/docs/{doc_filename}"

        image.save(image_path)
        document.save(doc_path)

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO lands (user_id, title, area, location, image_url, document_url)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data.get("user_id"),
            data.get("title"),
            data.get("area"),
            data.get("location"),
            image_path,
            doc_path
        ))

        conn.commit()

        return {"message": "Land submitted for approval"}, 201

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 400


# 🔹 UPDATE LAND
def update_land(land_id, data):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE lands
            SET title = %s,
                area = %s,
                location = %s
            WHERE id = %s
        """, (
            data.get("title"),
            data.get("area"),
            data.get("location"),
            land_id
        ))

        conn.commit()

        return {"message": "Land updated successfully"}, 200

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 400


# 🔥 BLOCKCHAIN FUNCTION (ADMIN SIDE)
def register_land_on_chain(land):
    try:
        nonce = w3.eth.get_transaction_count(ACCOUNT.address)

        tx = contract.functions.registerLand(
            land[0],              # land_id
            land[2],              # title
            land[4],              # location
            int(land[3]),         # area
            ACCOUNT.address       # owner (temporary admin)
        ).build_transaction({
            "from": ACCOUNT.address,
            "nonce": nonce,
            "gas": 2000000,
            "gasPrice": w3.to_wei("20", "gwei")
        })

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        print("✅ Blockchain TX:", tx_hash.hex())

    except Exception as e:
        print("❌ Blockchain error:", str(e))