// テスト用の環境変数
process.env.GEMINI_API_KEY_SCRIPT_PROPERTY = 'GEMINI_API_KEY'
process.env.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

// Google Apps Script APIのモック

// UrlFetchApp
const mockUrlFetchApp = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
  getRequest: jest.fn(),
}

// CacheService
const mockCache = {
  get: jest.fn(),
  put: jest.fn(),
}

const mockCacheService = {
  getDocumentCache: jest.fn().mockReturnValue(mockCache),
}

// PropertiesService
const mockProperties = {
  getProperty: jest.fn(),
  setProperty: jest.fn(),
}

const mockPropertiesService = {
  getScriptProperties: jest.fn().mockReturnValue(mockProperties),
}

// SpreadsheetApp
const mockMenu = {
  addItem: jest.fn().mockReturnThis(),
  addToUi: jest.fn(),
}

const mockUi = {
  createMenu: jest.fn().mockReturnValue(mockMenu),
  showModalDialog: jest.fn(),
}

const mockSpreadsheetApp = {
  getUi: jest.fn().mockReturnValue(mockUi),
}

// Utilities
const mockUtilities = {
  computeDigest: jest.fn((_algorithm: string, input: string) => {
    // テスト用の簡易ハッシュ値を返す
    const bytes: number[] = []
    for (let i = 0; i < 32; i++) {
      bytes.push((input.charCodeAt(i % input.length) + i) % 256)
    }
    return bytes
  }),
  DigestAlgorithm: {
    SHA_256: 'SHA_256',
  },
}

// Logger
const mockLogger = {
  log: jest.fn(),
}

// HtmlService
const mockHtmlOutput = {
  setWidth: jest.fn().mockReturnThis(),
  setHeight: jest.fn().mockReturnThis(),
}

const mockHtmlService = {
  createHtmlOutputFromFile: jest.fn().mockReturnValue(mockHtmlOutput),
}

// グローバルオブジェクトに追加
global.UrlFetchApp = mockUrlFetchApp
global.CacheService = mockCacheService as any
global.PropertiesService = mockPropertiesService as any
global.SpreadsheetApp = mockSpreadsheetApp as any
global.Utilities = mockUtilities as any
global.Logger = mockLogger as any
global.HtmlService = mockHtmlService as any

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

export {
  MockResponse,
  mockUrlFetchApp,
  mockCacheService,
  mockCache,
  mockPropertiesService,
  mockProperties,
  mockSpreadsheetApp,
  mockUi,
  mockMenu,
  mockUtilities,
  mockLogger,
  mockHtmlService,
  mockHtmlOutput,
}
