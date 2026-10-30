from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from fastapi.responses import HTMLResponse
from cache import get_cached_result, cache_result
from services.llm_service import generate_threat_explanation

from agents.threat_agent import investigate_url as run_threat_investigation

from database import (
    initialize_database,
    save_investigation,
    get_investigations
)

app = FastAPI(
    title="AI Threat Guardian",
    description="Multi-Agent Scam and Phishing Investigation System",
    version="1.0.0"
)

initialize_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str


@app.get("/")
def root():
    return {
        "system": "AI Threat Guardian",
        "status": "online",
        "message": "Threat Guardian backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/investigate-url")
def investigate_url(request: URLRequest):

    # 1. Check cache first
    cached_result = get_cached_result(request.url)

    if cached_result is not None:
        cached_result["cache_hit"] = True
        return cached_result

    # 2. Run the existing multi-agent investigation
    result = run_threat_investigation(request.url)

    risk = result["final_risk"]
    action = result["action"]

    indicators = result.get(
        "matched_indicators",
        []
    )

    # 3. Save the investigation to SQLite
    investigation_record = {
        "url": request.url,
        "risk": risk,
        "action": action,
        "matched_indicators": indicators
    }

    record_id = save_investigation(
        investigation_record
    )

       # 4. Generate an AI explanation
    ai_explanation = generate_threat_explanation(
        request.url,
        risk,
        action,
        indicators
    )

    # 5. Prepare the API response
    response = {
        "id": record_id,
        "url": request.url,
        "risk": risk,
        "action": action,
        "matched_indicators": indicators,
        "agent": result["agent"],
        "mcp": result.get("mcp", False),
        "agents": result.get("agents", {}),
        "message": result.get(
            "message",
            "Threat investigation completed."
        ),
        "ai_explanation": ai_explanation,
        "cache_hit": False
    }

      # 6. Store the completed result in cache
    cache_result(request.url, response)

    return response

@app.get("/investigations")
def investigation_history(limit: int = 50):

    records = get_investigations(
        limit=max(1, min(limit, 100))
    )

    return {
        "count": len(records),
        "investigations": records
    }

@app.get("/demo", response_class=HTMLResponse)
def demo():

    return """
    <!DOCTYPE html>

    <html>

    <head>

        <title>Threat Guardian Demo</title>

        <style>

            body {
                font-family: Arial, sans-serif;
                padding: 50px;
                background: #f5f7fb;
            }

            .card {
                max-width: 700px;
                margin: auto;
                padding: 30px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,.1);
            }

            a {
                display: block;
                margin: 20px 0;
                padding: 15px;
                border-radius: 10px;
                background: #eef2ff;
                color: #1d4ed8;
                text-decoration: none;
            }

        </style>

    </head>

    <body>

        <div class="card">

            <h1>
                🧪 AI Threat Guardian Demo
            </h1>

            <p>
                Click one of the URLs below.
                The browser extension should intercept it
                before navigation.
            </p>


            <a href="https://secure-bank-verification.xyz/login">
                🔴 Suspicious Bank Verification URL
            </a>


            <a href="https://www.wikipedia.org">
                🟢 Normal Example URL
            </a>

        </div>

    </body>

    </html>
    """