import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Save } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { getInitials } from '../utils/formatters';
import toast from 'react-hot-toast';
import { fadeInUp } from '../utils/animations';

const Settings = () => {
    const { user, updateUser } = useAuthStore();
    const { preferences, updatePreferences } = useUserStore();
    const [loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            updateUser(profileData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePreference = (key) => {
        updatePreferences({ [key]: !preferences[key] });
        toast.success('Preferences updated');
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account and preferences</p>
            </div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <GlassCard gradient>
                    <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-semibold">
                            {getInitials(profileData.name)}
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">{profileData.name}</h3>
                            <p className="text-gray-400 text-sm">{profileData.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <GlassInput
                            label="Full Name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            icon={User}
                        />
                        <GlassInput
                            label="Email"
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            icon={Mail}
                        />
                        <PrimaryButton
                            icon={Save}
                            onClick={handleSaveProfile}
                            loading={loading}
                        >
                            Save Changes
                        </PrimaryButton>
                    </div>
                </GlassCard>
            </motion.div>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
            >
                <GlassCard gradient>
                    <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-orbit-blue" />
                                <div>
                                    <p className="text-white font-medium">Push Notifications</p>
                                    <p className="text-gray-400 text-sm">Receive push notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleTogglePreference('notifications')}
                                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${preferences.notifications ? 'bg-orbit-blue' : 'bg-gray-600'}
                `}
                            >
                                <span className={`
                  absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${preferences.notifications ? 'translate-x-6' : 'translate-x-0'}
                `} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orbit-purple" />
                                <div>
                                    <p className="text-white font-medium">Email Updates</p>
                                    <p className="text-gray-400 text-sm">Receive email notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleTogglePreference('emailUpdates')}
                                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${preferences.emailUpdates ? 'bg-orbit-purple' : 'bg-gray-600'}
                `}
                            >
                                <span className={`
                  absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${preferences.emailUpdates ? 'translate-x-6' : 'translate-x-0'}
                `} />
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default Settings;
