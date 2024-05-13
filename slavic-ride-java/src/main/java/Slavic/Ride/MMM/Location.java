package Slavic.Ride.MMM;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class Location {
  private double lat;
  private double lng;

  public String toString() {
    return "Lat: " + lat + ", Lng: " + lng;
  }
}