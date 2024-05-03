package Slavic.Ride.MMM.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Driver extends User {
    private int carId;

    public Driver(String name, String email, String phone, String id, int carId) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.id = id;
        this.carId = carId;
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

    public int getCarId() {
        return this.carId;
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

    public void addRating(Float rating) {
        if (rating == 0) {
            return;
        }
        this.totalRating += rating;
        this.numberOfRatings++;
    }

    public void setCarId(int carId) {
        this.carId = carId;
    }

    public String toString() {
        return "Name: " + this.name + "\nEmail: " + this.email + "\nPhone: " + this.phone + "\nID: " + this.id + "\nRating: " + getRating();
    }
}
