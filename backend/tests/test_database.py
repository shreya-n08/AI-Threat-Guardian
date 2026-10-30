import database


def test_database_initializes(tmp_path, monkeypatch):
    test_db = tmp_path / "test_threat_guardian.db"

    monkeypatch.setattr(database, "DATABASE_PATH", test_db)

    database.initialize_database()

    assert test_db.exists()


def test_save_and_get_investigation(tmp_path, monkeypatch):
    test_db = tmp_path / "test_threat_guardian.db"

    monkeypatch.setattr(database, "DATABASE_PATH", test_db)

    database.initialize_database()

    investigation = {
        "url": "https://secure-bank-verification.xyz/login",
        "risk": "HIGH",
        "action": "BLOCK",
        "matched_indicators": ["bank", "verification", ".xyz"]
    }

    record_id = database.save_investigation(investigation)

    records = database.get_investigations()

    assert record_id == 1
    assert len(records) == 1
    assert records[0]["url"] == investigation["url"]
    assert records[0]["risk"] == "HIGH"
    assert records[0]["action"] == "BLOCK"
    assert records[0]["matched_indicators"] == [
        "bank", "verification", ".xyz"
    ]
    assert records[0]["created_at"]