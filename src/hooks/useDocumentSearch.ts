import { useState, useCallback } from "react";
import { parseFile } from "../utils/parsers";

export interface Document {
    id: string;
    name: string;
    type: string;
    rawText: string;
    matched: boolean;
    status: "idle" | "parsing" | "completed" | "error";
    error?: string;
}

export function useDocumentSearch() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const addFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).slice(0, 5 - documents.length);

        const newDocs: Document[] = fileArray.map((file) => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: file.name.split(".").pop() || "unknown",
            rawText: "",
            matched: false,
            status: "parsing",
        }));

        setDocuments((prev) => [...prev, ...newDocs]);

        newDocs.forEach(async (doc, index) => {
            try {
                const text = await parseFile(fileArray[index]);
                setDocuments((prev) =>
                    prev.map((d) =>
                        d.id === doc.id
                            ? { ...d, rawText: text, status: "completed" }
                            : d
                    )
                );
            } catch (error) {
                setDocuments((prev) =>
                    prev.map((d) =>
                        d.id === doc.id
                            ? { ...d, status: "error", error: "Failed to parse file" }
                            : d
                    )
                );
            }
        });
    }, [documents]);

    const removeDocument = useCallback((id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }, []);

    const handleSearch = useCallback((searchQuery: string) => {
        setQuery(searchQuery);
        setIsSearching(true);

        // Normalize query
        const normalizedQuery = searchQuery.trim().toLowerCase();

        setDocuments((prev) =>
            prev.map((doc) => ({
                ...doc,
                matched: normalizedQuery !== "" && doc.rawText.toLowerCase().includes(normalizedQuery),
            }))
        );

        setTimeout(() => setIsSearching(false), 500);
    }, []);

    const clearDocuments = useCallback(() => {
        setDocuments([]);
        setQuery("");
    }, []);

    return {
        documents,
        query,
        isSearching,
        addFiles,
        removeDocument,
        handleSearch,
        clearDocuments,
    };
}
