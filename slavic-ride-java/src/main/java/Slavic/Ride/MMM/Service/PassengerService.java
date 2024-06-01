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

import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class PassengerService {
    private final PassengerRepo passengerRepo;
    private final DriverService driverService;
    private final OrderService orderService;
    private final NotificationResource notificationResource;
    private final Lock lock = new ReentrantLock();

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

    public boolean existsByEmailOrPhoneOrUsername(String email, String phone, String username) {
        return passengerRepo.existsByEmail(email) || passengerRepo.existsByPhone(phone) || passengerRepo.existsByUsername(username);
    }

    public Optional<Passenger> findByUsername(String username) {
        log.info("Finding passenger by username: {}", username);
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

    public void savePassenger(Passenger passenger) {
        passengerRepo.save(passenger);
    }

    public ResponseEntity<String> assignDriverToPassenger(Location location, Location destination, String passengerId) throws InterruptedException {
        log.info("Assigning driver to passenger");

        try {
            lock.lock();
            List<Driver> driversList = driverService.getAllNotTakenDrivers();
            log.info("Free Drivers list: {}", driversList);
            int ptr = 0;
            while (true) {
                if (ptr == driversList.size()) {
                    return ResponseEntity.ok("No drivers available");
                }

                Driver chosenDriver = driversList.get(ptr);
                if (chosenDriver == null) {
                    return ResponseEntity.ok("No drivers available");
                }

                log.info("Driver is found with ID: {}", chosenDriver.getId());
                String driverId = chosenDriver.getId();
                boolean driverAccepted = false;

                // Check if the driver is still available and not deciding
                if (driverService.getIsTaken(driverId) || driverService.getIsDeciding(driverId)) {
                    ptr++;
                    continue;
                }

                // Mark the driver as deciding
                driverService.setIsDeciding(driverId, true);

                driverAccepted = notificationResource.requestDriverConfirmation(driverId, location, destination);

                driverService.setIsDeciding(driverId, false);

                if (driverAccepted) {
                    log.info("Driver with ID: {} accepted the ride", driverId);

                    //Creating order
                    {
                        Order order = orderService.createOrder(location, destination, passengerId, driverId);
                        driverService.setIsTaken(driverId, true);
                        driverService.setOrderId(driverId, order.getOrderId());
                        setOrderId(passengerId, order.getOrderId());
                    }

                    notificationResource.notifyDriverOfRoute(driverId, location, destination);
                    return ResponseEntity.ok(driverId);
                } else {
                    log.info("Driver with ID: {} rejected the ride", driverId);
                    ptr++;
                }
            }
        } finally {
            lock.unlock();
        }
    }
}
