const params =
    new URLSearchParams(window.location.search);


const requestedURL =
    params.get("url") || "Unknown URL";


const urlElement =
    document.getElementById("url");

const statusElement =
    document.getElementById("status");

const detailsElement =
    document.getElementById("details");


urlElement.textContent =
    requestedURL;


// --------------------------------------
// GO BACK
// --------------------------------------

document
    .getElementById("backButton")
    .addEventListener("click", () => {

        window.close();

    });


// --------------------------------------
// CONTINUE
// --------------------------------------

document
    .getElementById("continueButton")
    .addEventListener("click", async () => {

        const data =
            await chrome.storage.local.get(
                "latestInvestigation"
            );


        const investigation =
            data.latestInvestigation;


        if (
            investigation &&
            investigation.sourceTabId
        ) {

            chrome.tabs.update(
                investigation.sourceTabId,
                {
                    url: requestedURL
                }
            );

        }

        window.close();

    });


// --------------------------------------
// LOAD INVESTIGATION RESULT
// --------------------------------------

async function loadInvestigation() {

    const data =
        await chrome.storage.local.get(
            "latestInvestigation"
        );


    const investigation =
        data.latestInvestigation;


    if (!investigation) {

        showUnknown();

        return;
    }


    if (
        investigation.risk === "HIGH"
    ) {

        showHighRisk(investigation);

    }

    else {

        showLowRisk(investigation);

    }

}


function showHighRisk(result) {

    statusElement.className =
        "status high";


    statusElement.innerHTML = `

        <h2>
            🚨 HIGH RISK
        </h2>

        <p>
            ${result.message}
        </p>

    `;


    const indicators =
        result.matched_indicators || [];


    detailsElement.innerHTML = `

        <strong>
            Detected indicators:
        </strong>

        <ul>

            ${
                indicators
                    .map(
                        item =>
                            `<li>${item}</li>`
                    )
                    .join("")
            }

        </ul>

    `;

}


function showLowRisk(result) {

    statusElement.className =
        "status low";


    statusElement.innerHTML = `

        <h2>
            ✅ LOW RISK
        </h2>

        <p>
            ${result.message}
        </p>

    `;


    detailsElement.innerHTML = `

        <strong>
            No major suspicious indicators detected.
        </strong>

    `;

}


function showUnknown() {

    statusElement.className =
        "status unknown";


    statusElement.innerHTML = `

        <h2>
            ⚠️ UNKNOWN
        </h2>

        <p>
            The security engine could not determine
            the risk of this request.
        </p>

    `;

}


loadInvestigation();