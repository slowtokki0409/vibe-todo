// Verified by AntiGravity Swarm
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, Circle, AlertCircle, Inbox } from 'lucide-react';
import TodoFilter from './TodoFilter';
import TodoRecurring from './TodoRecurring';
import { isOverdue, isToday, isUrgent, formatDateWithDDay, getDateBadgeColor } from '../utils/dateUtils';

export const TodoList = ({ todos, onToggle, onDelete, onUpdate, onEdit, filters, onFilterChange }) => {
  // Smart Sorting Logic
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      // 1. Completion Status: Active first, Completed last
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      // 2. Priority: High > Medium > Low
      const priorityScore = { high: 3, medium: 2, low: 1 };
      const scoreA = priorityScore[a.priority] || 1;
      const scoreB = priorityScore[b.priority] || 1;
      if (scoreA !== scoreB) return scoreB - scoreA;

      // 3. Due Date: Electronic (Earliest first), No Date last
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // 4. Creation Date: Newest first (ID is timestamp)
      return b.id - a.id;
    });
  }, [todos]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
  };

  const categoryColors = {
    work: 'bg-blue-500/20 text-blue-400',
    personal: 'bg-purple-500/20 text-purple-400',
    study: 'bg-pink-500/20 text-pink-400',
  };

  const categoryLabels = {
    work: '업무',
    personal: '개인',
    study: '학습',
  };


  return (
    <motion.div className="w-full space-y-4">
      {/* Filter Component */}
      <TodoFilter filters={filters} onFilterChange={onFilterChange} />

      {/* Todo List */}
      <motion.div
        className="w-full space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <motion.div
              key="empty-state"
              variants={itemVariants}
              className="text-center py-12 text-gray-500"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              </motion.div>
              <p className="text-lg">할 일이 없습니다.</p>
              <p className="text-sm mt-2">새로운 목표를 추가하고 하루를 시작해보세요!</p>
            </motion.div>
          ) : (
            sortedTodos.map((todo) => (
              <motion.div
                layout
                key={todo.id}
                variants={itemVariants}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(todo)}
              >
                {/* Toggle Checkbox */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(todo.id);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 drop-shadow-lg" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500 hover:text-purple-400 transition-colors" />
                  )}
                </motion.button>

                {/* Todo Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Todo Text */}
                  <motion.p
                    className={`text-base tracking-tight font-medium truncate ${todo.completed ? 'text-gray-500 line-through' : 'text-white'
                      }`}
                    animate={{
                      color: todo.completed ? '#6b7280' : '#ffffff',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {todo.text}
                  </motion.p>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Priority Badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[todo.priority || 'medium']
                        }`}
                    >
                      {todo.priority === 'high'
                        ? '높음'
                        : todo.priority === 'low'
                          ? '낮음'
                          : '중간'}
                    </span>

                    {/* Category Badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[todo.category || 'personal']
                        }`}
                    >
                      {categoryLabels[todo.category || 'personal']}
                    </span>

                    {/* Due Date Badge with D-Day */}
                    {todo.dueDate && (
                      <motion.span
                        className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${getDateBadgeColor(
                          todo.dueDate
                        )}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        {(isOverdue(todo.dueDate) || isUrgent(todo.dueDate)) && <AlertCircle size={12} />}
                        {formatDateWithDDay(todo.dueDate)}
                      </motion.span>
                    )}

                    {/* Recurring & Reminder Badges */}
                    <TodoRecurring todo={todo} onUpdate={onUpdate} />
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(todo.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Footer */}
      {todos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 pt-4 border-t border-white/10 text-center font-medium space-y-1"
        >
          <div>
            남은 작업 {todos.filter((t) => !t.completed).length}개 / 전체 {todos.length}개
          </div>
          <div>
            완료된 작업 {todos.filter((t) => t.completed).length}개
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TodoList;
