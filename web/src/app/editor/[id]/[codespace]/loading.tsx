import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-300">Loading your workspace... (This can take up to a minute)</p>
        </div>
    </div>
);

export { LoadingOverlay };
export default LoadingOverlay;