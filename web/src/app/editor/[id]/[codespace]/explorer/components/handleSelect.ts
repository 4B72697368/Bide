import React from 'react';

import { SelectedPath } from '@/types/explorer';

const handleFileSelect = (file: SelectedPath, setSelectedFile: React.Dispatch<any>, setSelectedFolder: React.Dispatch<any>) => {
    setSelectedFile(file);

    if (file.parentPath.length > 0) {
        const parentFolderName = file.parentPath[file.parentPath.length - 1];
        const parentFolderPath = file.parentPath.slice(0, -1);
        setSelectedFolder({ name: parentFolderName, parentPath: parentFolderPath });
    }
};

const handleFolderSelect = (folder: SelectedPath, setSelectedFolder: React.Dispatch<any>) => {
    setSelectedFolder(folder);
};

export { handleFileSelect, handleFolderSelect };