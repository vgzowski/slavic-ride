package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Order;
import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.Repo.PassengerRepo;
import Slavic.Ride.MMM.Resource.NotificationResource;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.DistanceResult;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;

import Slavic.Ride.MMM.Service.Utils;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class PassengerService {
    private final PassengerRepo passengerRepo;
    private final DriverService driverService;
    private final OrderService orderService;
    private final NotificationResource notificationResource;

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
//        log.info("Updating passenger location for passenger ID: {}", driverId);
        Passenger passenger = getPassenger(driverId);
        passenger.setLocation(newLocation);
        passengerRepo.save(passenger);
    }

    public Driver findClosestDriver(String id) {
//        log.info("Finding the closest driver to the passenger");
        Passenger passenger = passengerRepo.findPassengerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        return driverService.findClosestDriverByLocation(passenger.getLocation());
    }

    public void setOrderId(String passengerId, String orderId) {
//        log.info("Setting order ID for passenger ID: {}", passengerId);
        Passenger passenger = getPassenger(passengerId);
        passenger.setOrderId(orderId);
        passengerRepo.save(passenger);
    }

    public boolean existsByEmailOrPhoneOrUsername(String email, String phone, String username) {
        return passengerRepo.existsByEmail(email) || passengerRepo.existsByPhone(phone) || passengerRepo.existsByUsername(username);
    }

    public Optional<Passenger> findByUsername(String username) {
//        log.info("Finding passenger by username: {}", username);
        return passengerRepo.findByUsername(username);
    }

    public boolean addActive (String username) {
        Passenger passenger = passengerRepo.findByUsername(username).orElse(null);
        if (passenger != null) {
            passenger.setActiveSessions(passenger.getActiveSessions() + 1);
            passengerRepo.save(passenger);
            return true;
        }
        return false;
    }

    public void setPassengerLocation(String id, Location newLocation) {
        Passenger passenger = getPassenger(id);
        passenger.setLocation(newLocation);
        passengerRepo.save(passenger);
    }

    public Location getPassengerLocation(String id) {
        Passenger passenger = getPassenger(id);
        return passenger.getLocation();
    }

    public void savePassenger(Passenger passenger) {
        passengerRepo.save(passenger);
    }

    public ResponseEntity<Driver> assignDriverToPassenger(Location pickUpPoint, Location dropOffPoint,
                                                          String passengerId, String rideType) throws InterruptedException {
        log.info("Assigning driver to passenger");

        List<Driver> driversList = driverService.getAllDrivers(rideType);

        final String API_KEY = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";

        driversList.sort(
            Comparator.comparingLong(
                driver -> {
                    try {
                        DistanceResult curDistance = Utils.getDistanceAndDuration(pickUpPoint, driver.getLocation(), API_KEY);
                        String distance = curDistance.distance;
                        if (distance.endsWith(" meters")) {
                            return Integer.parseInt(distance.split(" ")[0]);
                        }
                        else if (distance.endsWith(" kilometers")) {
                            double km = Double.parseDouble(distance.split(" ")[0]);
                            return (int)(km * 1000);
                        }
                        else {
                            throw new IllegalArgumentException("Unknown distance format: " + distance);
                        }
                    } catch (Exception e) {
                        return 0;
                    }
                }
            )
        );

        for (Driver driver : driversList) {
            try {
                DistanceResult distance = Utils.getDistanceAndDuration(pickUpPoint, driver.getLocation(), API_KEY);
                log.warn("Driver is {} {}", driver.getId(), distance.distance);
            } catch (Exception e) {
                log.warn("Could not fetch for {}", driver.getId());
            }
        }

        int sizeDrivers = driversList.size();
        int available = sizeDrivers;

        boolean[] haveAlreadySent = new boolean[sizeDrivers];
        for (int i = 0; i < sizeDrivers; ++i) {
            haveAlreadySent[i] = false;
        }

        int ptr = 0;
        while (true) {
            if (available == 0) {
                return ResponseEntity.ok(null);
            }

            if (ptr == driversList.size()) {
                ptr = 0;
            }

            if (haveAlreadySent[ptr]) {
                ++ptr;
                continue;
            }

            Driver chosenDriver = driversList.get(ptr);

            String driverId = chosenDriver.getId();

            synchronized (driverId.intern()) {
                // Check if the driver is still available
                if (!driverService.isDriverAvailable(driverId)) {
                    ptr++;
                    continue;
                }
            }

            // Mark the driver as taken and deciding
            driverService.setDriverStatus(driverId, false);

            haveAlreadySent[ptr] = true;
            --available;

            boolean driverAccepted = notificationResource.requestDriverConfirmation(driverId, pickUpPoint, dropOffPoint);

            if (driverAccepted) {
                log.info("Driver with ID: {} accepted the ride", driverId);

                // Creating order
                Order order = orderService.createOrder(pickUpPoint, dropOffPoint, passengerId, driverId);
                driverService.setOrderId(driverId, order.getOrderId());
                setOrderId(passengerId, order.getOrderId());

                notificationResource.notifyDriverOfRoute(driverId, pickUpPoint, dropOffPoint, order.getOrderId());
                return ResponseEntity.ok(chosenDriver);
            } else {
                driverService.setDriverStatus(driverId, true);
                log.info("Driver with ID: {} rejected the ride", driverId);
                ptr++;
            }

        }
    }
}
