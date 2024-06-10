import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

function Directions({ userLocation, userDestination }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // console.log('IAM ALIVE I CAN SEE');
    // console.log('userLocation:', userLocation);
    // console.log('userDestination:', userDestination);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        const ds = new routesLibrary.DirectionsService();
        const dr = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: true,
        });
        setDirectionsService(ds);
        setDirectionsRenderer(dr);
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        if (!userLocation || !userDestination) {
            directionsRenderer.setDirections({ routes: [] });
            setRoutes([]);
            return;
        }

        directionsService.route(
            {
                origin: userLocation,
                destination: userDestination,
                travelMode: routesLibrary.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            }
        ).then((response) => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        }).catch((error) => {
            console.error('Error fetching directions:', error);
            directionsRenderer.setDirections({ routes: [] });
            setRoutes([]);
        });
    }, [directionsService, directionsRenderer, userLocation, userDestination]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className="ride-info">
            <h2>{selected.summary}</h2>
            <p>
                {leg.start_address?.split(",")[0]} to {leg.end_address?.split(",")[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>
        </div>
    );
}

export default Directions;
