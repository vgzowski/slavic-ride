#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 6 ]; then
    echo "Usage: $0 <Driver/Passenger> <origin_lat,origin_lng> <dest_lat,dest_lng> <id> <steps> <delay>"
    exit 1
fi

# Parse the arguments
dtype=$1
origin_lat=$(echo $2 | cut -d',' -f1)
origin_lng=$(echo $2 | cut -d',' -f2)
dest_lat=$(echo $3 | cut -d',' -f1)
dest_lng=$(echo $3 | cut -d',' -f2)
id=$4
steps=$5
delay=$6

# Database credentials
DB_NAME="slavic_ride"
DB_USER="postgres"
DB_PASSWORD="abcd1234"
DB_HOST="localhost"
DB_PORT="5432"

# Calculate the step increments
lat_increment=$(echo "($dest_lat - $origin_lat) / $steps" | bc -l)
lng_increment=$(echo "($dest_lng - $origin_lng) / $steps" | bc -l)

current_lat=$origin_lat
current_lng=$origin_lng

# Loop to update the location
for (( i=0; i<=steps; i++ ))
do
    
    # Increment the current latitude and longitude
    current_lat=$(echo "$current_lat + $lat_increment" | bc -l)
    current_lng=$(echo "$current_lng + $lng_increment" | bc -l)

    # Update the user's location in the database
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h $DB_HOST -p $DB_PORT -c "UPDATE users SET lat=$current_lat, lng=$current_lng WHERE id='$id' AND dtype='$dtype';"

    # Sleep for the specified delay
    sleep $(echo "$delay / 1000" | bc -l)
done
