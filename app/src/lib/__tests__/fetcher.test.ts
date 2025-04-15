import fetcher from '../fetcher';

// モックの型定義
type MockResponse = {
  getContentText: jest.Mock;
};

// グローバルモックの設定
global.UrlFetchApp = {
  fetch: jest.fn(),
} as unknown as typeof UrlFetchApp;

describe('fetcher', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常系: 正しいJSONレスポンスを返すこと', () => {
    // モックレスポンスの準備
    const mockJsonResponse = { data: 'test data' };
    const mockResponse: MockResponse = {
      getContentText: jest.fn().mockReturnValue(JSON.stringify(mockJsonResponse)),
    };
    
    // UrlFetchApp.fetchのモック実装
    (global.UrlFetchApp.fetch as jest.Mock).mockReturnValue(mockResponse);
    
    // テスト対象の関数を実行
    const url = 'https://example.com/api';
    const options = { method: 'GET' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    const result = fetcher<typeof mockJsonResponse>(url, options);
    
    // 検証
    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(url, options);
    expect(mockResponse.getContentText).toHaveBeenCalledWith('UTF-8');
    expect(result).toEqual(mockJsonResponse);
  });

  it('異常系: UrlFetchApp.fetchがエラーを投げた場合、エラーをラップして再スローすること', () => {
    // UrlFetchApp.fetchのモック実装でエラーをスロー
    const mockError = new Error('Network error');
    (global.UrlFetchApp.fetch as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    
    // テスト対象の関数を実行し、エラーをキャッチ
    const url = 'https://example.com/api';
    const options = { method: 'GET' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    
    // エラーがスローされることを検証
    expect(() => {
      fetcher(url, options);
    }).toThrow(`Error: ${mockError}`);
    
    // UrlFetchApp.fetchが呼ばれたことを検証
    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(url, options);
  });

  it('異常系: JSONのパースに失敗した場合、エラーをラップして再スローすること', () => {
    // モックレスポンスの準備（不正なJSON）
    const mockResponse: MockResponse = {
      getContentText: jest.fn().mockReturnValue('invalid json'),
    };
    
    // UrlFetchApp.fetchのモック実装
    (global.UrlFetchApp.fetch as jest.Mock).mockReturnValue(mockResponse);
    
    // テスト対象の関数を実行し、エラーをキャッチ
    const url = 'https://example.com/api';
    const options = { method: 'GET' } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    
    // エラーがスローされることを検証
    expect(() => {
      fetcher(url, options);
    }).toThrow('Error:');
    
    // 検証
    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(url, options);
    expect(mockResponse.getContentText).toHaveBeenCalledWith('UTF-8');
  });
});
