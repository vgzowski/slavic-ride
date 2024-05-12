package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;

public class Utils {
    private static double rEarth = 6371;
    public static double calculateDistance(Location location1, Location location2) {
        double latDistance = Math.toRadians(location2.getLat() - location1.getLat());
        double lonDistance = Math.toRadians(location2.getLng() - location1.getLng());
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(location1.getLat())) * Math.cos(Math.toRadians(location2.getLat()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = rEarth * c;
        return distance;
    }
}
