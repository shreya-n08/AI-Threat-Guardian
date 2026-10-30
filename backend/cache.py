
import time

CACHE_TTL_SECONDS = 60

_investigation_cache = {}


def get_cached_result(url: str):
    key = url.strip().lower()

    cached = _investigation_cache.get(key)

    if cached is None:
        return None

    result, expires_at = cached

    if time.monotonic() >= expires_at:
        del _investigation_cache[key]
        return None

    return result.copy()


def cache_result(url: str, result: dict):
    key = url.strip()

    expires_at = time.monotonic() + CACHE_TTL_SECONDS

    _investigation_cache[key] = (
        result.copy(),
        expires_at
    )
