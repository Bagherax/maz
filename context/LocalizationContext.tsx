import React, { createContext, useEffect, useCallback, ReactNode } from 'react';
import { Language, LocalizationContextType } from '../types';
import { resources } from '../localization';
import { useLocalStorage } from '../hooks/usePersistentState';
import { LANGUAGES } from '../data/languages';

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', () => {
    // Auto-detect the browser language as the default.
    const browserLang = navigator.language.split('-')[0] as Language;
    
    // Check if the detected language is one of the supported languages.
    const isSupported = LANGUAGES.some(lang => lang.code === browserLang);
    
    // If the browser's language is supported, use it. Otherwise, fall back to English.
    return isSupported ? browserLang : 'en';
  });

  // This useEffect is still needed to update document attributes for language and direction.
  useEffect(() => {
    const langCode = language.split('-')[0];
    document.documentElement.lang = langCode;
    // Expanded list of common RTL languages for comprehensive support
    const isRtl = ['ar', 'he', 'ur', 'fa', 'sd', 'ps', 'yi'].includes(langCode);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, options?: { [key:string]: string | number }): string => {
    const pluralRules = new Intl.PluralRules(language);
    const langCode = language.split('-')[0] as keyof typeof resources;

    let translationKey = key;
    if (options && typeof options.count === 'number') {
      const pluralForm = pluralRules.select(options.count);
      const pluralKey = `${key}_${pluralForm}`;

      // Check if the specific plural key exists (e.g., key_one, key_few)
      if ((resources[langCode]?.translation as any)?.[pluralKey] ?? (resources.en.translation as any)?.[pluralKey]) {
        translationKey = pluralKey;
      } else {
        // Fallback to 'other' if the specific plural form is not defined (common for English)
        const fallbackKey = `${key}_other`;
        if ((resources[langCode]?.translation as any)?.[fallbackKey] ?? (resources.en.translation as any)?.[fallbackKey]) {
            translationKey = fallbackKey;
        }
      }
    }

    // Robust fallback system: current language -> English -> key.
    // This ensures that if a translation key is not found (null/undefined), it gracefully falls back.
    const translation = (resources[langCode]?.translation as any)?.[translationKey]
                      ?? (resources.en.translation as any)?.[translationKey]
                      ?? key;
    
    let finalTranslation = translation;
    if (options) {
      Object.keys(options).forEach(placeholder => {
        finalTranslation = finalTranslation.replace(`{${placeholder}}`, String(options[placeholder]));
      });
    }
    return finalTranslation;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};