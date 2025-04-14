import { CustomFunction } from '../entities/CustomFunction';
import { ICustomFunctionRepository } from '../repositories/ICustomFunctionRepository';

export class CustomFunctionService {
  constructor(private readonly repository: ICustomFunctionRepository) {}

  async registerFunction(customFunction: CustomFunction): Promise<void> {
    await this.repository.save(customFunction);
  }

  async getFunction(name: string): Promise<CustomFunction | null> {
    return await this.repository.getByName(name);
  }
}