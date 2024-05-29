/* global google */
import React, { useEffect, useRef } from 'react';

const AutocompleteInput = ({ id, value, onChange, onSelect }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['geocode'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                onSelect(place);
            }
        });
    }, [onSelect]);

    return (
        <input
            id={id}
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder="Enter address"
            type="text"
            tabindex="1"
            width={300}
        />
    );
};

export default AutocompleteInput;
