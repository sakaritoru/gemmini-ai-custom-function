import { fetcher } from '../../lib/fetcher';
import { cache } from '../../lib/cache';
import { generateHash } from '../../utils/generateHash';
import { generateUrl } from '../../utils/generateUrl';

export class GeminiService {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  ) {}

  async generateContent(prompt: string): Promise<string> {
    const cacheKey = generateHash(prompt);
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const url = generateUrl(this.baseUrl, { key: this.apiKey });
    const response = await fetcher.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    const result = response.candidates[0].content.parts[0].text;
    cache.set(cacheKey, result);
    return result;
  }
}