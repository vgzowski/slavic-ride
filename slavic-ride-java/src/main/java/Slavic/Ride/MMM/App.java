package Slavic.Ride.MMM;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import Slavic.Ride.MMM.Repo.*;

@SpringBootApplication
@PropertySource("classpath:.env")
public class App implements CommandLineRunner {

	@Autowired
	private DriverRepo driverRepo;

	@Autowired
	private PassengerRepo passengerRepo;

	@Autowired
	private OrderRepo orderRepo;

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// orderRepo.deleteAll();
		// driverRepo.deleteAll();
		// passengerRepo.deleteAll();
	}

}