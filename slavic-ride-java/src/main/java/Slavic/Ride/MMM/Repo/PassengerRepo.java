package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PassengerRepo extends JpaRepository<Passenger, String> {
    Optional<Passenger> findPassengerById(String id);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);

    Optional<Passenger> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM Passenger")
    void deleteAll();
}
