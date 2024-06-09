import React, { useState } from 'react';

const RatingComponent = ({ onRate }) => {
    const [rating, setRating] = useState(0);

    const handleRate = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmit = () => {
        onRate(rating);
    };

    return (
        <div className="rating">
            <p>Please rate the drive:</p>
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'star-filled' : 'star'}
                        onClick={() => handleRate(star)}
                    >
                        &#9733;
                    </span>
                ))}
            </div>
            <button onClick={handleSubmit}>Rate</button>
        </div>
    );
};

export default RatingComponent;