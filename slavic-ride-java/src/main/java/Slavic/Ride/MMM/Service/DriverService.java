package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.User.Driver;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

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

    public void updateDriverLocation(String driverId, Location newLocation) {
        log.info("Updating driver location for driver ID: {}", driverId);
        Driver driver = findDriverById(driverId);
        driver.setLocation(newLocation);
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

    public List<Driver> getAllDrivers() {
        log.info("Getting all drivers");
        return driverRepo.findAll();
    }

    public void updateDriverTaken(String driverId, boolean isTaken) {
        log.info("Updating driver taken status for driver ID: {}", driverId);
        Driver driver = findDriverById(driverId);
        driver.setIsTaken(isTaken);
        driverRepo.save(driver);
    }

    public Driver findClosestDriverByLocation(Location location) {
        log.info("Finding the closest driver to the location");
        List<Driver> drivers = driverRepo.findAllNotTaken();
        Driver closestDriver = null;
        double closestDistance = Double.MAX_VALUE;

        log.info("Size of drivers: {}", drivers.size());
        for (Driver driver : drivers) {
            double distance = Utils.calculateDistance(location, driver.getLocation());
            if (distance < closestDistance) {
                closestDriver = driver;
                closestDistance = distance;
            }
        }

        return closestDriver;
    }

    public void changeTakenToTrue(String driverId) {
        List<Driver> listDrives = driverRepo.findAll();
        Driver driver = driverRepo.findDriverById(driverId)
                        .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setIsTaken(true);
        driverRepo.save(driver);
    }

    public void changeTakenToFalse(String driverId) {
        Driver driver = driverRepo.findDriverById(driverId)
                        .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setIsTaken(false);
        log.info("Setting driver taken status to false for driver ID: {}", driverId);
        driverRepo.save(driver);
    }

    public void setOrderId(String driverId, String orderId) {
        log.info("Setting order ID for driver ID: {}", driverId);
        Driver driver = driverRepo.findDriverById(driverId)
                        .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setOrderId(orderId);
        driverRepo.save(driver);
    }

    public void deleteDriver(String id) {
        // TODO
    }
}
