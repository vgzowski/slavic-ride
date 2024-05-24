package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthResource {
    private DriverService driverService;
    private PassengerService passengerService;

    @GetMapping("/generateId")
    public ResponseEntity <?> generate () {
        return ResponseEntity.ok("id has been generated");
    }

    @PostMapping("/signup")
    public ResponseEntity <?> signup (@RequestBody Map<String, Object> user) {
        System.out.println(user);
        if (user.get("car") != null) {
            Driver driver = driverService.createDriver(new Driver(
                    (String) user.get("name"),
                    (String) user.get("email"),
                    (String) user.get("phone"),
                    (String) user.get("id"),
                    (String) user.get("car")
            ));
            driver.setUsername((String) user.get("username"));
            driver.setPassword((String) user.get("password"));

            return ResponseEntity.ok(driverService.createDriver(driver));
        } else {
            return ResponseEntity.ok(passengerService.createPassenger((Passenger) user));
        }
    }
}
