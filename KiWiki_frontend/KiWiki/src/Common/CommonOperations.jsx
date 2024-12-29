// Conversor Fecha
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

export const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false, // Si quieres 24 horas. Si prefieres formato de 12 horas, cambia a `true`
    };
  
    return new Date(dateString).toLocaleString(undefined, options);
  };

const azureTranslateKey = "89eRbsY6P8evCNoIoGbA9SBwrIGkwWWCg0Z7voA9ukagrzaLesM6JQQJ99ALACmepeSXJ3w3AAAbACOGkF3T";
const azureEndpoint = "https://api.cognitive.microsofttranslator.com";
const azureLocation = "uksouth";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const detectLanguage = async (text) => {
    try {
      const response = await axios({
        baseURL: azureEndpoint,
        url: '/detect',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': azureTranslateKey,
          'Ocp-Apim-Subscription-Region': azureLocation,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4().toString(),
        },
        params: {
          'api-version': '3.0',
        },
        data: [{ 'text': text }],
        responseType: 'json',
      });

      return response.data[0].language;
    } catch (error) {
      console.error('Error al detectar el idioma:', error);
      return null;
    }
  };

export const translateText = async (text,targetLanguage, texType) => {
    try {
      const detectedLang = await detectLanguage(text);

      if (!detectedLang) {
        console.warn('No se pudo detectar el idioma, usando "es" como predeterminado.');
      }

      const response = await axios({
        baseURL: azureEndpoint,
        url: '/translate',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': azureTranslateKey,
          'Ocp-Apim-Subscription-Region': azureLocation,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        params: {
          'api-version': '3.0',
          'from': detectedLang || 'es',
          'to': targetLanguage,
          'textType': {texType}
        },
        data: [{ 'text': text }],
        responseType: 'json'
      });

      return response.data[0].translations[0].text;
    } catch (error) {
      console.error('Error al traducir el texto:', error);
      return text;
    }
  };