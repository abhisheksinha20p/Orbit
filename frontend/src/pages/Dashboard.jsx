import { useQuery } from 'react-query';
import { projectService } from '../services/projectService';
import { technologyService } from '../services/technologyService';
import { Folder, Cpu, TrendingUp, Activity, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { data: projects } = useQuery('projects', () => projectService.getProjects({}));
  const { data: technologies } = useQuery('technologies', () => technologyService.getTechnologies({}));

  const projectsData = projects?.data || [];
  const techData = technologies?.data || [];

  // Calculate stats
  const totalProjects = projectsData.length;
  const activeProjects = projectsData.filter(p => p.status === 'active').length;
  const completedProjects = projectsData.filter(p => p.status === 'completed').length;
  const totalTechnologies = techData.length;

  // Project status distribution for pie chart
  const statusDistribution = [
    { name: 'Active', value: projectsData.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'Planning', value: projectsData.filter(p => p.status === 'planning').length, color: '#f59e0b' },
    { name: 'Completed', value: projectsData.filter(p => p.status === 'completed').length, color: '#3b82f6' },
    { name: 'Archived', value: projectsData.filter(p => p.status === 'archived').length, color: '#6b7280' },
  ].filter(item => item.value > 0);

  // Technology category distribution for bar chart
  const techCategories = ['frontend', 'backend', 'database', 'devops'];
  const techDistribution = techCategories.map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    count: techData.filter(t => t.category === category).length,
  }));

  // Mock timeline data for line chart
  const timelineData = [
    { month: 'Jan', projects: 5 },
    { month: 'Feb', projects: 8 },
    { month: 'Mar', projects: 12 },
    { month: 'Apr', projects: 15 },
    { month: 'May', projects: 18 },
    { month: 'Jun', projects: totalProjects },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome back! Here's what's happening with your projects.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          name="Total Projects"
          value={totalProjects}
          icon={Folder}
          gradient="primary"
          trend={12}
        />
        <StatCard
          name="Active Projects"
          value={activeProjects}
          icon={Activity}
          gradient="success"
          trend={8}
        />
        <StatCard
          name="Completed"
          value={completedProjects}
          icon={CheckCircle}
          gradient="secondary"
          trend={-3}
        />
        <StatCard
          name="Technologies"
          value={totalTechnologies}
          icon={Cpu}
          gradient="primary"
          trend={15}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-xl font-bold text-white mb-6">Project Status Distribution</h3>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-white/50">
              No project data available
            </div>
          )}
        </motion.div>

        {/* Technology Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="text-xl font-bold text-white mb-6">Technology Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={techDistribution}>
              <XAxis dataKey="name" stroke="#fff" opacity={0.7} />
              <YAxis stroke="#fff" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-white mb-6">Project Growth Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <XAxis dataKey="month" stroke="#fff" opacity={0.7} />
              <YAxis stroke="#fff" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#4facfe"
                strokeWidth={3}
                dot={{ fill: '#4facfe', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <h3 className="text-xl font-bold text-white mb-6">Recent Projects</h3>
        <div className="space-y-3">
          {projectsData.slice(0, 5).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{project.name}</h4>
                  <p className="text-white/60 text-sm">{project.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  project.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-yellow-500/20 text-yellow-300'
                }`}>
                {project.status}
              </span>
            </motion.div>
          ))}
          {projectsData.length === 0 && (
            <div className="text-center py-8 text-white/50">
              No projects yet. Create your first project to get started!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
