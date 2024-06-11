import sys
import psycopg2
import json
from dotenv import load_dotenv
import os

def get_user_location(username, db_credentials):
    conn = psycopg2.connect(
        dbname=db_credentials['DB_NAME'],
        user=db_credentials['DB_USER'],
        password=db_credentials['DB_PASSWORD'],
        host=db_credentials['DB_HOST'],
        port=db_credentials['DB_PORT']
    )
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, lat, lng FROM users WHERE username=%s",
        (username,)
    )

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result:
        return {
            "id": result[0],
            "lat": result[1],
            "lng": result[2]
        }
    else:
        return None

if __name__ == "__main__":
    load_dotenv()

    if len(sys.argv) != 2:
        print("Usage: python user.py <username>")
        sys.exit(1)

    username = sys.argv[1]

    db_credentials = {
        'DB_NAME': os.getenv('DB_NAME'),
        'DB_USER': os.getenv('DB_USER'),
        'DB_PASSWORD': os.getenv('DB_PASSWORD'),
        'DB_HOST': os.getenv('DB_HOST'),
        'DB_PORT': os.getenv('DB_PORT')
    }

    location = get_user_location(username, db_credentials)
    if location:
        print(json.dumps(location))
    else:
        print(json.dumps({"error": "User not found"}))
