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
  private Double lat;
  private Double lng;

  public String toString() {
    return "Lat: " + lat + ", Lng: " + lng;
  }
}