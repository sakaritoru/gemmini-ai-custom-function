/**
 * スクリプトプロパティを取得・設定します
 */
const properties = {
  get(key: string) {
    return PropertiesService.getScriptProperties().getProperty(key)
  },
  set(key: string, value: string) {
    return PropertiesService.getScriptProperties().setProperty(key, value)
  },
}

export default properties
