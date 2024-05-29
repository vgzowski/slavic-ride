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


@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepo orderRepo;
    private final DriverService driverService;
    private final PassengerService passengerService;

    public Order findOrderById(String orderId) {
        return orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public void createOrder(Location source, Location destination, String passengerId, String driverId) {
        Order order = new Order();
        order.setSource(source);
        order.setDestination(destination);
        order.setPassengerId(passengerId);
        order.setDriverId(driverId);
        order.setIsFinished(false);
        orderRepo.save(order);
        log.info("Creating order, orderId: {}", order.getOrderId());

        driverService.changeTakenToTrue(driverId);

        driverService.setOrderId(driverId, order.getOrderId());

        passengerService.setOrderId(passengerId, order.getOrderId());
    }

    public void finishOrder(String orderId) {
        log.info("Finishing order, orderId: {}", orderId);
        Order order = orderRepo.findOrderByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        orderRepo.delete(order);

        driverService.setOrderId(order.getDriverId(), "");
        passengerService.setOrderId(order.getPassengerId(), "");

        driverService.changeTakenToFalse(order.getDriverId());
    }
}
