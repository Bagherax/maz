import React, { createContext, useEffect, useCallback, ReactNode } from 'react';
import { Language, LocalizationContextType } from '../types';
import { resources } from '../localization';
import { useLocalStorage } from '../hooks/usePersistentState';

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', () => {
    // Auto-detect the browser language as the default.
    const browserLang = navigator.language.split('-')[0] as Language;
    if ((resources as any)[browserLang]) {
      return browserLang;
    }
    // Fallback to English.
    return 'en';
  });

  // This useEffect is still needed to update document attributes for language and direction.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, options?: { [key:string]: string }): string => {
    let translation = (resources[language]?.translation as Record<string, string>)?.[key] || key;
    if (options) {
      Object.keys(options).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, options[placeholder]);
      });
    }
    return translation;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};