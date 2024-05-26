package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, String> {
    Optional<Order> findOrderByOrderId(String orderId); // Rename the method

    @Modifying
    @Transactional
    @Query("DELETE FROM Order")
    void deleteAll();
}
