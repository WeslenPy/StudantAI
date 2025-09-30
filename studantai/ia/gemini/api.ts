import * as FileSystem from "expo-file-system";

import { generateQuestionsFromText } from "./system_message";
import Constants from "expo-constants";
import { DocumentPickerAsset } from "expo-document-picker";
import { File } from 'expo-file-system';

const { GEMINI_API_KEY } = Constants.expoConfig?.extra || {};

interface GeminiResponse {
  text: string;
}

export default class GeminiClient {

  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;

    this.baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  }

  private async request(contents: any[], options: { signal?: AbortSignal } = {}): Promise<GeminiResponse> {

    const body = {
      model: "gemini-2.5-flash",
      contents,
    };


    console.log(body)

    const resp = await fetch(this.baseUrl, {
      method: "POST",
      signal: options.signal,
      headers: {
        "x-goog-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const json = await resp.json();

    console.log(JSON.stringify(json))

    return {
      text:
        json.candidates?.[0]?.content?.parts?.[0]?.text ??
        json.output_text ??
        JSON.stringify(json),
    };
  }

  async sendText(prompt: string, options: { signal?: AbortSignal } = {}): Promise<GeminiResponse> {
    return this.request([{parts:
      [{ text: generateQuestionsFromText(prompt) }]
    }],
    options
  );
  }

  async sendDocumentWithText(files: Array<DocumentPickerAsset>, 
                  prompt: string, 
                  options: { signal?: AbortSignal } = {}): Promise<GeminiResponse> {
    const document = []

    files.forEach(async file=>{
      const fileContent = new File(file)
      const content = fileContent.base64Sync()
      document.push(
        {
          "inline_data": {
            "mime_type":file.mimeType,
            "data": content
          }
        },
      )
    })

    return this.request([
      {parts:
        [
          ...document,
          { text: generateQuestionsFromText(prompt) },
        ]
      }],
    options,
  );
  }


}
