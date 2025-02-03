import React, { useState } from 'react';

import { doc, setDoc, Firestore } from 'firebase/firestore';

import username from '@/utils/username';
import { SelectedPath, TreeNode } from '@/types/explorer';

import { reload } from './initialize';

const AddItemDialog = ({
    isOpen,
    onClose,
    onSubmit,
    type
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    type: 'file' | 'dir';
}) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    New {type === 'dir' ? 'Folder' : 'File'}
                </h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded mb-4"
                    placeholder={`Enter ${type} name...`}
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-300 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (name.trim()) {
                                onSubmit(name.trim());
                                setName('');
                                onClose();
                            }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

const addNewItem = async (db: Firestore, name: string, type: 'file' | 'dir', repo_name: string, codespace_name: string, token: string, selectedFolder: SelectedPath | null, setSelectedFile: React.Dispatch<React.SetStateAction<SelectedPath | null>>, setFileTree: React.Dispatch<React.SetStateAction<TreeNode[]>>) => {
    const ownerLogin = await username(token);

    const parentPath = selectedFolder ? [...selectedFolder.parentPath, selectedFolder.name] : [];
    const newPath = [...parentPath, name];

    const docRef = doc(db, 'Users', ownerLogin, repo_name, codespace_name, 'files', newPath.join('|'));
    if (type === 'dir') {
        await setDoc(docRef, {
            name,
            type,
            parentPath,
        });
    } else {
        await setDoc(docRef, {
            name,
            type,
            parentPath,
            content: ''
        });
    }

    if (type === 'file') {
        setSelectedFile({ name, parentPath });
    }

    const fileTree = await reload(db, repo_name, codespace_name, token);
    if (fileTree !== 'error') {
        setFileTree(fileTree);
    }
};

export { AddItemDialog, addNewItem };