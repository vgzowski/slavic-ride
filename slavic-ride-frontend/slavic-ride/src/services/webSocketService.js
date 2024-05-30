import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connect = (driverId, onMessageReceived, onRouteNotification) => {
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

        stompClient.subscribe(`/topic/driver-route/${driverId}`, (message) => {
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

            onRouteNotification(
                parseFloat(location_lat),
                parseFloat(location_lng),
                parseFloat(destination_lat),
                parseFloat(destination_lng)
            );
        });
    });

    return stompClient;
};

export default connect;
