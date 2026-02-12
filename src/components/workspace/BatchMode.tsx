import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { extractPoolData } from '../../utils/parsers';
import { Download, Check, X } from 'lucide-react';

const BatchMode: React.FC = () => {
    const { documents } = useDocuments();
    const [input, setInput] = useState('');
    const [analyzed, setAnalyzed] = useState<string[]>([]);

    const handleAnalyze = () => {
        const { walletArray } = extractPoolData(input, 'batch_input.csv');
        setAnalyzed(walletArray);
    };

    const handleExport = () => {
        let csv = 'Wallet Address,' + documents.map(d => d.poolTag).join(',') + '\n';
        analyzed.forEach(wallet => {
            csv += wallet + ',';
            csv += documents.map(doc => doc.walletSet.has(wallet) ? 'YES' : 'NO').join(',');
            csv += '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'poolintel_batch_results.csv';
        a.click();
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Batch Analysis</h2>
                    <p className="text-gray-500">Cross-reference multiple addresses against all pools simultaneously.</p>
                </div>
                {analyzed.length > 0 && (
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste multiple addresses (new line, space, or comma separated)..."
                    className="w-full h-40 bg-gray-50 border-none rounded-2xl p-6 text-sm font-mono focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-900"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Analyze List
                    </button>
                </div>
            </div>

            {/* Results Table */}
            {analyzed.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Wallet Address</th>
                                    {documents.map(doc => (
                                        <th key={doc.id} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                            {doc.poolTag}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {analyzed.map((wallet) => (
                                    <tr key={wallet} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 font-medium">{wallet}</td>
                                        {documents.map(doc => (
                                            <td key={doc.id} className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    {doc.walletSet.has(wallet) ? (
                                                        <>
                                                            <div className="bg-emerald-100 p-1.5 rounded-lg">
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            </div>
                                                            {doc.walletValues[wallet] && doc.walletValues[wallet] !== '0' && (
                                                                <span className="text-[9px] font-bold text-emerald-600">{doc.walletValues[wallet]} {doc.valueUnit || ''}</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="bg-red-50 p-1.5 rounded-lg opacity-20">
                                                            <X className="w-3.5 h-3.5 text-red-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchMode;
