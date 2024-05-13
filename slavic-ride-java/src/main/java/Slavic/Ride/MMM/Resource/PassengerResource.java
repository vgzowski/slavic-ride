package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.OrderService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Slavic.Ride.MMM.Service.Utils;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import static java.lang.System.exit;

@Slf4j
@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerResource {
    private final PassengerService passengerService;
    private final DriverService driverService;
    private final OrderService orderService;

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
    public ResponseEntity<String> orderTaxi(@RequestBody Map<String, Map<String, Double>> requestBody) {
        Map<String, Double> source = requestBody.get("source");
        Map<String, Double> destination = requestBody.get("destination");

        Double sourcelat = source.get("lat");
        Double sourcelng = source.get("lng");

        Double destinationlat = destination.get("lat");
        Double destinationlng = destination.get("lng");

        // Now you have the source and destination coordinates, you can process the request further

        // For example, you can return a confirmation message
        return ResponseEntity.ok(assignDriverToPassenger(
            new Location(sourcelat, sourcelng),
            new Location(destinationlat, destinationlng)
        ));
    }

    private String assignDriverToPassenger(Location location, Location destination) {
        return assignDriverToPassenger(location, destination, "7989a54c-b0de-4a2c-914e-ffaeac2e9415");
    }

    private String assignDriverToPassenger(Location location, Location destination, String passengerId) {
        log.info("Assigning driver to passenger");
        log.info("Location: {}", location);
        log.info("Destination: {}", destination);
        Driver closestDriver = driverService.findClosestDriverByLocation(location);
        if (closestDriver == null) {
            return "No drivers available";
        }

        log.info("Driver is found with ID: {}", closestDriver.getId());

        String driverId = closestDriver.getId();

        orderService.createOrder(location, destination, passengerId, driverId);
        return driverId;
    }
}