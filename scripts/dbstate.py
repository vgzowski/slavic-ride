import psycopg2
import json

def fetch_all_users(db_credentials):
    conn = psycopg2.connect(
        dbname=db_credentials['DB_NAME'],
        user=db_credentials['DB_USER'],
        password=db_credentials['DB_PASSWORD'],
        host=db_credentials['DB_HOST'],
        port=db_credentials['DB_PORT']
    )
    cursor = conn.cursor()
    cursor.execute("SELECT username, lat, lng FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

def write_to_file(users, file_path):
    with open(file_path, 'w') as f:
        for user in users:
            data = {
                'username': user[0],
                'lat': str(user[1]),  # Convert to string for JSON serialization
                'lng': str(user[2])   # Convert to string for JSON serialization
            }
            f.write(json.dumps(data) + '\n')

if __name__ == "__main__":
    db_credentials = {
        'DB_NAME': 'slavic_ride',
        'DB_USER': 'postgres',
        'DB_PASSWORD': 'abcd1234',
        'DB_HOST': 'localhost',  # Replace with your actual database host
        'DB_PORT': '5432'        # Default PostgreSQL port
    }

    users = fetch_all_users(db_credentials)
    file_path = 'user_data.txt'
    write_to_file(users, file_path)
    print(f"User data written to {file_path}")
