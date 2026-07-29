import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 md:p-10 text-center space-y-6 mx-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold" style={{ color: 'var(--color-text)' }}>
          {t('appName')}
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          {t('companionSub')}
        </p>
        <div className="pt-6">
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 hover-lift shadow-btn transition-colors"
          >
            {t('signInBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
