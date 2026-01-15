import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Plus, Grid3x3, List, Search } from 'lucide-react';
import { projectService } from '../services/projectService';
import Loader from '../components/ui/Loader';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import GlassInput from '../components/ui/GlassInput';
import Badge from '../components/ui/Badge';
import { staggerContainer, staggerItem } from '../utils/animations';
import { formatDate } from '../utils/formatters';

const Projects = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  /* 
   * Real Backend Integration:
   * Using React Query to fetch projects from actual backend API.
   * Debouncing search would be an improvement for future.
   */
  const { data: response, isLoading, isError } = useQuery(
    ['projects', searchQuery],
    () => projectService.getProjects({ search: searchQuery }),
    { keepPreviousData: true }
  );

  const projects = response?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'planning': return 'warning';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" text="Loading projects..." />
      </div>
    );
  }

  if (isError) {
    return (
      <GlassCard className="text-center py-12 border-red-500/30">
        <p className="text-red-400">Failed to load projects. Please try again later.</p>
        <SecondaryButton className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </SecondaryButton>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage and track your projects</p>
        </div>
        <PrimaryButton icon={Plus}>New Project</PrimaryButton>
      </div>

      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <GlassInput
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex gap-2">
            <SecondaryButton
              size="md"
              icon={Grid3x3}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white/20' : ''}
            >
              Grid
            </SecondaryButton>
            <SecondaryButton
              size="md"
              icon={List}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white/20' : ''}
            >
              List
            </SecondaryButton>
          </div>
        </div>
      </GlassCard>

      <motion.div
        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div key={project._id} variants={staggerItem}>
            <GlassCard gradient hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Status Section (Replaces Progress) */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Environment</span>
                  <span className="text-white font-medium">
                    {project.deploymentStatus?.environment || 'N/A'}
                  </span>
                </div>
                {project.deadline && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Deadline</span>
                    <span className="text-orbit-blue font-medium">
                      {formatDate(project.deadline)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies && project.technologies.map((tech, index) => (
                  <Badge key={index} size="sm" variant="secondary">
                    {/* Handle both populated objects and raw IDs or strings */}
                    {typeof tech === 'object' ? tech.name : tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/10">
                <span>Updated {formatDate(project.updatedAt || project.createdAt)}</span>
                <span>{project.createdBy?.name || 'Unknown'}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {projects.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-gray-400">No projects found</p>
        </GlassCard>
      )}
    </div>
  );
};

export default Projects;
