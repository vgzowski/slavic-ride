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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

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
        messagingTemplate.convertAndSend("/topic/driver/" + driverId,
                "{" +
                        "\"name\":\"Ride request\"," +
                        "\"location_lat\":\"" + location.getLat() + "\"," +
                        "\"location_lng\":\"" + location.getLng() + "\"," +
                        "\"destination_lat\":\"" + destination.getLat() + "\"," +
                        "\"destination_lng\":\"" + destination.getLng() + "\"" +
                        "}");

        try {
            if (latch.await(7, TimeUnit.SECONDS)) {
                return driverResponses.remove(driverId);
            } else {
                driverLatches.remove(driverId);
                return false;  // Timeout, driver didn't respond
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }


    public void notifyDriverOfRoute(String driverId, Location location, Location destination) {
        log.info("Notifying driver {} of route", driverId);
        messagingTemplate.convertAndSend("/topic/driver-route/" + driverId,  // Change the topic address
                "{" +
                        "\"name\":\"New order\"," +
                        "\"location_lat\":\"" + location.getLat() + "\"," +
                        "\"location_lng\":\"" + location.getLng() + "\"," +
                        "\"destination_lat\":\"" + destination.getLat() + "\"," +
                        "\"destination_lng\":\"" + destination.getLng() + "\"" +
                        "}");
    }

}
