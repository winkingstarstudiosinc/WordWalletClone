import axios from 'axios';

const API_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate';
const API_VERSION = '3.0';
const API_KEY = '9b1b61cc4eca4636bc326e4fb09bd331';
const API_REGION = 'canadacentral';

const getLanguageCode = languageName => {
  const languageMap = {
    English: 'en',
    French: 'fr',
    Spanish: 'es',
    German: 'de',
    // Add other languages as needed
  };
  return languageMap[languageName] || languageName; // Return the code, or the input if not found
};

export const translateText = async (text, fromLanguageName, toLanguageName) => {
  const fromLang = getLanguageCode(fromLanguageName);
  const toLang = getLanguageCode(toLanguageName);
  const url = `${API_ENDPOINT}?api-version=${API_VERSION}&from=${fromLang}&to=${toLang}`;
  try {
    const response = await axios.post(url, [{Text: text}], {
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Ocp-Apim-Subscription-Region': API_REGION,
        'Content-Type': 'application/json',
      },
    });
    return response.data[0].translations[0].text; // Extracting the translated text from the response
  } catch (error) {
    console.error(
      'Error translating text:',
      error.response ? error.response.data : error.message,
    );
    throw new Error(
      error.response
        ? error.response.data.error.message
        : 'Failed to connect to translation service',
    );
  }
};
