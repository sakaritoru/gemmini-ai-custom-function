import { geminiService } from '@/services'
import { cache as libCache, properties } from '@/lib'
import { generateHash } from '@/utils'

global.onOpen = () => {
  // カスタムメニューを追加
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('GEMINI').addItem('APIキーを登録する', 'showApiKeyInputForm').addToUi()
}

/**
 * APIキーを入力するためのダイアログを表示します。
 */
global.showApiKeyInputForm = () => {
  const html = HtmlService.createHtmlOutputFromFile('static/settingApiKey')
    .setWidth(400)
    .setHeight(200)
  SpreadsheetApp.getUi().showModalDialog(html, 'APIキーを入力してください。')
}

/**
 * APIキーを保存します。
 */
global.saveApiKey = (apiKey: string) => {
  properties.set('geminiApiKey', apiKey)
}

/**
 * GEMNI API に質問をできるカスタム関数です。
 * @param {string} contents 質問内容
 * @param {string} referenceCell 参照セル
 * @return {string} GEMINI API からの回答
 * @customfunction
 */
global.GEMINI = (contents = '岐阜県の県庁所在地', referenceCell = '') => {
  if (Array.isArray(referenceCell)) {
    throw Error('複数のセルに対する参照は対応しておりません。')
  }

  const prompt = `${contents}:${referenceCell}`

  const cacheKey = `gemini:${generateHash(prompt)}`
  const cache = libCache(cacheKey)
  const cacheValue = cache.get()

  Logger.log(cacheValue)

  if (cacheValue) {
    return cacheValue
  }

  const payload = geminiService.createGeminiPayLoad(prompt)

  const response = geminiService.requestGemini(payload)

  const text = geminiService.getResponseText(response)

  if (text) {
    cache.set(text)
    return text
  } else {
    return '回答がありません。'
  }
}
