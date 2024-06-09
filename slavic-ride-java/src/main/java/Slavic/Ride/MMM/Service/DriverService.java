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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepo driverRepo;
    private ConcurrentMap<String, Boolean> driverStatus = new ConcurrentHashMap<>();

    public boolean isDriverAvailable(String driverId) {
        return driverStatus.getOrDefault(driverId, true);
    }

    public void setDriverStatus(String driverId, boolean isTaken) {
        driverStatus.put(driverId, isTaken);
    }

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
//        log.info("Getting all drivers");
        return driverRepo.findAll();
    }

    public List<Driver> getAllDrivers(String rideType) {
        return driverRepo.findAllWithType(rideType);
    }

    public Driver findClosestDriverByLocation(Location location) {
//        log.info("Finding the closest driver to the location");
        List<Driver> drivers = driverRepo.findAll();
        Driver closestDriver = null;
        double closestDistance = Double.MAX_VALUE;

        for (Driver driver : drivers) {
            double distance = Utils.calculateDistance(location, driver.getLocation());
            if (distance < closestDistance) {
                closestDriver = driver;
                closestDistance = distance;
            }
        }

        return closestDriver;
    }


    public void setOrderId(String driverId, String orderId) {
//        log.info("Setting order ID for driver ID: {}", driverId);
        Driver driver = driverRepo.findDriverById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setOrderId(orderId);
        driverRepo.save(driver);
    }

    public boolean existsByEmailOrPhoneOrUsername(String email, String phone, String username) {
        return driverRepo.existsByEmail(email) || driverRepo.existsByPhone(phone) || driverRepo.existsByUsername(username);
    }

    public Optional<Driver> findByUsername(String username) {
//        log.info("Finding driver by username: {}", username);
        return driverRepo.findByUsername(username);
    }

    public boolean addActive (String username) {
        Driver driver = driverRepo.findByUsername(username).orElse(null);
        if (driver != null) {
//            driver.setActiveSessions(driver.getActiveSessions() + 1);
            driverRepo.save(driver);
            return true;
        }
        return false;
    }

    public void saveDriver(Driver driver) {
        driverRepo.save(driver);
    }

    public void updActiveSessions(String driverId, int activeSessions) {
        Driver driver = driverRepo.findDriverById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setActiveSessions(driver.getActiveSessions() + activeSessions);
        driverRepo.save(driver);
    }

    public void deleteDriver(String id) {
        // TODO
    }
}
