from urllib.parse import urlparse


SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "verification",
    "account",
    "bank",
    "secure",
    "password",
    "wallet",
    "update",
    "confirm",
    "signin",
]


def check_url(url: str) -> dict:

    parsed = urlparse(url)

    indicators = []

    lower_url = url.lower()

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in lower_url:
            indicators.append(keyword)

    if not parsed.scheme:
        indicators.append("missing_scheme")

    if not parsed.netloc:
        indicators.append("invalid_domain")

    if parsed.scheme != "https":
        indicators.append("not_https")

    if len(indicators) >= 3:
        risk = "HIGH"

    elif len(indicators) >= 1:
        risk = "MEDIUM"

    else:
        risk = "LOW"

    return {
        "tool": "check_url",
        "url": url,
        "risk": risk,
        "matched_indicators": indicators,
    }