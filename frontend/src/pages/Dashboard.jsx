import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Code2, TrendingUp } from 'lucide-react';
import MetricCard from '../components/features/MetricCard';
import ChartCard from '../components/features/ChartCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import GlassCard from '../components/ui/GlassCard';
import { projectService } from '../services/projectService';
import { staggerContainer, staggerItem } from '../utils/animations';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  /*
   * Real Backend Integration:
   * Computing metrics from fetched projects data since no dedicated analytics API exists yet.
   */
  const { data: response, isLoading, isError } = useQuery(
    'dashboard-projects',
    () => projectService.getProjects({ limit: 100 }), // Fetch more to compute stats
    { staleTime: 60000 }
  );

  const projects = response?.data || [];

  // 1. Calculate Metrics
  const totalProjects = projects.length;

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Unique technologies
  const uniqueTechs = new Set();
  projects.forEach(p => {
    if (p.technologies) {
      p.technologies.forEach(t => uniqueTechs.add(typeof t === 'object' ? t._id : t));
    }
  });
  const totalTechnologies = uniqueTechs.size;

  // Unique Team Members (creators)
  const uniqueMembers = new Set();
  projects.forEach(p => {
    if (p.createdBy) uniqueMembers.add(typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy);
  });
  const totalMembers = uniqueMembers.size > 0 ? uniqueMembers.size : 1; // At least current user

  const metrics = [
    { title: 'Total Projects', value: totalProjects, icon: FolderKanban },
    { title: 'Team Members', value: totalMembers, icon: Users },
    { title: 'Unique Technologies', value: totalTechnologies, icon: Code2 },
    { title: 'Completion Rate', value: completionRate, icon: TrendingUp, trend: 'up', suffix: '%' },
  ];

  // 2. Generate Chart Data (Group by Month)
  const chartDataMap = new Map();
  projects.forEach(p => {
    const date = new Date(p.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!chartDataMap.has(month)) {
      chartDataMap.set(month, { name: month, projects: 0, completed: 0 });
    }
    const data = chartDataMap.get(month);
    data.projects += 1;
    if (p.status === 'completed') data.completed += 1;
  });

  // Convert Map to Array and sort by month index (simplified for now, just reversing if recent first)
  const chartData = Array.from(chartDataMap.values()).reverse(); // Backend returns desc, so reverse/sort as needed

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-white/20 rounded-lg w-1/4 shimmer" />
          <div className="h-4 bg-white/20 rounded-lg w-1/2 shimmer" />
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader variant="metric" count={4} />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader variant="chart" count={2} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <GlassCard className="text-center py-12 border-red-500/30">
        <p className="text-red-400">Failed to load dashboard data.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => (
          <motion.div key={index} variants={staggerItem}>
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Project Growth">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="projects" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProjects)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Project Completion">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completed" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
