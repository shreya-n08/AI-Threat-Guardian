
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent / "threat_guardian.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS investigations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                risk TEXT NOT NULL,
                action TEXT NOT NULL,
                matched_indicators TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


def save_investigation(result: dict) -> int:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO investigations (
                url, risk, action, matched_indicators, created_at
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                result["url"],
                result["risk"],
                result["action"],
                json.dumps(result.get("matched_indicators", [])),
                datetime.now(timezone.utc).isoformat()
            )
        )
        return cursor.lastrowid


def get_investigations(limit: int = 50) -> list:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM investigations
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,)
        ).fetchall()

    investigations = []

    for row in rows:
        item = dict(row)
        item["matched_indicators"] = json.loads(
            item["matched_indicators"]
        )
        investigations.append(item)

    return investigations
