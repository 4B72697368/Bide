import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { SelectedPath } from '@/types/explorer';

export const getFileContent = async (
    db: Firestore,
    username: string,
    repo_name: string,
    codespace_name: string,
    file: SelectedPath
): Promise<string> => {
    const filePath = [...file.parentPath, file.name].join('|');
    const docRef = doc(db, 'Users', username, repo_name, codespace_name, 'files', filePath);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.content || '';
        }
        return '';
    } catch (error) {
        console.error('Error fetching file content:', error);
        return '';
    }
};