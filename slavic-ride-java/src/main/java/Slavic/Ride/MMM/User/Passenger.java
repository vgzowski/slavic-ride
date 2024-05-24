package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "passengers")
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

    @Embedded
    public Location getLocation() { return this.location; }

    @Override
    public String getUsername(String username) {
        return this.username;
    }

    @Override
    public String getPassword(String password) {
        return this.password;
    }


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

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
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
