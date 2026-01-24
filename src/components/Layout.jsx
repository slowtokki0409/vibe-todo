// Verified by AntiGravity Swarm
import React from 'react';
import { motion } from 'framer-motion';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Radial Gradient Mesh - Breathing Effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-500/30 rounded-full mix-blend-screen filter blur-3xl animate-breathe"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl animate-breathe-reverse"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl animate-breathe-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-breathe animation-delay-2000"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 font-display tracking-widest">
                AURA
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

            {/* Children Content */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
