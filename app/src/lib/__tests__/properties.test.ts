import { mockProperties } from '../__mocks__/global'
import properties from '../properties'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('properties', () => {
  test('正常系: プロパティを取得できること', () => {
    mockProperties.getProperty.mockReturnValueOnce('test-value')
    const result = properties.get('test-key')
    expect(result).toBe('test-value')
    expect(mockProperties.getProperty).toHaveBeenCalledWith('test-key')
  })

  test('正常系: プロパティを設定できること', () => {
    properties.set('test-key', 'test-value')
    expect(mockProperties.setProperty).toHaveBeenCalledWith('test-key', 'test-value')
  })

  test('正常系: 存在しないキーの場合nullを返すこと', () => {
    mockProperties.getProperty.mockReturnValueOnce(null)
    const result = properties.get('non-existent-key')
    expect(result).toBeNull()
  })

  test('正常系: PropertiesService.getScriptPropertiesが呼ばれること', () => {
    properties.get('key')
    expect(PropertiesService.getScriptProperties).toHaveBeenCalled()
  })
})
