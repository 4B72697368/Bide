import { getLanguageFromExtension } from '../../editor/components/languages';

interface PistonResponse {
  ran: boolean;
  language: string;
  version: string;
  output: string;
  error?: string;
}

interface LanguageConfig {
  language: string;
  version: string;
  runtime?: string;
}

const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  'javascript': { language: 'javascript', version: '1.32.3', runtime: 'node' },
  'typescript': { language: 'typescript', version: '1.32.3', runtime: 'deno' },
  'go': { language: 'go', version: '1.16.2' },
  'csharp': { language: 'csharp', version: '6.12.0', runtime: 'mono' },
  'python': { language: 'python', version: '3.10.0' },
  'cpp': { language: 'cpp', version: '10.2.0', runtime: 'gcc' },
  'java': { language: 'java', version: '15.0.2' },
  'php': { language: 'php', version: '8.2.3' },
  'shell': { language: 'bash', version: '5.2.0' }
};

export const isLanguageSupported = (filename: string): boolean => {
  const language = getLanguageFromExtension(filename);
  return language in SUPPORTED_LANGUAGES;
};

export const executePiston = async (code: string, filename: string, input: string): Promise<PistonResponse> => {
  const language = getLanguageFromExtension(filename);
  const config = SUPPORTED_LANGUAGES[language];

  if (!config) {
    return {
      ran: false,
      language: '',
      version: '',
      output: 'Unsupported language'
    };
  }

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{
          content: code
        }],
        stdin: input,
        ...(config.runtime && { runtime: config.runtime })
      }),
    });

    if (!response.ok) {
      throw new Error('Execution failed');
    }

    const result = await response.json();

    return {
      ran: true,
      language: config.language,
      version: config.version,
      output: result.run.output,
      error: result.run.stderr
    };
  } catch (error) {
    return {
      ran: false,
      language: config.language,
      version: config.version,
      output: 'Failed to execute code',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};