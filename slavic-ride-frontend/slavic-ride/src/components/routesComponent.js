import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const [directionsService, setDirectionsService] = 
    useState();
  
  const [directionsRenderer, setDirectionsRenderer] = 
    useState();

  const [routes, setRoutes] =
    useState()

  useEffect(() => {
    if (!routesLibrary || !map) {
      return;
    }

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

  }, [routesLibrary, map]);

  useEffect(() => {

    if (!directionsService || !directionsRenderer) {
      return;
    }

    directionsService.route({
      origin: "vulica Uryckaha 129, Babruysk, Mogilev Region 213827, Belarus",
      destination: "vul. Ardžanikidze 46, Babruysk, Mogilev Region 213811, Belarus",
      travelMode: routesLibrary.TravelMode.DRIVING,
      provideRouteAlternatives: true
    }).then((response) => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    });

  }, [directionsService, directionsRenderer]);

  console.log(routes);
  return null;
}

export default Directions;