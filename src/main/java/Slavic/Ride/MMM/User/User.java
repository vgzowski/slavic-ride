package Slavic.Ride.MMM.User;

abstract public class User {
    public String name = "";
    public String email = "";
    public String phone = "";
    public String id = "";
    public int numberOfRatings = 0;
    public Float totalRating = 0.0f;

    abstract public String getName();
    abstract public String getEmail();
    abstract public String getPhone();
    abstract public String getId();
    abstract public Float getRating();

    abstract public void setName(String name);
    abstract public void setEmail(String email);
    abstract public void setPhone(String phone);
    abstract public void setId(String id);
    abstract public void addRating(Float rating);

}
