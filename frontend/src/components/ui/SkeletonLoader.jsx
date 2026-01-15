import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  variant = 'card', 
  count = 1, 
  className = '' 
}) => {
  const variants = {
    card: (
      <div className={`glass rounded-2xl p-6 space-y-4 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-white/20 rounded-lg w-1/3 shimmer" />
            <div className="h-8 bg-white/20 rounded-lg w-1/2 shimmer" />
            <div className="h-3 bg-white/20 rounded-lg w-2/3 shimmer" />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl shimmer" />
        </div>
      </div>
    ),
    
    table: (
      <div className={`glass rounded-2xl overflow-hidden ${className}`}>
        <div className="p-6 border-b border-white/10">
          <div className="h-6 bg-white/20 rounded-lg w-1/4 shimmer" />
        </div>
        <div className="divide-y divide-white/10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded-lg w-1/3 shimmer" />
                <div className="h-3 bg-white/20 rounded-lg w-1/2 shimmer" />
              </div>
              <div className="w-20 h-8 bg-white/20 rounded-lg shimmer" />
            </div>
          ))}
        </div>
      </div>
    ),
    
    chart: (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <div className="h-6 bg-white/20 rounded-lg w-1/4 mb-6 shimmer" />
        <div className="h-64 bg-white/10 rounded-xl shimmer" />
      </div>
    ),
    
    metric: (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-white/20 rounded-lg w-2/3 shimmer" />
            <div className="h-10 bg-white/20 rounded-lg w-1/2 shimmer" />
            <div className="h-3 bg-white/20 rounded-lg w-3/4 shimmer" />
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl shimmer" />
        </div>
      </div>
    ),
    
    list: (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/20 rounded-lg w-1/3 shimmer" />
              <div className="h-3 bg-white/20 rounded-lg w-1/2 shimmer" />
            </div>
          </div>
        ))}
      </div>
    ),
    
    text: (
      <div className={`space-y-2 ${className}`}>
        <div className="h-4 bg-white/20 rounded-lg w-full shimmer" />
        <div className="h-4 bg-white/20 rounded-lg w-5/6 shimmer" />
        <div className="h-4 bg-white/20 rounded-lg w-4/6 shimmer" />
      </div>
    ),
  };

  const renderSkeleton = () => {
    if (count === 1) {
      return variants[variant] || variants.card;
    }

    return (
      <>
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {variants[variant] || variants.card}
          </motion.div>
        ))}
      </>
    );
  };

  return renderSkeleton();
};

export default SkeletonLoader;
