const BACKEND_URL =
    "http://127.0.0.1:8000";


console.log(
    "🛡️ AI Threat Guardian background service started"
);


/* ========================================================= */
/* MESSAGE HANDLER */
/* ========================================================= */

chrome.runtime.onMessage.addListener(
    function (
        message,
        sender,
        sendResponse
    ) {

        if (
            message.type !==
            "INVESTIGATE_URL"
        ) {
            return;
        }


        investigateURL(
            message.url
        )
            .then(function (result) {

                console.log(
                    "🔎 Investigation completed:",
                    result
                );


                /*
                    Keep latest result
                    in extension storage.
                */

                chrome.storage.local.set({

                    latestInvestigation: {

                        ...result,

                        sourceTabId:
                            sender.tab
                                ? sender.tab.id
                                : null,

                        checkedAt:
                            new Date().toISOString()

                    }

                });


                /*
                    Send result back
                    to content.js
                */

                sendResponse({
                    success: true,
                    result: result
                });

            })
            .catch(function (error) {

                console.error(
                    "❌ Backend investigation error:",
                    error
                );


                sendResponse({
                    success: false,

                    result: {

                        url: message.url,

                        risk: "UNKNOWN",

                        action: "BLOCK",

                        matched_indicators: [],

                        message:
                            "Threat Guardian could not reach the security engine.",

                        mcp: false,

                        agents: {}

                    }
                });

            });


        /*
            Required because
            response is asynchronous.
        */

        return true;
    }
);


/* ========================================================= */
/* BACKEND INVESTIGATION */
/* ========================================================= */

async function investigateURL(url) {

    console.log(
        "🛡️ Sending URL to Threat Guardian:",
        url
    );


    const response =
        await fetch(
            `${BACKEND_URL}/investigate-url`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


    if (!response.ok) {

        throw new Error(
            `Backend returned ${response.status}`
        );
    }


    return await response.json();
}