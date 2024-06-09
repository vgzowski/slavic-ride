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
        <div className="rating">
            <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Please rate the drive:</p> {/* Adjust font size and weight */}
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'star-filled' : 'star'}
                        onClick={() => handleRate(star)}
                        style={{ fontSize: '4em', color: star <= rating ? '#FFD700' : '#808080', cursor: 'pointer' }}
                    >
                    &#9733;
                </span>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                style={{
                    width: '80%', /* Set width to 80% of the container */
                    display: 'block', /* Ensure it takes full width */
                    margin: '20px auto', /* Center horizontally with 20px top and bottom margin */
                    padding: '15px', /* Add padding for better appearance */
                    fontSize: '1.2em', /* Adjust font size */
                    cursor: 'pointer',
                    backgroundColor: '#6c6aae',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s'
                }}
            >
                Rate
            </button>
        </div>
    );



};

export default RatingComponent;
