from urllib.parse import urlparse


def check_domain(url: str) -> dict:

    parsed = urlparse(url)

    domain = parsed.netloc.lower()

    suspicious_tlds = [
        ".xyz",
        ".top",
        ".click",
        ".zip",
        ".tk",
        ".ml",
        ".ga",
        ".cf"
    ]

    matched = []

    for tld in suspicious_tlds:
        if domain.endswith(tld):
            matched.append(tld)

    if matched:
        risk = "HIGH"
    else:
        risk = "LOW"

    return {
        "tool": "check_domain",
        "domain": domain,
        "risk": risk,
        "matched_indicators": matched
    }