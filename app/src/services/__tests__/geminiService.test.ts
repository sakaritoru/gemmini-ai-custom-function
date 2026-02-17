import { MockResponse, mockUrlFetchApp, mockProperties } from '../../lib/__mocks__/global'
import geminiService from '../geminiService'
import type { GenerateContentResponse } from '@google/generative-ai'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('geminiService', () => {
  describe('createGeminiPayLoad', () => {
    test('正常系: 正しいペイロード構造を生成すること', () => {
      const payload = geminiService.createGeminiPayLoad('テストプロンプト')
      expect(payload).toEqual({
        contents: [
          {
            parts: [{ text: 'テストプロンプト' }],
            role: 'user',
          },
        ],
      })
    })

    test('正常系: 空文字列のプロンプトでもペイロードを生成すること', () => {
      const payload = geminiService.createGeminiPayLoad('')
      expect(payload.contents[0].parts[0].text).toBe('')
    })
  })

  describe('getResponseText', () => {
    test('正常系: レスポンスからテキストを取得すること', () => {
      const response = {
        candidates: [
          {
            content: {
              parts: [{ text: '回答テキスト' }],
              role: 'model',
            },
          },
        ],
      } as unknown as GenerateContentResponse

      const result = geminiService.getResponseText(response)
      expect(result).toBe('回答テキスト')
    })

    test('異常系: candidatesが配列でない場合エラーをスローすること', () => {
      const response = {
        candidates: undefined,
      } as unknown as GenerateContentResponse

      expect(() => {
        geminiService.getResponseText(response)
      }).toThrow('回答がありません。')
    })
  })

  describe('requestGemini', () => {
    test('正常系: APIキーが設定されている場合リクエストを送信すること', () => {
      const mockResponseData = {
        candidates: [
          {
            content: {
              parts: [{ text: '回答' }],
              role: 'model',
            },
          },
        ],
      }

      mockProperties.getProperty.mockReturnValueOnce('test-api-key')
      mockUrlFetchApp.fetch.mockReturnValueOnce(
        new MockResponse(JSON.stringify(mockResponseData)),
      )

      const payload = geminiService.createGeminiPayLoad('テスト')
      const result = geminiService.requestGemini(payload)

      expect(mockProperties.getProperty).toHaveBeenCalledWith('GEMINI_API_KEY')
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
        }),
      )
      expect(result).toEqual(mockResponseData)
    })

    test('異常系: APIキーが未設定の場合エラーをスローすること', () => {
      mockProperties.getProperty.mockReturnValueOnce(null)

      const payload = geminiService.createGeminiPayLoad('テスト')

      expect(() => {
        geminiService.requestGemini(payload)
      }).toThrow('APIキーを設定してください。')
    })
  })
})
