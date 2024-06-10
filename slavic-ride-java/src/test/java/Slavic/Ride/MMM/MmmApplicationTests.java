package Slavic.Ride.MMM;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Service.Utils;
import Slavic.Ride.MMM.DistanceResult;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest
class MmmApplicationTests {

	@Test
	void testDistance() {
		Location l1 = new Location(50.035583, 19.991139);
		Location l2 = new Location(50.036768, 19.987812);
		try {
			DistanceResult x = Utils.getDistanceAndDuration(l1, l2, "AIzaSyA7m1gPyySkRNZWzJgn7q1cPcEQF_OXC0c");
			System.out.println(x.distance + " " + x.duration);
		} catch (Exception e) {
			System.out.println("EXCEPTION: " + e.getMessage());
		}
	}

	@Test
	void testStringifyMapToJSON() {
		String res = "{" +
				"\"name\":\"Ride request\"," +
				"\"location_lat\":\"" + 51. + "\"," +
				"\"location_lng\":\"" + 19 + "\"," +
				"\"destination_lat\":\"" + 1 + "\"," +
				"\"destination_lng\":\"" + 2 + "\"" +
				"}";
		Map <String, Object> map = new HashMap<>();
		map.put("name", "Ride request");
		map.put("location_lat", 51.);
		map.put("location_lng", 19);
		map.put("destination_lat", 1);
		map.put("destination_lng", 2);
		try {
			String x = Utils.stringifyMapToJSON(map);
			System.out.println(x);
			System.out.println(res);
		} catch (Exception e) {
			System.out.println("EXCEPTION: " + e.getMessage());
		}
	}
}
