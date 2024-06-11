import psycopg2
import json
from dotenv import load_dotenv
import os


def read_from_file(file_path):
    users = []
    with open(file_path, 'r') as f:
        for line in f:
            user = json.loads(line.strip())
            user['lat'] = float(user['lat'])  # Convert back to float
            user['lng'] = float(user['lng'])  # Convert back to float
            users.append(user)
    return users

def update_users_in_db(users, db_credentials):
    conn = psycopg2.connect(
        dbname=db_credentials['DB_NAME'],
        user=db_credentials['DB_USER'],
        password=db_credentials['DB_PASSWORD'],
        host=db_credentials['DB_HOST'],
        port=db_credentials['DB_PORT']
    )
    cursor = conn.cursor()
    for user in users:
        cursor.execute(
            "UPDATE users SET lat=%s, lng=%s WHERE username=%s",
            (user['lat'], user['lng'], user['username'])
        )
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

    file_path = 'user_data.txt'
    users = read_from_file(file_path)
    update_users_in_db(users, db_credentials)
    print(f"User data updated in the database from {file_path}")
