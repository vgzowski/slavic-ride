package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Driver;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepo {
    Optional<Driver> findDriverById(String id);
    List<Driver> findAll();

    // implement Location function
}
