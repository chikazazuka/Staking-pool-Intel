import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocuments } from '../../context/DocumentContext';
import { usePoolIntel } from '../../hooks/usePoolIntel';
import {
    Upload,
    FileText,
    Trash2,
    Tag,
    Plus,
    Info,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { documents, updateDocument, removeDocument, totalUniqueWallets } = useDocuments();
    const { handleFileUpload } = usePoolIntel();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleFileUpload(acceptedFiles);
    }, [handleFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 5 - documents.length,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        disabled: documents.length >= 5
    });

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 lg:border-hidden">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upload</h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload Section */}
                <div className="p-6 border-b border-gray-100 pt-0 lg:pt-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                            } ${documents.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="bg-blue-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-600">Drop Pool File(s)</span>
                        <span className="text-[10px] text-gray-400 italic">Up to 5 files total</span>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="p-6 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Pools</span>
                            <span className="text-lg font-black text-gray-800">{documents.length}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Unique</span>
                            <span className="text-lg font-black text-blue-600 truncate">{totalUniqueWallets.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Active Pools</h3>
                    <AnimatePresence mode="popLayout">
                        {documents.map((doc) => (
                            <motion.div
                                key={doc.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-4 rounded-2xl border-2 transition-all group ${doc.status === 'error' ? 'border-red-100 bg-red-50/20' : 'border-gray-50 bg-white hover:border-blue-100'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={`p-1.5 rounded-lg ${doc.status === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                            <FileText className={`w-3.5 h-3.5 ${doc.status === 'error' ? 'text-red-500' : 'text-blue-600'}`} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 truncate">{doc.fileName}</span>
                                    </div>
                                    <button
                                        onClick={() => removeDocument(doc.id)}
                                        className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Editable Pool Tag */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag className="w-3 h-3 text-gray-400" />
                                    <input
                                        type="text"
                                        value={doc.poolTag}
                                        onChange={(e) => updateDocument(doc.id, { poolTag: e.target.value })}
                                        className="text-[11px] font-bold bg-gray-100/50 border-none rounded px-2 py-0.5 focus:ring-1 focus:ring-blue-500 text-gray-600 w-full"
                                        placeholder="Pool Name..."
                                    />
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {doc.status === 'parsing' ? (
                                            <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold">
                                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                <span>Scanning...</span>
                                            </div>
                                        ) : doc.status === 'error' ? (
                                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                                                <AlertCircle className="w-2.5 h-2.5" />
                                                <span>Failed</span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-black text-gray-400">
                                                {doc.validCount.toLocaleString()} Wallets
                                            </span>
                                        )}
                                    </div>
                                    <Info className="w-3 h-3 text-gray-200" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {documents.length === 0 && (
                        <div className="flex flex-col items-center justify-center pt-8 text-center px-4">
                            <Plus className="w-8 h-8 text-gray-100 mb-2" />
                            <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                No data in memory. Upload files to start intelligence analysis.
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};
