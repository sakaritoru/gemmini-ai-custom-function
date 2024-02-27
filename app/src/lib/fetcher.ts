// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = unknown

const fetcher = <T extends Response>(
  url: string,
  options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
): T => {
  try {
    const response = UrlFetchApp.fetch(url, options)
    return JSON.parse(response.getContentText('UTF-8'))
  } catch (e) {
    throw new Error(`Error: ${e}`)
  }
}

export default fetcher
