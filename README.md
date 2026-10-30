# AI Threat Guardian
### Multi-Agent Scam & Phishing Investigation System using MCP

AI Threat Guardian is a security-focused project designed to help users identify potentially suspicious URLs before opening them. It combines a Chrome browser extension, FastAPI backend, MCP-based investigation tools, SQLite storage, caching, and an LLM-generated threat explanation.

## 1. Problem Statement

Phishing and scam websites often imitate legitimate websites to trick users into sharing passwords, banking details, and other sensitive information.

Users may not recognize suspicious links before opening them. AI Threat Guardian aims to provide an additional layer of protection by investigating clicked links and displaying a risk assessment before allowing the user to continue.

## 2. Target Users

- Everyday internet users.
- Users who frequently receive links through websites and online messages.
- People who need an understandable explanation of potential URL threats.

## 3. How It Works

1. The Chrome extension detects a user clicking an HTTP or HTTPS link.
2. The content script intercepts the navigation and requests an investigation.
3. The background service worker sends the URL to the FastAPI backend.
4. The backend coordinates URL, domain, and risk investigation agents.
5. MCP tools provide URL and domain investigation capabilities.
6. Rule-based logic determines the final risk level and recommended action.
7. The result is saved in SQLite.
8. An LLM generates a human-readable explanation of the assessment.
9. The extension displays the result and lets the user reject the navigation or continue.

**Important:** The rule-based investigation determines the risk and action. The LLM provides an explanation; it does not independently make the final security decision.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Backend API | Python, FastAPI |
| Agent communication | Model Context Protocol (MCP) |
| Investigation agents | Python |
| Database | SQLite |
| Caching | In-memory TTL cache |
| LLM integration | Groq API, GPT-OSS 20B |
| Browser extension | Chrome Manifest V3, JavaScript |
| Frontend | React, Vite, Tailwind CSS |
| Automated testing | Pytest, FastAPI TestClient |

## 5. Capstone Concepts Implemented

This project implements five concepts:

1. **API Endpoints:** FastAPI provides endpoints for URL investigation, health checks, and investigation history.
2. **Database:** SQLite stores investigation history, including URLs, risk levels, actions, indicators, and timestamps.
3. **Caching:** An in-memory cache stores investigation responses for 60 seconds to reduce repeated processing.
4. **LLM Integration:** Groq GPT-OSS 20B generates understandable explanations of investigation results.
5. **Automated Test Suite (approved swap):** Pytest tests the API, database, and cache. External agent and LLM dependencies are mocked in API tests.

The automated test suite is used as an approved replacement concept. The project therefore implements four original concepts and one approved swap.

## 6. Project Structure

```text
AI-Threat-Guardian/
├── backend/
│   ├── agents/
│   ├── api/
│   ├── mcp_server/
│   ├── services/
│   ├── tests/
│   ├── tools/
│   ├── cache.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
├── browser-extension/
│   ├── popup/
│   ├── background.js
│   ├── content.js
│   └── manifest.json
├── frontend/
├── services/
├── tests/
├── .gitignore
└── README.md
```

## 7. Backend Setup

### Requirements

- Python 3.13
- pip
- Google Chrome
- Node.js and npm (for the frontend)
- A Groq API key for live LLM explanations

### Install backend dependencies

From the project root:

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Configure environment variables

Create your environment file:

```bash
cp .env.example .env
```

Add your own Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

Never commit your real `.env` file or API key.

### Run the backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

## 8. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend status |
| GET | `/health` | Health check |
| POST | `/investigate-url` | Investigate a URL |
| GET | `/investigations` | Retrieve investigation history |
| GET | `/demo` | Open the demonstration page |

Example request for `POST /investigate-url`:

```json
{
  "url": "https://secure-bank-verification.xyz/login"
}
```

The response includes the risk level, recommended action, matched indicators, agent information, and AI-generated explanation.

## 9. Run Automated Tests

From the backend directory, activate the virtual environment and run:

```bash
python -m pytest -v
```

The test suite covers:

- API root and health endpoints.
- URL investigation responses.
- Cached investigation responses.
- Investigation history.
- SQLite database initialization and storage.
- Cache storage, copying, and expiration.

External agent and LLM calls are mocked in API tests so that the suite can run without live external services.

## 10. Run the Frontend

Open another terminal window:

```bash
cd frontend
npm install
npm run dev
```

To check the production build:

```bash
npm run build
```

## 11. Load the Chrome Extension

1. Start the backend.
2. Open Google Chrome.
3. Visit `chrome://extensions`.
4. Enable Developer mode.
5. Select **Load unpacked**.
6. Choose the project's `browser-extension` folder.
7. Reload the extension after making changes.

The extension intercepts clicked HTTP and HTTPS anchor links on supported pages and requests a backend investigation before continuing navigation.

## 12. Five-Minute Demo Plan

1. Start the FastAPI backend.
2. Open `/docs` and show the available endpoints.
3. Submit a suspicious-looking example URL to `/investigate-url`.
4. Show the risk assessment, recommended action, and LLM explanation.
5. Open `/investigations` to demonstrate SQLite history.
6. Submit the same URL again to demonstrate the cache.
7. Run the Pytest suite to demonstrate automated testing.
8. Optionally demonstrate the Chrome extension's link warning flow.

Use test URLs only. Never enter real credentials or sensitive information on suspicious websites.

## 13. Limitations and Non-Goals

- URL risk detection uses rule-based heuristics and is not a guarantee that a website is safe or malicious.
- The LLM explains the assessment; it does not determine the final risk level.
- The cache is in-memory and resets when the backend restarts.
- The extension currently intercepts clicked HTTP and HTTPS anchor links. It does not provide system-wide protection for every navigation method, downloaded file, or application.
- The project is a defensive prototype, not a replacement for antivirus software, browser security features, or professional security tools.
- The current implementation does not include user authentication or rate limiting.

## 14. Project Goal

AI Threat Guardian aims to make suspicious-link investigation more accessible by combining browser-level warnings, multi-agent investigation, MCP tools, persistent history, caching, and understandable AI explanations in one integrated system.