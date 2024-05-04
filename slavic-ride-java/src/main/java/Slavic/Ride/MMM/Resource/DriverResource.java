package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updateDriverLocation(@PathVariable String id, @RequestBody Location newLocation) {
        driverService.updateDriverLocation(id, newLocation);
        return ResponseEntity.ok().build();
    }
}