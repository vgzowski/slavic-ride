package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.User.Driver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepo driverRepo;

    public Driver findDriverById(String id) {
//        log.info("Finding driver by ID: {}", id);
        return driverRepo.findDriverById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    public void updateDriverLocation(String driverId, Location newLocation) {
//        log.info("Updating driver location for driver ID: {}", driverId);
        Driver driver = findDriverById(driverId);
        driver.setLocation(newLocation);
        driverRepo.save(driver);
    }

    public Driver createDriver(Driver driver) {
        log.info("Creating driver: {}", driver);
        var x = driverRepo.save(driver);
        log.info("Driver created: {}", x.getId());
        return x;
    }

    public Driver getDriver(String id) {
//        log.info("Getting driver by ID: {}", id);
        return driverRepo.findDriverById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    public List<Driver> getAllDrivers() {
        log.info("Getting all drivers");
        return driverRepo.findAll();
    }

    public List<Driver> getAllNotTakenDrivers() {
        log.info("Getting all drivers");
        return driverRepo.findAllNotTaken();
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

//        log.info("Size of drivers: {}", drivers.size());
        for (Driver driver : drivers) {
//            System.out.println(driver);
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

    public boolean existsByEmailOrPhoneOrUsername(String email, String phone, String username) {
        return driverRepo.existsByEmail(email) || driverRepo.existsByPhone(phone) || driverRepo.existsByUsername(username);
    }

    public Optional<Driver> findByUsername(String username) {
        log.info("Finding driver by username: {}", username);
        return driverRepo.findByUsername(username);
    }

    public boolean addActive (String username) {
        Driver driver = driverRepo.findByUsername(username).orElse(null);
        if (driver != null) {
            driver.setActiveSessions(driver.getActiveSessions() + 1);
            driverRepo.save(driver);
            return true;
        }
        return false;
    }

    public void saveDriver(Driver driver) {
        driverRepo.save(driver);
    }

    public void deleteDriver(String id) {
        // TODO
    }
}
