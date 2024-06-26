/* global google */

import React, { useEffect, useRef } from 'react';
import "../css/AutocompleteInput.css";

const AutocompleteInput = ({ id, value, onChange, onSelect, userLocation, Status }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['geocode'],
            componentRestrictions: { country: 'pl' }, // Change 'us' to your desired country code
            fields: ['formatted_address', 'geometry'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                onSelect(place);
            }
        });

        // Update the bounds of the autocomplete when user location changes
        autocomplete.setBounds(new google.maps.LatLngBounds(userLocation));

    }, [onSelect, userLocation]);

    return (
        <input className="mama"
            id={id}
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder="Enter address"
            type="text"
            tabIndex="1"
            width={250}
            disabled={Status}
        />
    );
};

export default AutocompleteInput;