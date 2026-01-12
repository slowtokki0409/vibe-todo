import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import TodoFilter from './TodoFilter';
import TodoRecurring from './TodoRecurring';

export const TodoList = ({ todos, onToggle, onDelete, onUpdate, onEdit, filters, onFilterChange }) => {
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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isToday = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const isUpcoming = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dueDate);
    date.setHours(0, 0, 0, 0);
    return date > today && date <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  };

  const formatDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
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
              <p className="text-lg">할 일이 없습니다.</p>
              <p className="text-sm mt-2">새로운 목표를 추가하고 하루를 시작해보세요!</p>
            </motion.div>
          ) : (
            todos.map((todo) => (
              <motion.div
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
                    className={`text-base tracking-tight font-medium truncate ${
                      todo.completed ? 'text-gray-500 line-through' : 'text-white'
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
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        priorityColors[todo.priority || 'medium']
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
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        categoryColors[todo.category || 'personal']
                      }`}
                    >
                      {categoryLabels[todo.category || 'personal']}
                    </span>

                    {/* Due Date Badge */}
                    {todo.dueDate && (
                      <motion.span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                          isOverdue(todo.dueDate)
                            ? 'bg-red-500/20 text-red-400'
                            : isToday(todo.dueDate)
                            ? 'bg-orange-500/20 text-orange-400'
                            : isUpcoming(todo.dueDate)
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {isOverdue(todo.dueDate) && <AlertCircle size={12} />}
                        {formatDate(todo.dueDate)}
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
