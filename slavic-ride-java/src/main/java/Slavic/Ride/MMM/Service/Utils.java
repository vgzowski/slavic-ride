package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.DistanceResult;

import com.google.maps.GeoApiContext;
import com.google.maps.DistanceMatrixApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElement;
import com.google.maps.model.DistanceMatrixRow;
import java.io.IOException;

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

    private static final String API_KEY = "AIzaSyA7m1gPyySkRNZWzJgn7q1cPcEQF_OXC0c";

    public static DistanceResult getDistanceAndDuration(Location originL, Location destinationL) throws ApiException, InterruptedException, IOException {
        String origin = String.valueOf(originL.getLat()) + "," + String.valueOf(originL.getLng());
        String destination = String.valueOf(destinationL.getLat()) + "," + String.valueOf(destinationL.getLng());
        GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(API_KEY)
                .build();

        DistanceMatrix result = DistanceMatrixApi.newRequest(context)
                .origins(origin)
                .destinations(destination)
                .mode(com.google.maps.model.TravelMode.DRIVING)
                .await();

        DistanceMatrixRow[] rows = result.rows;
        DistanceMatrixElement[] elements = rows[0].elements;

        long distanceInMeters = elements[0].distance.inMeters;
        long durationInSeconds = elements[0].duration.inSeconds;

        return new DistanceResult(distanceInMeters, durationInSeconds);
    }
}
