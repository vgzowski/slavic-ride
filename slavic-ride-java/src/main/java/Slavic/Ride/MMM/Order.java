package Slavic.Ride.MMM;

import Slavic.Ride.MMM.User.Passenger;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Table(name = "orders")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Order {
    @Id
    @UuidGenerator
    @Column(name = "Id", unique = true, updatable = false)
    String orderId;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "source_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "source_lng"))
    })
    Location source;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "destination_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "destination_lng"))
    })
    Location destination;
    String passengerId;
    String driverId;
    Boolean isFinished = false;
}
