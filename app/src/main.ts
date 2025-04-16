import { Properties } from './lib/properties';
import { CustomFunctionRepository } from './infrastructure/repositories/CustomFunctionRepository';
import { CustomFunctionService } from './domain/services/CustomFunctionService';
import { GeminiService } from './infrastructure/external/GeminiService';
import { GenerateContentUseCase } from './application/useCases/GenerateContentUseCase';
import { CustomFunctionController } from './interfaces/api/CustomFunctionController';

const properties = new Properties();
const customFunctionRepository = new CustomFunctionRepository(properties);
const customFunctionService = new CustomFunctionService(customFunctionRepository);
const geminiService = new GeminiService(process.env.GEMINI_API_KEY || '');
const generateContentUseCase = new GenerateContentUseCase(geminiService, customFunctionService);
const customFunctionController = new CustomFunctionController(customFunctionService);

export {
  generateContentUseCase,
  customFunctionController
};