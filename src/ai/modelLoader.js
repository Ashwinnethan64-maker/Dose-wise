/**
 * Pill AI — Model Loader
 *
 * Loads a Google Teachable Machine image model and exposes helpers for
 * running predictions against a video / canvas element.
 *
 * HOW TO USE:
 *  1. Train a model at https://teachablemachine.withgoogle.com/train/image
 *  2. Export the model and copy the shareable link
 *  3. Paste the link as the MODEL_URL below
 *  4. The app will automatically load the model and start predictions
 */

import * as tmImage from '@teachablemachine/image';

// ============================================================
// 🔧  REPLACE THIS URL with your own Teachable Machine model
// ============================================================
export const MODEL_URL =
    'https://teachablemachine.withgoogle.com/models/kj9jZ5jHg/';

// Internal reference to the loaded model
let _model = null;

/**
 * Load a Teachable Machine image model.
 * @param {string} [url] — model URL (defaults to MODEL_URL)
 * @returns {Promise<tmImage.CustomMobileNet | null>}
 */
export async function loadModel(url = MODEL_URL) {
    try {
        const modelURL = url + 'model.json';
        const metadataURL = url + 'metadata.json';
        _model = await tmImage.load(modelURL, metadataURL);
        console.log('[PillAI] Model loaded successfully —', _model.getTotalClasses(), 'classes');
        return _model;
    } catch (err) {
        console.error('[PillAI] Failed to load model:', err);
        _model = null;
        return null;
    }
}

/**
 * Run prediction against an HTML element (video, canvas, or img).
 * @param {HTMLElement} element
 * @param {tmImage.CustomMobileNet} [model]
 * @returns {Promise<Array<{className: string, probability: number}> | null>}
 */
export async function predict(element, model = _model) {
    if (!model) return null;
    try {
        const predictions = await model.predict(element);
        return predictions;
    } catch (err) {
        console.error('[PillAI] Prediction error:', err);
        return null;
    }
}

/**
 * Get the currently loaded model (or null).
 */
export function getModel() {
    return _model;
}

/**
 * Check if a model is currently loaded and ready.
 */
export function isModelReady() {
    return _model !== null;
}
