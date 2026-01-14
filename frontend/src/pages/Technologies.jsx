import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { technologyService } from '../services/technologyService';
import { Plus, Trash2, Code2 } from 'lucide-react';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Technologies() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['technologies', category], () =>
    technologyService.getTechnologies({ category })
  );

  const createMutation = useMutation(technologyService.createTechnology, {
    onSuccess: () => {
      queryClient.invalidateQueries('technologies');
      setShowModal(false);
      toast.success('Technology added successfully!');
    },
    onError: () => {
      toast.error('Failed to add technology');
    }
  });

  const deleteMutation = useMutation(technologyService.deleteTechnology, {
    onSuccess: () => {
      queryClient.invalidateQueries('technologies');
      toast.success('Technology deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete technology');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      version: formData.get('version')
    };
    createMutation.mutate(data);
  };

  const categoryColors = {
    frontend: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    backend: 'bg-green-500/20 text-green-300 border-green-500/30',
    database: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    devops: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
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
          <h1 className="text-4xl font-bold text-white mb-2">Technologies</h1>
          <p className="text-white/70">Manage your technology stack</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Technology
        </motion.button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <select
          className="input-glass w-full sm:w-64"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="database">Database</option>
          <option value="devops">DevOps</option>
        </select>
      </motion.div>

      {/* Technologies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="glass-card h-32 skeleton shimmer" />
          ))}
        </div>
      ) : data?.data?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {data.data.map((tech, index) => (
            <motion.div
              key={tech._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -5 }}
              className="glass-card group relative overflow-hidden"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />

              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-neon group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(tech._id)}
                    className="text-white/50 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">
                  {tech.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[tech.category] || categoryColors.frontend
                      }`}
                  >
                    {tech.category}
                  </span>
                  {tech.version && (
                    <span className="text-white/50 text-xs">v{tech.version}</span>
                  )}
                </div>
              </div>
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
            <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No technologies found</p>
            <p className="text-sm mt-2">Add your first technology to get started!</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            <Plus className="w-5 h-5 mr-2 inline" />
            Add Technology
          </button>
        </motion.div>
      )}

      {/* Add Technology Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Technology">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology Name</label>
            <input
              name="name"
              placeholder="e.g., React, Node.js, MongoDB"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version (Optional)</label>
            <input
              name="version"
              placeholder="e.g., 18.2.0"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-neon transition-all disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Adding...' : 'Add Technology'}
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
