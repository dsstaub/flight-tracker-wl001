require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/flights', async (req, res) => {
  try {
    const response = await fetch('https://api.flightradar24.com/common/v1/flights/airport.json?code=PIT&plugin[]=arrivals&page=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.FR24_API_KEY}`,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Accept': 'application/json',
        'Referer': 'https://www.flightradar24.com/',
      }
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      const text = await response.text();
      console.error("FR24 Response Error:", text);
      return res.status(500).json({ error: 'FR24 API rejected the request', status: response.status });
    }

    if (!contentType || !contentType.includes('application/json')) {
      const body = await response.text();
      return res.status(500).json({ error: 'Unexpected response from FR24', raw: body });
    }

    const data = await response.json();
    const arrivals = data?.result?.response?.airport?.pluginData?.schedule?.arrivals?.data || [];

    const aaFlights = arrivals
      .filter(flight => flight.airline?.iata === 'AA')
      .map(flight => ({
        flight: flight.identification?.number?.default || 'AA???',
        eta: new Date(flight.time?.scheduled?.arrival * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tail: flight.aircraft?.registration || 'N/A',
        gate: flight?.airport?.destination?.info?.gate || '—'
      }));

    res.json(aaFlights);
  } catch (err) {
    console.error("Backend Exception:", err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
