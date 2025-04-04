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
        'Referer': 'https://www.flightradar24.com/'
      }
    });

    const text = await response.text(); // grab raw response text (even on error)

    if (!response.ok) {
      console.error("FR24 returned non-OK response:", response.status, text);
      return res.status(500).json({ error: 'FR24 rejected request', status: response.status, response: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("FR24 sent non-JSON response:", text);
      return res.status(500).json({ error: 'Failed to parse FR24 response', raw: text });
    }

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
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: 'Unhandled server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
