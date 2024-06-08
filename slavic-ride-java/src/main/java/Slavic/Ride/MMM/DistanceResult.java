package Slavic.Ride.MMM;

public class DistanceResult {
    public String distance;
    public String duration;

    public DistanceResult(long distanceInMeters, long durationInSeconds) {
        this.distance = formatDistance(distanceInMeters);
        this.duration = formatDuration(durationInSeconds);
    }

    private String formatDistance(long distanceInMeters) {
        if (distanceInMeters < 1000) {
            return distanceInMeters + " meters";
        } else {
            double distanceInKilometers = distanceInMeters / 1000.0;
            return String.format("%.2f kilometers", distanceInKilometers);
        }
    }

    private String formatDuration(long durationInSeconds) {
        long hours = durationInSeconds / 3600;
        long minutes = (durationInSeconds % 3600) / 60;
        long seconds = durationInSeconds % 60;

        StringBuilder sb = new StringBuilder();
        if (hours > 0) {
            sb.append(hours).append(" hour").append(hours > 1 ? "s" : "").append(" ");
        }
        if (minutes > 0) {
            sb.append(minutes).append(" minute").append(minutes > 1 ? "s" : "").append(" ");
        }
        if (seconds > 0 || (hours == 0 && minutes == 0)) {
            sb.append(seconds).append(" second").append(seconds != 1 ? "s" : "");
        }

        return sb.toString().trim();
    }
}
