require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/flights', async (req, res) => {
  try {
    const response = await fetch('https://api.flightradar24.com/common/v1/flights/airport.json?code=PIT&plugin[]=arrivals&page=1', {
      headers: {
        'Authorization': `Bearer ${process.env.FR24_API_KEY}`,
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`FR24 API Error: ${response.status}`);
    const data = await response.json();
    const arrivals = data?.result?.response?.airport?.pluginData?.schedule?.arrivals?.data || [];

    const aaFlights = arrivals
      .filter(flight => flight.airline?.iata === 'AA')
      .map(flight => ({
        flight: flight.identification?.number?.default || 'AA???',
        eta: new Date(flight.time?.scheduled?.arrival * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tail: flight.aircraft?.registration || 'N/A',
        gate: flight.gate || '—'
      }));

    res.json(aaFlights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
