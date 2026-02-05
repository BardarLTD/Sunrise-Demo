/**
 * Environment variable validation
 * This file validates that all required environment variables are present
 * and crashes the application if any are missing.
 *
 * Note: In Next.js, only NEXT_PUBLIC_* variables are available on the client.
 * Server-only variables are validated on the server side only.
 */

// Detect if we're running on the server or client
const isServer = typeof window === 'undefined';

interface ServerEnvConfig {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
  OPENROUTER_APP_URL?: string;
  OPENROUTER_APP_NAME?: string;
  OPENROUTER_MODEL?: string;
}

interface ClientEnvConfig {
  NEXT_PUBLIC_MIXPANEL_TOKEN: string;
  NEXT_PUBLIC_MIXPANEL_API_HOST?: string;
}

type EnvConfig = ServerEnvConfig & ClientEnvConfig;

/**
 * Server-side required environment variables
 */
const REQUIRED_SERVER_VARS: Array<keyof ServerEnvConfig> = [
  'OPENROUTER_API_KEY',
];

/**
 * Client-side required environment variables
 */
const REQUIRED_CLIENT_VARS: Array<keyof ClientEnvConfig> = [
  'NEXT_PUBLIC_MIXPANEL_TOKEN',
];

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variables are missing
 */
function validateEnv(): void {
  const missingVars: string[] = [];
  const varsToCheck = isServer
    ? [...REQUIRED_SERVER_VARS, ...REQUIRED_CLIENT_VARS]
    : REQUIRED_CLIENT_VARS;

  for (const varName of varsToCheck) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const context = isServer ? 'server' : 'client';
    const errorMessage = [
      `❌ ERROR: Missing required environment variables (${context}-side):`,
      '',
      ...missingVars.map((varName) => `  - ${varName}`),
      '',
      'Please check your .env.local file and ensure all required variables are set.',
      'See CLAUDE.md for more information about environment variables.',
      '',
      isServer
        ? 'Note: Server-side variables should NOT be prefixed with NEXT_PUBLIC_'
        : 'Note: Client-side variables MUST be prefixed with NEXT_PUBLIC_',
    ].join('\n');

    console.error(errorMessage);

    // Crash the application
    if (isServer) {
      process.exit(1);
    } else {
      // On client, throw an error instead of process.exit
      throw new Error(errorMessage);
    }
  }
}

/**
 * Get a typed environment variable value
 * @param key - The environment variable key
 * @returns The value of the environment variable
 */
function getEnvVar<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  return process.env[key] as EnvConfig[K];
}

// Run validation immediately when this module is imported
validateEnv();

/**
 * Client-side environment variables (always available)
 */
export const clientEnv = {
  NEXT_PUBLIC_MIXPANEL_TOKEN: getEnvVar('NEXT_PUBLIC_MIXPANEL_TOKEN'),
  NEXT_PUBLIC_MIXPANEL_API_HOST:
    getEnvVar('NEXT_PUBLIC_MIXPANEL_API_HOST') || 'https://api.mixpanel.com',
} as const;

/**
 * Server-side environment variables (only available on server)
 * Will throw runtime error if accessed on client
 */
export const serverEnv = {
  OPENROUTER_API_KEY: getEnvVar('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL:
    getEnvVar('OPENROUTER_BASE_URL') || 'https://openrouter.ai/api/v1',
  OPENROUTER_APP_URL:
    getEnvVar('OPENROUTER_APP_URL') || 'http://localhost:3000',
  OPENROUTER_APP_NAME: getEnvVar('OPENROUTER_APP_NAME') || 'Sunrise Demo',
  OPENROUTER_MODEL:
    getEnvVar('OPENROUTER_MODEL') || 'anthropic/claude-3-5-sonnet',
} as const;

/**
 * Combined environment variables
 * Note: Server-only variables will be undefined on client
 */
export const env = {
  ...clientEnv,
  ...(isServer ? serverEnv : {}),
} as typeof clientEnv & typeof serverEnv;
