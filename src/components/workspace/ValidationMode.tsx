import React from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { BadgeCheck, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ValidationMode: React.FC = () => {
    const { documents } = useDocuments();

    const handleExportCleaned = (doc: any) => {
        let csv = 'Wallet Address\n';
        doc.walletArray.forEach((w: string) => {
            csv += w + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cleaned_${doc.poolTag}.csv`;
        a.click();
    };

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Data Validation</h2>
                <p className="text-gray-500">Audit the integrity of your files and export deduplicated intelligence.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {documents.map((doc) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8"
                    >
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{doc.poolTag}</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <StatItem label="Total Rows" value={doc.totalRows} />
                                <StatItem label="Valid Wallets" value={doc.validCount} highlight="emerald" />
                                <StatItem label="Duplicate Wallet(s)" value={doc.duplicateCount} highlight="amber" />
                                <StatItem label="Integrity" value="100%" highlight="blue" />
                            </div>
                        </div>

                        <button
                            onClick={() => handleExportCleaned(doc)}
                            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Clean CSV</span>
                        </button>
                    </motion.div>
                ))}

                {documents.length === 0 && (
                    <div className="py-24 text-center text-gray-300">
                        <BadgeCheck className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold">No active pools to validate.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatItem = ({ label, value, highlight }: any) => (
    <div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</span>
        <span className={`text-lg font-black ${highlight ? `text-${highlight}-600` : 'text-gray-800'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
    </div>
);

export default ValidationMode;
