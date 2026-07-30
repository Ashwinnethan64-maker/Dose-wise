/**
 * DoseWise AI — Client-Side Medical Intent Filter
 *
 * Runs BEFORE any API call to the LLM.
 * Detects non-medical queries and returns a local refusal
 * without consuming any API tokens.
 *
 * Two-layer approach:
 *   1. Block list — known non-medical keyword patterns → immediate refusal
 *   2. Allow list — healthcare keyword patterns → allow through
 *   3. Fallback — short/ambiguous queries (greetings, thanks) → allow through
 */

// ─── Standard Refusal Messages (per language) ──────────────────────────────
const REFUSAL_MESSAGES = {
    en: "I'm DoseWise AI, a healthcare and medication assistant. I can only help with medication, pill identification, dosage guidance, drug interactions, side effects, health information, wellness, and other healthcare-related questions. Please ask a medical or health-related question. 💊",
    hi: "मैं डोजवाइज AI हूँ, एक स्वास्थ्य और दवाई सहायक। मैं केवल दवाओं, खुराक, साइड इफेक्ट्स, दवाओं के परस्पर प्रभाव, स्वास्थ्य जानकारी और अन्य चिकित्सा संबंधी प्रश्नों में सहायता कर सकता हूँ। कृपया कोई स्वास्थ्य या दवाई संबंधी प्रश्न पूछें। 💊",
    kn: "ನಾನು ಡೋಸ್‌ವೈಸ್ AI, ಆರೋಗ್ಯ ಮತ್ತು ಔಷಧಿ ಸಹಾಯಕ. ನಾನು ಕೇವಲ ಔಷಧಿಗಳು, ಡೋಸೇಜ್, ಅಡ್ಡ ಪರಿಣಾಮಗಳು, ಔಷಧಿ ಸಂವಹನ, ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮತ್ತು ಇತರ ವೈದ್ಯಕೀಯ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ದಯವಿಟ್ಟು ವೈದ್ಯಕೀಯ ಅಥವಾ ಆರೋಗ್ಯ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆ ಕೇಳಿ. 💊",
};

// ─── Short / Conversational Pass-Through Patterns ──────────────────────────
// These short inputs are never blocked (greetings, thanks, confirmations)
const CONVERSATIONAL_PASSTHROUGH = [
    /^(hi|hello|hey|namaste|namaskar|hii|helo|hai|yo)\b/i,
    /^(thanks?|thank you|thx|ty|dhanyavaad|shukriya|dhanyawaad)\b/i,
    /^(ok|okay|got it|understood|sure|alright|yes|no|yeah|nope)\b/i,
    /^(good morning|good evening|good afternoon|good night)\b/i,
    /^(bye|goodbye|see you|take care)\b/i,
    /^(help|help me|please help|i need help)\b/i,
    /^(what can you do|what do you do|who are you|tell me about yourself)\b/i,
];

// ─── EMERGENCY KEYWORDS — Always allow through ──────────────────────────────
const EMERGENCY_PATTERNS = [
    /\b(emergency|urgent|ambulance|911|112|call doctor|chest pain|heart attack|stroke|can't breathe|difficulty breathing|overdose|poison|unconscious|unresponsive|bleeding heavily|seizure|anaphylaxis|allergic reaction)\b/i,
];

// ─── NON-MEDICAL BLOCK LIST ─────────────────────────────────────────────────
// Keywords strongly associated with non-healthcare topics
const NON_MEDICAL_BLOCK_PATTERNS = [
    // Programming & Technology
    /\b(javascript|python|java\b|c\+\+|c#|typescript|php|ruby|golang|rust|kotlin|swift|dart|html|css|sql|bash|shell|powershell|linux|unix|windows|macos|android sdk|ios sdk)\b/i,
    /\b(react|angular|vue|nextjs|next\.js|nuxt|svelte|express|django|flask|fastapi|spring boot|laravel|rails)\b/i,
    /\b(algorithm|data structure|linked list|binary tree|sorting|recursion|recursion|big o|complexity|stack overflow|github|git|docker|kubernetes|devops|ci\/cd|api endpoint|rest api|graphql)\b/i,
    /\b(cpu|gpu|ram|processor|motherboard|hard drive|ssd|nvme|bandwidth|latency|server|database|mysql|postgresql|mongodb|redis|elasticsearch)\b/i,
    /\b(machine learning|deep learning|neural network|artificial intelligence|ai model|chatgpt|gpt-4|llm|nlp|computer vision|training model|dataset)\b/i,
    /\b(hack|hacking|cybersecurity|exploit|vulnerability|malware|ransomware|phishing|ddos|firewall|vpn|encryption)\b/i,
    /\b(code snippet|write (a |the )?(code|function|class|program|script|app)|debug (this|my|the)|compile|syntax error|runtime error|import library|install package|pip install|npm install|yarn add)\b/i,
    /\b(tutorial|how to code|learn python|learn java|programming tutorial|web development|app development|software development)\b/i,

    // Mathematics
    /\b(calculus|algebra|trigonometry|geometry|statistics\b|probability\b|matrix|determinant|integral|derivative|differential equation|linear equation|quadratic|theorem|proof|mathematical)\b/i,
    /\b(solve this equation|calculate the (value|area|volume|perimeter|integral|sum)|find (x|y|z)\b|simplify|factorise|differentiate|integrate)\b/i,

    // Sports
    /\b(cricket|football|soccer|basketball|tennis|badminton|hockey|baseball|rugby|golf|swimming|athletics|olympics|ipl|nfl|nba|fifa|uefa|premier league|la liga|champions league)\b/i,
    /\b(batsman|bowler|wicket|century|hat-trick|goal|penalty|offside|slam dunk|grand slam|match result|score|scorecard|player stats|team ranking)\b/i,

    // Entertainment & Media
    /\b(movie|film|series|tv show|netflix|amazon prime|disney\+|hbo|youtube|tiktok|instagram reel|celebrity|actor|actress|director|box office|imdb|review)\b/i,
    /\b(song|music|album|artist|band|concert|spotify|apple music|billboard|grammy|oscar|emmy|golden globe)\b/i,
    /\b(anime|manga|comic|video game|gaming|esports|twitch|steam|playstation|xbox|nintendo)\b/i,

    // History & Geography
    /\b(history of|world war|cold war|ancient|medieval|renaissance|revolution|emperor|dynasty|kingdom|empire|civilization|archaeological|historical event)\b/i,
    /\b(country|capital city|continent|ocean|mountain|river|lake|desert|forest|population of|map of|geography|latitude|longitude)\b/i,

    // Politics & Economics
    /\b(politics|politician|election|vote|parliament|congress|senate|prime minister|president|government|constitution|party|bill|policy|democracy|socialism|capitalism)\b/i,
    /\b(economy|gdp|inflation|recession|stock market|shares|equity|mutual fund|crypto|bitcoin|ethereum|forex|investment|budget|tax)\b/i,

    // Space & Non-medical Science
    /\b(astronomy|planet|star|galaxy|universe|black hole|nasa|isro|rocket|satellite|space station|mars|moon|solar system|telescope|cosmology)\b/i,
    /\b(physics|quantum|relativity|thermodynamics|electromagnetism|optics|mechanics|chemistry (lab|experiment|equation|formula|reaction|compound|periodic table|element))\b/i,

    // General Knowledge & Misc
    /\b(recipe|cooking|baking|cuisine|restaurant|food (dish|culture)|travel|tourism|hotel|flight|visa|passport|country guide)\b/i,
    /\b(weather|climate|forecast|temperature (today|tomorrow)|rain|humidity|season)\b/i,
    /\b(philosophy|religion|theology|mythology|folklore|culture|language learning|translate (to|into) (french|spanish|german|arabic|chinese|japanese|korean))\b/i,
    /\b(write (a |an )?(essay|story|poem|letter|email|report|article|blog)|generate (content|text|paragraph|summary))\b/i,
    /\b(tell me (a joke|a riddle|something funny)|entertain me|give me trivia|quiz me|random fact)\b/i,
];

// ─── MEDICAL ALLOW LIST ──────────────────────────────────────────────────────
// Keywords strongly associated with healthcare — these always pass through
const MEDICAL_ALLOW_PATTERNS = [
    // Medications & Pharmacology
    /\b(medicine|medication|drug|tablet|capsule|pill|syrup|injection|vaccine|antibiotic|antiviral|antifungal|painkiller|analgesic|anti-inflammatory|nsaid|steroid|hormone|insulin|dosage|dose|prescription|otc|generic|brand)\b/i,
    /\b(paracetamol|ibuprofen|aspirin|metformin|atorvastatin|amlodipine|omeprazole|pantoprazole|amoxicillin|azithromycin|cetirizine|montelukast|losartan|metoprolol|clopidogrel|levothyroxine|dolo|crocin|combiflam|disprin)\b/i,
    /\b(antihistamine|antacid|laxative|diuretic|beta.?blocker|ace inhibitor|calcium channel|statin|ssri|snri|antidepressant|anxiolytic|antipsychotic|sedative|hypnotic|opioid|narcotic)\b/i,

    // Dosage & Administration
    /\b(dose|dosage|frequency|twice daily|once daily|three times|before food|after food|with water|sublingual|topical|intravenous|intramuscular|subcutaneous|inhalation|suppository|missed dose|overdose)\b/i,

    // Side Effects & Safety
    /\b(side effect|adverse effect|contraindication|interaction|drug interaction|allergy|allergic reaction|anaphylaxis|toxicity|withdrawal|dependency|tolerance)\b/i,

    // Symptoms & Conditions
    /\b(symptom|fever|temperature|cough|cold|flu|infection|inflammation|pain|headache|migraine|nausea|vomiting|diarrhea|constipation|bloating|fatigue|weakness|dizziness|vertigo|breathlessness|chest (pain|tightness)|palpitation)\b/i,
    /\b(diabetes|hypertension|blood pressure|cholesterol|thyroid|asthma|copd|arthritis|osteoporosis|anemia|cancer|tumor|stroke|heart (disease|attack|failure)|kidney (disease|failure|stone)|liver (disease|failure)|fatty liver)\b/i,
    /\b(anxiety|depression|insomnia|sleep disorder|bipolar|schizophrenia|dementia|alzheimer|parkinson|epilepsy|seizure|autism|adhd)\b/i,
    /\b(rash|skin|eczema|psoriasis|acne|wound|burn|cut|bruise|swelling|edema|itching|urticaria)\b/i,

    // Body & Anatomy
    /\b(heart|lung|liver|kidney|brain|stomach|intestine|bowel|colon|bladder|pancreas|thyroid|adrenal|prostate|uterus|ovary|testis|bone|muscle|joint|nerve|blood|artery|vein)\b/i,

    // Tests & Diagnostics
    /\b(blood test|urine test|x-ray|ct scan|mri|ultrasound|ecg|eeg|biopsy|lab report|hemoglobin|hba1c|creatinine|bun|ast|alt|tsh|t3|t4|cholesterol|triglyceride|platelet|wbc|rbc|esr|crp)\b/i,

    // Health & Wellness
    /\b(health|healthy|wellness|nutrition|diet|exercise|weight|bmi|obesity|hydration|vitamin|mineral|supplement|protein|carb|fat|calorie|fiber|antioxidant|probiotic)\b/i,
    /\b(blood sugar|glucose|insulin|bp|spo2|oxygen saturation|heart rate|pulse|respiratory rate|body temperature)\b/i,

    // Medical Procedures & Care
    /\b(surgery|operation|chemotherapy|radiation|dialysis|transplant|physiotherapy|rehabilitation|wound care|dressing|vaccination|immunization|booster)\b/i,
    /\b(first aid|cpr|heimlich|tourniquet|bandage|compress|splint|inhaler|nebulizer|glucometer|blood pressure monitor|thermometer)\b/i,

    // Healthcare Providers
    /\b(doctor|physician|specialist|cardiologist|diabetologist|neurologist|oncologist|dermatologist|gynecologist|pediatrician|orthopedic|pharmacist|nurse|hospital|clinic|emergency)\b/i,

    // Pregnancy & Reproductive
    /\b(pregnancy|pregnant|trimester|prenatal|postnatal|breastfeeding|contraception|birth control|fertility|menstruation|menopause|hormonal)\b/i,

    // Lifestyle & Preventive
    /\b(sleep|stress|mental health|meditation|yoga|physical activity|smoking|alcohol|substance|addiction|detox|preventive care|screening|check.?up)\b/i,
];

// ─── Core Classification Logic ───────────────────────────────────────────────

/**
 * Normalizes text for consistent matching.
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
    return text.trim().toLowerCase();
}

/**
 * Tests whether a query matches any pattern in a list.
 * @param {string} text
 * @param {RegExp[]} patterns
 * @returns {boolean}
 */
function matchesAny(text, patterns) {
    return patterns.some(pattern => pattern.test(text));
}

/**
 * Determines if a user query is healthcare-related.
 *
 * Decision flow:
 *   1. Emergency → always allow (true)
 *   2. Conversational passthrough → always allow (true)
 *   3. Medical allow list match → allow (true)
 *   4. Non-medical block list match → block (false)
 *   5. Short query (< 15 chars, no block match) → allow (true) — benefit of doubt
 *   6. Default → allow (true) — let model handle edge cases via system prompt
 *
 * @param {string} query - The raw user input
 * @returns {{ allowed: boolean, reason: string }}
 */
export function classifyQuery(query) {
    const text = normalize(query);

    // 1. Emergency — always allow
    if (matchesAny(text, EMERGENCY_PATTERNS)) {
        return { allowed: true, reason: 'emergency' };
    }

    // 2. Conversational passthrough
    if (matchesAny(text, CONVERSATIONAL_PASSTHROUGH)) {
        return { allowed: true, reason: 'conversational' };
    }

    // 3. Medical allow list match — allow even if block list also matches
    if (matchesAny(text, MEDICAL_ALLOW_PATTERNS)) {
        return { allowed: true, reason: 'medical_keyword' };
    }

    // 4. Non-medical block list match
    if (matchesAny(text, NON_MEDICAL_BLOCK_PATTERNS)) {
        return { allowed: false, reason: 'non_medical_keyword' };
    }

    // 5. Very short query — give benefit of the doubt
    if (text.length < 20) {
        return { allowed: true, reason: 'short_query_passthrough' };
    }

    // 6. Default — allow through (model handles via system prompt)
    return { allowed: true, reason: 'default_passthrough' };
}

/**
 * Simple boolean check — is this query healthcare-related?
 * @param {string} query
 * @returns {boolean}
 */
export function isMedicalQuery(query) {
    return classifyQuery(query).allowed;
}

/**
 * Returns the standard refusal message in the given language.
 * @param {'en'|'hi'|'kn'} langId
 * @returns {string}
 */
export function getRefusalMessage(langId = 'en') {
    return REFUSAL_MESSAGES[langId] || REFUSAL_MESSAGES.en;
}
