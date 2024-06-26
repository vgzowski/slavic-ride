package Slavic.Ride.MMM.Service;

import Slavic.Ride.MMM.Location;
import Slavic.Ride.MMM.Order;
import Slavic.Ride.MMM.Repo.DriverRepo;
import Slavic.Ride.MMM.Repo.OrderRepo;
import Slavic.Ride.MMM.User.Driver;
import Slavic.Ride.MMM.User.Passenger;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;


@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepo orderRepo;

    public Order findOrderById(String orderId) {
        return orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public Order createOrder(Location source, Location destination, String passengerId, String driverId) {
        Order order = new Order();
        order.setSource(source);
        order.setDestination(destination);
        order.setPassengerId(passengerId);
        order.setDriverId(driverId);
        order.setIsFinished(false);
        order.setDate(LocalDate.now());
        orderRepo.save(order);
        log.info("Creating order, orderId: {}", order.getOrderId());
        return order;
    }

    public List<Optional <Order>> findOrderByPassengerId(String passengerId) {
        return orderRepo.findOrderByPassengerId(passengerId);
    }

    public List<Optional <Order>> findOrderByDriverId(String driverId) {
        return orderRepo.findOrderByDriverId(driverId);
    }

    public void finishOrder(String orderId) {
        log.info("Finishing order, orderId: {}", orderId);
        Order order = orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        // orderRepo.delete(order);
    }

    public void rateDriver(String orderId, Integer rating) {
        log.info("Rating driver, orderId: {}, rating: {}", orderId, rating);
        Order order = orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setRatingDriver(rating);
        orderRepo.save(order);
    }

    public void ratePassenger(String orderId, Integer rating) {
        log.info("Rating passenger, orderId: {}, rating: {}", orderId, rating);
        Order order = orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setRatingPassenger(rating);
        orderRepo.save(order);
    }
}
