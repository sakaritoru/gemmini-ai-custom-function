import { mockCache, mockCacheService } from '../__mocks__/global'
import cache from '../cache'

beforeEach(() => {
  jest.clearAllMocks()
  // デフォルトのモック実装を復元
  mockCacheService.getDocumentCache.mockReturnValue(mockCache)
})

describe('cache', () => {
  test('正常系: キャッシュを取得できること', () => {
    const cachedValue = 'キャッシュされた回答'
    mockCache.get.mockReturnValue(cachedValue)

    const cacheInstance = cache('test-key')
    const result = cacheInstance.get()

    expect(mockCacheService.getDocumentCache).toHaveBeenCalled()
    expect(mockCache.get).toHaveBeenCalledWith('test-key')
    expect(result).toBe(cachedValue)
  })

  test('正常系: キャッシュを設定できること', () => {
    const cacheInstance = cache('test-key')
    cacheInstance.set('テスト内容')

    expect(mockCache.put).toHaveBeenCalledWith(
      'test-key',
      'テスト内容',
      24 * 60 * 60 * 1000,
    )
  })

  test('正常系: カスタム有効期限でキャッシュを設定できること', () => {
    const customExpire = 3600
    const cacheInstance = cache('test-key', customExpire)
    cacheInstance.set('テスト内容')

    expect(mockCache.put).toHaveBeenCalledWith('test-key', 'テスト内容', customExpire)
  })

  test('正常系: キャッシュが存在しない場合はnullを返すこと', () => {
    mockCache.get.mockReturnValue(null)

    const cacheInstance = cache('nonexistent-key')
    const result = cacheInstance.get()

    expect(mockCache.get).toHaveBeenCalledWith('nonexistent-key')
    expect(result).toBeNull()
  })

  test('異常系: DocumentCacheがnullの場合でもエラーにならないこと', () => {
    mockCacheService.getDocumentCache.mockReturnValueOnce(null)

    const cacheInstance = cache('test-key')
    const getResult = cacheInstance.get()
    const setResult = cacheInstance.set('テスト内容')

    expect(getResult).toBeUndefined()
    expect(setResult).toBeUndefined()
  })
})
