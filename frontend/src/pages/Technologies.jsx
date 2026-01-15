import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import GlassInput from '../components/ui/GlassInput';
import Badge from '../components/ui/Badge';
import { staggerContainer, staggerItem } from '../utils/animations';

const Technologies = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const technologies = [
    { id: 1, name: 'React', category: 'Frontend', projects: 12, color: '#61dafb' },
    { id: 2, name: 'Node.js', category: 'Backend', projects: 10, color: '#68a063' },
    { id: 3, name: 'TypeScript', category: 'Language', projects: 15, color: '#3178c6' },
    { id: 4, name: 'MongoDB', category: 'Database', projects: 8, color: '#47a248' },
    { id: 5, name: 'Docker', category: 'DevOps', projects: 6, color: '#2496ed' },
    { id: 6, name: 'AWS', category: 'Cloud', projects: 9, color: '#ff9900' },
  ];

  const filteredTechs = technologies.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Technologies</h1>
          <p className="text-gray-400">Manage your technology stack</p>
        </div>
        <PrimaryButton icon={Plus}>
          Add Technology
        </PrimaryButton>
      </div>

      <GlassCard>
        <GlassInput
          placeholder="Search technologies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
        />
      </GlassCard>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {filteredTechs.map((tech) => (
          <motion.div key={tech.id} variants={staggerItem}>
            <GlassCard gradient hover>
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.name.charAt(0)}
                </div>
                <Badge variant="primary">{tech.category}</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
              <p className="text-gray-400 text-sm">
                Used in {tech.projects} project{tech.projects !== 1 ? 's' : ''}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Technologies;
