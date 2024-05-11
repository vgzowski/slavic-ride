package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerResource {
    private final PassengerService passengerService;
    private final DriverService driverService;

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

        Double sourceLatitude = source.get("latitude");
        Double sourceLongitude = source.get("longitude");

        Double destinationLatitude = destination.get("latitude");
        Double destinationLongitude = destination.get("longitude");

        // Now you have the source and destination coordinates, you can process the request further

        // For example, you can return a confirmation message
        return ResponseEntity.ok(assignDriverToPassenger(
            new Location(sourceLatitude, sourceLongitude),
            new Location(destinationLatitude, destinationLongitude)
        ));

    }

    private String assignDriverToPassenger(Location location, Location destination) {
        Driver closestDriver = driverService.findClosestDriverByLocation(location);

        String driverId = closestDriver.getId();

        driverService.changeTakenToTrue(driverId);

        return driverId;
    }


}