import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function StatCard({ name, value, icon: Icon, gradient, trend }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card group"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-white/70 text-sm font-medium mb-2">{name}</p>
                    <p className="text-4xl font-bold text-white">
                        <CountUp end={value} duration={2} />
                    </p>
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <span>{trend > 0 ? '↑' : '↓'}</span>
                            <span className="ml-1">{Math.abs(trend)}%</span>
                            <span className="text-white/50 ml-2">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`p-4 rounded-2xl bg-gradient-${gradient} shadow-neon-pink group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </motion.div>
    );
}
