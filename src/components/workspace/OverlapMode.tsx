import React, { useState, useMemo } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { Layers, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OverlapMode: React.FC = () => {
    const { overlapMap } = useDocuments();
    const [minOverlap, setMinOverlap] = useState(2);
    const [search, setSearch] = useState('');

    const overlaps = useMemo(() => {
        const list = Array.from(overlapMap.entries())
            .map(([wallet, pools]) => ({ wallet, pools, count: pools.length }))
            .filter(item => item.count >= minOverlap);

        if (search.trim()) {
            const term = search.trim().toLowerCase();
            return list.filter(item => item.wallet.includes(term));
        }

        return list.sort((a, b) => b.count - a.count);
    }, [overlapMap, minOverlap, search]);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Overlap Detection</h2>
                <p className="text-gray-500">Discover wallets that are active in multiple pools concurrently.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Filter by wallet..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Min Overlap:</span>
                    <div className="flex items-center gap-1">
                        {[2, 3, 4, 5].map(v => (
                            <button
                                key={v}
                                onClick={() => setMinOverlap(v)}
                                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${minOverlap === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {v}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {overlaps.map((item) => (
                        <motion.div
                            key={item.wallet}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-mono text-sm text-gray-800 font-bold truncate">{item.wallet}</span>
                                <div className="flex flex-wrap gap-2">
                                    {item.pools.map(pool => (
                                        <span key={pool} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                                            {pool}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-l border-gray-100 pl-4 md:pl-8">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Pools</span>
                                    <span className="text-2xl font-black text-gray-900 leading-none">{item.count}</span>
                                </div>
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {overlaps.length === 0 && (
                    <div className="py-24 text-center">
                        <Info className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-bold">No overlaps detected with current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverlapMode;
