# My 10x Solution - Shreya Nagar

## Project: AI Threat Guardian

**Multi-Agent Scam & Phishing Investigation System using MCP**

### 1. Problem Statement

Phishing and scam websites often imitate legitimate websites to trick users into sharing passwords, banking details, and other sensitive information. Many users cannot easily identify suspicious links before opening them.

AI Threat Guardian addresses this problem by investigating clicked website links and displaying a risk assessment before allowing navigation to continue.

### 2. Target Users

- Everyday internet users.
- People who frequently interact with links on websites.
- Users who need understandable information about potentially suspicious URLs.

### 3. My 10x Solution

AI Threat Guardian combines a Chrome browser extension, FastAPI backend, MCP-based investigation tools, multiple investigation agents, SQLite storage, caching, and LLM-generated explanations.

The solution aims to make suspicious-link investigation more accessible by bringing the assessment directly into the user's browsing workflow.

**10x value proposition:** Instead of requiring users to manually investigate a suspicious URL using multiple tools, the system provides an integrated investigation and an understandable risk explanation through a browser warning workflow.

The system uses rule-based logic to determine the final risk level and recommended action. The LLM explains the result but does not independently decide whether a URL is safe or malicious.

### 4. Five Concepts Implemented

| No. | Concept | Implementation |
|---|---|---|
| 1 | API Endpoints | FastAPI endpoints for URL investigation, health checks, and investigation history |
| 2 | Database | SQLite stores URL investigation results, risk levels, actions, indicators, and timestamps |
| 3 | Caching | In-memory cache with a 60-second TTL to reuse recent investigation responses |
| 4 | LLM Integration | Groq GPT-OSS 20B generates human-readable threat explanations |
| 5 | Automated Test Suite | Pytest tests API endpoints, database operations, and caching behavior |

### 5. Approved Swap Explanation

The automated test suite is the approved replacement concept.

The project implements four original concepts: API endpoints, database, caching, and LLM integration. Automated testing replaces one of the other original concepts.

The test suite uses Pytest and FastAPI TestClient. It verifies API behavior, SQLite persistence, cache storage, cache copying, and cache expiration. External agent and LLM dependencies are mocked in API tests so that tests do not require live external services.

This gives the project repeatable verification and helps prevent regressions when the backend changes.

### 6. System Architecture

1. The Chrome extension detects a user clicking an HTTP or HTTPS anchor link.
2. The content script intercepts the navigation.
3. The background service worker sends the URL to the FastAPI backend.
4. The backend coordinates URL, domain, and risk investigation agents.
5. MCP tools provide URL and domain investigation capabilities.
6. Rule-based logic determines the risk level and action: ALLOW, WARN, or BLOCK.
7. SQLite stores the investigation history.
8. The Groq LLM generates a human-readable explanation.
9. The browser extension displays the result and allows the user to reject navigation or continue.

### 7. One Non-Goal

The project does not aim to replace antivirus software, browser security features, or professional cybersecurity solutions. It is a defensive prototype that provides an additional layer of suspicious-link awareness.

It does not guarantee that every malicious URL will be detected or that every URL classified as low risk is safe.

### 8. How to Run the Project

**Backend**

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add a valid Groq API key to `backend/.env`, then run:

```bash
uvicorn main:app --reload
```

**API documentation:** `http://127.0.0.1:8000/docs`

**Automated tests**

From the backend directory:

```bash
python -m pytest -v
```

**Frontend**

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

**Chrome extension**

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select Load unpacked.
4. Choose the `browser-extension` directory.

### 9. Demonstration

The five-minute demonstration will show:

1. Starting the FastAPI backend.
2. Investigating a sample suspicious-looking URL through Swagger UI.
3. Displaying the risk level, recommended action, and LLM explanation.
4. Viewing saved investigation history in SQLite.
5. Repeating an investigation to demonstrate caching.
6. Running the automated test suite.
7. Demonstrating the Chrome extension warning workflow.

### 10. Expected Outcome

AI Threat Guardian provides an integrated prototype for suspicious-link investigation. It combines API development, persistent data storage, caching, LLM integration, MCP-based tools, and automated testing to make URL risk assessments easier to access and understand.

**Project Name:** AI Threat Guardian  
**Student:** Shreya Nagar  
**Track:** Backend AI Engineering