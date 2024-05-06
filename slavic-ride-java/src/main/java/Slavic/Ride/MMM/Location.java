package Slavic.Ride.MMM;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Location {
  private double Latitude;
  private double Longitude;
}