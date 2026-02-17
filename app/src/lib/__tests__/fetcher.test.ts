import { MockResponse } from '../__mocks__/global'
import fetcher from '../fetcher'

// テスト実行前にモックをセットアップ
beforeEach(() => {
  // モックをリセット
  jest.clearAllMocks()
})

// 型定義の問題を回避するための型アサーション
const mockFetch = global.UrlFetchApp.fetch as jest.Mock

describe('fetcher', () => {
  test('正常系: 正しいJSONレスポンスを返すこと', () => {
    // モックデータ
    const mockData = { data: { id: 1, name: 'test' }, success: true }
    const mockResponseText = JSON.stringify(mockData)
    const mockResponseObj = new MockResponse(mockResponseText)

    // UrlFetchApp.fetchのモック実装
    mockFetch.mockReturnValue(mockResponseObj)

    // テスト対象の関数を実行
    const url = 'https://example.com/api'
    const options = { method: 'get' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
    const result = fetcher<typeof mockData>(url, options)

    // 期待する結果の検証
    expect(mockFetch).toHaveBeenCalledWith(url, options)
    expect(result).toEqual(mockData)
  })

  test('正常系: 空オブジェクトのレスポンスを返すこと', () => {
    const mockData = {}
    const mockResponseObj = new MockResponse(JSON.stringify(mockData))

    mockFetch.mockReturnValue(mockResponseObj)

    const url = 'https://example.com/api/empty'
    const options = { method: 'get' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
    const result = fetcher<typeof mockData>(url, options)

    expect(mockFetch).toHaveBeenCalledWith(url, options)
    expect(result).toEqual({})
  })

  test('正常系: POSTリクエストでボディオプションを渡せること', () => {
    const mockData = { id: 1, created: true }
    const mockResponseObj = new MockResponse(JSON.stringify(mockData))

    mockFetch.mockReturnValue(mockResponseObj)

    const url = 'https://example.com/api/users'
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ name: 'test' }),
    } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
    const result = fetcher<typeof mockData>(url, options)

    expect(mockFetch).toHaveBeenCalledWith(url, options)
    expect(result).toEqual(mockData)
  })

  test('正常系: getContentTextがUTF-8エンコーディングで呼ばれること', () => {
    const mockData = { message: 'テスト' }
    const mockResponseObj = new MockResponse(JSON.stringify(mockData))
    const spy = jest.spyOn(mockResponseObj, 'getContentText')

    mockFetch.mockReturnValue(mockResponseObj)

    const url = 'https://example.com/api'
    const options = { method: 'get' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
    fetcher(url, options)

    expect(spy).toHaveBeenCalledWith('UTF-8')
  })

  test('異常系: エラーが発生した場合は例外をスローすること', () => {
    // UrlFetchApp.fetchのモック実装でエラーをスロー
    const errorMessage = 'Network error'
    mockFetch.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    // テスト対象の関数を実行し、例外がスローされることを確認
    const url = 'https://example.com/api'
    const options = { method: 'get' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

    expect(() => {
      fetcher(url, options)
    }).toThrow(`Error: Error: ${errorMessage}`)
  })

  test('異常系: JSONのパースに失敗した場合は例外をスローすること', () => {
    // 不正なJSONを返すモック
    const invalidJson = '{ "invalid": json }'
    const mockResponseObj = new MockResponse(invalidJson)

    // UrlFetchApp.fetchのモック実装
    mockFetch.mockReturnValue(mockResponseObj)

    // テスト対象の関数を実行し、例外がスローされることを確認
    const url = 'https://example.com/api'
    const options = { method: 'get' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

    expect(() => {
      fetcher(url, options)
    }).toThrow('Error: ')
  })
})
