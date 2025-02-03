interface TreeNode {
    name: string;
    type: 'dir' | 'file';
    content?: string;
    parentPath: string[];
    children?: TreeNode[];
}

interface SelectedPath {
    name: string;
    parentPath: string[];
}

export { type TreeNode, type SelectedPath };