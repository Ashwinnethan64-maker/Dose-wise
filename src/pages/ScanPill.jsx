import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WebcamScanner from '../components/WebcamScanner';
import PredictionCard from '../components/PredictionCard';
import MedicationModal from '../components/MedicationModal';
import { loadModel } from '../ai/modelLoader';
import { Info, PlusCircle, ScanLine, Sparkles } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import { useToast } from '../components/ui/Toast';
import AnimatedPage from '../components/ui/AnimatedPage';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import SectionHeader from '../components/ui/SectionHeader';
import Skeleton from '../components/ui/Skeleton';

export default function ScanPill() {
    const [model, setModel] = useState(null);
    const [modelReady, setModelReady] = useState(false);
    const [modelError, setModelError] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [prediction, setPrediction] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanResults, setScanResults] = useState(null);
    const [allPredictions, setAllPredictions] = useState([]);
    const { addMedication } = useMedications();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function init() {
            setModelLoading(true);
            const loaded = await loadModel();
            if (cancelled) return;
            if (loaded) { setModel(loaded); setModelReady(true); }
            else setModelError(true);
            setModelLoading(false);
        }
        init();
        return () => { cancelled = true; };
    }, []);

    const handlePrediction = useCallback((pred) => {
        setPrediction(pred);
        if (pred) {
            setCameraActive(true);
            setAllPredictions((prev) => {
                const exists = prev.find((p) => p.className === pred.className);
                if (exists) return prev.map((p) => p.className === pred.className ? { ...p, probability: pred.probability } : p);
                if (prev.length >= 3) return [...prev.slice(1), pred];
                return [...prev, pred];
            });
        }
    }, []);

    const handleOpenAddModal = () => {
        if (!prediction) return;

        // Auto-detect color from label
        const colors = ['white', 'blue', 'red', 'yellow', 'green', 'orange', 'pink', 'purple'];
        const detectedColor = colors.find(c => prediction.className.toLowerCase().includes(c)) || 'white';

        setScanResults({
            name: prediction.className,
            image: capturedImage,
            color: detectedColor,
            notes: 'Added via AI Scan',
            fileType: 'image/png',
            fileName: 'scan_capture.png'
        });
        setIsModalOpen(true);
    };

    const handleSaveMedication = (medData) => {
        addMedication(medData);
        addToast('Medication added from AI Scan', 'success');
        navigate('/medications');
    };

    return (
        <AnimatedPage className="space-y-6">
            <SectionHeader title="Scan Your Pill" subtitle="Point your camera at a pill and our AI will identify it" icon={<ScanLine size={24} />} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                    {cameraActive && <div className="absolute -inset-1.5 rounded-[1.25rem] ai-scan-border opacity-60 blur-[1px]" />}
                    <div className="relative rounded-2xl overflow-hidden" style={cameraActive ? { boxShadow: '0 0 30px rgba(13,158,158,0.2)' } : {}}>
                        <WebcamScanner
                            model={model}
                            onPrediction={handlePrediction}
                            onImageChange={setCapturedImage}
                            isModelReady={modelReady}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <PredictionCard
                        prediction={prediction}
                        isModelReady={modelReady}
                        cameraActive={cameraActive}
                        onAdd={handleOpenAddModal}
                    />
                    {modelLoading && (
                        <div className="space-y-3 mt-4">
                            <Skeleton height="3rem" rounded="rounded-xl" />
                            <Skeleton height="1rem" width="60%" rounded="rounded-lg" />
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {allPredictions.length > 1 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <h3 className="text-sm font-semibold themed-text-muted mb-3 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-primary-400" /> All Detected Labels
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allPredictions.map((p, i) => {
                                const conf = Math.round(p.probability * 100);
                                return (
                                    <GlassCard key={i} hover padding="p-4" className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-sm">💊</div>
                                            <span className="font-semibold themed-text text-sm">{p.className}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${conf}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    className={`h-full rounded-full ${conf >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : conf >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`} />
                                            </div>
                                            <span className="text-xs font-bold themed-text-muted w-9 text-right">{conf}%</span>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {modelError && !modelLoading && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard className="!border-blue-200/60">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <Info size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-blue-800 mb-1">AI Model Not Connected</p>
                                <p className="text-xs text-blue-600 leading-relaxed">
                                    Replace the <code className="bg-blue-100/80 px-1.5 py-0.5 rounded text-[11px]">MODEL_URL</code> in{' '}
                                    <code className="bg-blue-100/80 px-1.5 py-0.5 rounded text-[11px]">src/ai/modelLoader.js</code> with your Teachable Machine model URL.
                                    The camera works for testing.
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            <div className="flex justify-center pt-2">
                <PrimaryButton onClick={() => navigate('/medications')} icon={<PlusCircle size={20} />} size="md">
                    Add Medication Manually
                </PrimaryButton>
            </div>

            <MedicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMedication}
                medication={scanResults}
            />
        </AnimatedPage>
    );
}
