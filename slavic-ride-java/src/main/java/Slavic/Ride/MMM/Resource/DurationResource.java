package Slavic.Ride.MMM.Resource;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import Slavic.Ride.MMM.DirectionsRequest;

@RestController
public class DurationResource {

    @PostMapping("/get-duration")
    public String getDuration(@RequestBody DirectionsRequest request) {
        // Make an HTTP request to the Node.js server to fetch the duration
        RestTemplate restTemplate = new RestTemplate();
        String nodeServerUrl = "http://node-server:3001/api/get-duration"; // Change to actual URL
        String duration = restTemplate.postForObject(nodeServerUrl, request, String.class);
        return duration;
    }
}