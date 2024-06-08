package Slavic.Ride.MMM.Resource;

import Slavic.Ride.MMM.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
  @GetMapping("/distance/{apiKey}")
  public ResponseEntity < DistanceResult > obtainDistanceAndDuration(
    @PathVariable String apiKey,
    Location origin,
    Location destination
  ) {
    try {
      DistanceResult result = Utils.getDistanceAndDuration(origin, destination, apiKey);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.warn("Error while obtaining distance: " + e.getMessage());
      return ResponseEntity.badRequest().body(null);
    }
  }
}