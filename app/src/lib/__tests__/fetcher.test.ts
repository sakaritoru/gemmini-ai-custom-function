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
