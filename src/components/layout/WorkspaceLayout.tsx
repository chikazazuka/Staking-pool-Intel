import React, { useState } from 'react';
import { Outlet, useParams, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Layers, ChevronRight, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkspaceLayout: React.FC = () => {
    const { mode } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const formatMode = (m?: string) => {
        if (!m) return '';
        return m.charAt(0).toUpperCase() + m.slice(1);
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Workspace Header */}
                <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-8 z-10">
                    <div className="flex items-center gap-2 md:gap-4 font-sans">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap">
                            <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tight hidden sm:inline">PoolIntel</span>
                        </Link>

                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />

                        <span className="text-[10px] md:text-sm font-bold text-gray-500 bg-gray-50 px-2 md:px-3 py-1 rounded-full border border-gray-100 truncate">
                            {formatMode(mode)} Mode
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Actions could go here */}
                    </div>
                </header>

                {/* Dynamic Mode Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 font-sans">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-6xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
