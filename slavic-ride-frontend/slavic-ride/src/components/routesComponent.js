import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState} from 'react';

class DirectionsService {
  constructor(routesLibrary) {
    this.service = new routesLibrary.DirectionsService();
  }

  async getDirections(origin, destination, travelMode, provideRouteAlternatives) {
    return new Promise((resolve, reject) => {
      this.service.route(
        {
          origin,
          destination,
          travelMode,
          provideRouteAlternatives,
        },
        (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(status);
          }
        }
      );
    });
  }
}

class DirectionsRenderer {
  constructor(map, routesLibrary) {
    this.renderer = new routesLibrary.DirectionsRenderer({ map });
  }

  setDirections(response) {
    this.renderer.setDirections(response);
  }

  setRouteIndex(index) {
    this.renderer.setRouteIndex(index);
  }
}

function Directions({ userLocation }) {
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
    setDirectionsService(new DirectionsService(routesLibrary));
    setDirectionsRenderer(new DirectionsRenderer(map, routesLibrary));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService.getDirections(
      userLocation,
      "Mieszczańska 10 Władysława Mitkowskiego 6 30-337 Kraków Poland",
      routesLibrary.TravelMode.DRIVING,
      true
    ).then((response) => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    });
  }, [directionsService, directionsRenderer, userLocation, routesLibrary]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address?.split(",")[0]} to {leg.end_address?.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Directions;
