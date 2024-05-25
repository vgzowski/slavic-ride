package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import Slavic.Ride.MMM.User.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthResource {
    private final DriverService driverService;
    private final PassengerService passengerService;

    @GetMapping("/generateId")
    public ResponseEntity <?> generate () {
        System.out.println("id has been generated");
        return ResponseEntity.ok(UUID.randomUUID().toString());
    }

    @PostMapping("/signup")
    public ResponseEntity <?> signup (@RequestBody Map<String, Object> user) {
        System.out.println(user.get("car"));
        if (user.get("car") != "") {
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
            Passenger passenger = passengerService.createPassenger(new Passenger(
                    (String) user.get("name"),
                    (String) user.get("email"),
                    (String) user.get("phone"),
                    (String) user.get("id")
            ));
            passenger.setUsername((String) user.get("username"));
            passenger.setPassword((String) user.get("password"));
            return ResponseEntity.ok(passengerService.createPassenger(passenger));
        }
    }
}
