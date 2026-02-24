/**
 * PredictionCard — Displays the AI prediction result.
 *
 * Props:
 *  - prediction : { className: string, probability: number } | null
 *  - isModelReady : boolean
 *  - cameraActive : boolean
 *  - onAdd : callback function
 */
export default function PredictionCard({ prediction, isModelReady, cameraActive, onAdd }) {
    const confidence = prediction ? Math.round(prediction.probability * 100) : 0;
    const isLowConfidence = confidence < 50;
    const showFallback = !prediction || isLowConfidence;

    // Color coding for confidence bar
    const barColor =
        confidence >= 80
            ? 'bg-medical-safe'
            : confidence >= 50
                ? 'bg-medical-warn'
                : 'bg-medical-danger';

    const barBg =
        confidence >= 80
            ? 'bg-medical-safe/15'
            : confidence >= 50
                ? 'bg-medical-warn/15'
                : 'bg-medical-danger/15';

    // When camera is not active and no prediction, show idle state
    if (!cameraActive && !prediction) {
        return (
            <div className="w-full max-w-[420px] bg-medical-card rounded-3xl shadow-card p-8 text-center animate-fade-in border border-primary-100">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                </div>
                <p className="text-elder-base text-medical-muted">
                    Start the camera to identify your pill
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[420px] bg-medical-card rounded-3xl shadow-card p-8 animate-slide-up border border-primary-100 transition-all duration-300">
            {/* ── Header ────────────────────────────────────────── */}
            <h2 className="text-elder-sm font-semibold text-medical-muted mb-5 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isModelReady ? 'bg-medical-safe animate-pulse' : 'bg-medical-warn animate-pulse'}`} />
                {isModelReady ? 'AI Analysis' : 'Loading Model…'}
            </h2>

            {/* ── Prediction Result ─────────────────────────────── */}
            {!showFallback ? (
                <div className="space-y-5">
                    {/* Pill name */}
                    <div className="text-center">
                        <p className="text-elder-sm text-medical-muted mb-1">Identified As</p>
                        <p className="text-elder-2xl font-bold text-medical-text leading-tight">
                            {prediction.className}
                        </p>
                    </div>

                    {/* Confidence bar */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-elder-sm text-medical-muted font-medium">Confidence</span>
                            <span className={`text-elder-lg font-bold ${confidence >= 80 ? 'text-medical-safe' : confidence >= 50 ? 'text-medical-warn' : 'text-medical-danger'}`}>
                                {confidence}%
                            </span>
                        </div>
                        <div className={`w-full h-4 rounded-full overflow-hidden ${barBg}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>

                    {/* Confidence hint */}
                    {confidence >= 80 && (
                        <p className="text-medical-safe text-elder-sm text-center font-medium animate-fade-in">
                            ✅ High confidence — likely match
                        </p>
                    )}
                    {confidence >= 50 && confidence < 80 && (
                        <p className="text-medical-warn text-elder-sm text-center font-medium animate-fade-in">
                            ⚠️ Moderate confidence — verify with pharmacist
                        </p>
                    )}

                    {/* Bridge Button */}
                    <button
                        onClick={onAdd}
                        disabled={isLowConfidence}
                        className={`w-full py-4 rounded-2xl font-bold text-elder-base shadow-btn transition-all duration-300 flex items-center justify-center gap-2 mt-2
                            ${isLowConfidence
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add to My Meds
                    </button>
                </div>
            ) : (
                /* ── Fallback Message ────────────────────────────── */
                <div className="text-center space-y-4 py-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-medical-danger/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-medical-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <p className="text-elder-base text-medical-text font-semibold">
                        Unable to identify pill
                    </p>
                    <p className="text-elder-sm text-medical-muted">
                        Please add the pill details manually or try again with better lighting.
                    </p>
                    <button className="mt-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-elder-sm py-3 px-6 rounded-2xl transition-colors duration-200">
                        ➕ Add Pill Manually
                    </button>
                </div>
            )}
        </div>
    );
}
