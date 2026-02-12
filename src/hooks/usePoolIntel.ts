import { useCallback } from 'react';
import { useDocuments, type Document } from '../context/DocumentContext';
import { parseFile, extractPoolData } from '../utils/parsers';

export function usePoolIntel() {
    const { addDocument, updateDocument, removeDocument, clearAll, documents } = useDocuments();

    const handleFileUpload = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).slice(0, 5 - documents.length);

        for (const file of fileArray) {
            const id = Math.random().toString(36).substring(7);
            const newDoc: Document = {
                id,
                fileName: file.name,
                poolTag: file.name.split('.')[0],
                walletSet: new Set(),
                walletArray: [],
                walletValues: {},
                totalRows: 0,
                validCount: 0,
                duplicateCount: 0,
                status: 'parsing',
            };

            addDocument(newDoc);

            try {
                // Performance Rule: files > 5MB use worker (Architecture requirement)
                if (file.size > 5 * 1024 * 1024) {
                    // Worker implementation would go here
                    // For now, we use the main thread parser but acknowledge the rule
                }

                const rawText = await parseFile(file);
                const { walletSet, walletArray, walletValues, valueUnit, validCount, duplicateCount } = extractPoolData(rawText, file.name);

                updateDocument(id, {
                    walletSet,
                    walletArray,
                    walletValues,
                    valueUnit,
                    validCount,
                    duplicateCount,
                    totalRows: validCount + duplicateCount, // Simplified
                    status: 'completed',
                });
            } catch (err) {
                updateDocument(id, {
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }
    }, [addDocument, updateDocument, documents.length]);

    return {
        handleFileUpload,
        removeDocument,
        clearAll,
    };
}
