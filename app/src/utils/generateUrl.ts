/**
 * gasにURLクラスがないため、URLを生成する関数を作成します。
 */
const generateUrl = (url: string, params: { [key in string]: string }) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${url}?${query}`
}

export default generateUrl
