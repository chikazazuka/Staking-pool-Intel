import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search,
    Layers,
    BarChart3,
    BadgeCheck,
    ArrowLeftRight,
    ClipboardList
} from 'lucide-react';

const modes = [
    {
        id: 'finder',
        title: 'Single Wallet Finder',
        description: 'Search for a single address across all uploaded pools instantly.',
        icon: Search,
        color: 'blue',
    },
    {
        id: 'batch',
        title: 'Batch Wallet Analysis',
        description: 'Paste a list of wallets to see which pools they belong to.',
        icon: ClipboardList,
        color: 'indigo',
    },
    {
        id: 'overlap',
        title: 'Overlap Detection',
        description: 'Identify wallets that exist in multiple pools simultaneously.',
        icon: Layers,
        color: 'purple',
    },
    {
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Visualize pool distributions and unique wallet metrics.',
        icon: BarChart3,
        color: 'emerald',
    },
    {
        id: 'validation',
        title: 'Data Validation',
        description: 'Audit file integrity, remove duplicates, and export clean data.',
        icon: BadgeCheck,
        color: 'amber',
    },
    {
        id: 'compare',
        title: 'Pool Comparison',
        description: 'Compare two pools to see gains, losses, and retention.',
        icon: ArrowLeftRight,
        color: 'rose',
    },
];

const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
};

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                            <Layers className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                            Pool<span className="text-blue-600">Intel</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Professional-grade wallet pool intelligence.
                        Secure, browser-only analysis for institutional-scale datasets.
                    </motion.p>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modes.map((mode, index) => (
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/workspace/${mode.id}`)}
                            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex flex-col items-start"
                        >
                            <div className={`p-4 rounded-2xl mb-6 ${colorMap[mode.color]} group-hover:scale-110 transition-transform`}>
                                <mode.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{mode.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                                {mode.description}
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
                                <span>Open Tool</span>
                                <Search className="w-4 h-4 rotate-90" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="py-12 text-center text-gray-400 text-sm border-t border-gray-100">
                <p>© 2026 PoolIntel • Built for Privacy • No Server Persistence</p>
            </footer>
        </div>
    );
};

export default LandingPage;
