import { CustomFunction } from '../../domain/entities/CustomFunction';
import { CustomFunctionService } from '../../domain/services/CustomFunctionService';

export class CustomFunctionController {
  constructor(private readonly customFunctionService: CustomFunctionService) {}

  async registerFunction(request: CustomFunction): Promise<void> {
    await this.customFunctionService.registerFunction(request);
  }

  async getFunction(name: string): Promise<CustomFunction | null> {
    return await this.customFunctionService.getFunction(name);
  }
}