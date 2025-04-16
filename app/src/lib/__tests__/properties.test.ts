import properties from '../properties';
import { PropertiesService } from '@/__mocks__/google-apps-script';

// PropertiesServiceのモックをスパイ
const getPropertySpy = jest.spyOn(PropertiesService.getScriptProperties(), 'getProperty');
const setPropertySpy = jest.spyOn(PropertiesService.getScriptProperties(), 'setProperty');

describe('properties', () => {
  beforeEach(() => {
    // テスト前にスパイをリセット
    getPropertySpy.mockClear();
    setPropertySpy.mockClear();
    
    // プロパティをクリア
    const scriptProperties = PropertiesService.getScriptProperties();
    (scriptProperties as any).properties.clear();
  });

  describe('get', () => {
    it('指定したキーの値を取得できること', () => {
      // テスト用のデータをセット
      const scriptProperties = PropertiesService.getScriptProperties();
      (scriptProperties as any).properties.set('testKey', 'testValue');

      // テスト対象の関数を実行
      const result = properties.get('testKey');

      // 期待する結果を検証
      expect(result).toBe('testValue');
      expect(getPropertySpy).toHaveBeenCalledWith('testKey');
      expect(getPropertySpy).toHaveBeenCalledTimes(1);
    });

    it('存在しないキーの場合はnullを返すこと', () => {
      // テスト対象の関数を実行
      const result = properties.get('nonExistentKey');

      // 期待する結果を検証
      expect(result).toBeNull();
      expect(getPropertySpy).toHaveBeenCalledWith('nonExistentKey');
      expect(getPropertySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('set', () => {
    it('指定したキーに値をセットできること', () => {
      // テスト対象の関数を実行
      const result = properties.set('newKey', 'newValue');

      // 期待する結果を検証
      expect(setPropertySpy).toHaveBeenCalledWith('newKey', 'newValue');
      expect(setPropertySpy).toHaveBeenCalledTimes(1);

      // 実際に値がセットされたことを確認
      const scriptProperties = PropertiesService.getScriptProperties();
      expect((scriptProperties as any).properties.get('newKey')).toBe('newValue');
    });

    it('既存のキーの値を上書きできること', () => {
      // テスト用のデータをセット
      const scriptProperties = PropertiesService.getScriptProperties();
      (scriptProperties as any).properties.set('existingKey', 'oldValue');

      // テスト対象の関数を実行
      const result = properties.set('existingKey', 'updatedValue');

      // 期待する結果を検証
      expect(setPropertySpy).toHaveBeenCalledWith('existingKey', 'updatedValue');
      expect(setPropertySpy).toHaveBeenCalledTimes(1);

      // 実際に値が上書きされたことを確認
      expect((scriptProperties as any).properties.get('existingKey')).toBe('updatedValue');
    });
  });
});
