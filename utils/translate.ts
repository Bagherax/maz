import { SupportedLanguage } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GoogleTranslation {
  translatedText: string;
}

interface GoogleTranslateResponse {
  data?: {
    translations: GoogleTranslation[];
  };
}


/**
 * SIMULATED BACKEND PROXY (BATCH-ENABLED & RESILIENT)
 * This function now accepts an array of texts for batch translation and includes a retry mechanism.
 */
async function mockApiTranslate(texts: string[], targetLang: SupportedLanguage): Promise<{ translatedTexts: string[] }> {
    // This API key is securely stored on the "backend" (simulated here)
    const API_KEY = process.env.API_KEY; 
    if (!API_KEY) {
      console.error("CRITICAL: API_KEY is not set for the backend translation service.");
      return { translatedTexts: texts }; // Fallback
    }
  
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                q: texts, // API supports array for batching
                target: targetLang,
                format: 'text'
              })
            }
          );
      
          if (!response.ok) {
            // Only retry on server-side errors (5xx)
            if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
                const backoff = Math.pow(2, attempt) * 200; // 200ms, 400ms, 800ms
                console.warn(`Translation API failed with status ${response.status}. Retrying in ${backoff}ms...`);
                await delay(backoff);
                continue; // Retry the loop
            }
            const errorBody = await response.json().catch(() => response.text());
            console.error('Google Translate API error response:', errorBody);
            throw new Error(`Google API failed with status: ${response.status}`);
          }
      
          const data: GoogleTranslateResponse = await response.json();
          
          if (data?.data?.translations) {
            // Ensure the response length matches the request length
            if (data.data.translations.length !== texts.length) {
                throw new Error('Mismatched translation response count.');
            }
            return { translatedTexts: data.data.translations.map((t) => t.translatedText) };
          } else {
            console.error('Invalid response format from Google API:', data);
            throw new Error('Invalid translation response format');
          }
      
        } catch (error) {
           console.error(`Secure translation proxy simulation failed on attempt ${attempt + 1}:`, error);
           if (attempt < MAX_RETRIES - 1) {
               const backoff = Math.pow(2, attempt) * 200;
               await delay(backoff);
           } else {
               // Final attempt failed, return original texts
               return { translatedTexts: texts };
           }
        }
    }
    // This should only be reached if all retries fail.
    return { translatedTexts: texts };
}


/**
 * Translates a batch of content by calling a secure backend proxy.
 */
export const translateContent = async (texts: string[], targetLang: SupportedLanguage): Promise<string[]> => {
  if (texts.length === 0 || targetLang === 'en') {
    return texts;
  }
  
  // Filter out empty strings to avoid unnecessary API calls
  const nonEmptyTexts = texts.map(text => text || '');

  try {
      const result = await mockApiTranslate(nonEmptyTexts, targetLang);
      return result.translatedTexts;
  } catch (error) {
      console.error("Translation batch failed:", error);
      return texts; // Fallback on failure
  }
};