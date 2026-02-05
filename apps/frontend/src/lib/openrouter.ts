import OpenAI from 'openai';
import { env } from './env';

// Type for chat completion responses
export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?:
    | {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      }
    | undefined;
}

// Error types for better error handling
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

class OpenRouterClient {
  private client: OpenAI | null = null;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: env.OPENROUTER_API_KEY,
        baseURL: env.OPENROUTER_BASE_URL,
        defaultHeaders: {
          'HTTP-Referer': env.OPENROUTER_APP_URL,
          'X-Title': env.OPENROUTER_APP_NAME,
        },
      });
    }

    return this.client;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async chatCompletion(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    } = {},
  ): Promise<ChatCompletionResponse> {
    const {
      model = env.OPENROUTER_MODEL,
      temperature = 0.7,
      maxTokens = 4000,
      systemPrompt,
    } = options;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const client = this.getClient();
        const response = await client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        });

        const choice = response.choices[0];
        if (!choice?.message?.content) {
          throw new OpenRouterError('No content in response');
        }

        return {
          content: choice.message.content,
          model: response.model,
          usage: response.usage
            ? {
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
              }
            : undefined,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx), only server errors (5xx) and network errors
        if (error instanceof OpenAI.APIError) {
          const errorStatus: number | undefined = error.status as
            | number
            | undefined;
          const status = errorStatus ?? 500;
          if (status >= 400 && status < 500) {
            throw new OpenRouterError(
              error.message,
              error.code || 'CLIENT_ERROR',
              status,
            );
          }
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    // If we've exhausted all retries, throw the last error
    throw new OpenRouterError(
      lastError?.message || 'Failed after maximum retries',
      'MAX_RETRIES_EXCEEDED',
    );
  }

  async generateJSON<T>(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    } = {},
  ): Promise<T> {
    const systemPrompt =
      options.systemPrompt ||
      'You are a helpful assistant that generates valid JSON responses. Always respond with valid JSON only, no additional text.';

    const response = await this.chatCompletion(prompt, {
      ...options,
      systemPrompt,
    });

    try {
      // Try to extract JSON from markdown code blocks if present
      let content = response.content.trim();
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch && jsonMatch[1]) {
        content = jsonMatch[1].trim();
      }

      return JSON.parse(content) as T;
    } catch (error) {
      throw new OpenRouterError(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'JSON_PARSE_ERROR',
      );
    }
  }
}

// Singleton instance
export const openRouterClient = new OpenRouterClient();
