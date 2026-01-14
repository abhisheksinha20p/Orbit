import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { projectService } from '../services/projectService';
import { technologyService } from '../services/technologyService';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Projects() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['projects', search, status], () =>
    projectService.getProjects({ search, status })
  );

  const { data: techData } = useQuery('technologies', () => technologyService.getTechnologies({}));

  const createMutation = useMutation(projectService.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setShowModal(false);
      toast.success('Project created successfully!');
    },
    onError: () => {
      toast.error('Failed to create project');
    }
  });

  const deleteMutation = useMutation(projectService.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      toast.success('Project deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete project');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
      technologies: Array.from(formData.getAll('technologies'))
    };
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/70">Manage and track all your projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search projects..."
              className="input-glass w-full pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-glass sm:w-48"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card h-48 skeleton shimmer" />
          ))}
        </div>
      ) : data?.data?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.data.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} onDelete={deleteMutation.mutate} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-16"
        >
          <div className="text-white/50 mb-4">
            <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No projects found</p>
            <p className="text-sm mt-2">Create your first project to get started!</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            <Plus className="w-5 h-5 mr-2 inline" />
            Create Project
          </button>
        </motion.div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              name="name"
              placeholder="Enter project name"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Enter project description"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-neon transition-all disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Creating...' : 'Create Project'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
