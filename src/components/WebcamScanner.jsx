import { useState, useRef, useCallback, useEffect } from 'react';
import { predict } from '../ai/modelLoader';

/**
 * WebcamScanner — Live camera feed with real-time pill prediction.
 *
 * Props:
 *  - model        : loaded Teachable Machine model (or null)
 *  - onPrediction : callback receiving the top prediction { className, probability }
 *  - onImageChange: callback receiving the captured image dataURL (or null)
 *  - isModelReady : boolean indicating if model is loaded
 */
export default function WebcamScanner({ model, onPrediction, onImageChange, isModelReady }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [captured, setCaptured] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    // ─── Start Camera ───────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCameraError(null);
        setCaptured(false);
        setCapturedImage(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 400, height: 400 },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);
        } catch (err) {
            console.error('[WebcamScanner] Camera error:', err);
            setCameraError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permissions and try again.'
                    : 'Could not access camera. Please check your device.'
            );
        }
    }, []);

    // ─── Stop Camera ────────────────────────────────────────────
    const stopCamera = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setCaptured(false);
        setCapturedImage(null);
        onImageChange?.(null);
        onPrediction?.(null);
    }, [onPrediction, onImageChange]);

    // ─── Capture Frame ──────────────────────────────────────────
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        setCaptured(true);
        onImageChange?.(dataUrl);
    }, [onImageChange]);

    // ─── Resume (un-capture) ───────────────────────────────────
    const resumeLive = useCallback(() => {
        setCaptured(false);
        setCapturedImage(null);
        onImageChange?.(null);
    }, [onImageChange]);

    // ─── Prediction Loop ───────────────────────────────────────
    useEffect(() => {
        if (!cameraActive || !model) return;

        let running = true;

        const loop = async () => {
            if (!running) return;

            const el = captured ? canvasRef.current : videoRef.current;
            if (el) {
                const predictions = await predict(el, model);
                if (predictions && predictions.length > 0) {
                    // pick the highest-confidence prediction
                    const top = predictions.reduce((a, b) =>
                        a.probability > b.probability ? a : b
                    );
                    onPrediction?.({ className: top.className, probability: top.probability });
                }
            }

            if (running) {
                // throttle to ~5 fps to save CPU
                await new Promise((r) => setTimeout(r, 200));
                animFrameRef.current = requestAnimationFrame(loop);
            }
        };

        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            running = false;
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [cameraActive, model, captured, onPrediction]);

    // ─── Cleanup on unmount ─────────────────────────────────────
    useEffect(() => () => stopCamera(), [stopCamera]);

    return (
        <div className="flex flex-col items-center gap-6 w-full animate-fade-in">
            {/* ── Camera Preview ────────────────────────────────── */}
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden bg-medical-text/5 border-4 border-primary-300 shadow-card">
                {/* Idle state */}
                {!cameraActive && !capturedImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-medical-muted gap-3 p-6 text-center">
                        <svg className="w-20 h-20 text-primary-300 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <span className="text-elder-base font-medium">
                            Press <strong>"Start Camera"</strong> to begin scanning
                        </span>
                    </div>
                )}

                {/* Live video feed */}
                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${cameraActive && !captured ? 'block' : 'hidden'}`}
                    playsInline
                    muted
                />

                {/* Captured still image */}
                {captured && capturedImage && (
                    <img
                        src={capturedImage}
                        alt="Captured pill"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan-line overlay when camera is active */}
                {cameraActive && !captured && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-60 animate-scan-line" />
                    </div>
                )}

                {/* Captured badge */}
                {captured && (
                    <div className="absolute top-3 right-3 bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-btn animate-fade-in">
                        📸 Captured
                    </div>
                )}
            </div>

            {/* ── Error Message ─────────────────────────────────── */}
            {cameraError && (
                <div className="w-full max-w-[420px] bg-medical-danger/10 border border-medical-danger/30 text-medical-danger rounded-2xl p-4 text-elder-sm text-center animate-slide-up">
                    ⚠️ {cameraError}
                </div>
            )}

            {/* ── Controls ──────────────────────────────────────── */}
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-[420px]">
                {!cameraActive ? (
                    <button
                        onClick={startCamera}
                        className="flex-1 min-w-[160px] bg-primary-500 hover:bg-primary-600 active:scale-[0.97] text-white text-elder-base font-bold py-4 px-6 rounded-2xl shadow-btn transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Start Camera
                    </button>
                ) : (
                    <>
                        <button
                            onClick={stopCamera}
                            className="flex-1 min-w-[130px] bg-medical-danger hover:brightness-110 active:scale-[0.97] text-white text-elder-base font-bold py-4 px-5 rounded-2xl shadow-btn transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                            </svg>
                            Stop
                        </button>

                        {!captured ? (
                            <button
                                onClick={captureFrame}
                                className="flex-1 min-w-[130px] bg-primary-700 hover:bg-primary-800 active:scale-[0.97] text-white text-elder-base font-bold py-4 px-5 rounded-2xl shadow-btn transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                </svg>
                                Capture
                            </button>
                        ) : (
                            <button
                                onClick={resumeLive}
                                className="flex-1 min-w-[130px] bg-primary-500 hover:bg-primary-600 active:scale-[0.97] text-white text-elder-base font-bold py-4 px-5 rounded-2xl shadow-btn transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                                </svg>
                                Resume Live
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* ── Model status hint ─────────────────────────────── */}
            {cameraActive && !isModelReady && (
                <div className="w-full max-w-[420px] bg-medical-warn/10 border border-medical-warn/30 text-medical-warn rounded-2xl p-3 text-center text-elder-sm animate-fade-in">
                    ⏳ AI model is loading… predictions will appear shortly.
                </div>
            )}
        </div>
    );
}
