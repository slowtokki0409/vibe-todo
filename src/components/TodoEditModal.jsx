import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import TodoRecurring from './TodoRecurring';

export const TodoEditModal = ({ todo, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    text: todo.text,
    priority: todo.priority || 'medium',
    category: todo.category || 'personal',
    dueDate: todo.dueDate || '',
    description: todo.description || '',
    recurring: todo.recurring || { type: 'daily', enabled: false },
    reminderEnabled: todo.reminderEnabled || false,
  });

  const handleSave = () => {
    onSave(todo.id, formData);
    onClose();
  };

  const priorityColors = {
    high: 'bg-red-500/20 border-red-500/50 text-red-400',
    medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    low: 'bg-green-500/20 border-green-500/50 text-green-400',
  };

  const categoryColors = {
    work: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    personal: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    study: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-b from-slate-900/95 to-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 z-50"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">할 일 수정</h2>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Todo Title */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">제목</label>
          <input
            type="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">메모</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="추가 설명이나 메모를 작성하세요..."
            rows="3"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">우선순위</label>
          <div className="flex gap-2">
            {['high', 'medium', 'low'].map((p) => (
              <motion.button
                key={p}
                onClick={() => setFormData({ ...formData, priority: p })}
                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${
                  formData.priority === p
                    ? priorityColors[p]
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {p === 'high' ? '높음' : p === 'medium' ? '중간' : '낮음'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">카테고리</label>
          <div className="flex gap-2">
            {['work', 'personal', 'study'].map((c) => (
              <motion.button
                key={c}
                onClick={() => setFormData({ ...formData, category: c })}
                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${
                  formData.category === c
                    ? categoryColors[c]
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {c === 'work' ? '업무' : c === 'personal' ? '개인' : '학습'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">마감일</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Recurring & Reminder */}
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-2 block">반복 및 알림</label>
          <div className="relative">
            <TodoRecurring
              todo={formData}
              onUpdate={(id, updates) => setFormData({ ...formData, ...updates })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            취소
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-purple-500/30 border border-purple-500/50 text-purple-300 font-medium hover:bg-purple-500/40 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            저장
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoEditModal;
