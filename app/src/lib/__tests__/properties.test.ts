import { mockScriptProperties } from '../__mocks__/global'
import properties from '../properties'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('properties', () => {
  test('正常系: プロパティを取得できること', () => {
    const expectedValue = 'test-api-key-value'
    mockScriptProperties.getProperty.mockReturnValue(expectedValue)

    const result = properties.get('apiKey')

    expect(mockScriptProperties.getProperty).toHaveBeenCalledWith('apiKey')
    expect(result).toBe(expectedValue)
  })

  test('正常系: プロパティを設定できること', () => {
    properties.set('apiKey', 'new-api-key')

    expect(mockScriptProperties.setProperty).toHaveBeenCalledWith('apiKey', 'new-api-key')
  })

  test('正常系: 存在しないプロパティの場合はnullを返すこと', () => {
    mockScriptProperties.getProperty.mockReturnValue(null)

    const result = properties.get('nonexistent')

    expect(mockScriptProperties.getProperty).toHaveBeenCalledWith('nonexistent')
    expect(result).toBeNull()
  })
})
