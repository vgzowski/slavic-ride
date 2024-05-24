package Slavic.Ride.MMM.Resource;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationResource {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationResource(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyDriver(String driverId, String message) {
        messagingTemplate.convertAndSend("/topic/driver/" + driverId, message);
    }
}
