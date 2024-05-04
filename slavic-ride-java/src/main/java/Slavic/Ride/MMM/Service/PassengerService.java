package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.Repo.PassengerRepo;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class PassengerService {
    private final PassengerRepo passengerRepo;
    private final DriverRepo driverRepo;

    public Driver findClosestDriver(String id) {
        log.info("Finding the closest driver to the passenger");

        Passenger passenger = passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        List<Driver> drivers = driverRepo.findAll();
        Driver closestDriver = null;
        double closestDistance = Double.MAX_VALUE;

        /*
        TODO here
        for (Driver driver : drivers) {
            double distance = calculateDistance(passenger.getLocation(), driver.getLocation());
            if (distance < closestDistance) {
                closestDriver = driver;
                closestDistance = distance;
            }
        }*/

        return closestDriver;
    }

    /*private double calculateDistance(Location location1, Location location2) {
      TODO here
    }*/
}
