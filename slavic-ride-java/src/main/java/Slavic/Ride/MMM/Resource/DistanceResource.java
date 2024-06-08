package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.*;

import Slavic.Ride.MMM.Service.Utils;
import Slavic.Ride.MMM.DistanceResult;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/distance")
@RequiredArgsConstructor
public class DistanceResource {
  @PostMapping("/distance/{apiKey}")
  public ResponseEntity < DistanceResult > obtainDistanceAndDuration(
    @PathVariable String apiKey,
    @RequestBody Map < String, Map <String, Object> > requestBody
  ) {
    Location origin = new Location((Double)requestBody.get("origin").get("lat"), (Double)requestBody.get("origin").get("lng"));
    Location destination = new Location((Double)requestBody.get("destination").get("lat"), (Double)requestBody.get("destination").get("lng"));
    try {
      DistanceResult result = Utils.getDistanceAndDuration(origin, destination, apiKey);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.warn("Error while obtaining distance: " + e.getMessage());
      return ResponseEntity.badRequest().body(null);
    }
  }
}