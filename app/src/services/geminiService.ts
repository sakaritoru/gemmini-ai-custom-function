import type { GenerateContentRequest, GenerateContentResponse } from '@google/generative-ai'
import { fetcher, properties } from '@/lib'
import { generateUrl } from '@/utils'
import { GeminiRole } from '@/types'

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

const geminiService = {
  /**
   * Gemini API に送る Body を作成します。
   */
  createGeminiPayLoad(prompt: string): GenerateContentRequest {
    return {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
          role: GeminiRole.User,
        },
      ],
    }
  },
  /**
   * Gemini API からの回答を取得します。
   */
  getResponseText(response: GenerateContentResponse) {
    if (Array.isArray(response.candidates)) {
      return response.candidates[0].content.parts[0].text
    } else {
      throw new Error('回答がありません。')
    }
  },
  /**
   * Gemini API にリクエストします。
   */
  requestGemini(payload: GenerateContentRequest) {
    // APIキーを設定
    const key = properties.get('geminiApiKey')

    if (!key) {
      throw new Error('APIキーを設定してください。')
    }

    const requestUrl = generateUrl(API_URL, { key })

    return fetcher<GenerateContentResponse>(requestUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      payload: JSON.stringify(payload),
    })
  },
}

export default geminiService
