import { useState } from 'react';

import { Folder, ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';

import { TreeNode, SelectedPath } from '@/types/explorer';

import { FileItem } from './file';

interface FolderItemProps {
    node: TreeNode;
    expandedFolders: Set<string>;
    setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectedFolder: SelectedPath | null;
    onFolderSelect: (folder: SelectedPath) => void;
    selectedFile: SelectedPath | null;
    onFileSelect: (file: SelectedPath) => void;
    onContextMenu: (e: React.MouseEvent, item: TreeNode) => void;
    level?: number;
}

const FolderItem: React.FC<FolderItemProps> = ({
    node,
    expandedFolders,
    setExpandedFolders,
    selectedFolder,
    onFolderSelect,
    selectedFile,
    onFileSelect,
    onContextMenu,
    level = 0,
}) => {
    const folderPath = [...node.parentPath, node.name].join('/');
    const isExpanded = expandedFolders.has(folderPath);

    const [hover, setHover] = useState(false);

    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedFolders);
        if (isExpanded) {
            newExpanded.delete(folderPath);
        } else {
            newExpanded.add(folderPath);
        }
        setExpandedFolders(newExpanded);
    };

    const handleFolderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFolderSelect({ name: node.name, parentPath: node.parentPath });
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node);
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleContextMenu(e);
    };

    return (
        <div className="w-full">
            <div
                className="flex items-center py-1 px-2 rounded cursor-pointer group justify-between"
                style={{ paddingLeft: `${(level * 12) + 8}px` }}
                onClick={(e) => { handleFolderClick(e); toggleFolder(e); }}
                onContextMenu={handleContextMenu}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div className='flex items-center gap-2'>
                    <div
                        className="flex items-center justify-center w-4 h-4"
                        onClick={toggleFolder}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                        )}
                    </div>
                    <Folder className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white truncate">
                        {node.name}
                    </span>
                </div>

                <MoreHorizontal
                    className={`${hover ? '' : 'hidden'} w-4 h-4 text-gray-400 group-hover:text-gray-300 cursor-pointer`}
                    onClick={handleMoreClick}
                />
            </div>

            {isExpanded && node.children && (
                <div className="ml-2">
                    {node.children.map((child, index) => (
                        <div key={`${child.name}-${index}`}>
                            {child.type === 'dir' ? (
                                <FolderItem
                                    node={child}
                                    expandedFolders={expandedFolders}
                                    setExpandedFolders={setExpandedFolders}
                                    selectedFolder={selectedFolder}
                                    onFolderSelect={onFolderSelect}
                                    selectedFile={selectedFile}
                                    onFileSelect={onFileSelect}
                                    onContextMenu={onContextMenu}
                                    level={level + 1}
                                />
                            ) : (
                                <div style={{ paddingLeft: `${((level + 1) * 12) + 8}px` }}>
                                    <FileItem
                                        name={child.name}
                                        parentPath={child.parentPath}
                                        content={child.content ? child.content : ''}
                                        isSelected={selectedFile?.name === child.name &&
                                            JSON.stringify(selectedFile.parentPath) === JSON.stringify(child.parentPath)}
                                        onClick={() => onFileSelect({ name: child.name, parentPath: child.parentPath })}
                                        onContextMenu={onContextMenu}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export { FolderItem };
export default FolderItem;