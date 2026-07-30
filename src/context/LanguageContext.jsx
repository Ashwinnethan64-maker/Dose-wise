import { createContext, useContext, useState, useEffect } from 'react';

export const TRANSLATIONS = {
    en: {
        // App / Logo / Footer
        appName: 'DoseWise AI',
        encrypted: 'Encrypted',
        footerText: 'DoseWise AI — Your Health Data Stays Private 🔒',

        // Navbar & Nav Items
        navDashboard: 'Dashboard',
        navScanPill: 'Scan Pill',
        navMyMeds: 'My Meds',
        navAdherence: 'Adherence',
        navCaregiver: 'Caregiver',
        navAssistant: 'DoseWise AI',
        profileSettings: 'Profile Settings',
        logout: 'Logout',
        selectLanguage: 'Language',
        languageName: 'English',
        flag: '🌐',
        menu: 'Menu',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        switchTheme: 'Switch Theme',

        // Dashboard
        goodMorning: 'Good Morning',
        goodAfternoon: 'Good Afternoon',
        goodEvening: 'Good Evening',
        dashboardSubtitle: "Here's your health overview for today",
        overallScore: 'Overall Score',
        adherence: 'Adherence',
        scanPill: 'Scan Pill',
        scanSub: 'Identify with AI camera',
        pendingToday: 'Pending Today',
        missedToday: 'Missed Today',
        todaysMedications: "Today's Medications",
        viewAll: 'View All',
        noMedsYet: 'No medications added yet',
        addFirstMed: '➕ Add Your First Medication',
        weeklyOverview: 'Weekly Overview',

        // Status badges
        statusPending: 'Pending',
        statusTaken: 'Taken',
        statusSkipped: 'Skipped',
        statusMissed: 'Missed',

        // Scan Pill Page & Components
        scanPillTitle: 'Scan Your Pill',
        scanPillSubtitle: 'Point your camera at a pill and our AI will identify it',
        startCamera: 'Start Camera',
        stopCamera: 'Stop Camera',
        capturePill: 'Capture Pill',
        cameraOffline: 'Camera Offline',
        cameraInstruction: 'Click "Start Camera" to begin scanning your medication',
        aiAnalysis: 'AI Analysis',
        loadingModel: 'Loading Model…',
        identifiedAs: 'Identified As',
        confidence: 'Confidence',
        highConfidence: '✅ High confidence — likely match',
        moderateConfidence: '⚠️ Moderate confidence — verify with pharmacist',
        unableToIdentify: 'Unable to identify pill',
        unableIdentifySub: 'Please add the pill details manually or try again with better lighting.',
        addToMyMeds: 'Add to My Meds',
        detectedLabels: 'All Detected Labels',
        modelNotConnected: 'AI Model Not Connected',
        manualAddMed: 'Add Medication Manually',
        cameraError: 'Camera permission denied or unavailable',

        // My Medications & Schedules / Frequencies
        myMedsTitle: 'My Medications',
        medsTracked: 'medication tracked',
        medsTrackedPlural: 'medications tracked',
        addMedication: 'Add Medication',
        noMedsTitle: 'No Medications Yet',
        noMedsSub: 'Add your medications to start tracking doses, get reminders, and check drug interactions.',
        addFirstMedBtn: 'Add Your First Medication',
        editMedication: 'Edit Medication',
        deleteMedication: 'Remove Medication',
        removeMedTitle: 'Remove Medication?',
        removeMedConfirm: 'Are you sure you want to remove "{name}"? This action cannot be undone.',
        confirmRemove: 'Remove',
        cancel: 'Cancel',
        saveChanges: 'Save Changes',
        pillColor: 'Pill Color',
        photoOrDoc: 'Photo or Document (Optional)',
        tapToUpload: 'Tap to upload Photo / PDF / DOC',
        changeFile: 'CHANGE FILE',
        medName: 'Medication Name *',
        medNamePlaceholder: 'e.g. Metformin',
        dosage: 'Dosage *',
        dosagePlaceholder: 'e.g. 500mg',
        frequency: 'Frequency',
        schedule: 'Schedule',
        notes: 'Notes',
        notesPlaceholder: 'Optional notes...',
        
        // Exact schedule & frequency values
        'Morning': 'Morning',
        'Afternoon': 'Afternoon',
        'Evening': 'Evening',
        'Bedtime': 'Bedtime',
        'Night': 'Night',
        'Once daily': 'Once daily',
        'Twice daily': 'Twice daily',
        'Three times': 'Three times',
        'As needed': 'As needed',

        freqOnce: 'Once daily',
        freqTwice: 'Twice daily',
        freqThree: 'Three times',
        freqAsNeeded: 'As needed',
        schedMorning: 'Morning',
        schedAfternoon: 'Afternoon',
        schedEvening: 'Evening',
        schedBedtime: 'Bedtime',
        medUpdatedSuccess: 'Medication updated successfully',
        medAddedSuccess: 'Medication added successfully',
        medRemovedInfo: 'removed',

        // Colors
        colorWhite: 'White',
        colorBlue: 'Blue',
        colorRed: 'Red',
        colorYellow: 'Yellow',
        colorGreen: 'Green',
        colorOrange: 'Orange',
        colorPink: 'Pink',
        colorPurple: 'Purple',

        // Adherence Page
        dailyAdherenceTitle: 'Daily Adherence',
        dailyAdherenceSub: 'Track your medication intake for today',
        todaysChecklist: "Today's Checklist",
        noMedsToTrack: 'No medications to track. Add medications first.',
        takenBtn: 'Taken',
        skippedBtn: 'Skipped',
        snoozeBtn: 'Snooze',
        snoozedNotice: 'snoozed for 15 minutes',
        weeklyCalendar: 'Weekly Calendar',
        overallAdherenceRate: 'Overall Adherence Rate',
        legendHigh: '80%+',
        legendMid: '50-79%',
        legendLow: '<50%',
        legendNoData: 'No data',

        // Caregiver Page
        caregiverTitle: 'Caregiver Dashboard',
        caregiverSub: 'Monitor medication adherence and missed doses',
        adherenceRate: 'Adherence Rate',
        medsTrackedLabel: 'Medications Tracked',
        weeklyReportCard: 'Weekly Report Card',
        perMedBreakdown: 'Per-Medication Breakdown',
        noMedsTrackedCaregiver: 'No medications being tracked.',
        overall: 'Overall',
        takenOfTotal: '{taken} taken / {total} total',
        unknownMed: 'Unknown',

        // AI Assistant Page
        assistantTitle: 'DoseWise Assistant',
        assistantSub: 'Your Health Analytics & Multilingual Companion',
        newChat: 'New Chat',
        savedConversations: 'Saved Conversations',
        askPlaceholder: 'Ask about your medications or health...',
        chatsCount: '{count} chats',
        aiLabel: '{name} AI',
        listeningIn: 'Listening in {lang}... Speak now into your microphone.',
        listeningShort: 'Listening ({lang})...',
        stopVoice: 'Stop',
        copyResponse: 'Copy response',
        regenerateResponse: 'Regenerate response',
        medicalDisclaimer: 'For educational purposes only. Consult a qualified healthcare professional for medical decisions.',

        // Profile Page
        profileTitle: 'Profile Settings',
        profileSub: 'Manage your account preferences',
        uploadPhoto: 'Upload photo',
        removePhoto: 'Remove photo',
        personalInfo: 'Personal Information',
        displayName: 'Display Name',
        displayNamePlaceholder: 'Your name...',
        emailLabel: 'Email',
        emailCantChange: 'Email cannot be changed',
        preferences: 'Preferences',
        themeLabel: 'Theme',
        darkModeActive: 'Dark mode active',
        lightModeActive: 'Light mode active',
        notificationsLabel: 'Notifications',
        remindersActive: 'Medication reminders active',
        remindersDisabled: 'Reminders disabled',
        profileSavedSuccess: 'Profile saved successfully ✅',
        remindersEnabledToast: 'Reminders enabled 🔔',
        remindersDisabledToast: 'Reminders disabled 🔕',
        googleAccount: 'Google Account',
        emailAccount: 'Email Account',

        // Auth / Login Page
        welcomeBack: 'Welcome Back',
        companionSub: 'Your AI-Powered Medication Companion',
        signInWithEmail: 'or sign in with email',
        passwordLabel: 'Password',
        forgotPassword: 'Forgot password?',
        signInBtn: 'Sign In',
        encryptedHint: 'Encrypted & Private — Your data stays on this device',
        madeWithLove: 'Made with ❤️ for better health',
        fillAllFields: 'Please fill in all fields',
        invalidCredentials: 'Invalid credentials',
        signInSuccess: 'Welcome back! 👋',
        googleSignInSuccess: 'Welcome back! 🎉',
        googleSignInFail: 'Failed to sign in with Google',

        // Forgot Password Modal
        resetPasswordTitle: 'Reset Password',
        resetPasswordSub: "Enter your email and we'll send you a reset link.",
        checkInbox: 'Check your inbox!',
        resetLinkSentTo: 'Reset link sent to {email}',
        sendResetLink: 'Send Reset Link',

        // Weekdays Short
        mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    },

    hi: {
        // App / Logo / Footer
        appName: 'डोज़वाइज़ AI',
        encrypted: 'सुरक्षित',
        footerText: 'डोज़वाइज़ AI — आपका स्वास्थ्य डेटा सुरक्षित रहता है 🔒',

        // Navbar & Nav Items
        navDashboard: 'डैशबोर्ड',
        navScanPill: 'स्कैन पिल',
        navMyMeds: 'मेरी दवाइयाँ',
        navAdherence: 'अनुपालन',
        navCaregiver: 'केयरगिवर',
        navAssistant: 'DoseWise AI',
        profileSettings: 'प्रोफ़ाइल सेटिंग्स',
        logout: 'लॉगआउट',
        selectLanguage: 'भाषा',
        languageName: 'हिंदी (Hindi)',
        flag: '🇮🇳',
        menu: 'मेन्यू',
        lightMode: 'लाइट मोड',
        darkMode: 'डार्क मोड',
        switchTheme: 'थीम बदलें',

        // Dashboard
        goodMorning: 'शुभ प्रभात',
        goodAfternoon: 'शुभ दोपहर',
        goodEvening: 'शुभ संध्या',
        dashboardSubtitle: 'आज का आपका स्वास्थ्य अवलोकन',
        overallScore: 'कुल स्कोर',
        adherence: 'दवा पालन',
        scanPill: 'स्कैन पिल',
        scanSub: 'AI कैमरा से पहचानें',
        pendingToday: 'आज बाकी दवाएँ',
        missedToday: 'आज छूटी दवाएँ',
        todaysMedications: 'आज की दवाइयाँ',
        viewAll: 'सभी देखें',
        noMedsYet: 'अभी कोई दवा नहीं जोड़ी गई है',
        addFirstMed: '➕ अपनी पहली दवा जोड़ें',
        weeklyOverview: 'साप्ताहिक अवलोकन',

        // Status badges
        statusPending: 'बाकी',
        statusTaken: 'ली गई',
        statusSkipped: 'छोड़ी गई',
        statusMissed: 'छूट गई',

        // Scan Pill Page & Components
        scanPillTitle: 'अपनी दवा स्कैन करें',
        scanPillSubtitle: 'कैमरा को दवा पर रखें और AI उसे पहचानेगा',
        startCamera: 'कैमरा शुरू करें',
        stopCamera: 'कैमरा बंद करें',
        capturePill: 'फोटो लें',
        cameraOffline: 'कैमरा बंद है',
        cameraInstruction: 'स्कैन शुरू करने के लिए "कैमरा शुरू करें" पर क्लिक करें',
        aiAnalysis: 'AI विश्लेषण',
        loadingModel: 'मॉडल लोड हो रहा है…',
        identifiedAs: 'पहचान की गई',
        confidence: 'सटीकता (Confidence)',
        highConfidence: '✅ उच्च सटीकता — सही पहचान',
        moderateConfidence: '⚠️ मध्यम सटीकता — फार्मासिस्ट से जांचें',
        unableToIdentify: 'दवा की पहचान नहीं हो सकी',
        unableIdentifySub: 'कृपया दवा का विवरण मैन्युअल रूप से जोड़ें या बेहतर रोशनी में प्रयास करें।',
        addToMyMeds: 'मेरी दवाइयों में जोड़ें',
        detectedLabels: 'सभी पहचाने गए लेबल',
        modelNotConnected: 'AI मॉडल कनेक्टेड नहीं है',
        manualAddMed: 'मैन्युअल रूप से दवा जोड़ें',
        cameraError: 'कैमरा अनुमति अस्वीकृत या अनुपलब्ध है',

        // My Medications & Schedules / Frequencies
        myMedsTitle: 'मेरी दवाइयाँ',
        medsTracked: 'दवा ट्रैक की जा रही है',
        medsTrackedPlural: 'दवाइयाँ ट्रैक की जा रही हैं',
        addMedication: 'दवा जोड़ें',
        noMedsTitle: 'अभी कोई दवा नहीं है',
        noMedsSub: 'खुराक ट्रैक करने, रिमाइंडर पाने और इंटरैक्शन जांचने के लिए अपनी दवाइयाँ जोड़ें।',
        addFirstMedBtn: 'अपनी पहली दवा जोड़ें',
        editMedication: 'दवा संपादित करें',
        deleteMedication: 'दवा हटाएं',
        removeMedTitle: 'दवा हटाएं?',
        removeMedConfirm: 'क्या आप निश्चित रूप से "{name}" को हटाना चाहते हैं? यह प्रक्रिया वापस नहीं हो सकती।',
        confirmRemove: 'हटाएं',
        cancel: 'रद्द करें',
        saveChanges: 'बदलाव सहेजें',
        pillColor: 'दवा का रंग',
        photoOrDoc: 'फोटो या दस्तावेज (वैकल्पिक)',
        tapToUpload: 'फोटो / PDF / DOC अपलोड करने के लिए टैप करें',
        changeFile: 'फ़ाइल बदलें',
        medName: 'दवा का नाम *',
        medNamePlaceholder: 'उदा. मेटफॉर्मिन',
        dosage: 'खुराक (Dosage) *',
        dosagePlaceholder: 'उदा. 500mg',
        frequency: 'आवृत्ति (Frequency)',
        schedule: 'समय (Schedule)',
        notes: 'नोट्स',
        notesPlaceholder: 'अतिरिक्त नोट्स...',

        // Exact schedule & frequency values
        'Morning': 'सुबह',
        'Afternoon': 'दोपहर',
        'Evening': 'शाम',
        'Bedtime': 'रात को (सोते समय)',
        'Night': 'रात',
        'Once daily': 'दिन में एक बार',
        'Twice daily': 'दिन में दो बार',
        'Three times': 'दिन में तीन बार',
        'As needed': 'आवश्यकतानुसार',

        freqOnce: 'दिन में एक बार',
        freqTwice: 'दिन में दो बार',
        freqThree: 'दिन में तीन बार',
        freqAsNeeded: 'आवश्यकतानुसार',
        schedMorning: 'सुबह',
        schedAfternoon: 'दोपहर',
        schedEvening: 'शाम',
        schedBedtime: 'रात को (सोते समय)',
        medUpdatedSuccess: 'दवा सफलतापूर्वक अपडेट की गई',
        medAddedSuccess: 'दवा सफलतापूर्वक जोड़ी गई',
        medRemovedInfo: 'हटा दी गई',

        // Colors
        colorWhite: 'सफेद',
        colorBlue: 'नीला',
        colorRed: 'लाल',
        colorYellow: 'पीला',
        colorGreen: 'हरा',
        colorOrange: 'नारंगी',
        colorPink: 'गुलाबी',
        colorPurple: 'बैंगनी',

        // Adherence Page
        dailyAdherenceTitle: 'दैनिक पालन (Daily Adherence)',
        dailyAdherenceSub: 'आज की अपनी दवा सेवन को ट्रैक करें',
        todaysChecklist: 'आज की जांच सूची',
        noMedsToTrack: 'ट्रैक करने के लिए कोई दवा नहीं है। पहले दवाइयाँ जोड़ें।',
        takenBtn: 'ली गई',
        skippedBtn: 'छोड़ी गई',
        snoozeBtn: 'स्नूज़ करें',
        snoozedNotice: '15 मिनट के लिए स्नूज़ किया गया',
        weeklyCalendar: 'साप्ताहिक कैलेंडर',
        overallAdherenceRate: 'कुल दवा अनुपालन दर',
        legendHigh: '80%+',
        legendMid: '50-79%',
        legendLow: '<50%',
        legendNoData: 'कोई डेटा नहीं',

        // Caregiver Page
        caregiverTitle: 'केयरगिवर डैशबोर्ड',
        caregiverSub: 'दवा अनुपालन और छूटी हुई खुराक पर नज़र रखें',
        adherenceRate: 'अनुपालन दर',
        medsTrackedLabel: 'ट्रैक की गई दवाइयाँ',
        weeklyReportCard: 'साप्ताहिक रिपोर्ट कार्ड',
        perMedBreakdown: 'प्रत्येक दवा का विवरण',
        noMedsTrackedCaregiver: 'कोई दवा ट्रैक नहीं की जा रही है।',
        overall: 'कुल',
        takenOfTotal: '{taken} ली गई / {total} कुल',
        unknownMed: 'अज्ञात दवा',

        // AI Assistant Page
        assistantTitle: 'डोज़वाइज़ असिस्टेंट',
        assistantSub: 'आपका स्वास्थ्य विश्लेषक और बहुभाषी साथी',
        newChat: 'नई बातचीत',
        savedConversations: 'सहेजी गई बातचीत',
        askPlaceholder: 'अपनी दवाइयों या स्वास्थ्य के बारे में पूछें...',
        chatsCount: '{count} बातचीत',
        aiLabel: '{name} AI',
        listeningIn: '{lang} में सुन रहे हैं... अब माइक में बोलें।',
        listeningShort: 'सुन रहे हैं ({lang})...',
        stopVoice: 'रोकें',
        copyResponse: 'कॉपी करें',
        regenerateResponse: 'पुनः उत्पन्न करें',
        medicalDisclaimer: 'यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। चिकित्सीय निर्णय के लिए किसी योग्य स्वास्थ्य विशेषज्ञ से परामर्श करें।',

        // Profile Page
        profileTitle: 'प्रोफ़ाइल सेटिंग्स',
        profileSub: 'अपनी खाता प्राथमिकताओं को प्रबंधित करें',
        uploadPhoto: 'फोटो अपलोड करें',
        removePhoto: 'फोटो हटाएं',
        personalInfo: 'व्यक्तिगत जानकारी',
        displayName: 'नाम',
        displayNamePlaceholder: 'आपका नाम...',
        emailLabel: 'ईमेल',
        emailCantChange: 'ईमेल नहीं बदला जा सकता',
        preferences: 'प्राथमिकताएं',
        themeLabel: 'थीम',
        darkModeActive: 'डार्क मोड सक्रिय',
        lightModeActive: 'लाइट मोड सक्रिय',
        notificationsLabel: 'सूचनाएं (Notifications)',
        remindersActive: 'दवा रिमाइंडर सक्रिय हैं',
        remindersDisabled: 'रिमाइंडर बंद हैं',
        profileSavedSuccess: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई ✅',
        remindersEnabledToast: 'रिमाइंडर चालू किए गए 🔔',
        remindersDisabledToast: 'रिमाइंडर बंद किए गए 🔕',
        googleAccount: 'गूगल खाता',
        emailAccount: 'ईमेल खाता',

        // Auth / Login Page
        welcomeBack: 'पुनः स्वागत है',
        companionSub: 'आपका AI-संचालित दवा साथी',
        signInWithEmail: 'या ईमेल से साइन इन करें',
        passwordLabel: 'पासवर्ड',
        forgotPassword: 'पासवर्ड भूल गए?',
        signInBtn: 'साइन इन करें',
        encryptedHint: 'सुरक्षित और निजी — आपका डेटा इसी डिवाइस पर रहता है',
        madeWithLove: 'स्वास्थ्य की देखभाल के लिए ❤️ से बनाया गया',
        fillAllFields: 'कृपया सभी फ़ील्ड भरें',
        invalidCredentials: 'अमान्य क्रेडेंशियल',
        signInSuccess: 'पुनः स्वागत है! 👋',
        googleSignInSuccess: 'पुनः स्वागत है! 🎉',
        googleSignInFail: 'गूगल साइन इन विफल रहा',

        // Forgot Password Modal
        resetPasswordTitle: 'पासवर्ड रीसेट करें',
        resetPasswordSub: 'अपना ईमेल दर्ज करें और हम आपको रीसेट लिंक भेजेंगे।',
        checkInbox: 'अपना इनबॉक्स जांचें!',
        resetLinkSentTo: 'रीसेट लिंक {email} पर भेजा गया',
        sendResetLink: 'रीसेट लिंक भेजें',

        // Weekdays Short
        mon: 'सोम', tue: 'मंगल', wed: 'बुध', thu: 'गुरु', fri: 'शुक्र', sat: 'शनि', sun: 'रवि',
    },

    kn: {
        // App / Logo / Footer
        appName: 'ಡೋಸ್‌ವೈಸ್ AI',
        encrypted: 'ಸುರಕ್ಷಿತ',
        footerText: 'ಡೋಸ್‌ವೈಸ್ AI — ನಿಮ್ಮ ಆರೋಗ್ಯದ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ 🔒',

        // Navbar & Nav Items
        navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        navScanPill: 'ಮಾತ್ರೆ ಸ್ಕ್ಯಾನ್',
        navMyMeds: 'ನನ್ನ ಔಷಧಿಗಳು',
        navAdherence: 'ಅನುಸರಣೆ',
        navCaregiver: 'ಆರೈಕೆದಾರರು',
        navAssistant: 'DoseWise AI',
        profileSettings: 'ಪ್ರೊಫೈಲ್ ಸಂಯೋಜನೆಗಳು',
        logout: 'ನಿರ್ಗಮನ (Logout)',
        selectLanguage: 'ಭಾಷೆ',
        languageName: 'ಕನ್ನಡ (Kannada)',
        flag: '🇮🇳',
        menu: 'ಪಟ್ಟಿ (Menu)',
        lightMode: 'ಬೆಳಕಿನ ಮೋಡ್',
        darkMode: 'ಕತ್ತಲೆಯ ಮೋಡ್',
        switchTheme: 'ಥೀಮ್ ಬದಲಾಯಿಸಿ',

        // Dashboard
        goodMorning: 'ಶುಭೋದಯ',
        goodAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
        goodEvening: 'ಶುಭ ಸಂಜೆ',
        dashboardSubtitle: 'ಇಂದಿನ ನಿಮ್ಮ ಆರೋಗ್ಯ ವಿವರಣೆ',
        overallScore: 'ಒಟ್ಟು ಸ್ಕೋರ್',
        adherence: 'ಔಷಧಿ ಅನುಸರಣೆ',
        scanPill: 'ಮಾತ್ರೆ ಸ್ಕ್ಯಾನ್',
        scanSub: 'AI ಕ್ಯಾಮೆರಾ ಮೂಲಕ ಗುರುತಿಸಿ',
        pendingToday: 'ಇಂದು ಬಾಕಿ ಇರುವವು',
        missedToday: 'ಇಂದು ತಪ್ಪಿದವು',
        todaysMedications: 'ಇಂದಿನ ಔಷಧಿಗಳು',
        viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
        noMedsYet: 'ಇನ್ನೂ ಯಾವುದೇ ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ',
        addFirstMed: '➕ ನಿಮ್ಮ ಮೊದಲ ಔಷಧಿಯನ್ನು ಸೇರಿಸಿ',
        weeklyOverview: 'ವಾರದ ವಿವರಣೆ',

        // Status badges
        statusPending: 'ಬಾಕಿ',
        statusTaken: 'ತೆಗೆದುಕೊಂಡಿದ್ದು',
        statusSkipped: 'ತಪ್ಪಿಸಿದ್ದು',
        statusMissed: 'ತಪ್ಪಿಹೋಗಿದೆ',

        // Scan Pill Page & Components
        scanPillTitle: 'ಮಾತ್ರೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
        scanPillSubtitle: 'ಕ್ಯಾಮೆರಾವನ್ನು ಮಾತ್ರೆಯತ್ತ ಹಿಡಿಯಿರಿ ಮತ್ತು AI ಅದನ್ನು ಗುರುತಿಸುತ್ತದೆ',
        startCamera: 'ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ',
        stopCamera: 'ಕ್ಯಾಮೆರಾ ನಿಲ್ಲಿಸಿ',
        capturePill: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
        cameraOffline: 'ಕ್ಯಾಮೆರಾ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದೆ',
        cameraInstruction: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಲು "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ',
        aiAnalysis: 'AI ವಿಶ್ಲೇಷಣೆ',
        loadingModel: 'ಮಾಡೆಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
        identifiedAs: 'ಗುರುತಿಸಲಾಗಿದೆ',
        confidence: 'ನಿಖರತೆ (Confidence)',
        highConfidence: '✅ ಹೆಚ್ಚಿನ ನಿಖರತೆ — ಸರಿಯಾದ ಜೋಡಿ',
        moderateConfidence: '⚠️ ಮಧ್ಯಮ ನಿಖರತೆ — ಫಾರ್ಮಸಿಸ್ಟ್ ಬಳಿ ಪರಿಶೀಲಿಸಿ',
        unableToIdentify: 'ಮಾತ್ರೆಯನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ',
        unableIdentifySub: 'ದಯವಿಟ್ಟು ಮಾಹಿತಿಯನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ಸೇರಿಸಿ ಅಥವಾ ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        addToMyMeds: 'ನನ್ನ ಔಷಧಿಗಳಿಗೆ ಸೇರಿಸಿ',
        detectedLabels: 'ಗುರುತಿಸಲಾದ ಎಲ್ಲಾ ಲೇಬಲ್‌ಗಳು',
        modelNotConnected: 'AI ಮಾಡೆಲ್ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ',
        manualAddMed: 'ಹಸ್ತಚಾಲಿತವಾಗಿ ಔಷಧಿ ಸೇರಿಸಿ',
        cameraError: 'ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ ಅಥವಾ ಲಭ್ಯವಿಲ್ಲ',

        // My Medications & Schedules / Frequencies
        myMedsTitle: 'ನನ್ನ ಔಷಧಿಗಳು',
        medsTracked: 'ಔಷಧಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ',
        medsTrackedPlural: 'ಔಷಧಿಗಳು ಟ್ರ್ಯಾಕ್ ಮಾಡಲ್ಪಟ್ಟಿವೆ',
        addMedication: 'ಔಷಧಿ ಸೇರಿಸಿ',
        noMedsTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಔಷಧಿಗಳಿಲ್ಲ',
        noMedsSub: 'ಡೋಸ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು, ಜ್ಞಾಪನೆಗಳನ್ನು ಪಡೆಯಲು ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಿ.',
        addFirstMedBtn: 'ನಿಮ್ಮ ಮೊದಲ ಔಷಧಿಯನ್ನು ಸೇರಿಸಿ',
        editMedication: 'ಔಷಧಿಯನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ',
        deleteMedication: 'ಔಷಧಿಯನ್ನು ತೆಗೆದುಹಾಕಿ',
        removeMedTitle: 'ಔಷಧಿಯನ್ನು ತೆಗೆದುಹಾಕಬೇಕೆ?',
        removeMedConfirm: 'ನೀವು ನಿಜವಾಗಿಯೂ "{name}" ಅನ್ನು ತೆಗೆದುಹಾಕಲು ಬಯಸುತ್ತೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲಾಗುವುದಿಲ್ಲ.',
        confirmRemove: 'ತೆಗೆದುಹಾಕಿ',
        cancel: 'ರದ್ದುಗೊಳಿಸಿ',
        saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
        pillColor: 'ಮಾತ್ರೆಯ ಬಣ್ಣ',
        photoOrDoc: 'ಫೋಟೋ ಅಥವಾ ದಾಖಲೆ (ಐಚ್ಛಿಕ)',
        tapToUpload: 'ಫೋಟೋ / PDF / DOC ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
        changeFile: 'ಫೈಲ್ ಬದಲಾಯಿಸಿ',
        medName: 'ಔಷಧಿಯ ಹೆಸರು *',
        medNamePlaceholder: 'ಉದಾ: ಮೆಟ್‌ಫಾರ್ಮಿನ್',
        dosage: 'ಡೋಸೇಜ್ *',
        dosagePlaceholder: 'ಉದಾ: 500mg',
        frequency: 'ಆವರ್ತನ (Frequency)',
        schedule: 'ಸಮಯ (Schedule)',
        notes: 'ಟಿಪ್ಪಣಿಗಳು',
        notesPlaceholder: 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು...',

        // Exact schedule & frequency values
        'Morning': 'ಬೆಳಿಗ್ಗೆ',
        'Afternoon': 'ಮಧ್ಯಾಹ್ನ',
        'Evening': 'ಸಂಜೆ',
        'Bedtime': 'ರಾತ್ರಿ (ಮಲಗುವ ಮುನ್ನ)',
        'Night': 'ರಾತ್ರಿ',
        'Once daily': 'ದಿನಕ್ಕೆ ಒಮ್ಮೆ',
        'Twice daily': 'ದಿನಕ್ಕೆ ದುಬಾರಿ',
        'Three times': 'ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ',
        'As needed': 'ಅಗತ್ಯವಿದ್ದಾಗ',

        freqOnce: 'ದಿನಕ್ಕೆ ಒಮ್ಮೆ',
        freqTwice: 'ದಿನಕ್ಕೆ ದುಬಾರಿ',
        freqThree: 'ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ',
        freqAsNeeded: 'ಅಗತ್ಯವಿದ್ದಾಗ',
        schedMorning: 'ಬೆಳಿಗ್ಗೆ',
        schedAfternoon: 'ಮಧ್ಯಾಹ್ನ',
        schedEvening: 'ಸಂಜೆ',
        schedBedtime: 'ರಾತ್ರಿ (ಮಲಗುವ ಮುನ್ನ)',
        medUpdatedSuccess: 'ಔಷಧಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ',
        medAddedSuccess: 'ಔಷಧಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ',
        medRemovedInfo: 'ತೆಗೆದುಹಾಕಲಾಗಿದೆ',

        // Colors
        colorWhite: 'ಬಿಳಿ',
        colorBlue: 'ನೀಲಿ',
        colorRed: 'ಕೆಂಪು',
        colorYellow: 'ಹಳದಿ',
        colorGreen: 'ಹಸಿರು',
        colorOrange: 'ಕಿತ್ತಳೆ',
        colorPink: 'ಗುಲಾಬಿ',
        colorPurple: 'ನೇರಳೆ',

        // Adherence Page
        dailyAdherenceTitle: 'ದೈನಂದಿನ ಅನುಸರಣೆ (Daily Adherence)',
        dailyAdherenceSub: 'ಇಂದಿನ ನಿಮ್ಮ ಔಷಧಿ ಸೇವನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
        todaysChecklist: 'ಇಂದಿನ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
        noMedsToTrack: 'ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಯಾವುದೇ ಔಷಧಿಗಳಿಲ್ಲ. ಮೊದಲು ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಿ.',
        takenBtn: 'ತೆಗೆದುಕೊಂಡಿದ್ದು',
        skippedBtn: 'ತಪ್ಪಿಸಿದ್ದು',
        snoozeBtn: 'ಸ್ನೂಜ್ ಮಾಡಿ',
        snoozedNotice: '15 ನಿಮಿಷಗಳ ಕಾಲ ಸ್ನೂಜ್ ಮಾಡಲಾಗಿದೆ',
        weeklyCalendar: 'ವಾರದ ಕ್ಯಾಲೆಂಡರ್',
        overallAdherenceRate: 'ಒಟ್ಟು ಔಷಧಿ ಅನುಸರಣೆ ದರ',
        legendHigh: '80%+',
        legendMid: '50-79%',
        legendLow: '<50%',
        legendNoData: 'ಮಾಹಿತಿಯಿಲ್ಲ',

        // Caregiver Page
        caregiverTitle: 'ಆರೈಕೆದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        caregiverSub: 'ಔಷಧಿ ಅನುಸರಣೆ ಮತ್ತು ತಪ್ಪಿದ ಡೋಸ್‌ಗಳನ್ನು ಗಮನಿಸಿ',
        adherenceRate: 'ಅನುಸರಣೆ ದರ',
        medsTrackedLabel: 'ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಔಷಧಿಗಳು',
        weeklyReportCard: 'ವಾರದ ವರದಿ ಕಾರ್ಡ್',
        perMedBreakdown: 'ಪ್ರತಿಯೊಂದು ಔಷಧಿಯ ವಿವರ',
        noMedsTrackedCaregiver: 'ಯಾವುದೇ ಔಷಧಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿಲ್ಲ.',
        overall: 'ಒಟ್ಟು',
        takenOfTotal: '{taken} ತೆಗೆದುಕೊಂಡಿದ್ದು / {total} ಒಟ್ಟು',
        unknownMed: 'ಅಪರಿಚಿತ ಔಷಧಿ',

        // AI Assistant Page
        assistantTitle: 'ಡೋಸ್‌ವೈಸ್ ಸಹಾಯಕ',
        assistantSub: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಕ ಮತ್ತು ಬಹುಭಾಷಾ ಸಹಚರ',
        newChat: 'ಹೊಸ ಸಂಭಾಷಣೆ',
        savedConversations: 'ಉಳಿಸಿದ ಸಂಭಾಷಣೆಗಳು',
        askPlaceholder: 'ನಿಮ್ಮ ಔಷಧಿಗಳು ಅಥವಾ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕೇಳಿ...',
        chatsCount: '{count} ಸಂಭಾಷಣೆಗಳು',
        aiLabel: '{name} AI',
        listeningIn: '{lang} ನಲ್ಲಿ ಕೇಳಲಾಗುತ್ತಿದೆ... ಈಗ ಮೈಕ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.',
        listeningShort: 'ಕೇಳಲಾಗುತ್ತಿದೆ ({lang})...',
        stopVoice: 'ನಿಲ್ಲಿಸಿ',
        copyResponse: 'ಕಾಪಿ ಮಾಡಿ',
        regenerateResponse: 'ಮತ್ತೆ ತಯಾರಿಸಿ',
        medicalDisclaimer: 'ಇದು ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಕ್ಕಾಗಿ. ವೈದ್ಯಕೀಯ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ಅರ್ಹ ಆರೋಗ್ಯ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',

        // Profile Page
        profileTitle: 'ಪ್ರೊಫೈಲ್ ಸಂಯೋಜನೆಗಳು',
        profileSub: 'ನಿಮ್ಮ ಖಾತೆಯ ಆಯ್ಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
        uploadPhoto: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        removePhoto: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ',
        personalInfo: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
        displayName: 'ಹೆಸರು',
        displayNamePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು...',
        emailLabel: 'ಇಮೇಲ್',
        emailCantChange: 'ಇಮೇಲ್ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ',
        preferences: 'ಆದ್ಯತೆಗಳು',
        themeLabel: 'ಥೀಮ್',
        darkModeActive: 'ಕತ್ತಲೆಯ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
        lightModeActive: 'ಬೆಳಕಿನ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
        notificationsLabel: 'ಸೂಚನೆಗಳು (Notifications)',
        remindersActive: 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ',
        remindersDisabled: 'ಜ್ಞಾಪನೆಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ',
        profileSavedSuccess: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ ✅',
        remindersEnabledToast: 'ಜ್ಞಾಪನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ 🔔',
        remindersDisabledToast: 'ಜ್ಞಾಪನೆಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ 🔕',
        googleAccount: 'ಗೂಗಲ್ ಖಾತೆ',
        emailAccount: 'ಇಮೇಲ್ ಖಾತೆ',

        // Auth / Login Page
        welcomeBack: 'ಮತ್ತೆ ಸುಸ್ವಾಗತ',
        companionSub: 'ನಿಮ್ಮ AI-ಚಾಲಿತ ಔಷಧಿ ಸಹಚರ',
        signInWithEmail: 'ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಲಾಗ್ ಇನ್ ಮಾಡಿ',
        passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
        forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
        signInBtn: 'ಸೈನ್ ಇನ್ (Sign In)',
        encryptedHint: 'ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ — ನಿಮ್ಮ ಡೇಟಾ ಈ ಸಾಧನದಲ್ಲೇ ಇರುತ್ತದೆ',
        madeWithLove: 'ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ❤️ ಯೊಂದಿಗೆ ತಯಾರಿಸಲಾಗಿದೆ',
        fillAllFields: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
        invalidCredentials: 'ಅಮಾನ್ಯ ವಿವರಗಳು',
        signInSuccess: 'ಮತ್ತೆ ಸುಸ್ವಾಗತ! 👋',
        googleSignInSuccess: 'ಮತ್ತೆ ಸುಸ್ವಾಗತ! 🎉',
        googleSignInFail: 'ಗೂಗಲ್ ಸೈನ್ ಇನ್ ವಿಫಲವಾಗಿದೆ',

        // Forgot Password Modal
        resetPasswordTitle: 'ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಮಾಡಿ',
        resetPasswordSub: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ ಮತ್ತು ನಾವು ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.',
        checkInbox: 'ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ!',
        resetLinkSentTo: 'ರೀಸೆಟ್ ಲಿಂಕ್ {email} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
        sendResetLink: 'ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ',

        // Weekdays Short
        mon: 'ಸೋಮ', tue: 'ಮಂಗಳ', wed: 'ಬುಧ', thu: 'ಗುರು', fri: 'ಶುಕ್ರ', sat: 'ಶನಿ', sun: 'ಭಾನುವಾರ',
    }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('dosewise_lang') || 'en';
        } catch (e) {
            return 'en';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('dosewise_lang', language);
            document.documentElement.lang = language;
        } catch (e) {}
    }, [language]);

    const t = (key, params = {}) => {
        if (!key) return '';
        const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
        let str = langDict[key] || TRANSLATIONS.en[key] || key;

        if (typeof str === 'string' && params && Object.keys(params).length > 0) {
            Object.keys(params).forEach((paramKey) => {
                str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
            });
        }
        return str;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, TRANSLATIONS }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return ctx;
}
