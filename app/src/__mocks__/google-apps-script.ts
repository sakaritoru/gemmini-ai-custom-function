// Google Apps Scriptのグローバルモック

// PropertiesServiceのモック
const scriptProperties = {
  properties: new Map<string, string>(),
  getProperty: function(key: string) {
    return this.properties.get(key) || null;
  },
  setProperty: function(key: string, value: string) {
    this.properties.set(key, value);
    return this;
  },
};

export const PropertiesService = {
  getScriptProperties: () => scriptProperties,
};

// Loggerのモック
export const Logger = {
  log: jest.fn(),
};

// SpreadsheetAppのモック
export const SpreadsheetApp = {
  getUi: jest.fn().mockReturnValue({
    createMenu: jest.fn().mockReturnThis(),
    addItem: jest.fn().mockReturnThis(),
    addToUi: jest.fn(),
    showModalDialog: jest.fn(),
  }),
};

// HtmlServiceのモック
export const HtmlService = {
  createHtmlOutputFromFile: jest.fn().mockReturnValue({
    setWidth: jest.fn().mockReturnThis(),
    setHeight: jest.fn().mockReturnThis(),
  }),
};

// グローバルオブジェクト
export const global = {
  onOpen: jest.fn(),
  showApiKeyInputForm: jest.fn(),
  saveApiKey: jest.fn(),
  GEMINI: jest.fn(),
};
