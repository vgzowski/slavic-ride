package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PassengerRepo extends JpaRepository<Passenger, String> {
    Optional<Passenger> findPassengerById(String id);

    // implement Location function
}
