import { doc, deleteDoc, collection, query, getDocs, writeBatch } from 'firebase/firestore';

import { FileNode } from '@/types/firebase';

const deleteItem = async (item: { name: string; type: 'file' | 'dir'; parentPath: string[] }, db: any, owner: string, repo_id: string, codespace_name: string) => {
    try {
        if (item.type === 'file') {
            const path = [...item.parentPath, item.name].join('|');
            await deleteDoc(doc(db, 'Users', owner, repo_id, codespace_name, 'files', path));
        } else {
            const filesRef = collection(db, 'Users', owner, repo_id, codespace_name, 'files');
            const q = query(filesRef);
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            const folderPath = [...item.parentPath, item.name].join('|');

            querySnapshot.forEach((doc) => {
                const data = doc.data() as FileNode;
                const itemPath = [...data.parentPath, data.name].join('|');
                if (itemPath.startsWith(folderPath)) {
                    batch.delete(doc.ref);
                }
            });

            await batch.commit();
        }

        return true;
    } catch (err) {
        return false;
    }
}

export { deleteItem };
export default deleteItem;