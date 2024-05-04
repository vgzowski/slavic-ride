package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepo driverRepo;

    // Method to retrieve a driver by their ID
    public Driver findDriverById(String id) {
        log.info("Finding driver by ID: {}", id);
        return driverRepo.findDriverById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    // Method to update a driver's location
    public void updateDriverLocation(String driverId, Location newLocation) {
        log.info("Updating driver location for driver ID: {}", driverId);
        Driver driver = findDriverById(driverId);
        driver.setLocation(newLocation);
        // Save the updated driver entity
        driverRepo.save(driver);
    }

    public Driver createDriver(Driver driver) {
        log.info("Creating passenger: {}", driver);
        return driverRepo.save(driver);
    }

    public Driver getDriver(String id) {
        log.info("Getting driver by ID: {}", id);
        return driverRepo.findDriverById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    public void deleteDriver(String id) {
        // TODO
    }



}
