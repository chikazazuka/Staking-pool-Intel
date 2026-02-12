import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export interface Document {
    id: string;
    fileName: string;
    poolTag: string;
    walletSet: Set<string>;
    walletArray: string[];
    walletValues: Record<string, string>; // lowercase address -> value string
    valueUnit?: string; // The header name for the value column (e.g., IRWA/USD)
    totalRows: number;
    validCount: number;
    duplicateCount: number;
    status: 'idle' | 'parsing' | 'completed' | 'error';
    error?: string;
}

interface DocumentContextType {
    documents: Document[];
    activeMode: string;
    setActiveMode: (mode: string) => void;
    addDocument: (doc: Document) => void;
    updateDocument: (id: string, updates: Partial<Document>) => void;
    removeDocument: (id: string) => void;
    clearAll: () => void;
    totalUniqueWallets: number;
    overlapMap: Map<string, string[]>; // wallet -> poolTags[]
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeMode, setActiveMode] = useState('finder');

    const addDocument = useCallback((doc: Document) => {
        setDocuments((prev) => [...prev.slice(0, 4), doc]);
    }, []);

    const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
        setDocuments((prev) =>
            prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
        );
    }, []);

    const removeDocument = useCallback((id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setDocuments([]);
    }, []);

    // Derived state: Total Unique Wallets
    const totalUniqueWallets = useMemo(() => {
        const allWallets = new Set<string>();
        documents.forEach((doc) => {
            doc.walletSet.forEach((w) => allWallets.add(w));
        });
        return allWallets.size;
    }, [documents]);

    // Derived state: Overlap Map (wallet -> list of poolTags)
    const overlapMap = useMemo(() => {
        const map = new Map<string, string[]>();
        documents.forEach((doc) => {
            doc.walletSet.forEach((wallet) => {
                const tags = map.get(wallet) || [];
                if (!tags.includes(doc.poolTag)) {
                    map.set(wallet, [...tags, doc.poolTag]);
                }
            });
        });
        return map;
    }, [documents]);

    return (
        <DocumentContext.Provider
            value={{
                documents,
                activeMode,
                setActiveMode,
                addDocument,
                updateDocument,
                removeDocument,
                clearAll,
                totalUniqueWallets,
                overlapMap,
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocuments must be used within a DocumentProvider');
    }
    return context;
};
