// Google Apps Script APIのモック
const mockUrlFetchApp = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
  getRequest: jest.fn(),
}

// グローバルオブジェクトに追加
global.UrlFetchApp = mockUrlFetchApp

// レスポンスのモック
class MockResponse {
  private content: string

  constructor(content: string) {
    this.content = content
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getContentText(charset?: string): string {
    return this.content
  }
}

export { MockResponse }
