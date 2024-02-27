/**
 * 文字列からハッシュ値を生成します。
 */
const generateHash = (key: string) => {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, key)
  const hashHex = digest.reduce((str, chr) => {
    const hex = (chr < 0 ? chr + 256 : chr).toString(16)
    return str + (hex.length === 1 ? '0' : '') + hex
  }, '')

  return hashHex
}

export default generateHash
