import React from 'react';
import { X } from 'lucide-react';
import { SelectedPath } from '@/types/explorer';

interface Tab {
    file: SelectedPath;
    content: string;
    unsaved: boolean;
}

interface TabManagerProps {
    tabs: Tab[];
    activeTab: number;
    onTabClick: (index: number) => void;
    onTabClose: (index: number) => void;
}

const TabManager: React.FC<TabManagerProps> = ({
    tabs,
    activeTab,
    onTabClick,
    onTabClose,
}) => {
    if (tabs.length === 0) return null;

    return (
        <div className="flex bg-[#181818] border-b border-gray-700 overflow-x-auto">
            {tabs.map((tab, index) => {
                const isActive = index === activeTab;
                const path = [...tab.file.parentPath, tab.file.name].join('/');

                return (
                    <div
                        key={path}
                        className={`
                            flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer
                            hover:bg-gray-900 min-w-fit
                            ${isActive ? 'bg-[#232323]' : 'bg-[#181818]'}
                        `}
                        onClick={() => onTabClick(index)}
                    >
                        <span className="text-gray-300 text-sm truncate max-w-xs">
                            {tab.file.name}
                        </span>
                        {tab.unsaved && (
                            <div className="w-2 h-2 rounded-full bg-white ml-2" />
                        )}
                        <button
                            className="ml-2 p-1 rounded-sm hover:bg-gray-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(index);
                            }}
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default TabManager;