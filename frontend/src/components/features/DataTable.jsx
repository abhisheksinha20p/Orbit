import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { staggerContainer, staggerItem } from '../../utils/animations';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data, onRowClick }) => {
    return (
        <GlassCard padding="none">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {data.map((row, index) => (
                            <motion.tr
                                key={row.id || index}
                                variants={staggerItem}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`
                  border-b border-white/5 transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}
                `}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-gray-300">
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </GlassCard>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
};

export default DataTable;
