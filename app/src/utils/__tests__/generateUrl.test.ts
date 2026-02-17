import generateUrl from '../generateUrl'

describe('generateUrl', () => {
  test('正常系: パラメータ付きURLを生成できること', () => {
    const result = generateUrl('https://example.com/api', { key: 'abc123' })

    expect(result).toBe('https://example.com/api?key=abc123')
  })

  test('正常系: 複数パラメータを&で結合すること', () => {
    const result = generateUrl('https://example.com/api', {
      key: 'abc123',
      model: 'gemini-pro',
    })

    expect(result).toBe('https://example.com/api?key=abc123&model=gemini-pro')
  })

  test('正常系: パラメータが空の場合は?のみ付くこと', () => {
    const result = generateUrl('https://example.com/api', {})

    expect(result).toBe('https://example.com/api?')
  })
})
