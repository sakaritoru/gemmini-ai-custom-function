import generateUrl from '../generateUrl'

describe('generateUrl', () => {
  test('正常系: 単一パラメータでURLを生成すること', () => {
    const result = generateUrl('https://example.com/api', { key: 'abc123' })
    expect(result).toBe('https://example.com/api?key=abc123')
  })

  test('正常系: 複数パラメータでURLを生成すること', () => {
    const result = generateUrl('https://example.com/api', {
      key: 'abc123',
      model: 'gemini-pro',
    })
    expect(result).toBe('https://example.com/api?key=abc123&model=gemini-pro')
  })

  test('正常系: 空のパラメータの場合クエリ部分が空になること', () => {
    const result = generateUrl('https://example.com/api', {})
    expect(result).toBe('https://example.com/api?')
  })

  test('正常系: 特殊文字を含むパラメータを処理すること', () => {
    const result = generateUrl('https://example.com/api', {
      query: 'hello world',
    })
    expect(result).toBe('https://example.com/api?query=hello world')
  })
})
