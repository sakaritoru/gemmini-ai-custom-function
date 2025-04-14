import { CustomFunction } from '../entities/CustomFunction';

export interface ICustomFunctionRepository {
  save(customFunction: CustomFunction): Promise<void>;
  getByName(name: string): Promise<CustomFunction | null>;
}