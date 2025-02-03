import React from 'react';

import { doc, collection, setDoc, deleteDoc, query, getDocs, writeBatch } from 'firebase/firestore';

import { FileNode } from '@/types/firebase';

interface RenameDialogProps {
    isOpen: boolean;
    currentName: string;
    onRename: (newName: string) => void;
    onClose: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ isOpen, currentName, onRename, onClose }) => {
    const [newName, setNewName] = React.useState(currentName);

    React.useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onRename(newName.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Rename Item</h3>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-700 text-gray-200 rounded px-3 py-2 mb-4"
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Rename
                    </button>
                </div>
            </div>
        </div>
    );
};

const renameItem = async (
    item: { name: string; type: 'file' | 'dir'; parentPath: string[]; content?: string },
    newName: string,
    db: any,
    owner: string,
    repo_id: string,
    codespace_name: string
) => {
    if (!newName || newName === item.name) return;
    try {
        if (item.type === 'file') {
            const oldPath = [...item.parentPath, item.name].join('|');
            const newPath = [...item.parentPath, newName].join('|');

            await setDoc(doc(db, 'Users', owner, repo_id, codespace_name, 'files', newPath), {
                name: newName,
                type: 'file',
                parentPath: item.parentPath,
                content: item.content
            });

            await deleteDoc(doc(db, 'Users', owner, repo_id, codespace_name, 'files', oldPath));
        } else {
            const filesRef = collection(db, 'Users', owner, repo_id, codespace_name, 'files');
            const q = query(filesRef);
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);

            const oldFolderPath = [...item.parentPath, item.name].join('|');
            const newFolderPath = [...item.parentPath, newName].join('|');

            batch.set(doc(db, 'Users', owner, repo_id, codespace_name, 'files', newFolderPath), {
                name: newName,
                type: 'dir',
                parentPath: item.parentPath
            });

            querySnapshot.forEach((document) => {
                const data = document.data() as FileNode;
                if (data.parentPath.includes(item.name)) {
                    const oldPath = [...data.parentPath, data.name].join('|');
                    const newParentPath = data.parentPath.map(p => p === item.name ? newName : p);
                    const newPath = [...newParentPath, data.name].join('|');

                    batch.set(doc(db, 'Users', owner, repo_id, codespace_name, 'files', newPath), {
                        ...data,
                        parentPath: newParentPath
                    });

                    batch.delete(doc(db, 'Users', owner, repo_id, codespace_name, 'files', oldPath));
                }
            });

            batch.delete(doc(db, 'Users', owner, repo_id, codespace_name, 'files', oldFolderPath));

            await batch.commit();
        }
        return true;
    } catch (err) {
        console.error('Error in renameItem:', err);
        return false;
    }
}

export { renameItem, RenameDialog };