# slavic-ride
OOP Project - UBER-like app

## Setup
1. `pip install python-dotenv bc psycopg2`
2. `npm install` in folder `slavic-ride-frontend/slavic-ride/src`
3. fill .env and properties files in `scripts`, `slavic-ride-java/src/main/resources` and `slavic-ride-frontend` with your credentials

`scripts` .env format:
DB_NAME=slavic_ride
DB_USER=your_name
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

`slavic-ride-java/src/main/resources` .env format:
DB_USERNAME=your_name
DB_PASSWORD=your_password

`slavic-ride-java/src/main/resources` application.properties format:
spring.application.name=MMM

spring.datasource.url=jdbc:postgresql://localhost:5432/slavic_ride
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

logging.level.org.hibernate.SQL=ERROR
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=ERROR
spring.jpa.show-sql=false

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
#spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
# logging.level.root=WARN

## How to run the project
1. Run drop script `python3 drop.py`.
2. Run Spring boot: `mvn spring-boot:run` in folder `slavic-ride-java`.
3. Run init SQL script `psql -d slavic_ride init.sql`.
4. Run reset script `python3 dbreset.py`.
5. Run front-end part `npm start` in folder `slavic-ride-frontend/slavic-ride/src`.
6. Open browser and go to `http://localhost:3000/` and enjoy our application (if you want to register you will get an error because we write a demonstrative version with 'fake' coords. We used Google Maps and React JS API that provide us getting user location and sometimes it doesn't work so accurately as we want. For archiving the best result we need to retrieve information about Wi-Fi and GPS stations in city and country (it isn't possible for us at that moment). 
7. If you want to see how users and drivers move on the map you can run `python3 mvusercoords.py <username> <dest_lat> <dest_lng> <steps> <delay>`. (run to see what you need to write). It will move user to destination coords with certain number of steps and delay.
8. `python3 mvuser.py <username1> <username2> <steps> <delay>` will move first user to second in certain number of steps and delay.

## List of users and drivers you can can login
- `passengerNUMBER` where NUMBER is from 1 to 5 or `driverNUMBER` where NUMBER is from 1 to 3
- Password for all users is `1`
