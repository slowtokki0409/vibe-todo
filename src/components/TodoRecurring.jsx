import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat2, Bell } from 'lucide-react';

export const TodoRecurring = ({ todo, onUpdate }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleRecurringChange = (type) => {
    const newRecurring = {
      type,
      enabled: type !== null,
    };
    onUpdate(todo.id, { recurring: newRecurring });
    setShowOptions(false);
  };

  const handleReminderToggle = () => {
    onUpdate(todo.id, { reminderEnabled: !todo.reminderEnabled });
  };

  const recurringLabel = {
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Recurring Badge */}
      {todo.recurring?.enabled && (
        <motion.div
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-medium"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <Repeat2 size={12} />
          {recurringLabel[todo.recurring.type] || '반복'}
        </motion.div>
      )}

      {/* Reminder Badge */}
      {todo.reminderEnabled && (
        <motion.div
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-medium"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <Bell size={12} />
          알림
        </motion.div>
      )}

      {/* Recurring Menu */}
      <div className="relative">
        {showOptions && (
          <motion.div
            className="absolute right-0 mt-8 bg-slate-900 border border-white/20 rounded-lg shadow-lg p-2 z-50 space-y-1 min-w-max"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => handleRecurringChange('daily')}
              className="w-full px-3 py-1 text-left text-sm hover:bg-white/10 rounded transition-colors"
            >
              매일
            </button>
            <button
              onClick={() => handleRecurringChange('weekly')}
              className="w-full px-3 py-1 text-left text-sm hover:bg-white/10 rounded transition-colors"
            >
              매주
            </button>
            <button
              onClick={() => handleRecurringChange('monthly')}
              className="w-full px-3 py-1 text-left text-sm hover:bg-white/10 rounded transition-colors"
            >
              매월
            </button>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => handleRecurringChange(null)}
              className="w-full px-3 py-1 text-left text-sm hover:bg-white/10 rounded transition-colors text-red-400"
            >
              반복 안 함
            </button>
          </motion.div>
        )}

        {/* Recurring Toggle Button */}
        <motion.button
          onClick={() => setShowOptions(!showOptions)}
          className={`p-1 rounded-lg transition-colors ${
            todo.recurring?.enabled
              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-gray-500 hover:text-gray-400'
          }`}
          title="반복 설정"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Repeat2 size={14} />
        </motion.button>
      </div>

      {/* Reminder Toggle */}
      <motion.button
        onClick={handleReminderToggle}
        className={`p-1 rounded-lg transition-colors ${
          todo.reminderEnabled
            ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
            : 'bg-white/5 border border-white/10 text-gray-500 hover:text-gray-400'
        }`}
        title="알림 설정"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell size={14} />
      </motion.button>
    </div>
  );
};

export default TodoRecurring;
