require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/flights', async (req, res) => {
  try {
    const response = await fetch('https://fr24api.flightradar24.com/api/live/flight-positions/light?painted_as=AAL&airports=KPIT', {
      headers: {
        'Authorization': `Bearer ${process.env.9e989a4d-9156-4413-829e-c62ba64a1cd9|OYv6EYeCP2l3oyCjkcJUDy7ALfMfWa2O1PoVgYyid1a49ea1}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
const flights = (data.flights || []);

    const results = flights.map(f => ({
      flight: f.callsign || 'Unknown',
      tail: f.registration || 'N/A',
      eta: f.estimated_arrival ? new Date(f.estimated_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      gate: f.gate || '—'
    }));

    res.json(results);
  } catch (error) {
    console.error("API fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
