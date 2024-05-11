import express, { json } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Directions from './Directions'; // Assuming Directions component is defined in Directions.js
const app = express();

app.use(json());

// Define API endpoint for rendering Directions component and extracting duration
app.post('/api/get-duration', (req, res) => {
    // Render the Directions component with the provided data
    const renderedHtml = renderToString(
        <Directions userLocation={req.body.userLocation} userDestination={req.body.userDestination} />
    );

    // Extract duration from rendered HTML
    const durationRegex = /Duration:\s*(.*?)<\/p>/;
    const match = renderedHtml.match(durationRegex);
    const duration = match ? match[1] : 'Duration not found';

    res.send({ duration });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
