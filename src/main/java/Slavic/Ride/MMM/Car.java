package Slavic.Ride.MMM;

public class Car {
    private int id;
    private String model;
    private String color;
    private String licensePlate;
    private int driverId;

    public Car(int id, String model, String color, String licensePlate, int driverId) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.licensePlate = licensePlate;
        this.driverId = driverId;
    }

    public int getId() {
        return this.id;
    }

    public String getModel() {
        return this.model;
    }

    public String getColor() {
        return this.color;
    }

    public String getLicensePlate() {
        return this.licensePlate;
    }

    public int getDriverId() {
        return this.driverId;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }
}
