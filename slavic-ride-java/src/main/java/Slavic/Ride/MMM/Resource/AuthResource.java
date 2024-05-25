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

import java.util.Optional;
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
    public ResponseEntity<?> generate() {
        System.out.println("id has been generated");
        return ResponseEntity.ok(UUID.randomUUID().toString());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> user) {
        System.out.println(user.get("car"));
        if (!user.get("car").equals("")) {
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

    @PostMapping("/checkUserExists")
    public ResponseEntity<Map<String, Boolean>> checkUserExists(@RequestBody Map<String, String> user) {
        boolean exists = driverService.existsByEmailOrPhoneOrUsername(user.get("email"), user.get("phone"), user.get("username")) ||
                passengerService.existsByEmailOrPhoneOrUsername(user.get("email"), user.get("phone"), user.get("username"));
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String username) {
        System.out.println("username: " + username);

        Optional<Driver> driverOpt = driverService.findByUsername(username);
        Optional <Passenger> passengerOpt = passengerService.findByUsername(username);

        if (driverOpt.isPresent() || passengerOpt.isPresent()) {
            Optional <? extends User> opt = driverOpt.isPresent() ? driverOpt : passengerOpt;
            return ResponseEntity.ok(Map.of("success", true,
                                            "role", driverOpt.isPresent() ? "driver" : "passenger",
                                            "id", opt.get().getId(),
                                            "passwordFromBack", opt.get().getPassword()));
        } else {
            return ResponseEntity.ok(Map.of("success", false));
        }
    }
}