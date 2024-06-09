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

import static java.lang.System.exit;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthResource {
    private final DriverService driverService;
    private final PassengerService passengerService;

    // Currently useless method
    /*@GetMapping("/generateId")
    public ResponseEntity<?> generate() {
        String newId = UUID.randomUUID().toString();
        log.info("Generating id " + newId);
        return ResponseEntity.ok(newId);
    }*/

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> user) {
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
        Optional <Driver> driverOpt = driverService.findByUsername(username);
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

    @PutMapping("/activate")
    public ResponseEntity <Map <String, Object>> activator (@RequestBody Map <String, Object> body) {
        log.info("Activating user with id " + body.get("id"));
        String username = body.get("username").toString();
        Optional <Driver> driverOpt = driverService.findByUsername(username);
        Optional <Passenger> passengerOpt = passengerService.findByUsername(username);
        if (driverOpt.isPresent()) {
            if (driverService.addActive(username)) {
                return ResponseEntity.ok(Map.of("success", true,
                                                "numberOfSessions", driverOpt.get().getActiveSessions()));
            }
            else {
                return ResponseEntity.ok(Map.of("success", false));
            }
        }
        else if (passengerOpt.isPresent()) {
            if (passengerService.addActive(username)) {
                return ResponseEntity.ok(Map.of("success", true,
                                                "numberOfSessions", passengerOpt.get().getActiveSessions()));
            }
            else {
                return ResponseEntity.ok(Map.of("success", false));
            }
        }
        else {
            return ResponseEntity.ok(Map.of("success", false));
        }
    }

    @PutMapping("/deactivate")
    public ResponseEntity <Map <String, Object>> deactivator (@RequestBody Map <String, Object> body) {
        log.info("Deactivating user with id " + body.get("id"));
        String username = body.get("username").toString();
        Optional <Driver> driverOpt = driverService.findByUsername(username);
        Optional <Passenger> passengerOpt = passengerService.findByUsername(username);
        if (driverOpt.isPresent()) {
            if (driverOpt.get().getActiveSessions() > 0) {
//                driverOpt.get().setActiveSessions(driverOpt.get().getActiveSessions() - 1);
                driverService.saveDriver(driverOpt.get());
                return ResponseEntity.ok(Map.of("success", true,
                                                "numberOfSessions", driverOpt.get().getActiveSessions()));
            }
            else {
                return ResponseEntity.ok(Map.of("success", false));
            }
        }
        else if (passengerOpt.isPresent()) {
            if (passengerOpt.get().getActiveSessions() > 0) {
                passengerOpt.get().setActiveSessions(passengerOpt.get().getActiveSessions() - 1);
                passengerService.savePassenger(passengerOpt.get());
                return ResponseEntity.ok(Map.of("success", true,
                                                "numberOfSessions", passengerOpt.get().getActiveSessions()));
            }
            else {
                return ResponseEntity.ok(Map.of("success", false));
            }
        }
        else {
            return ResponseEntity.ok(Map.of("success", false));
        }
    }
}