package Slavic.Ride.MMM;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Service.Utils;
import Slavic.Ride.MMM.DistanceResult;

@SpringBootTest
class MmmApplicationTests {

	@Test
	void testDistance() {
		Location l1 = new Location(50.035583, 19.991139);
		Location l2 = new Location(50.036768, 19.987812);
		try {
			DistanceResult x = Utils.getDistanceAndDuration(l1, l2);
			System.out.println(x.distance + " " + x.duration);
		} catch (Exception e) {
			System.out.println("EXCEPTION: " + e.getMessage());
		}
	}

}
