import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState} from 'react';

function Directions (obj) {
    const {userLocation, userDestination} = obj;
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map])

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        console.log("Loc: " + userLocation);
        console.log("Des: " + userDestination);

        directionsService.route(
            {
                origin: userLocation, 
                destination: userDestination ? userDestination : "Mieszczańska 10 Władysława Mitkowskiego 6 30-337 Kraków Poland",
                travelMode: routesLibrary.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            }
        ).then((response) => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        });
    }, [directionsService, directionsRenderer, userLocation, userDestination]);

    useEffect(() => {
      if (!directionsRenderer) {
        return;
      }

      directionsRenderer.setRouteIndex(routeIndex);

    }, [routeIndex, directionsRenderer])

    if (!leg) return null;

    return (
        <div className="directions">
            <h2>{selected.summary}</h2>
            <p>
                {leg.start_address?.split(",")[0]} to {leg.end_adress?.split(",")[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>

            <h2>Other routes</h2>
            <ul>
              {
                routes.map((route, index) => (
                  <li key={route.summary}>
                    <button onClick={() => setRouteIndex(index)}>
                      {route.summary}
                    </button>
                  </li>
                ))
              }
            </ul>
       </div>
    );
};

export default Directions;