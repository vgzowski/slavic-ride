package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "passengers")
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

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPhone() {
        return this.phone;
    }

    public String getId() {
        return this.id;
    }

    public Float getRating() {
        return this.totalRating / this.numberOfRatings;
    }

    public Location getLocation() { return this.location; }


    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setLocation(Location location) { this.location = location; }

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
