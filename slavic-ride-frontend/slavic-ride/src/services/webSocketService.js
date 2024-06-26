import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function connect(driverId, onMessageReceived, onRouteNotification, onTimeExceeding) {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/driver/${driverId}`, (message) => {
            console.log(message.body);

            const {
                name,
                location_lat,
                location_lng,
                destination_lat,
                destination_lng
            } = JSON.parse(message.body);

            console.log(location_lat);
            console.log(location_lng);
            console.log(destination_lat);
            console.log(destination_lng);

            if (name === 'New order') {
                onRouteNotification(
                    parseFloat(location_lat),
                    parseFloat(location_lng),
                    parseFloat(destination_lat),
                    parseFloat(destination_lng)
                );
            } else {
                onMessageReceived(
                    parseFloat(location_lat),
                    parseFloat(location_lng),
                    parseFloat(destination_lat),
                    parseFloat(destination_lng)
                );
            }
        });

        stompClient.subscribe(`/topic/driver/time-exceed/${driverId}`, (message) => {
            console.log(message);

            const {
                name
            } = JSON.parse(message.body);

            if (name === 'time-exceeded') {
                onTimeExceeding();
            }
        });

        stompClient.subscribe(`/topic/driver-route/${driverId}`, (message) => {
            console.log('Route notification');
            console.log(message.body);

            const {
                name,
                location_lat,
                location_lng,
                destination_lat,
                destination_lng,
                orderId
            } = JSON.parse(message.body);

            console.log(location_lat);
            console.log(location_lng);
            console.log(destination_lat);
            console.log(destination_lng);

            onRouteNotification(
                parseFloat(location_lat),
                parseFloat(location_lng),
                parseFloat(destination_lat),
                parseFloat(destination_lng),
                orderId
            );
        });
    });

    return stompClient;
};

export function connectPassenger(passengerId, onOrderFinished, onPassengerTaken) {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/passenger/${passengerId}`, (message) => {
            console.log("Finishing order", message.body);

            const {
                order_id
            } = JSON.parse(message.body);

            onOrderFinished(order_id);
        });

        stompClient.subscribe(`/topic/passenger-taken/${passengerId}`, (message) => {
            console.log("Passenger was taken", message.body);
            onPassengerTaken();
        });
    });
    return stompClient;
}
