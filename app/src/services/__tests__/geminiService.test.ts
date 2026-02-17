import { MockResponse, mockScriptProperties, mockUrlFetchApp } from '../../lib/__mocks__/global'
import geminiService from '../geminiService'
import { GeminiRole } from '@/types'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('geminiService', () => {
  describe('createGeminiPayLoad', () => {
    test('正常系: 正しいペイロードを作成すること', () => {
      const prompt = 'テストの質問です'
      const payload = geminiService.createGeminiPayLoad(prompt)

      expect(payload).toEqual({
        contents: [
          {
            parts: [{ text: prompt }],
            role: GeminiRole.User,
          },
        ],
      })
    })
  })

  describe('getResponseText', () => {
    test('正常系: レスポンスからテキストを取得できること', () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'AIからの回答です' }],
              role: 'model',
            },
          },
        ],
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = geminiService.getResponseText(mockResponse as any)

      expect(result).toBe('AIからの回答です')
    })

    test('異常系: candidatesが配列でない場合はエラーをスローすること', () => {
      const mockResponse = {
        candidates: undefined,
      }

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geminiService.getResponseText(mockResponse as any)
      }).toThrow('回答がありません。')
    })
  })

  describe('requestGemini', () => {
    test('正常系: APIリクエストが正しく送信されること', () => {
      const mockApiKey = 'test-api-key-12345'
      mockScriptProperties.getProperty.mockReturnValue(mockApiKey)

      const mockResponseData = {
        candidates: [
          {
            content: {
              parts: [{ text: '回答テキスト' }],
              role: 'model',
            },
          },
        ],
      }
      const mockResponseObj = new MockResponse(JSON.stringify(mockResponseData))
      mockUrlFetchApp.fetch.mockReturnValue(mockResponseObj)

      const payload = geminiService.createGeminiPayLoad('テスト質問')
      const result = geminiService.requestGemini(payload)

      // APIキーが取得されたことを確認
      expect(mockScriptProperties.getProperty).toHaveBeenCalledWith('testGeminiApiKey')

      // UrlFetchAppが正しいURLとオプションで呼ばれたことを確認
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`key=${mockApiKey}`),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          payload: JSON.stringify(payload),
        }),
      )

      expect(result).toEqual(mockResponseData)
    })

    test('異常系: APIキーが未設定の場合はエラーをスローすること', () => {
      mockScriptProperties.getProperty.mockReturnValue(null)

      const payload = geminiService.createGeminiPayLoad('テスト質問')

      expect(() => {
        geminiService.requestGemini(payload)
      }).toThrow('APIキーを設定してください。')
    })
  })
})
