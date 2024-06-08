package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Order;
import Slavic.Ride.MMM.Service.DriverService;
import Slavic.Ride.MMM.Service.OrderService;
import Slavic.Ride.MMM.Service.PassengerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/sidebar")
@RequiredArgsConstructor
public class SidebarResource {
    private final DriverService driverService;
    private final PassengerService passengerService;
    private final OrderService orderService;

    @PostMapping("/getinfo")
    public ResponseEntity <Map<String, Object>> getInfo (@RequestBody Map <String, String> requestBody) {
        String who = requestBody.get("who");
        String id = requestBody.get("id");

        Map <String, Object> result = new HashMap<>();

        if (who.equals("passenger")) {
            result.put("name", passengerService.getPassenger(id).getName());
            result.put("email", passengerService.getPassenger(id).getEmail());
            result.put("phone", passengerService.getPassenger(id).getPhone());
            result.put("username", passengerService.getPassenger(id).getUsername());

            List<Optional<Order>> orders = orderService.findOrderByPassengerId(id);
            Integer totalSum = 0, totalOrders = 0;
            for (Optional<Order> order : orders) {
                if (order.isPresent() && order.get().getRatingPassenger() != null) {
                    totalSum += order.get().getRatingPassenger();
                    totalOrders++;
                }
            }

            List <Order> returnOrders = new ArrayList<>();
            for (Optional<Order> order : orders) {
                if (order.isPresent()) {
                    Order o = new Order();
                    o.setDriverId(driverService.getDriver(order.get().getDriverId()).getName());
                    o.setOrderId(order.get().getOrderId());
                    o.setSource(order.get().getSource());
                    o.setDestination(order.get().getDestination());
                    o.setDate(order.get().getDate());

                    returnOrders.add(o);
                }
            }

            Float rating = totalOrders == 0 ? 0 : (float) totalSum / totalOrders;

            result.put("rating", Float.valueOf(rating));
            result.put("orders", returnOrders);
        } else {
            result.put("name", driverService.getDriver(id).getName());
            result.put("email", driverService.getDriver(id).getEmail());
            result.put("phone", driverService.getDriver(id).getPhone());
            result.put("username", driverService.getDriver(id).getUsername());

            List<Optional<Order>> orders = orderService.findOrderByDriverId(id);
            Integer totalSum = 0, totalOrders = 0;
            for (Optional<Order> order : orders) {
                if (order.isPresent() && order.get().getRatingDriver() != null) {
                    totalSum += order.get().getRatingDriver();
                    totalOrders++;
                }
            }

            List <Order> returnOrders = new ArrayList<>();
            for (Optional<Order> order : orders) {
                if (order.isPresent()) {
                    Order o = new Order();
                    o.setDriverId(passengerService.getPassenger(order.get().getPassengerId()).getName());
                    o.setOrderId(order.get().getOrderId());
                    o.setSource(order.get().getSource());
                    o.setDestination(order.get().getDestination());
                    o.setDate(order.get().getDate());

                    returnOrders.add(o);
                }
            }

            Float rating = totalOrders == 0 ? 0 : (float) totalSum / totalOrders;

            result.put("rating", Float.valueOf(rating));
            result.put("orders", returnOrders);
        }

        return ResponseEntity.ok(result);
    }
}
