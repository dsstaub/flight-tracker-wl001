require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/flight/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;
  try {
    const url = `https://fr24api.flightradar24.com/api/v1/search/flights?query=${flightNumber}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.FR24_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const flight = data.results.find(f => f.identification.callsign === flightNumber);

    if (flight) {
      const result = {
        flight: flight.identification.callsign,
        eta: flight.time?.estimated?.arrival
          ? new Date(flight.time.estimated.arrival * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'N/A',
        gate: flight.airport?.destination?.info?.gate || '—',
        registration: flight.aircraft?.registration || 'N/A'
      };
      res.json(result);
    } else {
      res.status(404).json({ error: 'Flight not found' });
    }
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
