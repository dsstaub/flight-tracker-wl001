require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/flights', async (req, res) => {
  try {
    const response = await fetch('https://fr24api.flightradar24.com/api/v1/search/flights?destination=KPIT&painted_as=AAL', {
      headers: {
        'Authorization': `Bearer ${process.env.FR24_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const flights = data.results || [];

    const results = flights.map(f => ({
      flight: f.identification?.callsign || 'AA???',
      tail: f.aircraft?.registration || 'N/A',
      eta: f.time?.estimated?.arrival
        ? new Date(f.time.estimated.arrival * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'N/A',
      gate: f.airport?.destination?.info?.gate || '—'
    }));

    res.json(results);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});