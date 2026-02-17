import {
  MockResponse,
  mockCache,
  mockCacheService,
  mockHtmlOutput,
  mockHtmlService,
  mockMenu,
  mockScriptProperties,
  mockSpreadsheetApp,
  mockUi,
  mockUrlFetchApp,
  mockUtilities,
} from '../lib/__mocks__/global'

// main.ts をインポートすると、global に関数が登録される
import '../main'

beforeEach(() => {
  jest.clearAllMocks()
  // デフォルトのモック実装を復元
  mockCacheService.getDocumentCache.mockReturnValue(mockCache)
  mockSpreadsheetApp.getUi.mockReturnValue(mockUi)
  mockUi.createMenu.mockReturnValue(mockMenu)
  mockHtmlService.createHtmlOutputFromFile.mockReturnValue(mockHtmlOutput)
})

describe('onOpen', () => {
  test('正常系: カスタムメニューが追加されること', () => {
    global.onOpen()

    expect(mockSpreadsheetApp.getUi).toHaveBeenCalled()
    expect(mockUi.createMenu).toHaveBeenCalledWith('GEMINI')
    expect(mockMenu.addItem).toHaveBeenCalledWith('APIキーを登録する', 'showApiKeyInputForm')
    expect(mockMenu.addToUi).toHaveBeenCalled()
  })
})

describe('showApiKeyInputForm', () => {
  test('正常系: APIキー入力ダイアログが表示されること', () => {
    global.showApiKeyInputForm()

    expect(mockHtmlService.createHtmlOutputFromFile).toHaveBeenCalledWith('static/settingApiKey')
    expect(mockHtmlOutput.setWidth).toHaveBeenCalledWith(400)
    expect(mockHtmlOutput.setHeight).toHaveBeenCalledWith(200)
    expect(mockUi.showModalDialog).toHaveBeenCalledWith(
      mockHtmlOutput,
      'APIキーを入力してください。',
    )
  })
})

describe('saveApiKey', () => {
  test('正常系: APIキーが保存されること', () => {
    global.saveApiKey('my-api-key-12345')

    expect(mockScriptProperties.setProperty).toHaveBeenCalledWith(
      'testGeminiApiKey',
      'my-api-key-12345',
    )
  })
})

describe('GEMINI', () => {
  test('正常系: キャッシュがある場合はキャッシュから返すこと', () => {
    const cachedResponse = 'キャッシュされた回答'
    mockUtilities.computeDigest.mockReturnValue([1, 2, 3])
    mockCache.get.mockReturnValue(cachedResponse)

    const result = global.GEMINI('テスト質問', '')

    // キャッシュから取得されたことを確認
    expect(mockCache.get).toHaveBeenCalled()
    // APIは呼ばれないことを確認
    expect(mockUrlFetchApp.fetch).not.toHaveBeenCalled()
    expect(result).toBe(cachedResponse)
  })

  test('正常系: キャッシュがない場合はAPIから取得してキャッシュすること', () => {
    // キャッシュミス
    mockCache.get.mockReturnValue(null)
    mockUtilities.computeDigest.mockReturnValue([10, 20, 30])

    // APIキーを設定
    mockScriptProperties.getProperty.mockReturnValue('fake-api-key')

    // Gemini APIのモックレスポンス
    const apiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'AIからの回答' }],
            role: 'model',
          },
        },
      ],
    }
    const mockResponseObj = new MockResponse(JSON.stringify(apiResponse))
    mockUrlFetchApp.fetch.mockReturnValue(mockResponseObj)

    const result = global.GEMINI('テスト質問', '')

    // APIが呼ばれたことを確認
    expect(mockUrlFetchApp.fetch).toHaveBeenCalled()
    // 結果がキャッシュされたことを確認
    expect(mockCache.put).toHaveBeenCalled()
    expect(result).toBe('AIからの回答')
  })

  test('正常系: レスポンステキストが空の場合は「回答がありません。」を返すこと', () => {
    mockCache.get.mockReturnValue(null)
    mockUtilities.computeDigest.mockReturnValue([10, 20, 30])
    mockScriptProperties.getProperty.mockReturnValue('fake-api-key')

    // テキストが空のレスポンス
    const apiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: '' }],
            role: 'model',
          },
        },
      ],
    }
    const mockResponseObj = new MockResponse(JSON.stringify(apiResponse))
    mockUrlFetchApp.fetch.mockReturnValue(mockResponseObj)

    const result = global.GEMINI('テスト質問', '')

    expect(result).toBe('回答がありません。')
  })

  test('正常系: referenceCellが指定された場合はプロンプトに含まれること', () => {
    mockCache.get.mockReturnValue(null)
    mockUtilities.computeDigest.mockReturnValue([10, 20, 30])
    mockScriptProperties.getProperty.mockReturnValue('fake-api-key')

    const apiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: '参照セルを含む回答' }],
            role: 'model',
          },
        },
      ],
    }
    const mockResponseObj = new MockResponse(JSON.stringify(apiResponse))
    mockUrlFetchApp.fetch.mockReturnValue(mockResponseObj)

    const result = global.GEMINI('質問', '参照データ')

    // APIリクエストのペイロードに参照セルが含まれることを確認
    const fetchCall = mockUrlFetchApp.fetch.mock.calls[0]
    const requestPayload = JSON.parse(fetchCall[1].payload)
    expect(requestPayload.contents[0].parts[0].text).toBe('質問:参照データ')
    expect(result).toBe('参照セルを含む回答')
  })

  test('異常系: 複数セル参照はエラーをスローすること', () => {
    expect(() => {
      global.GEMINI('テスト', ['セル1', 'セル2'] as unknown as string)
    }).toThrow('複数のセルに対する参照は対応しておりません。')
  })

  test('正常系: デフォルト引数で動作すること', () => {
    mockCache.get.mockReturnValue('デフォルトの回答')
    mockUtilities.computeDigest.mockReturnValue([1, 2, 3])

    const result = global.GEMINI()

    expect(result).toBe('デフォルトの回答')
  })
})
