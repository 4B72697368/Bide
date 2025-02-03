import React, { useEffect, useRef, useState } from 'react';

import { Editor as MonacoEditor } from '@monaco-editor/react';

import { doc, setDoc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

import { getFileContent } from '@/utils/fileContent';
import { username as getUserName } from '@/utils/username';
import { SelectedPath } from '@/types/explorer';

import { getLanguageFromExtension } from './components/languages';
import EditorLoadingOverlay from './components/loading';
import TabManager from './components/tabManager';

interface EditorProps {
    selectedFile: SelectedPath | null;
    setSelectedFile: React.Dispatch<SelectedPath | null>;
    db: Firestore;
    repo_name: string;
    codespace_name: string;
    token: string;
    onContentChange: (content: string) => void;
    reloadTree: () => Promise<void>;
}

interface Tab {
    file: SelectedPath;
    content: string;
    unsaved: boolean;
}

const Editor: React.FC<EditorProps> = ({
    selectedFile,
    setSelectedFile,
    db,
    repo_name,
    codespace_name,
    token,
    onContentChange,
    reloadTree
}) => {
    const editorRef = useRef<any>(null);

    const loadTabsFromLocalStorage = () => {
        try {
            const storedTabs = localStorage.getItem(`${repo_name}-${codespace_name}-tabs`);
            const storedActiveTab = localStorage.getItem(`${repo_name}-${codespace_name}-activeTab`);

            if (!storedTabs) {
                return { tabs: [], activeTab: 0 };
            }

            const parsedTabs = JSON.parse(storedTabs);

            const validTabs = parsedTabs.filter((tab: any) => {
                return tab &&
                    tab.file &&
                    tab.file.name &&
                    tab.file.parentPath &&
                    typeof tab.content === 'string';
            });

            if (validTabs.length === 0) {
                localStorage.removeItem(`${repo_name}-${codespace_name}-tabs`);
                localStorage.removeItem(`${repo_name}-${codespace_name}-activeTab`);
                return { tabs: [], activeTab: 0 };
            }

            const parsedActiveTab = parseInt(storedActiveTab || '0', 10);
            const validActiveTab = isNaN(parsedActiveTab) || parsedActiveTab >= validTabs.length
                ? 0
                : parsedActiveTab;

            return {
                tabs: validTabs,
                activeTab: validActiveTab
            };
        } catch (error) {
            console.log("an error occured: " + error)
            localStorage.removeItem(`${repo_name}-${codespace_name}-tabs`);
            localStorage.removeItem(`${repo_name}-${codespace_name}-activeTab`);
            return { tabs: [], activeTab: 0 };
        }
    };

    const [tabs, setTabs] = useState<Tab[]>(() => loadTabsFromLocalStorage().tabs);
    const [activeTab, setActiveTab] = useState<number>(() => loadTabsFromLocalStorage().activeTab);

    useEffect(() => {
        if (tabs.length === 0) {
            localStorage.removeItem(`${repo_name}-${codespace_name}-tabs`);
            localStorage.removeItem(`${repo_name}-${codespace_name}-activeTab`);
        } else {
            localStorage.setItem(`${repo_name}-${codespace_name}-tabs`, JSON.stringify(tabs));
            localStorage.setItem(`${repo_name}-${codespace_name}-activeTab`, activeTab.toString());
        }
    }, [tabs, activeTab, repo_name, codespace_name]);

    useEffect(() => {
        const loadFileContent = async () => {
            const username = await getUserName(token);
            if (!selectedFile) return;

            const existingTabIndex = tabs.findIndex(
                tab =>
                    tab.file.name === selectedFile.name &&
                    JSON.stringify(tab.file.parentPath) === JSON.stringify(selectedFile.parentPath)
            );

            if (existingTabIndex !== -1) {
                setActiveTab(existingTabIndex);
                return;
            }

            const content = await getFileContent(db, username, repo_name, codespace_name, selectedFile);
            onContentChange(content);

            setTabs(prev => {
                const updatedTabs = [...prev, { file: selectedFile, content, unsaved: false }];
                return updatedTabs;
            });
            setActiveTab(tabs.length);
        };

        loadFileContent();
    }, [selectedFile, db, repo_name, codespace_name, tabs, token, onContentChange]);

    useEffect(() => {
        const handleSave = async () => {
            if (activeTab === -1 || !tabs[activeTab]) return;

            const currentTab = tabs[activeTab];
            const username = await getUserName(token);

            const docRef = doc(
                db,
                'Users',
                username,
                repo_name,
                codespace_name,
                'files',
                [...currentTab.file.parentPath, currentTab.file.name].join('|')
            );

            await setDoc(docRef, {
                name: currentTab.file.name,
                content: currentTab.content,
                type: 'file',
                parentPath: currentTab.file.parentPath
            }, { merge: true });

            setTabs(prev => {
                const newTabs = [...prev];
                newTabs[activeTab] = { ...newTabs[activeTab], unsaved: false };
                return newTabs;
            });

            await reloadTree();
        };

        const handleKeyDown = async (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                await handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, tabs, codespace_name, db, reloadTree, repo_name, token]);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            onContentChange(value);
        }
        if (!value || activeTab === -1) return;

        setTabs(prev => {
            const newTabs = [...prev];
            newTabs[activeTab] = {
                ...newTabs[activeTab],
                content: value,
                unsaved: value !== newTabs[activeTab].content
            };
            return newTabs;
        });
    };

    const handleTabClose = (index: number) => {
        setTabs(prev => {
            const newTabs = prev.filter((_, i) => i !== index);

            if (index === activeTab) {
                if (index === prev.length - 1) {
                    setActiveTab(Math.max(0, index - 1));
                } else {
                    setActiveTab(Math.min(index, newTabs.length - 1));
                }
            } else if (index < activeTab) {
                setActiveTab(activeTab - 1);
            }

            return newTabs;
        });
    };

    const handleTabClick = (index: number) => {
        if (index >= 0 && index < tabs.length && tabs[index]) {
            setActiveTab(index);
            setSelectedFile(tabs[index].file);
            onContentChange(tabs[index].content);
        }
    };
    if (tabs.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#202020]">
                Select a file to edit
            </div>
        );
    }

    const validActiveTab = Math.min(activeTab, tabs.length - 1);
    if (validActiveTab !== activeTab) {
        setActiveTab(validActiveTab);
        return null;
    }

    if (!tabs[validActiveTab]) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#202020]">
                Error loading editor state
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <TabManager
                tabs={tabs}
                activeTab={validActiveTab}
                onTabClick={handleTabClick}
                onTabClose={handleTabClose}
            />
            <div className="flex-1">
                <MonacoEditor
                    height="100%"
                    language={getLanguageFromExtension(tabs[validActiveTab].file.name)}
                    value={tabs[validActiveTab].content}
                    theme="vs-dark"
                    loading={<EditorLoadingOverlay />}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                        tabSize: 2,
                        lineNumbers: 'on',
                        renderWhitespace: 'selection',
                        scrollbar: {
                            vertical: 'visible',
                            horizontal: 'visible',
                        }
                    }}
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
};

export { Editor };
export default Editor;