// 最大で24時間しか保存できないらしいので24時間にしておく。
const DEFAULT_EXPIRE = 24 * 60 * 60 * 1000

/**
 * 開くたびにセルで呼び出される関数が実行されるためキャッシュします。
 * param {string} key キャッシュのキー
 */
const cache = (key: string, expire: number = DEFAULT_EXPIRE) => {
  const cache = CacheService.getDocumentCache()
  return {
    get() {
      return cache?.get(key)
    },
    set(contents: string) {
      return cache?.put(key, contents, expire)
    },
  }
}

export default cache
