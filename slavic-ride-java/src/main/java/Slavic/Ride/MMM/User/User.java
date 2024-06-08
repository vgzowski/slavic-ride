package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "users") // Enclose "user" in double quotes
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
abstract public class User {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, updatable = false)
    protected String id = "";

    protected String name = "";
    protected String email = "";
    protected String phone = "";
    protected int numberOfRatings = 0;
    protected Float totalRating = 0.0f;
    protected String orderId = "";
    protected String username = "";
    protected String password = "";
    @Column(nullable = false, columnDefinition = "integer default 0")
    protected int activeSessions = 0;

    @Embedded
    protected Location location = new Location();

    abstract public void addRating(Float rating);
}
