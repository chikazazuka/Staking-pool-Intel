import React, { useMemo } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BarChart3, TrendingUp, Users, PieChart } from 'lucide-react';

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#059669', '#d97706'];

const AnalyticsMode: React.FC = () => {
    const { documents, totalUniqueWallets } = useDocuments();

    const chartData = useMemo(() => {
        return documents.map(doc => ({
            name: doc.poolTag,
            val: doc.validCount
        }));
    }, [documents]);

    const totalDuplicates = useMemo(() => {
        return documents.reduce((acc, doc) => acc + doc.duplicateCount, 0);
    }, [documents]);

    const largestPool = useMemo(() => {
        if (documents.length === 0) return null;
        return [...documents].sort((a, b) => b.validCount - a.validCount)[0];
    }, [documents]);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Pool Analytics</h2>
                <p className="text-gray-500">Overview of intelligence distribution and pool metrics.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={Users}
                    label="Total Wallets"
                    value={documents.reduce((acc, d) => acc + d.validCount, 0).toLocaleString()}
                    color="blue"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Unique Wallets"
                    value={totalUniqueWallets.toLocaleString()}
                    color="emerald"
                />
                <MetricCard
                    icon={PieChart}
                    label="Duplicates Removed"
                    value={totalDuplicates.toLocaleString()}
                    color="amber"
                />
                <MetricCard
                    icon={BarChart3}
                    label="Largest Pool"
                    value={largestPool?.poolTag || 'N/A'}
                    color="indigo"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-8">Wallet Distribution per Pool</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
        <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</span>
            <span className="text-2xl font-black text-gray-900 leading-none">{value}</span>
        </div>
    </div>
);

export default AnalyticsMode;
