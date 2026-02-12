import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isSearching: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(input);
    };

    return (
        <div className="max-w-5xl mx-auto w-full px-4 md:px-6 mb-8 md:mb-12">
            <form
                onSubmit={handleSubmit}
                className="relative group flex items-center bg-white rounded-xl md:rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/20"
            >
                <div className="pl-4 md:pl-6 text-gray-400">
                    {isSearching ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-blue-500" />
                    ) : (
                        <Search className="w-5 h-5 md:w-6 md:h-6 group-focus-within:text-blue-500 transition-colors" />
                    )}
                </div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste wallet address or search terms..."
                    className="flex-1 py-4 md:py-6 pl-3 md:pl-4 pr-4 md:pr-6 text-base md:text-lg focus:outline-none placeholder:text-gray-400 min-w-0"
                />

                <div className="hidden sm:flex items-center gap-2 pr-4 text-gray-300 pointer-events-none">
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                        Enter
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isSearching}
                    className="mr-2 md:mr-3 px-4 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl font-bold transition-all disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
                >
                    {isSearching ? "Finding..." : "Search"}
                </button>
            </form>

            <p className="mt-4 text-center text-xs md:text-sm text-gray-500 px-4">
                Try searching for standard wallet formats like <span className="font-mono bg-gray-100 px-1 rounded">0x...</span>
            </p>
        </div>
    );
};
