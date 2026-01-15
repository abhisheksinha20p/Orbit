import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import ChartCard from '../components/features/ChartCard';
import MetricCard from '../components/features/MetricCard';
import SecondaryButton from '../components/ui/SecondaryButton';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { staggerContainer, staggerItem } from '../utils/animations';

const Analytics = () => {
    const performanceData = [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 72 },
        { month: 'Mar', value: 68 },
        { month: 'Apr', value: 78 },
        { month: 'May', value: 85 },
        { month: 'Jun', value: 90 },
    ];

    const categoryData = [
        { name: 'Frontend', value: 45, color: '#3b82f6' },
        { name: 'Backend', value: 30, color: '#8b5cf6' },
        { name: 'DevOps', value: 15, color: '#10b981' },
        { name: 'Design', value: 10, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-gray-400">Track your performance and insights</p>
                </div>
                <div className="flex gap-2">
                    <SecondaryButton icon={Calendar} size="md">
                        Date Range
                    </SecondaryButton>
                    <SecondaryButton icon={Download} size="md">
                        Export
                    </SecondaryButton>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={staggerItem}>
                    <MetricCard title="Total Revenue" value={45280} prefix="$" change={12} />
                </motion.div>
                <motion.div variants={staggerItem}>
                    <MetricCard title="Active Users" value={1248} change={8} />
                </motion.div>
                <motion.div variants={staggerItem}>
                    <MetricCard title="Conversion Rate" value={3.2} suffix="%" change={-2} trend="down" decimals={1} />
                </motion.div>
                <motion.div variants={staggerItem}>
                    <MetricCard title="Avg. Session" value={4.5} suffix="m" change={5} decimals={1} />
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Performance Trend">
                    <ResponsiveContainer width={600} height={256}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Project Distribution">
                    <ResponsiveContainer width={600} height={256}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;
