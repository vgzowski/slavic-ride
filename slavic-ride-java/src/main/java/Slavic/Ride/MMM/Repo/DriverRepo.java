package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepo extends JpaRepository<Driver, String>{
    Optional<Driver> findDriverById(String id);
    List<Driver> findAll();

    Optional<Driver> findClosestDriverToPassenger(String passengerId);
}
