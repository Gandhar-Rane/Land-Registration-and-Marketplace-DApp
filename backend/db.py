import psycopg2

conn = psycopg2.connect(
    dbname="land_registry",
    user="postgres",
    password="Gandhar@123",
    host="localhost",
    port="5432"
)

print("Connected DB:", conn.get_dsn_parameters()["dbname"])

cursor = conn.cursor()