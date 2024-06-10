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
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public static DistanceResult getDistanceAndDuration(Location originL, Location destinationL, String API_KEY) throws ApiException, InterruptedException, IOException {
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

    public static <T, V> String stringifyMapToJSON (Map<T, V> map) {
        StringBuilder res = new StringBuilder();
        res.append("{");
        for (Map.Entry<T, V> entry : map.entrySet()) {
            res.append("\"").append(entry.getKey().toString()).append("\":");
            res.append("\"").append(entry.getValue().toString()).append("\",");
        }

        res.delete(res.length() - 1, res.length());
        res.append("}");
        return res.toString();
    }

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        return matcher.matches();
    }

    private static final String PHONE_REGEX = "^\\+?[1-9]\\d{9,14}$";
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);

    public static boolean isValidPhone(String phone) {
        if (phone == null) {
            return false;
        }
        Matcher matcher = PHONE_PATTERN.matcher(phone);
        return matcher.matches();
    }
}
