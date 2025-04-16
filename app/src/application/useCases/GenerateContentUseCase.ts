import { GeminiService } from '../../infrastructure/external/GeminiService';
import { CustomFunctionService } from '../../domain/services/CustomFunctionService';

export class GenerateContentUseCase {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly customFunctionService: CustomFunctionService
  ) {}

  async execute(prompt: string, functionName?: string): Promise<string> {
    if (functionName) {
      const customFunction = await this.customFunctionService.getFunction(functionName);
      if (customFunction) {
        prompt = `${prompt}\n\nUse the following custom function:\n${JSON.stringify(customFunction, null, 2)}`;
      }
    }

    return await this.geminiService.generateContent(prompt);
  }
}