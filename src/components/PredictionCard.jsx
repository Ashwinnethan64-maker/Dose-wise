import GlassCard from './ui/GlassCard';

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
            <GlassCard padding="p-6 sm:p-8" className="w-full text-center flex flex-col items-center justify-center min-h-[320px]">
                <div className="mx-auto mb-4 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                </div>
                <p className="text-base sm:text-lg font-bold themed-text">
                    Start the camera to identify your pill
                </p>
            </GlassCard>
        );
    }

    return (
        <GlassCard padding="p-6 sm:p-8" className="w-full flex flex-col justify-center min-h-[320px]">
            {/* ── Header ────────────────────────────────────────── */}
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider themed-text-muted mb-5 flex items-center justify-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isModelReady ? 'bg-medical-safe animate-pulse' : 'bg-medical-warn animate-pulse'}`} />
                {isModelReady ? 'AI Analysis' : 'Loading Model…'}
            </h2>

            {/* ── Prediction Result ─────────────────────────────── */}
            {!showFallback ? (
                <div className="space-y-5">
                    {/* Pill name */}
                    <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1">Identified As</p>
                        <p className="text-2xl sm:text-3xl font-extrabold themed-text leading-tight">
                            {prediction.className}
                        </p>
                    </div>

                    {/* Confidence bar */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-sm themed-text-muted font-semibold">Confidence</span>
                            <span className={`text-lg font-bold ${confidence >= 80 ? 'text-medical-safe' : confidence >= 50 ? 'text-medical-warn' : 'text-medical-danger'}`}>
                                {confidence}%
                            </span>
                        </div>
                        <div className={`w-full h-3.5 rounded-full overflow-hidden ${barBg}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>

                    {/* Confidence hint */}
                    {confidence >= 80 && (
                        <p className="text-medical-safe text-sm text-center font-semibold flex items-center justify-center gap-1.5">
                            ✅ High confidence — likely match
                        </p>
                    )}
                    {confidence >= 50 && confidence < 80 && (
                        <p className="text-medical-warn text-sm text-center font-semibold flex items-center justify-center gap-1.5">
                            ⚠️ Moderate confidence — verify with pharmacist
                        </p>
                    )}

                    {/* Bridge Button */}
                    <button
                        onClick={onAdd}
                        disabled={isLowConfidence}
                        className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base shadow-btn transition-all duration-300 flex items-center justify-center gap-2 mt-2
                            ${isLowConfidence
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] text-white'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add to My Meds
                    </button>
                </div>
            ) : (
                /* ── Fallback Message ────────────────────────────── */
                <div className="text-center space-y-4 py-2 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100/80 flex items-center justify-center shrink-0">
                        <svg className="w-7 h-7 text-medical-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-base sm:text-lg font-bold themed-text">
                            Unable to identify pill
                        </p>
                        <p className="text-xs sm:text-sm themed-text-muted mt-1 leading-relaxed">
                            Please add the pill details manually or try again with better lighting.
                        </p>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
