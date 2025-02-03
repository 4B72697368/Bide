interface FileNode {
    name: string;
    type: 'file' | 'dir';
    content?: string;
    parentPath: string[];
}

export { type FileNode };
export default FileNode;