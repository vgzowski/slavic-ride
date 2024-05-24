package Slavic.Ride.MMM.User;

import Slavic.Ride.MMM.Location;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

//@Setter
//@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "drivers")
public class Driver extends User {
    private String carName;
    @Getter
    Boolean isTaken = false;

    public Driver(String name, String email, String phone, String id, String carName) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.id = id;
        this.carName = carName;
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

    public String getCarName() {
        return this.carName;
    }

    public Float getRating() {
        return this.totalRating / this.numberOfRatings;
    }

    public void setCarName(String carName) {
        this.carName = carName;
    }

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

    public void setIsTaken(Boolean isTaken) {
        this.isTaken = isTaken;
    }

    public Boolean getIsTaken() {
        return this.isTaken;
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

    public void setIsTaken(boolean isTaken) {
        this.isTaken = isTaken;
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
        return "Name: " + this.name + "\nEmail: " + this.email + "\nPhone: " + this.phone + "\nID: " + this.id + "\nRating: " + getRating() + "\nLocation: " + getLocation();
    }
}
