import psycopg2
from dotenv import load_dotenv
import os

def drop_tables(db_credentials):
    conn = psycopg2.connect(
        dbname=db_credentials['DB_NAME'],
        user=db_credentials['DB_USER'],
        password=db_credentials['DB_PASSWORD'],
        host=db_credentials['DB_HOST'],
        port=db_credentials['DB_PORT']
    )
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS users;")
    cursor.execute("DROP TABLE IF EXISTS orders;")
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    load_dotenv()

    db_credentials = {
        'DB_NAME': os.getenv('DB_NAME'),
        'DB_USER': os.getenv('DB_USER'),
        'DB_PASSWORD': os.getenv('DB_PASSWORD'),
        'DB_HOST': os.getenv('DB_HOST'),
        'DB_PORT': os.getenv('DB_PORT')
    }

    drop_tables(db_credentials)
    print("Tables 'users' and 'orders' dropped successfully.")
