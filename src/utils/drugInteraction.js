/**
 * Mock drug interaction checker.
 * In production, this would call the OpenFDA API.
 * Returns interaction severity: 'critical' | 'moderate' | 'safe'
 */

const KNOWN_INTERACTIONS = {
    'aspirin+ibuprofen': { severity: 'critical', message: 'Increased risk of bleeding when taken together.' },
    'warfarin+aspirin': { severity: 'critical', message: 'High risk of serious bleeding.' },
    'lisinopril+potassium': { severity: 'moderate', message: 'May cause elevated potassium levels.' },
    'metformin+alcohol': { severity: 'moderate', message: 'Risk of lactic acidosis.' },
    'amoxicillin+methotrexate': { severity: 'moderate', message: 'May increase methotrexate toxicity.' },
    'simvastatin+grapefruit': { severity: 'moderate', message: 'Grapefruit may increase statin levels.' },
};

/**
 * Check interaction between two drug names.
 * @param {string} drug1
 * @param {string} drug2
 * @returns {{ severity: string, message: string }}
 */
export function checkInteraction(drug1, drug2) {
    const key1 = `${drug1.toLowerCase()}+${drug2.toLowerCase()}`;
    const key2 = `${drug2.toLowerCase()}+${drug1.toLowerCase()}`;

    if (KNOWN_INTERACTIONS[key1]) return KNOWN_INTERACTIONS[key1];
    if (KNOWN_INTERACTIONS[key2]) return KNOWN_INTERACTIONS[key2];

    return { severity: 'safe', message: 'No known interactions found.' };
}

/**
 * Check a medication against a list of existing medications.
 * @param {string} newDrug
 * @param {Array<{name: string}>} existingMeds
 * @returns {Array<{ drug: string, severity: string, message: string }>}
 */
export function checkAllInteractions(newDrug, existingMeds) {
    return existingMeds
        .map((med) => ({
            drug: med.name,
            ...checkInteraction(newDrug, med.name),
        }))
        .filter((r) => r.severity !== 'safe');
}

export const SEVERITY_COLORS = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Critical' },
    moderate: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Moderate' },
    safe: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Safe' },
};
