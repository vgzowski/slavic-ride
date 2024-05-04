package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.Repo.PassengerRepo;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import Slavic.Ride.MMM.Location;

import java.util.*;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class PassengerService {
    private final PassengerRepo passengerRepo;
    private final DriverRepo driverRepo;

    public Passenger createPassenger(Passenger passenger) {
        log.info("Creating passenger: {}", passenger);
        return passengerRepo.save(passenger);
    }

    public Passenger getPassenger(String id) {
        log.info("Getting passenger by ID: {}", id);
        return passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));
    }

    public Driver findClosestDriver(String id) {
        log.info("Finding the closest driver to the passenger");

        Passenger passenger = passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        List<Driver> drivers = driverRepo.findAll();
        Driver closestDriver = null;
        double closestDistance = Double.MAX_VALUE;

        for (Driver driver : drivers) {
            double distance = calculateDistance(passenger.getLocation(), driver.getLocation());
            if (distance < closestDistance) {
                closestDriver = driver;
                closestDistance = distance;
            }
        }

        return closestDriver;
    }

    private static double rEarth = 6371;

    private static double calculateDistance(Location location1, Location location2) {
        double latDistance = Math.toRadians(location2.getLatitude() - location1.getLatitude());
        double lonDistance = Math.toRadians(location2.getLongitude() - location1.getLongitude());
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(location1.getLatitude())) * Math.cos(Math.toRadians(location2.getLatitude()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = rEarth * c;
        return distance;
    }
}
