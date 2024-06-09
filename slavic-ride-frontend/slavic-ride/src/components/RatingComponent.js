import React, { useState } from 'react';
import axios from 'axios';

const RatingComponent = ({ onRate, orderId }) => {
    const [rating, setRating] = useState(0);

    const handleRate = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmit = async () => {
        onRate(rating);
        // const response = await axios.post('http://localhost:8080/rating/rateDriver', { orderId: orderId, rating: rating });
        // console.log('Rating response:', response.data);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            zIndex: '100',
            textAlign: 'center'
        }}
             className="rating">
            <p>Please rate the drive:</p>
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'star-filled' : 'star'}
                        onClick={() => handleRate(star)}
                        style={{ color: star <= rating ? 'yellow' : 'gray', cursor: 'pointer' }}
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
