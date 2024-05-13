package Slavic.Ride.MMM.Repo;

import Slavic.Ride.MMM.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, String> {
    Optional<Order> findOrderByOrderId(String orderId); // Rename the method
}
