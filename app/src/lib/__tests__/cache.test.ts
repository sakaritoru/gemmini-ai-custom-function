import cache from '../cache'

// Google Apps ScriptのCacheServiceのモック
const mockPut = jest.fn()
const mockGet = jest.fn()

// グローバルなCacheServiceのモック
;(global as any).CacheService = {
  getDocumentCache: () => ({
    get: mockGet,
    put: mockPut,
  }),
}

describe('cache', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    mockPut.mockClear()
    mockGet.mockClear()
  })

  describe('get', () => {
    it('キャッシュから値を取得できる', () => {
      const testKey = 'testKey'
      const testValue = 'testValue'
      mockGet.mockReturnValue(testValue)

      const result = cache(testKey).get()

      expect(result).toBe(testValue)
      expect(mockGet).toHaveBeenCalledWith(testKey)
    })

    it('キャッシュが存在しない場合はundefinedを返す', () => {
      const testKey = 'nonExistentKey'
      mockGet.mockReturnValue(null)

      const result = cache(testKey).get()

      expect(result).toBeNull()
      expect(mockGet).toHaveBeenCalledWith(testKey)
    })
  })

  describe('set', () => {
    it('デフォルトの有効期限でキャッシュを設定できる', () => {
      const testKey = 'testKey'
      const testValue = 'testValue'
      const defaultExpire = 24 * 60 * 60 * 1000 // 24時間（ミリ秒）

      cache(testKey).set(testValue)

      expect(mockPut).toHaveBeenCalledWith(testKey, testValue, defaultExpire)
    })

    it('カスタムの有効期限でキャッシュを設定できる', () => {
      const testKey = 'testKey'
      const testValue = 'testValue'
      const customExpire = 60 * 60 * 1000 // 1時間（ミリ秒）

      cache(testKey, customExpire).set(testValue)

      expect(mockPut).toHaveBeenCalledWith(testKey, testValue, customExpire)
    })
  })

  describe('エラーケース', () => {
    it('CacheServiceが利用できない場合でもエラーにならない', () => {
      // CacheServiceをnullに設定
      global.CacheService = null as any

      const testKey = 'testKey'
      const testValue = 'testValue'

      // エラーが発生しないことを確認
      expect(() => {
        const cacheInstance = cache(testKey)
        cacheInstance.set(testValue)
        cacheInstance.get()
      }).not.toThrow()
    })
  })
})