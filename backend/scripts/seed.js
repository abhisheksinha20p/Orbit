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
            { name: 'AWS', category: 'devops', version: 'latest', icon: 'aws-icon' }
        ]);

        // Create Users
        // Hashing handled by pre-save hook in User model, but for seed we might need to be careful if using insertMany vs create.
        // User.create triggers save middleware.
        const hashedPassword = 'password123';

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'user'
            },
            {
                name: 'John Smith',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'user'
            }
        ]);

        // Create Projects
        await Project.create([
            {
                name: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with payment integration.',
                status: 'active',
                deploymentStatus: {
                    environment: 'production',
                    url: 'https://shop-example.com',
                    lastDeployed: new Date(),
                    health: 'healthy'
                },
                technologies: [technologies[0]._id, technologies[1]._id, technologies[2]._id], // React, Node, Mongo
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                createdBy: users[0]._id
            },
            {
                name: 'Internal Dashboard',
                description: 'Analytics dashboard for internal team use.',
                status: 'planning',
                technologies: [technologies[0]._id, technologies[3]._id], // React, Docker
                deploymentStatus: {
                    environment: 'staging',
                    url: 'https://staging.dashboard.internal',
                    lastDeployed: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    health: 'healthy'
                },
                createdBy: users[1]._id
            },
            {
                name: 'Legacy Migration',
                description: 'Migrating legacy monolith to microservices.',
                status: 'completed',
                technologies: [technologies[1]._id, technologies[2]._id, technologies[4]._id],
                deploymentStatus: {
                    environment: 'production',
                    url: 'https://api.legacy-migrated.com',
                    lastDeployed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    health: 'healthy'
                },
                createdBy: users[0]._id
            }
        ]);

        console.log('Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
