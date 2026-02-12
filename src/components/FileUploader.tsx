import React, { useRef, useState } from "react";
import { Upload, FileText, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

interface FileUploaderProps {
    onUpload: (files: FileList) => void;
    count: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, count }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (count < 5) setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && count < 5) {
            onUpload(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto w-full px-4 md:px-6 mb-6 md:mb-8"
        >
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer transition-all duration-300",
                    "border-2 border-dashed rounded-2xl md:rounded-3xl p-6 md:p-12 text-center",
                    isDragging
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/50",
                    count >= 5 && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                <input
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xls,.xlsx,.docx"
                    onChange={handleFileInput}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={count >= 5}
                />

                <div className="flex flex-col items-center">
                    <div className={cn(
                        "mb-4 md:mb-6 p-4 md:p-6 rounded-full transition-transform duration-500 group-hover:scale-110",
                        isDragging ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                    )}>
                        <Upload className="w-8 h-8 md:w-12 md:h-12" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                        Upload Pool Documents
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-sm mx-auto">
                        Drag & drop up to <span className="text-blue-600 font-semibold">{5 - count}</span> files or click to browse
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        <Badge icon={FileSpreadsheet} label="CSV / Excel" />
                        <Badge icon={FileText} label="PDF / DOCX" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Badge = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
        <Icon className="w-4 h-4 text-blue-500" />
        <span className="text-xs md:text-sm font-medium text-gray-600">{label}</span>
    </div>
);
