type SupportedLanguages =
    | 'javascript'
    | 'typescript'
    | 'go'
    | 'csharp'
    | 'python'
    | 'cpp'
    | 'java'
    | 'php'
    | 'shell'
    | 'json'
    | 'html'
    | 'css';

const languageMap: Record<string, SupportedLanguages> = {
    // JavaScript
    'js': 'javascript',
    'jsx': 'javascript',
    'mjs': 'javascript',

    // TypeScript
    'ts': 'typescript',
    'tsx': 'typescript',

    // Go
    'go': 'go',

    // C#
    'cs': 'csharp',

    // Python
    'py': 'python',
    'pyc': 'python',
    'pyw': 'python',

    // C++
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',

    // Java
    'java': 'java',

    // PHP
    'php': 'php',

    // Shell/Bash
    'sh': 'shell',
    'bash': 'shell',

    // JSON
    'json': 'json',

    // HTML
    'html': 'html',

    // CSS
    'css': 'css'
};

const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return 'plaintext';

    return languageMap[extension] || 'plaintext';
};

export { getLanguageFromExtension };
export default getLanguageFromExtension;