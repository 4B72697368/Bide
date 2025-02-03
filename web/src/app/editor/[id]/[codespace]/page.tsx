"use client";
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';

import { getFirestore } from 'firebase/firestore';

import app from '@/utils/firebase';
import { username } from '@/utils/username';
import { TreeNode, SelectedPath } from '@/types/explorer';

import LoadingOverlay from './loading';

import { Explorer } from './explorer';
import { ContextMenu } from './explorer/components/contextMenu';
import { AddItemDialog, addNewItem } from './explorer/components/add';
import { RenameDialog, renameItem } from './explorer/components/rename';
import { deleteItem } from './explorer/components/delete';
import { initializeExplorer, reload } from './explorer/components/initialize';

import { Editor } from './editor';

import { ExecuteOutput } from './execute';

const Codespace: NextPage = () => {
    const params = useParams();
    const repo_name = params.id as string;
    const codespace_name = params.codespace as string;

    const { data: session, status } = useSession();
    const [token, setToken] = useState<string>('');
    const [fileTree, setFileTree] = useState<TreeNode[]>([]);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedFile, setSelectedFile] = useState<SelectedPath | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<SelectedPath | null>(null);

    const [currentFileContent, setCurrentFileContent] = useState<string>('');

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        item: { name: string; type: 'file' | 'dir'; parentPath: string[]; content?: string } | null;
    }>({ x: 0, y: 0, item: null });
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showAddFileDialog, setShowAddFileDialog] = useState<boolean>(false);
    const [showAddFolderDialog, setShowAddFolderDialog] = useState<boolean>(false);

    const db = getFirestore(app);

    const addNewItemFunction = async (name: string, type: 'file' | 'dir') => addNewItem(db, name, type, repo_name, codespace_name, token, selectedFolder, setSelectedFile, setFileTree);

    const handleRename = async (newName: string) => {
        if (!contextMenu.item) return;

        const success = await renameItem(
            contextMenu.item,
            newName,
            db,
            await username(token),
            repo_name,
            codespace_name
        );

        if (success) {
            const tree = await reload(db, repo_name, codespace_name, token);
            if (tree !== 'error') {
                setFileTree(tree);
            } else {
                setError("An error occurred");
            }

            if (contextMenu.item.type === 'file' && selectedFile?.name === contextMenu.item.name) {
                setSelectedFile({ ...selectedFile, name: newName });
            } else if (contextMenu.item.type === 'dir' && selectedFolder?.name === contextMenu.item.name) {
                setSelectedFolder({ ...selectedFolder, name: newName });
            }
        } else {
            setError("An error occurred");
        }

        setShowRenameDialog(false);
        setContextMenu({ x: 0, y: 0, item: null });
    };

    const handleDelete = async () => {
        if (!contextMenu.item) return;

        const success = await deleteItem(
            contextMenu.item,
            db,
            await username(token),
            repo_name,
            codespace_name
        );

        if (success) {
            const tree = await reload(db, repo_name, codespace_name, token);
            if (tree !== 'error') {
                setFileTree(tree);
            } else {
                setError("An error occurred");
            }

            if (contextMenu.item.type === 'file' && selectedFile?.name === contextMenu.item.name) {
                setSelectedFile(null);
            } else if (contextMenu.item.type === 'dir' && selectedFolder?.name === contextMenu.item.name) {
                setSelectedFolder(null);
            }
        } else {
            setError("An error occurred");
        }

        setContextMenu({ x: 0, y: 0, item: null });
    };

    const onContextMenu = (
        e: React.MouseEvent,
        item: {
            name: string;
            type: 'file' | 'dir';
            parentPath: string[];
            content?: string;
            children?: TreeNode[];
        }
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const x = Math.min(
            e.pageX,
            window.innerWidth - 160
        );
        const y = Math.min(
            e.pageY,
            window.innerHeight - 100
        );

        setContextMenu({ x, y, item });
        setShowRenameDialog(false);
    };

    const reloadTree = async () => {
        const tree = await reload(db, repo_name, codespace_name, token);
        if (tree !== 'error') {
            setFileTree(tree);
        }
    };

    useEffect(() => {
        const fetchExplorer = async () => {
            if (status === 'authenticated' && session?.accessToken) {
                try {
                    setLoading(true);

                    const tree = await initializeExplorer(db, repo_name, codespace_name, session?.accessToken);

                    if (tree == "error") {
                        throw error;
                    } else {
                        setFileTree(tree);
                    }
                } catch (err) {
                    setError("An error occurred: " + err);
                    setLoading(false);
                } finally {
                    setToken(session.accessToken);
                    setLoading(false);
                }
            } else {
                redirect('/login')
            }
        }

        fetchExplorer();
    }, [status, session, repo_name, codespace_name, db, error]);

    if (loading) {
        return <LoadingOverlay />;
    }

    if (!status) {
        return <div className="text-red-500">Please sign in to view codespace files.</div>;
    }

    if (error) {
        return (
            <div className="p-4 max-w-2xl mx-auto">
                <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-900">
            <Explorer
                fileTree={fileTree}
                setShowAddFileDialog={setShowAddFileDialog}
                setShowAddFolderDialog={setShowAddFolderDialog}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                onContextMenu={onContextMenu}
            />

            <div className="w-4/5 h-full flex flex-col">
                <div className="h-[70%]">
                    <Editor
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        db={db}
                        repo_name={repo_name}
                        codespace_name={codespace_name}
                        token={token}
                        onContentChange={setCurrentFileContent}
                        reloadTree={reloadTree}
                    />
                </div>
                <div className="h-[30%]">
                    <ExecuteOutput
                        filename={selectedFile?.name || ''}
                        code={currentFileContent}
                    />
                </div>
            </div>

            <AddItemDialog
                isOpen={showAddFileDialog}
                onClose={() => setShowAddFileDialog(false)}
                onSubmit={(name) => addNewItemFunction(name, 'file')}
                type="file"
            />

            <AddItemDialog
                isOpen={showAddFolderDialog}
                onClose={() => setShowAddFolderDialog(false)}
                onSubmit={(name) => addNewItemFunction(name, 'dir')}
                type="dir"
            />

            {contextMenu.item && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onRename={() => setShowRenameDialog(true)}
                    onDelete={handleDelete}
                    onClose={() => setContextMenu({ x: 0, y: 0, item: null })}
                />
            )}

            {showRenameDialog && contextMenu.item && (
                <RenameDialog
                    isOpen={showRenameDialog}
                    currentName={contextMenu.item.name}
                    onRename={handleRename}
                    onClose={() => setShowRenameDialog(false)}
                />
            )}
        </div>
    );
};

export default Codespace;