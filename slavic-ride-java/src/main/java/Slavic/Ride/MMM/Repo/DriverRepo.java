package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.User.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    @Query("UPDATE Driver d SET d.isTaken = true WHERE d.id = ?1")
    void setTakenToTrue(String id);

    @Modifying
    @Transactional
    @Query("UPDATE Driver d SET d.isTaken = false WHERE d.id = ?1")
    void setTakenToFalse(String id);

    @Query("SELECT d FROM Driver d WHERE COALESCE(d.isTaken, false) = false")
    List<Driver> findAllNotTaken();

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);

    Optional<Driver> findByUsername(String username);
}
