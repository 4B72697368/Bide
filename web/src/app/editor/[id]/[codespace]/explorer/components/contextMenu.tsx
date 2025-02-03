import React from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onRename: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onRename, onDelete, onClose }) => {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.context-menu')) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div
            className="context-menu absolute z-50 bg-gray-800 rounded shadow-lg py-1"
            style={{ top: y, left: x }}
        >
            <button
                className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                onClick={onRename}
            >
                Rename
            </button>
            <button
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 text-left"
                onClick={onDelete}
            >
                Delete
            </button>
        </div>
    );
};