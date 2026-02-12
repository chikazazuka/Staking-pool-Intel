import React, { useState, useMemo } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { Search, CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FinderMode: React.FC = () => {
    const { documents } = useDocuments();
    const [search, setSearch] = useState('');

    const matches = useMemo(() => {
        if (!search.trim()) return [];
        const term = search.trim().toLowerCase();

        return documents.filter(doc => doc.walletSet.has(term));
    }, [search, documents]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Wallet Finder</h2>
                <p className="text-gray-500">Locate a specific address across all active  pools.</p>
            </div>

            {/* Search Input */}
            <div className="max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Paste 0x address..."
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-lg font-mono focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all text-gray-900"
                    />
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pool Matches</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {matches.map((doc) => (
                            <motion.div
                                key={doc.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-500/5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{doc.poolTag}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{doc.fileName}</span>
                                            {doc.walletValues[search.trim().toLowerCase()] && doc.walletValues[search.trim().toLowerCase()] !== '0' && (
                                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {(doc.valueUnit || 'STAKED').toUpperCase()}: {doc.walletValues[search.trim().toLowerCase()]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                                        FOUND
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {search.trim() && matches.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-12 text-center bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200"
                        >
                            <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold">No pools contain this address.</p>
                        </motion.div>
                    )}

                    {!search.trim() && (
                        <div className="col-span-full py-12 text-center text-gray-300">
                            <Info className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Enter an address to start scanning pools.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinderMode;
