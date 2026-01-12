import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';

export const TodoStats = ({ todos }) => {
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    remaining: todos.filter((t) => !t.completed).length,
    overdue: todos.filter(
      (t) =>
        !t.completed &&
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        new Date(t.dueDate).toDateString() !== new Date().toDateString()
    ).length,
    high: todos.filter((t) => !t.completed && t.priority === 'high').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      label: '완료된 작업',
      value: stats.completed,
      total: stats.total,
      icon: CheckCircle2,
      color: 'from-green-500/20 to-green-600/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
    },
    {
      label: '남은 작업',
      value: stats.remaining,
      icon: Clock,
      color: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    },
    {
      label: '기한 초과',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'from-red-500/20 to-red-600/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
    },
    {
      label: '높은 우선순위',
      value: stats.high,
      icon: Zap,
      color: 'from-yellow-500/20 to-yellow-600/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Completion Rate - Full Width */}
      <motion.div
        className={`md:col-span-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 space-y-2`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 font-medium">전체 진행률</span>
          <span className="text-2xl font-bold text-purple-300">{completionRate}%</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {stats.completed} / {stats.total}개 완료
        </div>
      </motion.div>

      {/* Stat Cards */}
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-lg p-3 space-y-2`}
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <Icon className={`${stat.text} w-4 h-4`} />
              <span className={`${stat.text} text-2xl font-bold`}>{stat.value}</span>
            </div>
            <p className="text-xs text-gray-400 font-medium truncate">{stat.label}</p>
            {stat.total && (
              <p className="text-xs text-gray-500">
                {stat.total}개 중 {stat.value}개
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TodoStats;
