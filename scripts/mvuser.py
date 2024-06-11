import sys
import subprocess
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

def move_user(u1, u2, steps, delay, db_credentials):
    u1_location = get_user_location(u1, db_credentials)
    u2_location = get_user_location(u2, db_credentials)

    if not u1_location or not u2_location:
        print(f"One of the users '{u1}' or '{u2}' not found.")
        sys.exit(1)

    origin = f"{u1_location['lat']},{u1_location['lng']}"
    destination = f"{u2_location['lat']},{u2_location['lng']}"
    user_id = u1_location['id']

    subprocess.run([
        "python3", "mover.py", origin, destination, user_id, str(steps), str(delay)
    ])

if __name__ == "__main__":
    load_dotenv()

    if len(sys.argv) != 5:
        print("Usage: python move_user.py <username1> <username2> <steps> <delay>")
        sys.exit(1)

    u1 = sys.argv[1]
    u2 = sys.argv[2]
    steps = int(sys.argv[3])
    delay = int(sys.argv[4])

    db_credentials = {
        'DB_NAME': os.getenv('DB_NAME'),
        'DB_USER': os.getenv('DB_USER'),
        'DB_PASSWORD': os.getenv('DB_PASSWORD'),
        'DB_HOST': os.getenv('DB_HOST'),
        'DB_PORT': os.getenv('DB_PORT')
    }

    move_user(u1, u2, steps, delay, db_credentials)
