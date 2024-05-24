import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connect = (driverId, onMessageReceived) => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    console.log("hui");

    stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/driver/${driverId}`, (message) => {
            console.log("hui tebe w rot");
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

            onMessageReceived(
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