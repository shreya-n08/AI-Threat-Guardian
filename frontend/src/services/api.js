const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function investigateURL(url) {
    const response = await fetch(
        `${API_URL}/investigate-url`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            "Threat investigation failed"
        );
    }

    return await response.json();
}