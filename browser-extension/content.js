console.log("🛡️ AI THREAT GUARDIAN CONTENT SCRIPT ACTIVE");


/* =========================================================
   INTERCEPT LINK CLICKS
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        const url = link.href;

        if (!url || !url.startsWith("http")) {
            return;
        }

        /*
         * Stop the browser from navigating immediately.
         * Guardian will investigate first.
         */
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log(
            "🛡️ Guardian intercepted:",
            url
        );

        showLoadingPopup(url);

        chrome.runtime.sendMessage(
            {
                type: "INVESTIGATE_URL",
                url: url
            },
            function (response) {

                if (chrome.runtime.lastError) {

                    console.error(
                        "Guardian communication error:",
                        chrome.runtime.lastError
                    );

                    showErrorPopup(
                        url,
                        "Security engine could not be reached."
                    );

                    return;
                }

                console.log(
                    "🔎 Guardian investigation result:",
                    response
                );

                if (
                    !response ||
                    !response.result
                ) {

                    showErrorPopup(
                        url,
                        "No investigation result was received."
                    );

                    return;
                }

                showGuardianPopup(
                    url,
                    response.result
                );
            }
        );

    },
    true
);


/* =========================================================
   POPUP ROOT
   ========================================================= */

function createPopupRoot() {

    const oldPopup =
        document.getElementById(
            "threat-guardian-root"
        );

    if (oldPopup) {
        oldPopup.remove();
    }

    const root =
        document.createElement("div");

    root.id =
        "threat-guardian-root";

    document.documentElement.appendChild(root);

    return root;
}


/* =========================================================
   LOADING POPUP
   ========================================================= */

function showLoadingPopup(url) {

    const root =
        createPopupRoot();

    const shadow =
        root.attachShadow({
            mode: "open"
        });

    shadow.innerHTML = `

        <style>

            * {
                box-sizing: border-box;
            }

            .popup {

                position: fixed;

                top: 24px;
                right: 24px;

                width: 420px;

                z-index: 2147483647;

                font-family:
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    Roboto,
                    Helvetica,
                    Arial,
                    sans-serif;

                animation:
                    appear
                    180ms ease-out;
            }

            @keyframes appear {

                from {
                    opacity: 0;
                    transform:
                        translateY(-10px)
                        scale(0.98);
                }

                to {
                    opacity: 1;
                    transform:
                        translateY(0)
                        scale(1);
                }

            }

            .card {

                background: #ffffff;

                border:
                    1px solid #e5e7eb;

                border-radius: 18px;

                overflow: hidden;

                box-shadow:
                    0 20px 50px rgba(15, 23, 42, 0.16),
                    0 4px 12px rgba(15, 23, 42, 0.08);
            }

            .line {

                height: 4px;

                background: #111827;
            }

            .header {

                display: flex;

                align-items: center;

                gap: 11px;

                padding: 18px 20px;

                border-bottom:
                    1px solid #f1f5f9;
            }

            .logo {

                width: 34px;
                height: 34px;

                display: flex;

                align-items: center;
                justify-content: center;

                border-radius: 10px;

                background: #111827;

                color: white;

                font-size: 11px;

                font-weight: 800;
            }

            .brand {

                font-size: 13px;

                font-weight: 700;

                color: #111827;
            }

            .subtitle {

                margin-top: 2px;

                font-size: 10px;

                color: #9ca3af;
            }

            .body {

                padding: 20px;
            }

            .title {

                font-size: 18px;

                font-weight: 700;

                color: #111827;

                margin-bottom: 5px;
            }

            .description {

                font-size: 12px;

                line-height: 1.55;

                color: #6b7280;
            }

            .checking {

                margin-top: 17px;

                display: flex;

                align-items: center;

                gap: 10px;

                padding: 12px;

                border-radius: 11px;

                background: #f8fafc;

                border:
                    1px solid #edf2f7;

                font-size: 11px;

                color: #4b5563;
            }

            .spinner {

                width: 17px;
                height: 17px;

                flex-shrink: 0;

                border:
                    2px solid #e5e7eb;

                border-top-color:
                    #111827;

                border-radius: 50%;

                animation:
                    spin
                    0.8s linear infinite;
            }

            @keyframes spin {

                to {
                    transform: rotate(360deg);
                }

            }

            .url {

                margin-top: 12px;

                padding: 10px 12px;

                background: #fafafa;

                border-radius: 9px;

                border:
                    1px solid #eeeeee;

                color: #6b7280;

                font-size: 10px;

                line-height: 1.5;

                word-break: break-all;
            }

        </style>


        <div class="popup">

            <div class="card">

                <div class="line"></div>

                <div class="header">

                    <div class="logo">
                        TG
                    </div>

                    <div>

                        <div class="brand">
                            AI Threat Guardian
                        </div>

                        <div class="subtitle">
                            Real-time protection
                        </div>

                    </div>

                </div>


                <div class="body">

                    <div class="title">
                        Checking this link
                    </div>

                    <div class="description">
                        Guardian is investigating this
                        destination before allowing navigation.
                    </div>


                    <div class="checking">

                        <div class="spinner"></div>

                        <span>
                            Multi-agent security investigation...
                        </span>

                    </div>


                    <div class="url">
                        ${escapeHTML(url)}
                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   FINAL SECURITY POPUP
   ========================================================= */

function showGuardianPopup(
    url,
    result
) {

    const root =
        createPopupRoot();

    const shadow =
        root.attachShadow({
            mode: "open"
        });


    const risk =
        result.risk || "UNKNOWN";

    const isHigh =
        risk === "HIGH";

    const isMedium =
        risk === "MEDIUM";

    const isLow =
        risk === "LOW";


    const title =
        isHigh
            ? "Potential threat blocked"
            : isMedium
                ? "Suspicious link detected"
                : isLow
                    ? "Link checked"
                    : "Unable to determine safety";


    const description =
        isHigh
            ? "This destination contains indicators commonly associated with phishing or fraudulent activity."
            : isMedium
                ? "This destination contains suspicious characteristics. Review it before continuing."
                : isLow
                    ? "No major security indicators were detected."
                    : "Guardian could not confidently determine the safety of this destination.";


    const riskClass =
        isHigh
            ? "danger"
            : isMedium
                ? "warning"
                : isLow
                    ? "safe"
                    : "unknown";


    const actionText =
        isHigh
            ? "BLOCK"
            : isMedium
                ? "WARN"
                : isLow
                    ? "ALLOW"
                    : "REVIEW";


    const indicators =
        result.matched_indicators || [];


    const agents =
        result.agents || {};


    shadow.innerHTML = `

        <style>

            * {
                box-sizing: border-box;
            }


            .popup {

                position: fixed;

                top: 24px;
                right: 24px;

                width: 430px;

                max-width:
                    calc(100vw - 32px);

                z-index: 2147483647;

                font-family:
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    Roboto,
                    Helvetica,
                    Arial,
                    sans-serif;

                animation:
                    appear
                    180ms ease-out;
            }


            @keyframes appear {

                from {
                    opacity: 0;
                    transform:
                        translateY(-10px)
                        scale(0.98);
                }

                to {
                    opacity: 1;
                    transform:
                        translateY(0)
                        scale(1);
                }

            }


            .card {

                background: #ffffff;

                border:
                    1px solid #e5e7eb;

                border-radius: 18px;

                overflow: hidden;

                box-shadow:
                    0 20px 50px rgba(15, 23, 42, 0.16),
                    0 4px 12px rgba(15, 23, 42, 0.08);
            }


            .top-line {

                height: 4px;

                background: #6b7280;
            }


            .top-line.danger {
                background: #dc2626;
            }

            .top-line.warning {
                background: #d97706;
            }

            .top-line.safe {
                background: #16a34a;
            }


            .header {

                display: flex;

                align-items: center;

                justify-content: space-between;

                padding:
                    17px 20px;

                border-bottom:
                    1px solid #f1f5f9;
            }


            .brand {

                display: flex;

                align-items: center;

                gap: 11px;
            }


            .logo {

                width: 34px;
                height: 34px;

                display: flex;

                align-items: center;
                justify-content: center;

                border-radius: 10px;

                background: #111827;

                color: #ffffff;

                font-size: 11px;

                font-weight: 800;
            }


            .brand-name {

                font-size: 13px;

                font-weight: 700;

                color: #111827;
            }


            .brand-subtitle {

                margin-top: 2px;

                font-size: 10px;

                color: #9ca3af;
            }


            .close {

                width: 30px;
                height: 30px;

                border: none;

                display: flex;

                align-items: center;

                justify-content: center;

                background: transparent;

                border-radius: 8px;

                color: #9ca3af;

                font-size: 18px;

                cursor: pointer;
            }


            .close:hover {

                background: #f3f4f6;

                color: #111827;
            }


            .body {

                padding: 20px;
            }


            .status {

                display: flex;

                align-items: flex-start;

                justify-content: space-between;

                gap: 14px;
            }


            .status-left {

                display: flex;

                gap: 12px;
            }


            .status-icon {

                width: 40px;
                height: 40px;

                flex-shrink: 0;

                display: flex;

                align-items: center;
                justify-content: center;

                border-radius: 12px;

                font-size: 18px;

                font-weight: 800;
            }


            .status-icon.danger {

                background: #fef2f2;

                color: #dc2626;
            }


            .status-icon.warning {

                background: #fffbeb;

                color: #d97706;
            }


            .status-icon.safe {

                background: #f0fdf4;

                color: #16a34a;
            }


            .status-icon.unknown {

                background: #f3f4f6;

                color: #6b7280;
            }


            .title {

                font-size: 17px;

                font-weight: 700;

                letter-spacing: -0.02em;

                color: #111827;
            }


            .description {

                margin-top: 4px;

                max-width: 290px;

                font-size: 11px;

                line-height: 1.55;

                color: #6b7280;
            }


            .badge {

                padding:
                    6px 9px;

                border-radius: 8px;

                font-size: 9px;

                font-weight: 800;

                letter-spacing: 0.06em;
            }


            .badge.danger {

                background: #fee2e2;

                color: #b91c1c;
            }


            .badge.warning {

                background: #fef3c7;

                color: #b45309;
            }


            .badge.safe {

                background: #dcfce7;

                color: #15803d;
            }


            .badge.unknown {

                background: #f3f4f6;

                color: #6b7280;
            }


            .section {

                margin-top: 18px;
            }


            .label {

                margin-bottom: 7px;

                font-size: 9px;

                font-weight: 800;

                text-transform: uppercase;

                letter-spacing: 0.1em;

                color: #9ca3af;
            }


            .url {

                padding:
                    10px 12px;

                border-radius: 10px;

                background: #f8fafc;

                border:
                    1px solid #edf2f7;

                color: #374151;

                font-size: 10px;

                line-height: 1.5;

                word-break: break-all;
            }


            .chips {

                display: flex;

                flex-wrap: wrap;

                gap: 6px;
            }


            .chip {

                padding:
                    5px 8px;

                border:
                    1px solid #e5e7eb;

                background: #f9fafb;

                border-radius: 7px;

                color: #4b5563;

                font-size: 10px;
            }


            .engine {

                margin-top: 18px;

                padding:
                    10px 12px;

                display: flex;

                justify-content: space-between;

                align-items: center;

                border:
                    1px solid #e5e7eb;

                border-radius: 10px;

                background: #ffffff;
            }


            .engine-left {

                display: flex;

                align-items: center;

                gap: 8px;
            }


            .dot {

                width: 7px;
                height: 7px;

                border-radius: 50%;

                background: #16a34a;

                box-shadow:
                    0 0 0 3px #dcfce7;
            }


            .engine-text {

                font-size: 10px;

                font-weight: 600;

                color: #4b5563;
            }


            .mcp {

                font-size: 9px;

                font-weight: 700;

                color: #9ca3af;
            }


            .agents {

                margin-top: 9px;

                padding:
                    8px 12px;

                background: #f8fafc;

                border-radius: 10px;
            }


            .agent {

                display: flex;

                align-items: center;

                justify-content: space-between;

                padding: 5px 0;
            }


            .agent:not(:last-child) {

                border-bottom:
                    1px solid #eef2f7;
            }


            .agent-name {

                font-size: 10px;

                color: #4b5563;
            }


            .agent-state {

                font-size: 9px;

                color: #16a34a;

                font-weight: 600;
            }


            .footer {

                display: flex;

                gap: 9px;

                padding:
                    14px 20px;

                background: #fafafa;

                border-top:
                    1px solid #f1f5f9;
            }


            button {

                font-family: inherit;

                cursor: pointer;
            }


            .reject {

                flex: 1;

                height: 38px;

                border:
                    1px solid #d1d5db;

                border-radius: 9px;

                background: #ffffff;

                color: #374151;

                font-size: 11px;

                font-weight: 700;
            }


            .reject:hover {

                background: #f3f4f6;
            }


            .continue {

                flex: 1;

                height: 38px;

                border: none;

                border-radius: 9px;

                background: #111827;

                color: #ffffff;

                font-size: 11px;

                font-weight: 700;
            }


            .continue:hover {

                background: #374151;
            }


            .continue.danger {

                background: #dc2626;
            }


            .continue.danger:hover {

                background: #b91c1c;
            }


            @media (max-width: 520px) {

                .popup {

                    top: 12px;
                    right: 12px;
                    left: 12px;

                    width: auto;
                }

            }

        </style>


        <div class="popup">

            <div class="card">

                <div class="top-line ${riskClass}">
                </div>


                <!-- HEADER -->

                <div class="header">

                    <div class="brand">

                        <div class="logo">
                            TG
                        </div>

                        <div>

                            <div class="brand-name">
                                AI Threat Guardian
                            </div>

                            <div class="brand-subtitle">
                                Real-time protection
                            </div>

                        </div>

                    </div>


                    <button
                        class="close"
                        id="closeButton"
                    >
                        ×
                    </button>

                </div>


                <!-- BODY -->

                <div class="body">


                    <div class="status">

                        <div class="status-left">

                            <div class="status-icon ${riskClass}">
                                ${
                                    isHigh
                                        ? "!"
                                        : isMedium
                                            ? "!"
                                            : isLow
                                                ? "✓"
                                                : "?"
                                }
                            </div>


                            <div>

                                <div class="title">
                                    ${title}
                                </div>

                                <div class="description">
                                    ${description}
                                </div>

                            </div>

                        </div>


                        <div class="badge ${riskClass}">
                            ${actionText}
                        </div>

                    </div>


                    <!-- URL -->

                    <div class="section">

                        <div class="label">
                            Destination
                        </div>

                        <div class="url">
                            ${escapeHTML(url)}
                        </div>

                    </div>


                    <!-- INDICATORS -->

                    ${
                        indicators.length > 0
                            ? `
                                <div class="section">

                                    <div class="label">
                                        Security indicators
                                    </div>

                                    <div class="chips">

                                        ${indicators
                                            .map(
                                                item => `
                                                    <span class="chip">
                                                        ${escapeHTML(item)}
                                                    </span>
                                                `
                                            )
                                            .join("")}

                                    </div>

                                </div>
                            `
                            : ""
                    }


                    <!-- ENGINE -->

                    <div class="engine">

                        <div class="engine-left">

                            <div class="dot">
                            </div>

                            <div class="engine-text">
                                Security analysis completed
                            </div>

                        </div>

                        <div class="mcp">
                            ${
                                result.mcp
                                    ? "MCP VERIFIED"
                                    : "SECURITY ENGINE"
                            }
                        </div>

                    </div>


                    <!-- AGENTS -->

                    <div class="agents">

                        ${renderAgent(
                            "URL Investigation Agent",
                            agents.url_agent
                        )}

                        ${renderAgent(
                            "Domain Investigation Agent",
                            agents.domain_agent
                        )}

                        ${renderAgent(
                            "Risk Assessment Agent",
                            agents.risk_agent
                        )}

                    </div>

                </div>


                <!-- FOOTER -->

                <div class="footer">

                    <button
                        class="reject"
                        id="rejectButton"
                    >
                        Reject
                    </button>


                    <button
                        class="continue ${
                            isHigh
                                ? "danger"
                                : ""
                        }"
                        id="continueButton"
                    >
                        ${
                            isHigh
                                ? "Continue anyway"
                                : "Continue"
                        }
                    </button>

                </div>

            </div>

        </div>
    `;


    /* =====================================================
       REJECT
       ===================================================== */

    shadow
        .getElementById("rejectButton")
        .addEventListener(
            "click",
            function () {

                console.log(
                    "🛡️ Guardian blocked navigation:",
                    url
                );

                root.remove();
            }
        );


    /* =====================================================
       CONTINUE
       ===================================================== */

    shadow
        .getElementById("continueButton")
        .addEventListener(
            "click",
            function () {

                console.log(
                    "🛡️ User allowed navigation:",
                    url
                );

                root.remove();

                window.location.href =
                    url;
            }
        );


    /* =====================================================
       CLOSE
       ===================================================== */

    shadow
        .getElementById("closeButton")
        .addEventListener(
            "click",
            function () {

                root.remove();
            }
        );
}


/* =========================================================
   ERROR POPUP
   ========================================================= */

function showErrorPopup(
    url,
    message
) {

    showGuardianPopup(
        url,
        {
            url: url,

            risk: "UNKNOWN",

            action: "BLOCK",

            matched_indicators: [],

            message: message,

            mcp: false,

            agents: {}
        }
    );
}


/* =========================================================
   AGENT ROW
   ========================================================= */

function renderAgent(
    name,
    data
) {

    if (!data) {

        return `
            <div class="agent">

                <div class="agent-name">
                    ${name}
                </div>

                <div class="agent-state">
                    unavailable
                </div>

            </div>
        `;
    }


    return `
        <div class="agent">

            <div class="agent-name">
                ${name}
            </div>

            <div class="agent-state">
                ✓ verified
            </div>

        </div>
    `;
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}