package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.OrderService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Slavic.Ride.MMM.Service.Utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import static java.lang.System.exit;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerResource {
    private final PassengerService passengerService;
    private final Lock lock = new ReentrantLock();

    @PostMapping
    public ResponseEntity<Passenger> createPassenger(@RequestBody Passenger passenger) {
        Passenger createdPassenger = passengerService.createPassenger(passenger);
        return ResponseEntity.ok(createdPassenger);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Passenger> getPassenger(@PathVariable String id) {
        Passenger passenger = passengerService.getPassenger(id);
        return ResponseEntity.ok(passenger);
    }

    @GetMapping("/{id}/closestDriver")
    public ResponseEntity<Driver> findClosestDriver(@PathVariable String id) {
        Driver closestDriver = passengerService.findClosestDriver(id);
        return ResponseEntity.ok(closestDriver);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updatePassengerLocation(@PathVariable String id, @RequestBody Location newLocation) {
        passengerService.updatePassengerLocation(id, newLocation);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/order-taxi")
    public ResponseEntity<String> orderTaxi(@RequestBody Map<String, Map<String, Object>> requestBody) {
        Map<String, Object> source = requestBody.get("source");
        Map<String, Object> destination = requestBody.get("destination");

        Double sourcelat = (Double) source.get("lat");
        Double sourcelng = (Double) source.get("lng");

        Double destinationlat = (Double) destination.get("lat");
        Double destinationlng = (Double) destination.get("lng");

        String passengerId = (String) requestBody.get("id").get("id");

        try {
            lock.lock();
            return passengerService.assignDriverToPassenger(new Location(sourcelat, sourcelng), new Location(destinationlat, destinationlng), passengerId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Interrupted while assigning driver");
        } finally {
            lock.unlock();
        }
    }
}