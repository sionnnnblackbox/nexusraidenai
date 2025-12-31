
import { GoogleGenAI, Type } from "@google/genai";
import { SummaryLength, SummaryResult, AnimeContinuationResult, Language, ChatMessage } from "../types";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const summarizeText = async (text: string, length: SummaryLength, lang: Language): Promise<SummaryResult> => {
  const ai = getAIInstance();
  const langPrompt = lang === 'id' ? 'Tolong berikan respon dalam Bahasa Indonesia.' : 'Please provide the response in English.';
  
  const prompt = `Summarize the following text in a ${length} manner. ${langPrompt}
  Text: ${text}
  
  Provide the response in the following JSON format:
  {
    "summary": "A cohesive paragraph of the summary",
    "bulletPoints": ["point 1", "point 2", ...],
    "keyTakeaways": ["takeaway 1", "takeaway 2", ...]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['summary', 'bulletPoints', 'keyTakeaways'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};

export const translateText = async (text: string, source: Language, target: Language): Promise<string> => {
  const ai = getAIInstance();
  const prompt = `Translate the following text from ${source} to ${target}. Preserve the original meaning and tone.
  Text: ${text}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || '';
};

export const chatWithSummary = async (
  originalText: string, 
  summary: string, 
  userMessage: string, 
  history: ChatMessage[], 
  lang: Language
): Promise<string> => {
  const ai = getAIInstance();
  const systemInstruction = `You are a helpful assistant. You have access to a text and its summary. 
  Original Text: ${originalText}
  Summary Provided to User: ${summary}
  Respond in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}. 
  Be concise and base your answers on the provided text.`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
    history: history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text || '';
};

export const findAnimeContinuation = async (title: string, season: string, lang: Language): Promise<AnimeContinuationResult> => {
  const ai = getAIInstance();
  const langNames = { id: 'Indonesian', en: 'English', ja: 'Japanese' };
  
  const prompt = `Find the manga continuation for the anime "${title}" Season ${season}. 
  Please provide the synopsis specifically in ${langNames[lang]}.
  
  You MUST search for:
  1. The EXACT chapter number where the manga continues after the anime season ends.
  2. The Volume number containing that chapter.
  3. A high-quality synopsis of the arc that follows (Spoiler-Free).
  4. A direct URL to a High-Definition (HD) official manga volume cover image.
  5. Price comparisons for Indonesian marketplaces (Tokopedia, Shopee, Gramedia) and International (Amazon, BookWalker).
  
  Format the result in this JSON structure:
  {
    "animeTitle": "${title}",
    "nextChapter": "Chapter X (Name of chapter)",
    "nextVolume": "Volume Y",
    "synopsis": "A detailed but spoiler-free summary...",
    "volumeImageUrl": "https://direct-link-to-hd-image.jpg",
    "marketplaces": [
      {
        "name": "Tokopedia",
        "priceIDR": "Rp 45.000",
        "link": "https://...",
        "format": "Physical",
        "isInternational": false
      },
      ...
    ]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          animeTitle: { type: Type.STRING },
          nextChapter: { type: Type.STRING },
          nextVolume: { type: Type.STRING },
          synopsis: { type: Type.STRING },
          volumeImageUrl: { type: Type.STRING },
          marketplaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                priceIDR: { type: Type.STRING },
                priceUSD: { type: Type.STRING },
                link: { type: Type.STRING },
                format: { type: Type.STRING },
                isInternational: { type: Type.BOOLEAN },
              },
              required: ['name', 'link', 'format', 'isInternational'],
            },
          },
        },
        required: ['animeTitle', 'nextChapter', 'nextVolume', 'synopsis', 'volumeImageUrl', 'marketplaces'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};
