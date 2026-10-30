import main
from fastapi.testclient import TestClient


client = TestClient(main.app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["system"] == "AI Threat Guardian"
    assert response.json()["status"] == "online"


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_investigate_url(monkeypatch):
    monkeypatch.setattr(
        main,
        "get_cached_result",
        lambda url: None
    )

    monkeypatch.setattr(
        main,
        "run_threat_investigation",
        lambda url: {
            "final_risk": "HIGH",
            "action": "BLOCK",
            "matched_indicators": ["bank", "verification"],
            "agent": "Threat Guardian",
            "mcp": True,
            "agents": {},
            "message": "Investigation completed."
        }
    )

    monkeypatch.setattr(
        main,
        "save_investigation",
        lambda result: 101
    )

    monkeypatch.setattr(
        main,
        "generate_threat_explanation",
        lambda url, risk, action, indicators:
            "This URL has suspicious indicators. Avoid opening it."
    )

    monkeypatch.setattr(
        main,
        "cache_result",
        lambda url, result: None
    )

    response = client.post(
        "/investigate-url",
        json={"url": "https://example.xyz/login"}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 101
    assert data["risk"] == "HIGH"
    assert data["action"] == "BLOCK"
    assert data["cache_hit"] is False
    assert data["ai_explanation"] == (
        "This URL has suspicious indicators. Avoid opening it."
    )


def test_investigate_url_cache_hit(monkeypatch):
    cached_result = {
        "id": 101,
        "url": "https://example.xyz/login",
        "risk": "HIGH",
        "action": "BLOCK",
        "matched_indicators": ["bank"],
        "agent": "Threat Guardian",
        "mcp": True,
        "agents": {},
        "message": "Cached result.",
        "ai_explanation": "Previously generated explanation.",
        "cache_hit": False
    }

    monkeypatch.setattr(
        main,
        "get_cached_result",
        lambda url: cached_result.copy()
    )

    def should_not_run(url):
        raise AssertionError("Investigation should not run on a cache hit")

    monkeypatch.setattr(
        main,
        "run_threat_investigation",
        should_not_run
    )

    response = client.post(
        "/investigate-url",
        json={"url": "https://example.xyz/login"}
    )

    assert response.status_code == 200
    assert response.json()["cache_hit"] is True


def test_investigation_history(monkeypatch):
    sample_records = [
        {
            "id": 1,
            "url": "https://example.xyz",
            "risk": "HIGH",
            "action": "BLOCK",
            "matched_indicators": ["bank"],
            "created_at": "2026-10-30T10:00:00"
        }
    ]

    monkeypatch.setattr(
        main,
        "get_investigations",
        lambda limit: sample_records
    )

    response = client.get("/investigations")

    assert response.status_code == 200
    assert response.json()["count"] == 1
    assert response.json()["investigations"][0]["risk"] == "HIGH"