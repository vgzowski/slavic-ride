package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import Slavic.Ride.MMM.Service.Utils;

@Slf4j
@RestController
@RequestMapping("/notifications")
public class NotificationResource {
    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, CountDownLatch> driverLatches = new ConcurrentHashMap<>();
    private final Map<String, Boolean> driverResponses = new ConcurrentHashMap<>();

    public NotificationResource(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/finish-order-passenger")
    public void handleFinishOrderForPassenger(@RequestBody Map <String, Object> requestBody) {
        String passengerId = (String)requestBody.get("passenger_id");
        String orderId = (String)requestBody.get("order_id");

        log.info("Sending to web socket finising order: Order {} Passenger {}", orderId, passengerId);

        messagingTemplate.convertAndSend(
            "/topic/passenger/" + passengerId,
            Utils.stringifyMapToJSON(new LinkedHashMap<>(Map.of(
                "order_id", orderId
            )))
        );

        // messagingTemplate.convertAndSend(
        //     "/topic/passenger/" + passengerId,
        //     "{" + "\"order_id\":" + "\"" + orderId + "\"" + "}"
        // );
    }

    @PostMapping("/take-passenger")
    public void handlePassengerTaken(@RequestBody Map <String, Object> requestBody) {
        String passengerId = (String)requestBody.get("passenger_id");

        log.info("Sending to web socket changing state to [in a drive]: Passenger {}", passengerId);

        messagingTemplate.convertAndSend(
            "/topic/passenger-taken/" + passengerId,
            "Successfuly took passenger with ID: " + passengerId
        );
    }

    @PostMapping("/driver-response")
    public void handleDriverResponse(@RequestBody Map<String, Object> response) {
        log.info("Received driver response: {}", response);
        String driverId = (String) response.get("driverId");
        boolean accepted = (Boolean) response.get("accepted");
        driverResponses.put(driverId, accepted);
        CountDownLatch latch = driverLatches.remove(driverId);
        if (latch != null) {
            latch.countDown();
        }
    }

    public boolean requestDriverConfirmation(String driverId, Location location, Location destination) {
        CountDownLatch latch = new CountDownLatch(1);
        driverLatches.put(driverId, latch);
        log.info("Sending request to driver {}", driverId);

        messagingTemplate.convertAndSend(
            "/topic/driver/" + driverId,
            Utils.stringifyMapToJSON(new LinkedHashMap<>(Map.of(
                "name", "Ride request",
                "location_lat", location.getLat(),
                "location_lng", location.getLng(),
                "destination_lat", destination.getLat(),
                "destination_lng", destination.getLng()
            )))
        );
        // messagingTemplate.convertAndSend("/topic/driver/" + driverId,
        //         "{" +
        //                 "\"name\":\"Ride request\"," +
        //                 "\"location_lat\":\"" + location.getLat() + "\"," +
        //                 "\"location_lng\":\"" + location.getLng() + "\"," +
        //                 "\"destination_lat\":\"" + destination.getLat() + "\"," +
        //                 "\"destination_lng\":\"" + destination.getLng() + "\"" +
        //                 "}");

        try {
            if (latch.await(7, TimeUnit.SECONDS)) {
                return driverResponses.remove(driverId);
            } else {
                driverLatches.remove(driverId);
                messagingTemplate.convertAndSend(
                    "/topic/driver/time-exceed/" + driverId,
                    Utils.stringifyMapToJSON(new LinkedHashMap<>(Map.of(
                        "name", "time-exceeded"
                    )))
                );

                // messagingTemplate.convertAndSend(
                //     "/topic/driver/time-exceed/" + driverId,
                //     "{" + "\"name\": " + "\"time-exceeded\"" + "}"
                // );
                return false;  // Timeout, driver didn't respond
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }


    public void notifyDriverOfRoute(String driverId, Location location, Location destination, String orderId) {
        log.info("Notifying driver {} of route with order ID {}", driverId, orderId);

        messagingTemplate.convertAndSend(
            "/topic/driver-route/" + driverId,
            Utils.stringifyMapToJSON(new LinkedHashMap<>(Map.of(
                "name", "New order",
                "location_lat", location.getLat(),
                "location_lng", location.getLng(),
                "destination_lat", destination.getLat(),
                "destination_lng", destination.getLng(),
                "orderId", orderId
        ))));

        // messagingTemplate.convertAndSend("/topic/driver-route/" + driverId,
        //         "{" +
        //                 "\"name\":\"New order\"," +
        //                 "\"location_lat\":\"" + location.getLat() + "\"," +
        //                 "\"location_lng\":\"" + location.getLng() + "\"," +
        //                 "\"destination_lat\":\"" + destination.getLat() + "\"," +
        //                 "\"destination_lng\":\"" + destination.getLng() + "\"," +
        //                 "\"orderId\":\"" + orderId + "\"" +
        //                 "}");
    }

}
