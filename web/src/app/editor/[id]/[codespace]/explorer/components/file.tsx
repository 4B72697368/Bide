import { useState } from 'react';

import { File, MoreHorizontal } from 'lucide-react';

interface FileItemProps {
    name: string;
    parentPath: string[];
    content: string;
    isSelected: boolean;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent, item: { name: string; type: 'file'; parentPath: string[]; content: string }) => void;
}

const FileItem: React.FC<FileItemProps> = ({
    name,
    parentPath,
    content,
    isSelected,
    onClick,
    onContextMenu,
}) => {
    const [hover, setHover] = useState(false);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenu(e, { name, type: 'file', parentPath, content });
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleContextMenu(e);
    };

    return (
        <div
            className={`flex items-center py-1 px-2 rounded cursor-pointer group justify-between
                ${isSelected ? 'bg-gray-600' : 'hover:bg-gray-800'}`}
            onClick={onClick}
            onContextMenu={handleContextMenu}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className='flex items-center gap-2'>
                <File className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                <span className='text-sm text-gray-300 group-hover:text-white'>{name}</span>
            </div>

            <MoreHorizontal
                className={`${hover ? '' : 'hidden'} w-4 h-4 text-gray-400 group-hover:text-gray-300 cursor-pointer`}
                onClick={handleMoreClick}
            />
        </div>
    );
};

export { FileItem };
export default FileItem;