import React, { useState } from 'react';

import { Play } from 'lucide-react';

import { executePiston, isLanguageSupported } from './components/pistonExecute';

interface ExecuteProps {
    filename: string;
    code: string;
}

const ExecuteOutput: React.FC<ExecuteProps> = ({ filename, code }) => {
    const [output, setOutput] = useState<string>('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [stdin, setStdin] = useState('');
    const [isOutput, setIsOutput] = useState(true);
    const isSupported = isLanguageSupported(filename);

    const handleExecute = async () => {
        setIsExecuting(true);
        try {
            const result = await executePiston(code, filename, stdin);
            setOutput(result.error ? `Error: ${result.error}\n${result.output}` : result.output);
            setIsOutput(true);
        } catch (error) {
            setOutput('Execution failed');
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="relative min-h-[30vh] max-h-[30vh] bg-[#181818] border-t border-gray-700 overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between px-4 py-2 bg-[#181818] border-b border-gray-700 z-10">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsOutput(false)}
                        className={`px-4 py-2 rounded-l-full border-gray-600 ${!isOutput ? 'bg-[#242424] text-gray-300' : 'bg-[#202020] text-gray-500'
                            }`}
                    >
                        Input
                    </button>
                    <div className="border-r border-gray-600 w-[2px]" />
                    <button
                        onClick={() => setIsOutput(true)}
                        className={`px-4 py-2 rounded-r-full ${isOutput ? 'bg-[#242424] text-gray-300' : 'bg-[#202020] text-gray-500'
                            }`}
                    >
                        Output
                    </button>
                </div>

                <button
                    onClick={handleExecute}
                    disabled={!isSupported || isExecuting}
                    className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
            ${isSupported && !isExecuting
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                >
                    <Play className="w-4 h-4" />
                    {isExecuting ? 'Running...' : 'Run'}
                </button>
            </div>

            <div className="p-4 h-[calc(100%-44px)] overflow-y-auto font-mono text-sm">
                {isOutput ? (
                    <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
                ) : (
                    <textarea
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        className="w-full h-full bg-[#181818] text-gray-300 border-none p-2 rounded-md focus:outline-none resize-none"
                        placeholder="Write your stdin here..."
                    />
                )}
            </div>
        </div>
    );
};

export { ExecuteOutput };
export default ExecuteOutput;