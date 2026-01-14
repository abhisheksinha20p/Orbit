import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { technologyService } from '../services/technologyService';
import { Plus, Trash2 } from 'lucide-react';

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
    }
  });

  const deleteMutation = useMutation(technologyService.deleteTechnology, {
    onSuccess: () => queryClient.invalidateQueries('technologies')
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Technologies</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </button>
      </div>

      <div className="mb-6">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="database">Database</option>
          <option value="devops">DevOps</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data?.map((tech) => (
            <div key={tech._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                <button
                  onClick={() => deleteMutation.mutate(tech._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{tech.category}</p>
              {tech.version && <p className="text-xs text-gray-500 mt-1">v{tech.version}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Technology</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Technology Name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select Category</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
              </select>
              <input
                name="version"
                placeholder="Version (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
