import { motion } from 'framer-motion';
import { Trash2, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectCard({ project, onDelete }) {
    const statusColors = {
        planning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        active: 'bg-green-500/20 text-green-300 border-green-500/30',
        completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        archived: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden"
        >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                        {project.name}
                    </h3>
                    <button
                        onClick={() => onDelete(project._id)}
                        className="text-white/50 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs font-medium bg-white/10 text-white/90 rounded-full border border-white/20"
                            >
                                {tech.name || tech}
                            </span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium text-white/60">
                                +{project.technologies.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[project.status] || statusColors.planning
                            }`}
                    >
                        {project.status}
                    </span>

                    {project.createdAt && (
                        <div className="flex items-center text-white/50 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
