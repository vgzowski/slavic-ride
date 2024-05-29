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
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static java.lang.System.exit;

@Slf4j
@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerResource {
    private final PassengerService passengerService;
    private final DriverService driverService;
    private final OrderService orderService;
    private final NotificationResource notificationResource;

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
    public DeferredResult<ResponseEntity<String>> orderTaxi(@RequestBody Map<String, Map<String, Object>> requestBody) {
        DeferredResult<ResponseEntity<String>> output = new DeferredResult<>();
        Map<String, Object> source = requestBody.get("source");
        Map<String, Object> destination = requestBody.get("destination");
        Double sourcelat = (Double) source.get("lat");
        Double sourcelng = (Double) source.get("lng");
        Double destinationlat = (Double) destination.get("lat");
        Double destinationlng = (Double) destination.get("lng");
        String id = (String) requestBody.get("id").get("id");
        assignDriverToPassenger(new Location(sourcelat, sourcelng), new Location(destinationlat, destinationlng), id, output);
        return output;
    }

    //TODO: Add lock() and unlock methods to prevent from assigning the same driver to multiple passengers!!!
    private void assignDriverToPassenger(Location location, Location destination, String passengerId, DeferredResult<ResponseEntity<String>> output) {
        log.info("Assigning driver to passenger");
        CompletableFuture.runAsync(() -> {
            List<Driver> dirversList = driverService.getAllNotTakenDrivers();
            int ptr = 0;
            while (true) {

                if (ptr == dirversList.size()) {
                    ptr = 0;
                }

                Driver chosenDriver = dirversList.get(ptr);

                if (chosenDriver == null) {
                    output.setResult(ResponseEntity.ok("No drivers available"));
                    return;
                }

                log.info("Driver is found with ID: {}", chosenDriver.getId());

                String driverId = chosenDriver.getId();

                boolean driverAccepted = notificationResource.requestDriverConfirmation(driverId, location, destination);

                if (driverAccepted) {
                    log.info("Driver with ID: {} accepted the ride", driverId);
                    orderService.createOrder(location, destination, passengerId, driverId);
                    notificationResource.notifyDriver(driverId,
                            "{" +
                                    "\"name\":\"New order\"," +
                                    "\"location_lat\":\"" + location.getLat() + "\"," +
                                    "\"location_lng\":\"" + location.getLng() + "\"," +
                                    "\"destination_lat\":\"" + destination.getLat() + "\"," +
                                    "\"destination_lng\":\"" + destination.getLng() + "\"" +
                                    "}");
                    output.setResult(ResponseEntity.ok(driverId));
                    return;
                } else {
                    log.info("Driver with ID: {} rejected the ride", driverId);
                    ptr++;
                }
            }
        });
    }
}