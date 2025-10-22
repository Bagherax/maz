import { SupportedLanguage } from "../types";

export interface LanguageOption {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }
  
  export const LANGUAGES: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
  ];