import { useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

const useDistanceAndDuration = (source, destination) => {
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');
    const { maps } = useMapsLibrary("routes");

    useEffect(() => {
        if (!maps || !source || !destination) return;

        const directionsService = new maps.DirectionsService();

        directionsService.route(
            {
                origin: source,
                destination: destination,
                travelMode: maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === maps.DirectionsStatus.OK) {
                    const leg = result.routes[0].legs[0];
                    setDuration(leg.duration.text);
                    setDistance(leg.distance.text);
                } else {
                    console.error('Error fetching directions:', status);
                }
            }
        );
    }, [maps, source, destination]);

    return { duration, distance };
};

export default useDistanceAndDuration;
