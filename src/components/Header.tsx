import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-8 pb-10 md:pt-12 md:pb-16 px-4 md:px-6 w-full shadow-lg">
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"
                >
                    <div className="bg-white/10 p-2 md:p-2.5 rounded-xl backdrop-blur-sm border border-white/20">
                        <Search className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Wallet Pool <span className="text-blue-200">Finder</span>
                    </h1>
                </motion.div>
                <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-blue-100 text-base md:text-lg max-w-2xl px-4 md:px-0 leading-relaxed font-medium mb-6 md:mb-8"
                >
                    Instant browser-only search across documents for wallet addresses.
                    Private, secure, and stays in your tab.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-2 md:gap-4"
                >
                    {['CSV', 'Excel', 'PDF', 'Word'].map((type) => (
                        <span key={type} className="px-3 md:px-4 py-1.5 md:py-2 bg-white/10 rounded-lg text-xs md:text-sm font-semibold border border-white/10 backdrop-blur-md">
                            {type}
                        </span>
                    ))}
                </motion.div>
            </div>
        </header>
    );
};
