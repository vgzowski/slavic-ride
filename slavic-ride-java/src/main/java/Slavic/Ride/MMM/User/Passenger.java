package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

//@Table(name = "passengers")
@Entity
@Getter
@Setter
public class Passenger extends User {
    public Passenger(String name, String email, String phone, String id) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.id = id;
    }

    public Passenger() {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.id = "";
    }

//    @Embedded
    public Location getLocation() {
        return new Location();
        //        return this.location;
    }
    public void setLocation(Location location) {
//        this.location = location;
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
        return "Name: " + this.name + "\nEmail: " + this.email + "\nPhone: " + this.phone + "\nID: " + this.id + "\nRating: " + getRating();
    }
}
