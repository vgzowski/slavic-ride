import sys
import time
import psycopg2
from decimal import Decimal

def update_location(origin, destination, user_id, steps, delay, db_credentials):
    # Parse the origin and destination coordinates
    origin_lat, origin_lng = map(Decimal, origin.split(','))
    destination_lat, destination_lng = map(Decimal, destination.split(','))

    # Calculate the step increments
    lat_increment = (destination_lat - origin_lat) / Decimal(steps)
    lng_increment = (destination_lng - origin_lng) / Decimal(steps)

    current_lat = origin_lat
    current_lng = origin_lng

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        dbname=db_credentials['DB_NAME'],
        user=db_credentials['DB_USER'],
        password=db_credentials['DB_PASSWORD'],
        host=db_credentials['DB_HOST'],
        port=db_credentials['DB_PORT']
    )
    cursor = conn.cursor()

    for i in range(steps + 1):
        # Update the user's location in the database
        cursor.execute(
            "UPDATE users SET lat=%s, lng=%s WHERE id=%s",
            (current_lat, current_lng, user_id)
        )
        conn.commit()

        # Increment the current latitude and longitude
        current_lat += lat_increment
        current_lng += lng_increment

        # Sleep for the specified delay (convert milliseconds to seconds)
        time.sleep(delay / 1000.0)

    cursor.close()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Usage: python update_location.py <origin_lat,origin_lng> <dest_lat,dest_lng> <id> <steps> <delay>")
        sys.exit(1)

    origin = sys.argv[1]
    destination = sys.argv[2]
    user_id = sys.argv[3]
    steps = int(sys.argv[4])
    delay = int(sys.argv[5])

    db_credentials = {
        'DB_NAME': 'slavic_ride',
        'DB_USER': 'postgres',
        'DB_PASSWORD': 'abcd1234',
        'DB_HOST': 'localhost',  # Replace with your actual database host
        'DB_PORT': '5432'       # Default PostgreSQL port
    }

    update_location(origin, destination, user_id, steps, delay, db_credentials)
