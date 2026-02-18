import { GoogleGenAI, Type } from "@google/genai";
import { Dossier, Language } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDossier = async (name: string, lang: Language): Promise<Dossier> => {
  try {
    const ai = initGenAI();
    
    const langInstruction = lang === 'ko' ? "Write the response in Korean." : "Write the response in English.";

    // We use Gemini to hallucinate a fun "Secret Agent" profile for the recognized user
    const prompt = `Generate a fictional, high-tech secret agent dossier for a person named "${name}". 
    ${langInstruction}
    The output must be a JSON object with the following fields:
    - codename: A cool spy code name.
    - role: Their specialization (e.g., Cyber-Infiltration, Heavy Weapons, Quantum Cryptography).
    - threatLevel: A color-coded threat level (Low, Elevated, High, Critical).
    - biography: A 2-sentence mysterious background story.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                codename: { type: Type.STRING },
                role: { type: Type.STRING },
                threatLevel: { type: Type.STRING },
                biography: { type: Type.STRING }
            }
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as Dossier;

  } catch (error) {
    console.error("Gemini Dossier Error:", error);
    // Fallback if API fails or key is missing
    const fallback = lang === 'ko' ? {
        codename: "알 수 없는 요원",
        role: "시스템 오류",
        threatLevel: "알 수 없음",
        biography: "메인프레임에서 기밀 데이터를 검색할 수 없습니다."
    } : {
      codename: "UNKNOWN_AGENT",
      role: "System Error",
      threatLevel: "Unknown",
      biography: "Unable to retrieve classified data from the mainframe."
    };

    return fallback;
  }
};