import {
  mockCache,
  mockProperties,
  mockUrlFetchApp,
  MockResponse,
  mockLogger,
  mockUi,
  mockMenu,
  mockHtmlService,
  mockHtmlOutput,
} from '../lib/__mocks__/global'

// main.ts を読み込んでグローバル関数を登録する
import '../main'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('main', () => {
  describe('GEMINI', () => {
    test('正常系: キャッシュヒット時にキャッシュ値を返すこと', () => {
      mockCache.get.mockReturnValueOnce('キャッシュされた回答')

      const result = global.GEMINI('テスト質問', '')
      expect(result).toBe('キャッシュされた回答')
      expect(mockUrlFetchApp.fetch).not.toHaveBeenCalled()
      expect(mockLogger.log).toHaveBeenCalledWith('キャッシュされた回答')
    })

    test('正常系: キャッシュミス時にAPIを呼び出して結果を返すこと', () => {
      mockCache.get.mockReturnValueOnce(null)

      const mockResponseData = {
        candidates: [
          {
            content: {
              parts: [{ text: 'API回答' }],
              role: 'model',
            },
          },
        ],
      }
      mockProperties.getProperty.mockReturnValueOnce('test-api-key')
      mockUrlFetchApp.fetch.mockReturnValueOnce(
        new MockResponse(JSON.stringify(mockResponseData)),
      )

      const result = global.GEMINI('テスト質問', '')
      expect(result).toBe('API回答')
      expect(mockCache.put).toHaveBeenCalled()
    })

    test('正常系: APIが空のテキストを返した場合デフォルトメッセージを返すこと', () => {
      mockCache.get.mockReturnValueOnce(null)

      const mockResponseData = {
        candidates: [
          {
            content: {
              parts: [{ text: '' }],
              role: 'model',
            },
          },
        ],
      }
      mockProperties.getProperty.mockReturnValueOnce('test-api-key')
      mockUrlFetchApp.fetch.mockReturnValueOnce(
        new MockResponse(JSON.stringify(mockResponseData)),
      )

      const result = global.GEMINI('テスト質問', '')
      expect(result).toBe('回答がありません。')
    })

    test('異常系: referenceCellが配列の場合エラーをスローすること', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.GEMINI('テスト', ['A1', 'B1'] as any)
      }).toThrow('複数のセルに対する参照は対応しておりません。')
    })

    test('正常系: デフォルト引数が使用されること', () => {
      mockCache.get.mockReturnValueOnce('キャッシュ値')

      const result = global.GEMINI()
      expect(result).toBe('キャッシュ値')
    })
  })

  describe('onOpen', () => {
    test('正常系: カスタムメニューが作成されること', () => {
      global.onOpen()

      expect(mockUi.createMenu).toHaveBeenCalledWith('GEMINI')
      expect(mockMenu.addItem).toHaveBeenCalledWith('APIキーを登録する', 'showApiKeyInputForm')
      expect(mockMenu.addToUi).toHaveBeenCalled()
    })
  })

  describe('showApiKeyInputForm', () => {
    test('正常系: APIキー入力フォームが表示されること', () => {
      global.showApiKeyInputForm()

      expect(mockHtmlService.createHtmlOutputFromFile).toHaveBeenCalledWith('static/settingApiKey')
      expect(mockHtmlOutput.setWidth).toHaveBeenCalledWith(400)
      expect(mockHtmlOutput.setHeight).toHaveBeenCalledWith(200)
      expect(mockUi.showModalDialog).toHaveBeenCalled()
    })
  })

  describe('saveApiKey', () => {
    test('正常系: APIキーが保存されること', () => {
      global.saveApiKey('new-api-key')
      expect(mockProperties.setProperty).toHaveBeenCalledWith('GEMINI_API_KEY', 'new-api-key')
    })
  })
})
