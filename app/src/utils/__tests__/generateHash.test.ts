import { mockUtilities } from '../../lib/__mocks__/global'
import generateHash from '../generateHash'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('generateHash', () => {
  test('正常系: 文字列からハッシュ値を生成すること', () => {
    const result = generateHash('test')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
    // 16進数文字列であること
    expect(result).toMatch(/^[0-9a-f]+$/)
  })

  test('正常系: 同じ入力に対して同じハッシュ値を返すこと', () => {
    const result1 = generateHash('test')
    const result2 = generateHash('test')
    expect(result1).toBe(result2)
  })

  test('正常系: 異なる入力に対して異なるハッシュ値を返すこと', () => {
    const result1 = generateHash('test1')
    const result2 = generateHash('test2')
    expect(result1).not.toBe(result2)
  })

  test('正常系: Utilities.computeDigestが正しい引数で呼ばれること', () => {
    generateHash('hello')
    expect(mockUtilities.computeDigest).toHaveBeenCalledWith('SHA_256', 'hello')
  })

  test('正常系: 負のバイト値を正しく処理すること', () => {
    mockUtilities.computeDigest.mockReturnValueOnce([-1, -128, 0, 127, 255])
    const result = generateHash('test')
    // -1 → 255 → 'ff', -128 → 128 → '80', 0 → '00', 127 → '7f', 255 → 'ff'
    expect(result).toBe('ff80007fff')
  })

  test('正常系: 1桁の16進数値にゼロパディングすること', () => {
    mockUtilities.computeDigest.mockReturnValueOnce([0, 1, 15])
    const result = generateHash('test')
    expect(result).toBe('00010f')
  })
})
