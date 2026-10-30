import cache


def setup_function():
    cache._investigation_cache.clear()


def test_cache_stores_and_returns_result():
    result = {
        "url": "https://example.com",
        "risk": "HIGH",
        "action": "BLOCK"
    }

    cache.cache_result(result["url"], result)

    cached_result = cache.get_cached_result(result["url"])

    assert cached_result == result


def test_cache_returns_a_copy():
    result = {
        "url": "https://example.com",
        "risk": "HIGH",
        "action": "BLOCK"
    }

    cache.cache_result(result["url"], result)

    cached_result = cache.get_cached_result(result["url"])
    cached_result["risk"] = "LOW"

    original_cached_result = cache.get_cached_result(result["url"])

    assert original_cached_result["risk"] == "HIGH"


def test_expired_cache_returns_none(monkeypatch):
    current_time = 100.0

    monkeypatch.setattr(
        cache.time,
        "monotonic",
        lambda: current_time
    )

    result = {
        "url": "https://example.com",
        "risk": "HIGH",
        "action": "BLOCK"
    }

    cache.cache_result(result["url"], result)

    current_time = 200.0

    assert cache.get_cached_result(result["url"]) is None