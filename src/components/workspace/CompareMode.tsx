import React, { useState, useMemo } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { ArrowLeftRight, Minus, Plus, RefreshCw, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const colorMap: Record<string, string> = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
};

const CompareMode: React.FC = () => {
    const { documents } = useDocuments();
    const [poolAId, setPoolAId] = useState('');
    const [poolBId, setPoolBId] = useState('');

    const poolA = documents.find(d => d.id === poolAId);
    const poolB = documents.find(d => d.id === poolBId);

    const diff = useMemo(() => {
        if (!poolA || !poolB) return null;

        const retained = poolA.walletArray.filter(w => poolB.walletSet.has(w));
        const lost = poolA.walletArray.filter(w => !poolB.walletSet.has(w));
        const newlyAdded = poolB.walletArray.filter(w => !poolA.walletSet.has(w));

        return {
            retained: retained.length,
            lost: lost.length,
            newlyAdded: newlyAdded.length,
            retainedList: retained.slice(0, 10),
        };
    }, [poolA, poolB]);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Pool Comparison</h2>
                <p className="text-gray-500">Calculate the differential between two specific pools.</p>
            </div>

            {/* Select Pools */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Pool (A)</label>
                    <select
                        value={poolAId}
                        onChange={(e) => setPoolAId(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="">Select Pool...</option>
                        {documents.map(d => <option key={d.id} value={d.id}>{d.poolTag}</option>)}
                    </select>
                </div>

                <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                    <ArrowLeftRight className="w-5 h-5" />
                </div>

                <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Pool (B)</label>
                    <select
                        value={poolBId}
                        onChange={(e) => setPoolBId(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="">Select Pool...</option>
                        {documents.map(d => <option key={d.id} value={d.id}>{d.poolTag}</option>)}
                    </select>
                </div>
            </div>

            {/* Compare Results */}
            {diff && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DiffCard
                        label="Lost Wallets"
                        value={diff.lost}
                        icon={Minus}
                        color="red"
                        desc={`Wallets in ${poolA?.poolTag} but missing in ${poolB?.poolTag}`}
                    />
                    <DiffCard
                        label="Retained Wallets"
                        value={diff.retained}
                        icon={RefreshCw}
                        color="blue"
                        desc={`Wallets present in both intelligence pools`}
                    />
                    <DiffCard
                        label="New Wallets"
                        value={diff.newlyAdded}
                        icon={Plus}
                        color="emerald"
                        desc={`Found in ${poolB?.poolTag} but not in ${poolA?.poolTag}`}
                    />

                    <div className="col-span-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-bold text-gray-800">Retained Wallet(s)</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {diff.retainedList.map(w => (
                                <div key={w} className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="font-mono text-xs text-gray-700 font-bold break-all">{w}</span>
                                    <div className="flex flex-row gap-4 text-xs font-sans whitespace-nowrap">
                                        {poolA?.walletValues[w] && poolA.walletValues[w] !== '0' && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Base {poolA.valueUnit || 'Value'}</span>
                                                <span className="text-blue-600 font-black">{poolA.walletValues[w]} <span className="text-[10px] opacity-70">{poolA.valueUnit || ''}</span></span>
                                            </div>
                                        )}
                                        {poolB?.walletValues[w] && poolB.walletValues[w] !== '0' && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Target {poolB.valueUnit || 'Value'}</span>
                                                <span className="text-emerald-600 font-black">{poolB.walletValues[w]} <span className="text-[10px] opacity-70">{poolB.valueUnit || ''}</span></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {diff.retainedList.length === 0 && <span className="text-sm text-gray-400 italic">No retained wallet available.</span>}
                        </div>
                    </div>
                </div>
            )}

            {(!poolAId || !poolBId) && (
                <div className="py-24 text-center text-gray-300">
                    <ArrowLeftRight className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="font-bold">Select two pools to view the differences.</p>
                </div>
            )}
        </div>
    );
};

const DiffCard = ({ label, value, icon: Icon, color, desc }: any) => {
    const colorClasses = colorMap[color as keyof typeof colorMap];
    const [bgClass, textClass] = colorClasses.split(' ');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${bgClass} ${textClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-4xl font-black ${textClass} leading-none`}>{value.toLocaleString()}</span>
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-800 mb-1 uppercase tracking-tight">{label}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
            </div>
        </motion.div>
    );
};

export default CompareMode;
