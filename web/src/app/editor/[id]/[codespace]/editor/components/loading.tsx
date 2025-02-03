import React from 'react';

const EditorLoadingOverlay: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#202020]">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
        </div>
    );
};

export { EditorLoadingOverlay };
export default EditorLoadingOverlay;