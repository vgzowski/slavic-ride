package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.*;

import java.util.List;
import java.util.Map;

import static java.lang.System.exit;

@Slf4j
@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
public class DriverResource {
    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        Driver createdDriver = driverService.createDriver(driver);
        return ResponseEntity.ok(createdDriver);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable String id) {
        Driver driver = driverService.getDriver(id);
        return ResponseEntity.ok(driver);
    }

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updateDriverLocation(@RequestBody Map<String, Map <String, Object>> requestBody) {
        log.info("Location: {}", requestBody.get("location"));
        String id = requestBody.containsKey("id") ? (String) requestBody.get("id").get("id") : null;
        log.info("Driver Id: {}", id);
        driverService.updateDriverLocation(id, new Location((Double) requestBody.get("location").get("latitude"),
                                                            (Double) requestBody.get("location").get("longitude")));
        return ResponseEntity.ok().build();
    }
}