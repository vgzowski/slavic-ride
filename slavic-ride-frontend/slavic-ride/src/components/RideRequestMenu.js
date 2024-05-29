import React from 'react';

const RideRequestMenu = ({ onAccept, onReject }) => {
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
            zIndex: '9999',
            textAlign: 'center'
        }}>
            <h3>You have a new ride request.</h3>
            <button onClick={onAccept} style={{ margin: '10px' }}>Accept</button>
            <button onClick={onReject} style={{ margin: '10px' }}>Reject</button>
        </div>
    );
}

export default RideRequestMenu;
