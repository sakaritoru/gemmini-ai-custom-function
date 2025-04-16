import { CustomFunction } from '../../domain/entities/CustomFunction';
import { ICustomFunctionRepository } from '../../domain/repositories/ICustomFunctionRepository';
import { Properties } from '../../lib/properties';

export class CustomFunctionRepository implements ICustomFunctionRepository {
  constructor(private readonly properties: Properties) {}

  async save(customFunction: CustomFunction): Promise<void> {
    const functions = this.properties.getProperty('customFunctions') || '{}';
    const existingFunctions = JSON.parse(functions);
    existingFunctions[customFunction.name] = customFunction;
    await this.properties.setProperty('customFunctions', JSON.stringify(existingFunctions));
  }

  async getByName(name: string): Promise<CustomFunction | null> {
    const functions = this.properties.getProperty('customFunctions') || '{}';
    const existingFunctions = JSON.parse(functions);
    return existingFunctions[name] || null;
  }
}