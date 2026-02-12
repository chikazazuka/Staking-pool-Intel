import React from "react";
import { type Document } from "../hooks/useDocumentSearch";
import {
    FileText,
    FileSpreadsheet,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

interface DocumentCardProps {
    doc: Document;
    onRemove: (id: string) => void;
    query: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc, onRemove, query }) => {
    const getIcon = () => {
        switch (doc.type.toLowerCase()) {
            case "pdf":
            case "docx":
                return <FileText className="w-6 h-6 md:w-8 md:h-8 text-red-500" />;
            case "csv":
            case "xls":
            case "xlsx":
                return <FileSpreadsheet className="w-6 h-6 md:w-8 md:h-8 text-green-500" />;
            default:
                return <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative group bg-white border-2 rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 ${doc.matched
                    ? "border-blue-500 bg-blue-50/30 shadow-md ring-4 ring-blue-500/5"
                    : "border-gray-50 hover:border-gray-200"
                }`}
        >
            <button
                onClick={() => onRemove(doc.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${doc.matched ? "bg-blue-100" : "bg-gray-50"
                    }`}>
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 truncate text-sm md:text-base pr-6">
                            {doc.name}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs md:text-sm">
                        {doc.status === "parsing" && (
                            <div className="flex items-center gap-1.5 text-blue-500 font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Scanning lines...</span>
                            </div>
                        )}

                        {doc.status === "error" && (
                            <div className="flex items-center gap-1.5 text-red-500 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Error parsing</span>
                            </div>
                        )}

                        {doc.status === "completed" && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                                    {doc.type}
                                </span>

                                {doc.matched && (
                                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Match Found</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {doc.matched && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-blue-100"
                >
                    <div className="bg-blue-600/5 rounded-lg p-3 border border-blue-600/10">
                        <div className="flex items-center justify-between text-[11px] md:text-xs text-blue-700 font-bold uppercase tracking-wider mb-2">
                            <span>Context Fragment</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </div>
                        <p className="text-xs md:text-sm text-blue-900 line-clamp-2 md:line-clamp-3 font-mono break-all leading-relaxed">
                            {/* 
                 A small helper to find a snippet of the match 
                 This is a simplified version for the UI iteration
               */}
                            ...{query}...
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};
