import { useQuery } from 'react-query';
import { projectService } from '../services/projectService';
import { technologyService } from '../services/technologyService';
import { Folder, Cpu, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data: projects } = useQuery('projects', () => projectService.getProjects({}));
  const { data: technologies } = useQuery('technologies', () => technologyService.getTechnologies({}));

  const stats = [
    { name: 'Total Projects', value: projects?.data?.length || 0, icon: Folder, color: 'bg-blue-500' },
    { name: 'Technologies', value: technologies?.data?.length || 0, icon: Cpu, color: 'bg-purple-500' },
    { name: 'Active Projects', value: projects?.data?.filter(p => p.status === 'active').length || 0, icon: TrendingUp, color: 'bg-green-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
