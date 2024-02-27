/* eslint-disable no-var */
declare global {
  var GEMINI: (contents?: string, referenceCell?: string) => string | undefined
  var onOpen: () => void
  var showApiKeyInputForm: () => void
  var saveApiKey: (apiKey: string) => void
}

export {}
