package Slavic.Ride.MMM.Resource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Slavic.Ride.MMM.Service.OrderService;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/rating")
@RequiredArgsConstructor
public class RatingResource {
    private final OrderService orderService;

    @PostMapping("/rateDriver")
    public ResponseEntity<String> rateDriver(@RequestBody Map<String, Object> requestBody) {
        String orderId = (String) requestBody.get("orderId");
        Integer rating = (Integer) requestBody.get("rating");
        try {
            orderService.rateDriver(orderId, rating);
            return ResponseEntity.ok("Driver rated successfully");
        } catch (Exception e) {
            log.error("Error rating driver: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error rating driver");
        }
    }

    @PostMapping("/ratePassenger")
    public ResponseEntity<String> ratePassenger(@RequestBody Map<String, Object> requestBody) {
        String orderId = (String) requestBody.get("orderId");
        Integer rating = (Integer) requestBody.get("rating");
        try {
            orderService.ratePassenger(orderId, rating);
            return ResponseEntity.ok("Passenger rated successfully");
        } catch (Exception e) {
            log.error("Error rating passenger: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error rating passenger");
        }
    }
}
