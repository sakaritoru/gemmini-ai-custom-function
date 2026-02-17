// Google Apps Script APIのモック

// UrlFetchApp mock
const mockUrlFetchApp = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
  getRequest: jest.fn(),
}
global.UrlFetchApp = mockUrlFetchApp

// CacheService mock
const mockCache = {
  get: jest.fn(),
  getAll: jest.fn(),
  put: jest.fn(),
  putAll: jest.fn(),
  remove: jest.fn(),
  removeAll: jest.fn(),
}

const mockCacheService = {
  getDocumentCache: jest.fn().mockReturnValue(mockCache),
  getScriptCache: jest.fn().mockReturnValue(mockCache),
  getUserCache: jest.fn().mockReturnValue(mockCache),
}
global.CacheService = mockCacheService as unknown as GoogleAppsScript.Cache.CacheService

// PropertiesService mock
const mockScriptProperties = {
  deleteAllProperties: jest.fn().mockReturnThis(),
  deleteProperty: jest.fn().mockReturnThis(),
  getKeys: jest.fn().mockReturnValue([]),
  getProperties: jest.fn().mockReturnValue({}),
  getProperty: jest.fn().mockReturnValue(null),
  setProperties: jest.fn().mockReturnThis(),
  setProperty: jest.fn().mockReturnThis(),
}

const mockPropertiesService = {
  getDocumentProperties: jest.fn().mockReturnValue(mockScriptProperties),
  getScriptProperties: jest.fn().mockReturnValue(mockScriptProperties),
  getUserProperties: jest.fn().mockReturnValue(mockScriptProperties),
}
global.PropertiesService =
  mockPropertiesService as unknown as GoogleAppsScript.Properties.PropertiesService

// Utilities mock
const mockUtilities = {
  DigestAlgorithm: {
    MD2: 0,
    MD5: 1,
    SHA_1: 2,
    SHA_256: 3,
    SHA_384: 4,
    SHA_512: 5,
  },
  computeDigest: jest.fn(),
}
// @ts-expect-error GAS API mock
global.Utilities = mockUtilities

// SpreadsheetApp mock
const mockMenu = {
  addItem: jest.fn().mockReturnThis(),
  addSeparator: jest.fn().mockReturnThis(),
  addSubMenu: jest.fn().mockReturnThis(),
  addToUi: jest.fn(),
}

const mockUi = {
  createMenu: jest.fn().mockReturnValue(mockMenu),
  showModalDialog: jest.fn(),
  showSidebar: jest.fn(),
}

const mockSpreadsheetApp = {
  getUi: jest.fn().mockReturnValue(mockUi),
}
// @ts-expect-error GAS API mock
global.SpreadsheetApp = mockSpreadsheetApp

// HtmlService mock
const mockHtmlOutput = {
  setHeight: jest.fn().mockReturnThis(),
  setWidth: jest.fn().mockReturnThis(),
}

const mockHtmlService = {
  createHtmlOutputFromFile: jest.fn().mockReturnValue(mockHtmlOutput),
}
// @ts-expect-error GAS API mock
global.HtmlService = mockHtmlService

// Logger mock
const mockLogger = {
  log: jest.fn(),
}
// @ts-expect-error GAS API mock
global.Logger = mockLogger

// 環境変数のセットアップ
process.env.GEMINI_API_KEY_SCRIPT_PROPERTY = 'testGeminiApiKey'
process.env.GEMINI_API_URL = 'https://test.example.com/gemini'

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
  mockCache,
  mockCacheService,
  mockHtmlOutput,
  mockHtmlService,
  mockLogger,
  mockMenu,
  mockScriptProperties,
  mockSpreadsheetApp,
  mockUi,
  mockUrlFetchApp,
  mockUtilities,
}
