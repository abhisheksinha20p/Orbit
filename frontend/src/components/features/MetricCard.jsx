import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend = 'up', // supports: up, down, neutral
    prefix = '',
    suffix = '',
    decimals = 0
}) => {
    const isPositive = trend === 'up';
    const showTrend = trend !== 'neutral';

    return (
        <GlassCard gradient hover>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">
                        {prefix}
                        <CountUp end={value} decimals={decimals} duration={2} separator="," />
                        {suffix}
                    </h3>
                    {change !== undefined && showTrend && (
                        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{Math.abs(change)}%</span>
                            <span className="text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 rounded-xl bg-gradient-primary">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    change: PropTypes.number,
    icon: PropTypes.elementType,
    trend: PropTypes.oneOf(['up', 'down']),
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    decimals: PropTypes.number,
};

export default MetricCard;
