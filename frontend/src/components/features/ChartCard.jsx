import React from 'react';
import GlassCard from '../ui/GlassCard';
import PropTypes from 'prop-types';

const ChartCard = ({ title, children, action }) => {
    return (
        <GlassCard gradient className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                {action}
            </div>
            <div className="w-full" style={{ height: '256px', minHeight: '256px', width: '100%' }}>
                {children}
            </div>
        </GlassCard>
    );
};

ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    action: PropTypes.node,
};

export default ChartCard;
