import React, { useState } from "react";
import { redirect } from "next/navigation";

import { Home, FolderCode, BotMessageSquare, GitCommitHorizontal, FolderPlus, Plus } from "lucide-react";

import { SelectedPath } from "@/types/explorer";
import { TreeNode } from "@/types/explorer";

import { FolderItem } from "./components/folder";
import { FileItem } from "./components/file";
import { handleFileSelect, handleFolderSelect } from "./components/handleSelect";
import { Chatbot } from './components/chatbot'
import { GitManagement } from './components/gitManagement'

const Explorer = (
    {
        fileTree,
        setShowAddFileDialog,
        setShowAddFolderDialog,
        selectedFile,
        setSelectedFile,
        selectedFolder,
        setSelectedFolder,
        onContextMenu
    }: {
        fileTree: TreeNode[],
        setShowAddFileDialog: React.Dispatch<React.SetStateAction<boolean>>,
        setShowAddFolderDialog: React.Dispatch<React.SetStateAction<boolean>>,
        selectedFile: SelectedPath | null,
        setSelectedFile: React.Dispatch<React.SetStateAction<SelectedPath | null>>,
        selectedFolder: SelectedPath | null,
        setSelectedFolder: React.Dispatch<React.SetStateAction<SelectedPath | null>>,
        onContextMenu: (e: React.MouseEvent, item: {
            name: string;
            type: 'file' | 'dir';
            parentPath: string[];
            content?: string;
            children?: TreeNode[];
        }) => void
    }) => {

    const [tab, setTab] = useState<number>(0);

    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const handleFileSelectFunction = (file: SelectedPath) => handleFileSelect(file, setSelectedFile, setSelectedFolder);
    const handleFolderSelectFunction = (folder: SelectedPath) => handleFolderSelect(folder, setSelectedFolder);

    return (
        <div className="h-screen w-1/5 flex bg-[#181818] border-r border-gray-700 flex-col overflow-x-auto">
            <div className="bg-[#161616] border-b border-gray-700 p-4 flex justify-between">
                <Home onClick={() => { redirect('/') }} className="cursor-pointer w-5 h-5 text-gray-400" />
                <FolderCode onClick={() => { setTab(0) }} className={`${tab == 0 ? 'text-white' : ''} cursor-pointer w-5 h-5 text-gray-400`} />
                <BotMessageSquare onClick={() => { setTab(1) }} className={`${tab == 1 ? 'text-white' : ''} cursor-pointer w-5 h-5 text-gray-400`} />
                <GitCommitHorizontal onClick={() => { setTab(2) }} className={`${tab == 2 ? 'text-white' : ''} cursor-pointer w-5 h-5 text-gray-400`} />
            </div>

            {tab == 0 && <div className="w-full overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-200">Explorer</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddFileDialog(true)}
                                className="hover:bg-gray-700 rounded"
                            >
                                <Plus className="w-4 h-4 text-gray-300" />
                            </button>
                            <button
                                onClick={() => setShowAddFolderDialog(true)}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <FolderPlus className="w-4 h-4 text-gray-300" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {fileTree.map((node, index) => (
                            <div key={`${node.name}-${index}`}>
                                {node.type === 'dir' ? (
                                    <FolderItem
                                        node={node}
                                        expandedFolders={expandedFolders}
                                        setExpandedFolders={setExpandedFolders}
                                        selectedFolder={selectedFolder}
                                        onFolderSelect={handleFolderSelectFunction}
                                        selectedFile={selectedFile}
                                        onFileSelect={handleFileSelectFunction}
                                        onContextMenu={onContextMenu}
                                    />
                                ) : (
                                    <FileItem
                                        name={node.name}
                                        parentPath={node.parentPath}
                                        content={node.content ? node.content : ''}
                                        isSelected={selectedFile?.name === node.name &&
                                            selectedFile.parentPath.length === 0}
                                        onClick={() => handleFileSelectFunction({ name: node.name, parentPath: [] })}
                                        onContextMenu={onContextMenu}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>}

            {tab == 1 && <Chatbot />}
            {tab == 2 && <GitManagement />}
        </div>
    )
};

export { Explorer };
export default Explorer;