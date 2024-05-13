package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.Repo.PassengerRepo;
import Slavic.Ride.MMM.Service.DriverService;
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
    private final DriverService driverService;

    public Passenger createPassenger(Passenger passenger) {
        log.info("Creating passenger: {}", passenger);
        return passengerRepo.save(passenger);
    }

    public Passenger getPassenger(String id) {
        log.info("Getting passenger by ID: {}", id);
        return passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));
    }

    public void updatePassengerLocation(String driverId, Location newLocation) {
        log.info("Updating passenger location for passenger ID: {}", driverId);
        Passenger passenger = getPassenger(driverId);
        passenger.setLocation(newLocation);
        passengerRepo.save(passenger);
    }

    public Driver findClosestDriver(String id) {
        log.info("Finding the closest driver to the passenger");
        Passenger passenger = passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        return driverService.findClosestDriverByLocation(passenger.getLocation());
    }

    public void setOrderId(String passengerId, String orderId) {
        log.info("Setting order ID for passenger ID: {}", passengerId);
        Passenger passenger = getPassenger(passengerId);
        passenger.setOrderId(orderId);
        passengerRepo.save(passenger);
    }
}
