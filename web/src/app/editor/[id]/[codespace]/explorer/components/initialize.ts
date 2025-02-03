import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { type Firestore } from 'firebase/firestore';

import { username } from '@/utils/username';
import { type TreeNode } from '@/types/explorer';
import { type FileNode } from '@/types/firebase';

const fetchFirestoreTree = async (db: Firestore, ownerLogin: string, repo_name: string, codespace_name: string) => {
    const filesRef = collection(db, 'Users', ownerLogin, repo_name, codespace_name, 'files');
    const querySnapshot = await getDocs(filesRef);

    const rootTree: TreeNode[] = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data() as FileNode;
        const { parentPath, name, type, content } = data;

        let currentLevel = rootTree;
        let currentParentPath: string[] = [];

        for (const dir of parentPath) {
            let nextNode = currentLevel.find(node => node.name === dir && node.type === 'dir');

            if (!nextNode) {
                nextNode = {
                    name: dir,
                    type: 'dir',
                    parentPath: [...currentParentPath],
                    children: []
                };
                currentLevel.push(nextNode);
            }

            currentLevel = nextNode.children || [];
            currentParentPath.push(dir);
        }

        if (type === 'dir') {
            currentLevel.push({
                name,
                type: 'dir',
                parentPath,
                children: []
            });
        } else if (type === 'file') {
            currentLevel.push({
                name,
                type: 'file',
                content,
                parentPath,
                children: []
            });
        }
    });

    return rootTree;
};

const initializeExplorer = async (db: Firestore, repo_name: string, codespace_name: string, token: string) => {
    const initializeFirestoreStructure = async (ownerLogin: string, contents: any[]) => {
        const processItem = async (item: any, parentPath: string[]) => {
            const currentPath = [...parentPath, item.name];

            const docRef = doc(db, 'Users', ownerLogin, repo_name, codespace_name, 'files', item.path.replace(/\//g, '|'));

            await setDoc(docRef, {
                name: item.name,
                type: item.type,
                parentPath
            });

            if (item.type === 'dir') {
                const children = await getDoc(currentPath.join('/'));
                for (const child of children) {
                    await processItem(child, currentPath);
                }
            } else if (item.type === 'file') {
                const fileContent = await getFileContent(item.download_url);
                await setDoc(docRef, {
                    name: item.name,
                    content: fileContent,
                    type: item.type,
                    parentPath
                });
            }
        };

        const getDoc = async (path: string) => {
            const response = await fetch(
                `https://api.github.com/repos/${ownerLogin}/${repo_name}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }
            );

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error(`Failed to fetch GitHub contents for ${path}`);
            }
        };

        const getFileContent = async (fileUrl: string) => {
            const response = await fetch(fileUrl);
            if (response.ok) {
                const data = await response.text();
                return data;
            } else {
                throw new Error(`Failed to fetch content for file at ${fileUrl}`);
            }
        };

        for (const item of contents) {
            await processItem(item, []);
        }
    };

    try {
        const ownerLogin = await username(token);

        const filesRef = collection(db, 'Users', ownerLogin, repo_name, codespace_name, 'files');
        const snapshot = await getDocs(filesRef);

        if (snapshot.empty) {
            const response = await fetch(
                `https://api.github.com/repos/${ownerLogin}/${repo_name}/contents`,
                {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }
            );

            const contents = await response.json();

            if (await contents.message === "This repository is empty.") return [];
            if (!response.ok) throw new Error('Failed to fetch repo contents');

            await initializeFirestoreStructure(ownerLogin, contents);
        }

        const tree = await fetchFirestoreTree(db, ownerLogin, repo_name, codespace_name);
        return tree;
    } catch (err) {
        console.log(err);
        return "error";
    }
};

const reload = async (db: Firestore, repo_name: string, codespace_name: string, token: string) => {
    try {
        const ownerLogin = await username(token);

        const tree = await fetchFirestoreTree(db, ownerLogin, repo_name, codespace_name);
        return tree;
    } catch (err) {
        console.log(err);
        return "error";
    }
}

export { initializeExplorer, reload };