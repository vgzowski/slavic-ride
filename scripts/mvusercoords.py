import sys
import subprocess
import psycopg2
import json
from dotenv import load_dotenv
import os

def get_user_location(username, db_credentials):
    result = subprocess.run(
        ["python3", "user.py", username],
        capture_output=True,
        text=True
    )

    try:
        output = json.loads(result.stdout.strip())
        if "error" in output:
            return None
        return output
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON output: {e}")
        return None

def move_user_to_coordinates(username, dest_lat, dest_lng, steps, delay, db_credentials):
    user_location = get_user_location(username, db_credentials)

    if not user_location:
        print(f"User '{username}' not found.")
        sys.exit(1)

    origin = f"{user_location['lat']},{user_location['lng']}"
    destination = f"{dest_lat},{dest_lng}"
    user_id=f"{user_location['id']}"

    subprocess.run([
        "python3", "mover.py", origin, destination, user_id, str(steps), str(delay)
    ])

if __name__ == "__main__":
    load_dotenv()

    if len(sys.argv) != 6:
        print("Usage: python move_user_to_coordinates.py <username> <dest_lat> <dest_lng> <steps> <delay>")
        sys.exit(1)

    username = sys.argv[1]
    dest_lat = sys.argv[2]
    dest_lng = sys.argv[3]
    steps = int(sys.argv[4])
    delay = int(sys.argv[5])

    db_credentials = {
        'DB_NAME': os.getenv('DB_NAME'),
        'DB_USER': os.getenv('DB_USER'),
        'DB_PASSWORD': os.getenv('DB_PASSWORD'),
        'DB_HOST': os.getenv('DB_HOST'),
        'DB_PORT': os.getenv('DB_PORT')
    }

    move_user_to_coordinates(username, dest_lat, dest_lng, steps, delay, db_credentials)
