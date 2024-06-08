package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

//@Table(name = "drivers")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Driver extends User {
    private String carType;

    public Driver(String name, String email, String phone, String id, String carType) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.id = id;
        this.carType = carType;
    }

    public Float getRating() {
        return this.totalRating / this.numberOfRatings;
    }

    public void addRating(Float rating) {
        if (rating == 0) {
            return;
        }
        this.totalRating += rating;
        this.numberOfRatings++;
    }

    public String toString() {
        return "Username: " + this.username + ", id: " + this.id + "\n";
    }
}
