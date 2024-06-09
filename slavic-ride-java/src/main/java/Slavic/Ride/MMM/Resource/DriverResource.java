package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Order;
import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.OrderService;
import Slavic.Ride.MMM.Service.PassengerService;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
public class DriverResource {
    private final DriverService driverService;
    private final PassengerService passengerService;
    private final OrderService orderService;

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
        String id = requestBody.containsKey("id") ? (String) requestBody.get("id").get("id") : null;
        driverService.updateDriverLocation(id, new Location((Double) requestBody.get("location").get("lat"),
                                                            (Double) requestBody.get("location").get("lng")));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/get-location")
    public ResponseEntity <Location> getDriverLocationById(@PathVariable String id) {
        Driver driver = driverService.getDriver(id);
        return ResponseEntity.ok(driver.getLocation());
    }

    @GetMapping("/{id}/order")
    public ResponseEntity<Order> getOrderRealOrder(@PathVariable String id) {
        Driver driver = driverService.getDriver(id);
        String orderId = driver.getOrderId();
        Order order = orderService.findOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            log.warn("Order not found for Order ID: {}", orderId);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/get-order")
    public ResponseEntity<Boolean> getOrder(@PathVariable String id) {
        try {
            Driver driver = driverService.getDriver(id);
            String orderId = driver.getOrderId();
            Order order = orderService.findOrderById(orderId);
            if (order != null) {
                return ResponseEntity.ok(true);
            } else {
                log.warn("Order not found for Order ID: {}", orderId);
                return ResponseEntity.ok(false);
            }
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @PutMapping("/{id}/finish-order")
    public ResponseEntity < Map <String, String> > finishOrder(@PathVariable String id) {
        log.info("Finishing order for driver ID: {}", id);
        String orderId = driverService.getDriver(id).getOrderId(), passengerId;

        try {
            //Finishing the order
            {
                Order order = orderService.findOrderById(orderId);
                passengerId = order.getPassengerId();
                orderService.finishOrder(orderId);
                driverService.setOrderId(order.getDriverId(), "");
                passengerService.setOrderId(order.getPassengerId(), "");
                driverService.setDriverStatus(id, true);
            }
            log.info("Returning a nice response in finish-order: Order: {} Passenger: {}", orderId, passengerId);
            return ResponseEntity.ok(Map.of("order_id", orderId, "passenger_id", passengerId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}