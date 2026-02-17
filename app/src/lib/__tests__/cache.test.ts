import { mockCache, mockCacheService } from '../__mocks__/global'
import cache from '../cache'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cache', () => {
  test('正常系: キャッシュから値を取得できること', () => {
    mockCache.get.mockReturnValueOnce('cached value')
    const c = cache('test-key')
    const result = c.get()
    expect(result).toBe('cached value')
    expect(mockCache.get).toHaveBeenCalledWith('test-key')
  })

  test('正常系: キャッシュに値を設定できること', () => {
    const c = cache('test-key')
    c.set('new value')
    expect(mockCache.put).toHaveBeenCalledWith('test-key', 'new value', 24 * 60 * 60 * 1000)
  })

  test('正常系: カスタム有効期限を指定できること', () => {
    const customExpire = 3600
    const c = cache('test-key', customExpire)
    c.set('value')
    expect(mockCache.put).toHaveBeenCalledWith('test-key', 'value', customExpire)
  })

  test('正常系: キャッシュミスの場合nullを返すこと', () => {
    mockCache.get.mockReturnValueOnce(null)
    const c = cache('missing-key')
    const result = c.get()
    expect(result).toBeNull()
  })

  test('正常系: デフォルトの有効期限が24時間であること', () => {
    const c = cache('test-key')
    c.set('value')
    const expectedExpire = 24 * 60 * 60 * 1000 // 86400000ms
    expect(mockCache.put).toHaveBeenCalledWith('test-key', 'value', expectedExpire)
  })

  test('正常系: CacheService.getDocumentCacheが呼ばれること', () => {
    cache('key')
    expect(CacheService.getDocumentCache).toHaveBeenCalled()
  })

  test('異常系: getDocumentCacheがnullを返した場合エラーにならないこと', () => {
    mockCacheService.getDocumentCache.mockReturnValueOnce(null)
    const c = cache('test-key')
    expect(c.get()).toBeUndefined()
    c.set('value')
    // エラーが発生しないことを確認
  })
})
