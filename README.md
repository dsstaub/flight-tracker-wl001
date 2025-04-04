# AA PIT Flight Tracker

Tracks American Airlines flights inbound to Pittsburgh (KPIT) using Flightradar24 API.

## How it Works
- Backend (Node.js) pulls AA flights from Flightradar24
- Frontend (HTML) shows them with flight #, tail #, ETA, gate
- Tap to mark serviced, double-tap to dismiss

## Setup Instructions

### Backend (Deploy to Render or Fly.io)
1. Copy `.env.example` to `.env` and paste your FR24 API key.
2. Deploy backend folder to Render/Fly/Railway as a Node app.
3. Note the public URL (e.g. `https://fr24proxy.fly.dev`)

### Frontend (GitHub Pages)
1. Replace `YOUR-BACKEND-URL` in `index.html` with your deployed backend URL.
2. Push the `/frontend` folder to GitHub.
3. Turn on GitHub Pages in repo settings and point to `frontend/index.html`.

Done!

Now you have a live AA tracker that works on your iPad.
