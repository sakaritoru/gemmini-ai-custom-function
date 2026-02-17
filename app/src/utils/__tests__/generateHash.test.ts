import { mockUtilities } from '../../lib/__mocks__/global'
import generateHash from '../generateHash'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('generateHash', () => {
  test('正常系: 文字列からハッシュ値を生成できること', () => {
    // SHA-256 ダイジェストのモック（正のバイト値）
    const mockDigest = [0, 1, 15, 16, 127, 255]
    mockUtilities.computeDigest.mockReturnValue(mockDigest)

    const result = generateHash('テスト文字列')

    expect(mockUtilities.computeDigest).toHaveBeenCalledWith(
      mockUtilities.DigestAlgorithm.SHA_256,
      'テスト文字列',
    )
    expect(result).toBe('00010f107fff')
  })

  test('正常系: 負のバイト値を正しく処理すること', () => {
    // GASのcomputeDigestは-128〜127の符号付きバイト配列を返す
    const mockDigest = [-1, -128, -64, 0, 64, 127]
    mockUtilities.computeDigest.mockReturnValue(mockDigest)

    const result = generateHash('テスト')

    // -1 → 255 → "ff"
    // -128 → 128 → "80"
    // -64 → 192 → "c0"
    // 0 → "00"
    // 64 → "40"
    // 127 → "7f"
    expect(result).toBe('ff80c000407f')
  })

  test('正常系: 同じ入力に対して同じハッシュ値を返すこと', () => {
    const mockDigest = [10, 20, 30]
    mockUtilities.computeDigest.mockReturnValue(mockDigest)

    const result1 = generateHash('同じ文字列')
    const result2 = generateHash('同じ文字列')

    expect(result1).toBe(result2)
  })

  test('正常系: 1桁の16進数にゼロパディングされること', () => {
    // 0〜15は1桁の16進数なので、ゼロパディングが必要
    const mockDigest = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    mockUtilities.computeDigest.mockReturnValue(mockDigest)

    const result = generateHash('パディングテスト')

    expect(result).toBe('000102030405060708090a0b0c0d0e0f')
  })
})
