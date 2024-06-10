import psycopg2
import json

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
    db_credentials = {
        'DB_NAME': 'slavic_ride',
        'DB_USER': 'postgres',
        'DB_PASSWORD': 'abcd1234',
        'DB_HOST': 'localhost',  # Replace with your actual database host
        'DB_PORT': '5432'        # Default PostgreSQL port
    }

    file_path = 'user_data.txt'
    users = read_from_file(file_path)
    update_users_in_db(users, db_credentials)
    print(f"User data updated in the database from {file_path}")
