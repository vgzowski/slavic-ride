package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepo extends JpaRepository<Driver, String> {
    Optional<Driver> findDriverById(String id);
    List<Driver> findAll();

    @Modifying
    @Transactional
    @Query("DELETE FROM Driver")
    void deleteAll();


    @Query("SELECT d FROM Driver d WHERE d.carType = :rideType and d.activeSessions > 0")
    List<Driver> findAllWithType(@Param("rideType") String rideType);


    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);

    Optional<Driver> findByUsername(String username);
}
