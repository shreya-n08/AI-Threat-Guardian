import { useState } from "react";
import { investigateURL } from "./services/api";

function App() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleInvestigation(e) {
        e.preventDefault();

        if (!url.trim()) {
            setError("Please enter a URL.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await investigateURL(
                url.trim()
            );

            setResult(data);
        } catch (err) {
            console.error(err);
            setError(
                "Could not connect to the Threat Guardian backend."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f6f7f9]">

            {/* NAVBAR */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white">
                            🛡
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                                Threat Guardian
                            </h1>

                            <p className="text-xs text-gray-500">
                                AI security protection
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Protection active
                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="mx-auto max-w-6xl px-6 py-20">

                <div className="mx-auto max-w-3xl text-center">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Multi-agent threat detection
                    </div>

                    <h2 className="text-5xl font-semibold tracking-tight text-gray-950">
                        Check before
                        <br />
                        <span className="text-gray-400">
                            you trust.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-500">
                        Threat Guardian investigates suspicious
                        links using multiple security agents and
                        gives you a clear decision before you continue.
                    </p>


                    {/* URL FORM */}
                    <form
                        onSubmit={handleInvestigation}
                        className="mx-auto mt-10"
                    >

                        <div className="flex rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/40">

                            <input
                                type="url"
                                value={url}
                                onChange={(e) =>
                                    setUrl(e.target.value)
                                }
                                placeholder="Paste a suspicious URL..."
                                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Investigating..."
                                    : "Investigate"}
                            </button>

                        </div>

                    </form>


                    {/* ERROR */}
                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                </div>


                {/* FEATURES */}
                <div className="mx-auto mt-20 grid max-w-4xl gap-4 md:grid-cols-3">

                    <InfoCard
                        title="Multi-Agent"
                        description="Specialized agents independently investigate the threat."
                    />

                    <InfoCard
                        title="MCP Connected"
                        description="Security tools are accessed through the Model Context Protocol."
                    />

                    <InfoCard
                        title="Instant Decision"
                        description="Receive a clear BLOCK, WARN, or ALLOW decision."
                    />

                </div>

            </main>


            {/* RESULT MODAL */}
            {result && (
                <InvestigationModal
                    result={result}
                    onClose={() => setResult(null)}
                />
            )}

        </div>
    );
}


/* -------------------------------- */
/* INFO CARD */
/* -------------------------------- */

function InfoCard({
    title,
    description
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">

            <h3 className="text-sm font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

        </div>
    );
}


/* -------------------------------- */
/* INVESTIGATION MODAL */
/* -------------------------------- */

function InvestigationModal({
    result,
    onClose
}) {

    const isHigh =
        result.risk === "HIGH";

    const isMedium =
        result.risk === "MEDIUM";


    const riskColor = isHigh
        ? "red"
        : isMedium
            ? "yellow"
            : "green";


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4 backdrop-blur-sm">

            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">


                {/* HEADER */}
                <div className="border-b border-gray-100 px-7 py-6">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                                Guardian Intercept
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                                {isHigh
                                    ? "Something doesn't look right."
                                    : isMedium
                                        ? "Proceed with caution."
                                        : "This link looks safe."
                                }
                            </h2>

                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-900"
                        >
                            ✕
                        </button>

                    </div>

                </div>


                {/* RESULT */}
                <div className="px-7 py-6">


                    {/* RISK STATUS */}
                    <div
                        className={
                            riskColor === "red"
                                ? "rounded-2xl border border-red-200 bg-red-50 p-5"
                                : riskColor === "yellow"
                                    ? "rounded-2xl border border-yellow-200 bg-yellow-50 p-5"
                                    : "rounded-2xl border border-green-200 bg-green-50 p-5"
                        }
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Threat assessment
                                </p>

                                <p
                                    className={
                                        riskColor === "red"
                                            ? "mt-1 text-xl font-semibold text-red-700"
                                            : riskColor === "yellow"
                                                ? "mt-1 text-xl font-semibold text-yellow-700"
                                                : "mt-1 text-xl font-semibold text-green-700"
                                    }
                                >
                                    {result.risk}
                                </p>

                            </div>


                            <div
                                className={
                                    riskColor === "red"
                                        ? "rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white"
                                        : riskColor === "yellow"
                                            ? "rounded-full bg-yellow-500 px-4 py-2 text-xs font-semibold text-white"
                                            : "rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white"
                                }
                            >
                                {result.action}
                            </div>

                        </div>

                    </div>


                    {/* URL */}
                    <div className="mt-5">

                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Requested URL
                        </p>

                        <div className="mt-2 rounded-xl bg-gray-50 p-4">

                            <p className="break-all text-sm leading-6 text-gray-700">
                                {result.url}
                            </p>

                        </div>

                    </div>


                    {/* MESSAGE */}
                    <p className="mt-5 text-sm leading-6 text-gray-600">
                        {result.message}
                    </p>


                    {/* INDICATORS */}
                    {result.matched_indicators?.length > 0 && (

                        <div className="mt-5">

                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                Detected indicators
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">

                                {result.matched_indicators.map(
                                    (indicator) => (

                                        <span
                                            key={indicator}
                                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                                        >
                                            {indicator}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* AGENT INFO */}
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white">

                        <div className="border-b border-gray-100 px-4 py-3 text-xs text-gray-500">
                            {result.mcp
                                ? "3 security agents · MCP verified"
                                : "Security investigation completed"
                            }
                        </div>

                        <div className="divide-y divide-gray-100">

                            <AgentRow
                                name="URL Investigation Agent"
                                data={
                                    result.agents?.url_agent
                                }
                            />

                            <AgentRow
                                name="Domain Investigation Agent"
                                data={
                                    result.agents?.domain_agent
                                }
                            />

                            <AgentRow
                                name="Risk Assessment Agent"
                                data={
                                    result.agents?.risk_agent
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}
                <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-7 py-5">

                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Leave
                    </button>

                    <button
                        onClick={onClose}
                        className={
                            isHigh
                                ? "flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
                                : "flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700"
                        }
                    >
                        {isHigh
                            ? "Proceed anyway"
                            : "Continue"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}


/* -------------------------------- */
/* AGENT ROW */
/* -------------------------------- */

function AgentRow({
    name,
    data
}) {

    if (!data) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-4 py-3">

            <div>

                <p className="text-sm font-medium text-gray-800">
                    {name}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    {data.risk || data.final_risk}
                </p>

            </div>

            <span className="text-xs text-gray-400">
                ✓ completed
            </span>

        </div>
    );
}


export default App;