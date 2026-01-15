const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Technology = require('../src/models/Technology');

dotenv.config();

const seedData = async () => {
    try {
        const mongoValue = process.env.MONGODB_URI;
        if (!mongoValue) {
            throw new Error("MONGODB_URI is not defined in the environment variables");
        }

        // Safety check for production
        if (process.env.NODE_ENV === 'production') {
            console.error('CRITICAL: Attempting to run seed script in production environment!');
            console.error('This will delete all existing data. If you are sure, use --force flag.');
            if (!process.argv.includes('--force')) {
                process.exit(1);
            }
        }

        await mongoose.connect(mongoValue);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        await Technology.deleteMany({});
        console.log('Cleared existing data');

        // Create Technologies
        const technologies = await Technology.create([
            { name: 'React', category: 'frontend', version: '18.2.0', icon: 'react-icon' },
            { name: 'Node.js', category: 'backend', version: '18.x', icon: 'node-icon' },
            { name: 'MongoDB', category: 'database', version: '6.0', icon: 'mongo-icon' },
            { name: 'Docker', category: 'devops', version: 'latest', icon: 'docker-icon' },
            { name: 'AWS', category: 'devops', version: 'latest', icon: 'aws-icon' },
            { name: 'Python', category: 'backend', version: '3.9', icon: 'python-icon' },
            { name: 'PostgreSQL', category: 'database', version: '15', icon: 'postgres-icon' },
            { name: 'Redis', category: 'database', version: '7', icon: 'redis-icon' }
        ]);

        const hashedPassword = 'password123';
        const users = [];

        // Create Admin
        users.push({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Generate 100 Users
        for (let i = 1; i <= 100; i++) {
            users.push({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: hashedPassword,
                role: 'user'
            });
        }

        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        // Generate 100 Projects
        const projects = [];
        const statuses = ['planning', 'active', 'completed', 'archived'];
        const environments = ['development', 'staging', 'production'];
        const healths = ['healthy', 'degraded', 'down'];

        for (let i = 1; i <= 100; i++) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomTechs = [];
            // Pick 1-3 random technologies
            const numTechs = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numTechs; j++) {
                const tech = technologies[Math.floor(Math.random() * technologies.length)];
                if (!randomTechs.includes(tech._id)) randomTechs.push(tech._id);
            }

            projects.push({
                name: `Project ${i} - ${randomStatus.toUpperCase()}`,
                description: `Auto-generated project number ${i}. This is a description for the project which serves as a placeholder.`,
                status: randomStatus,
                deploymentStatus: {
                    environment: environments[Math.floor(Math.random() * environments.length)],
                    url: `https://project-${i}.example.com`,
                    lastDeployed: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    health: healths[Math.floor(Math.random() * healths.length)]
                },
                technologies: randomTechs,
                deadline: new Date(Date.now() + Math.floor(Math.random() * 10000000000)),
                createdBy: randomUser._id
            });
        }

        await Project.create(projects);
        console.log(`Created ${projects.length} projects`);

        console.log('Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
