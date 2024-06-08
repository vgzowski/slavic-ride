package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, String> {
    Optional<Order> findOrderByOrderId(String orderId);

    List<Optional <Order>> findOrderByPassengerId(String passengerId);
    List<Optional <Order>> findOrderByDriverId(String driverId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Order")
    void deleteAll();
}
