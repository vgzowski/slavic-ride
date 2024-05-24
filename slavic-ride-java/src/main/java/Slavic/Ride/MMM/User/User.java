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
    @Embedded
    protected Location location = new Location();
    protected String username = "";
    protected String password = "";

    abstract public String getName();
    abstract public String getEmail();
    abstract public String getPhone();
    abstract public String getId();
    abstract public Float getRating();
    abstract public Location getLocation();
    abstract public String getUsername(String username);
    abstract public String getPassword(String password);

    abstract public void setName(String name);
    abstract public void setEmail(String email);
    abstract public void setPhone(String phone);
    abstract public void setId(String id);
    abstract public void addRating(Float rating);
    abstract public void setLocation(Location location);
    abstract public void setOrderId(String orderId);
    abstract public void setUsername(String username);
    abstract public void setPassword(String password);
}
